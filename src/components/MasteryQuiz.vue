<script setup lang="ts" generic="K extends string | number">
import { computed, onMounted, ref, watch } from 'vue'
import { BaseButton, BaseCard, BaseSheet } from 'rei-kit'
import { Check, CircleX, Flame, History, Lightbulb, PartyPopper, X } from 'lucide-vue-next'

import { usePageContext } from '@/lib/page'
import { addAttempt, groupMisses, loadRun, saveRun, type Miss } from '@/lib/quiz-store'
import { notation, plain } from '@/lib/ruby'
import { shuffle } from '@/lib/shuffle'
import MissList from './MissList.vue'
import QuizHistory from './QuizHistory.vue'

export interface Question {
  /** Small line above the question: its type or section. */
  kind?: string
  /** Notation or HTML. */
  prompt: string
  /** `big` for a lone kanji or word; `text` for a Turkish/English prompt. */
  size?: 'big' | 'jp' | 'text'
  options: string[]
  answer: number
  /** Shown after answering, under the verdict. */
  explain?: string
  /**
   * How a mistake on this exact question is filed in the statistics: its own
   * label, and the groups it sits under (radical → kanji). Without it the
   * item's `label` is used.
   */
  stat?: { label: string; path?: string[] }
}

/** A question answered wrong, waiting to be answered right twice. */
interface Retry {
  q: Question
  /** Wrong answers to this exact question so far. */
  wrong: number
}

/**
 * The one test engine of the site.
 *
 * Every item is asked until it has been answered correctly twice. A wrong
 * answer brings that exact question back two questions later, resets the
 * item's count, and after two misses cuts it to two options; a first right answer sends it a
 * few places further. Options are shuffled on every showing, so the second
 * time cannot be answered by remembering where the right one was.
 *
 * `build` is called on every showing rather than once, so a page can vary the
 * question type for the same key (kanji → meaning, word → reading …).
 *
 * With a `storageKey` the run survives leaving the page — it resumes on the
 * same question — and each finished run goes into the test's history, named
 * item by item through `label`.
 */
const { pool, build, storageKey, label } = defineProps<{
  pool: readonly K[]
  build: (key: K) => Question
  storageKey?: string
  /** How an item is named in the mistakes list (notation allowed). */
  label?: (key: K) => string
}>()
const emit = defineEmits<{ finish: [] }>()
defineSlots<{
  feedback?: (p: { item: K; correct: boolean }) => unknown
  more?: (p: { item: K }) => unknown
  actions?: () => unknown
}>()

const { t } = usePageContext()

const queue = ref<K[]>([]) as { value: K[] }
const counts = ref(new Map<K, number>())
const current = ref<K | null>(null) as { value: K | null }
const question = ref<Question | null>(null)
const order = ref<number[]>([])
const picked = ref<number | null>(null)
const tries = ref(0)
const wrong = ref(0)
const finished = ref(false)
/** Right answers in a row, and the best run of them. */
const streak = ref(0)
const best = ref(0)
/** Set for one answer: what to celebrate (re-keyed by `tries` so it replays). */
const burst = ref<'right' | 'mastered' | 'wrong' | null>(null)
/** This run's mistakes, keyed by their stat label. */
const misses = ref(new Map<string, Miss>())
const resumed = ref(false)
/** A short note at the top that fades on its own (resumed, streak milestones). */
const toast = ref('')
const toastIcon = ref<typeof History>(History)
let toastTimer: ReturnType<typeof setTimeout> | undefined
function showToast(text: string, icon: typeof History) {
  toast.value = text
  toastIcon.value = icon
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 2600)
}
/** Bumped at each streak milestone to replay the screen flash. */
const flash = ref(0)
const showHistory = ref(false)
/** The explanation sheet, opened from the bar after answering. */
const explaining = ref(false)
const actions = ref<HTMLElement | null>(null)
/** The finished run's mistakes, kept for the end screen. */
const lastMisses = ref<Miss[]>([])
const lastGroups = computed(() => groupMisses(lastMisses.value, Infinity))
/**
 * Questions answered wrong. Until such a question is answered right twice in
 * a row it comes back exactly as it was — not rebuilt as another question
 * about the same item — and the item cannot be mastered.
 */
const retry = ref(new Map<K, Retry>())

function start() {
  queue.value = shuffle(pool)
  counts.value = new Map(pool.map((k) => [k, 0]))
  misses.value = new Map()
  retry.value = new Map()
  tries.value = 0
  wrong.value = 0
  streak.value = 0
  best.value = 0
  burst.value = null
  finished.value = false
  resumed.value = false
  showHistory.value = false
  next()
}
function persist() {
  if (!storageKey) return
  saveRun<K>(storageKey, {
    pool: [...pool],
    queue: queue.value,
    counts: [...counts.value],
    current: current.value,
    question: question.value,
    order: order.value,
    picked: picked.value,
    tries: tries.value,
    wrong: wrong.value,
    misses: [...misses.value],
    retry: [...retry.value],
    streak: streak.value,
    best: best.value,
    at: new Date().toISOString(),
  })
}
/** The saved run, if it belongs to this same test. */
function resume(): boolean {
  if (!storageKey) return false
  const run = loadRun<K>(storageKey)
  const same = run && run.pool.length === pool.length && run.pool.every((k) => pool.includes(k))
  // Runs saved before misses were filed per question cannot be resumed.
  const filedPerQuestion = run?.misses.every(([, m]) => typeof m === 'object')
  if (!run || !same || !filedPerQuestion || run.current === null) return false
  queue.value = run.queue
  counts.value = new Map(run.counts)
  current.value = run.current
  question.value = run.question as Question
  order.value = run.order
  picked.value = run.picked
  tries.value = run.tries
  wrong.value = run.wrong
  misses.value = new Map(run.misses as [string, Miss][])
  retry.value = new Map((run.retry ?? []) as [K, Retry][])
  streak.value = run.streak ?? 0
  best.value = run.best ?? 0
  finished.value = false
  resumed.value = true
  showToast(t.value.resumed.replace(/^↩\s*/, ''), History)
  return true
}
function finish() {
  finished.value = true
  emit('finish')
  current.value = null
  lastMisses.value = [...misses.value.values()]
  if (storageKey) {
    saveRun(storageKey, null)
    addAttempt(storageKey, {
      at: new Date().toISOString(),
      tries: tries.value,
      wrong: wrong.value,
      misses: lastMisses.value,
    })
  }
}
function restart() {
  if (storageKey) saveRun(storageKey, null)
  start()
}
function next() {
  const k = queue.value.shift()
  if (k === undefined) {
    finish()
    return
  }
  current.value = k
  // A missed question comes back as it was; after two misses it shows two
  // options, the wrong one re-picked at random on every showing.
  const r = retry.value.get(k)
  question.value = r ? (r.wrong >= 2 ? halve(r.q) : r.q) : build(k)
  burst.value = null
  order.value = shuffle(question.value.options.map((_, i) => i))
  picked.value = null
}
function pick(i: number) {
  if (picked.value !== null || current.value === null || !question.value) return
  picked.value = i
  tries.value++
  const k = current.value
  const q = question.value
  if (i === q.answer) {
    const c = (counts.value.get(k) ?? 0) + 1
    counts.value.set(k, c)
    if (c >= 2) retry.value.delete(k)
    else queue.value.splice(Math.min(queue.value.length, 4 + Math.floor(Math.random() * 4)), 0, k)
    streak.value++
    best.value = Math.max(best.value, streak.value)
    if (streak.value % 5 === 0) {
      flash.value++
      showToast(t.value.milestone(streak.value), Flame)
    }
    burst.value = c >= 2 ? 'mastered' : 'right'
    buzz(c >= 2 ? [10, 30, 10, 30, 40] : 15)
  } else {
    wrong.value++
    streak.value = 0
    burst.value = 'wrong'
    buzz([30, 40, 30])
    fileMiss(k, q)
    // Back to zero: this exact question now has to be right twice.
    counts.value.set(k, 0)
    // Keep the original question (all its options) so halving can re-pick.
    const r = retry.value.get(k) ?? { q, wrong: 0 }
    r.wrong++
    retry.value.set(k, r)
    queue.value.splice(Math.min(queue.value.length, 2), 0, k)
  }
  persist()
  // On a short screen, bring the buttons under the question into view.
  requestAnimationFrame(() => actions.value?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }))
}
/** Count a mistake under the question's own label and groups. */
function fileMiss(k: K, q: Question) {
  const stat = q.stat ?? { label: label ? label(k) : String(k) }
  const m = misses.value.get(stat.label) ?? { label: stat.label, n: 0, ...(stat.path ? { path: stat.path } : {}) }
  m.n++
  misses.value.set(stat.label, m)
}
/** Missed twice: keep the right option and one wrong one at random — a 50% guess. */
function halve(q: Question): Question {
  if (q.options.length <= 2) return q
  const wrongs = q.options.map((_, i) => i).filter((i) => i !== q.answer)
  const w = wrongs[Math.floor(Math.random() * wrongs.length)]!
  return { ...q, options: [q.options[q.answer]!, q.options[w]!], answer: 0 }
}
/** A short vibration where the phone supports it. */
function buzz(pattern: number | number[]) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern)
  } catch {
    // Not allowed here: no haptics.
  }
}
function proceed() {
  explaining.value = false
  next()
  // finish() already cleared the saved run; writing it back would leave a dead one.
  if (!finished.value) persist()
  if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
}

onMounted(() => {
  if (!resume()) {
    start()
    persist()
  }
})
watch(
  () => pool,
  () => {
    if (!resume()) {
      start()
      persist()
    }
  },
)
defineExpose({ start: restart })

const total = computed(() => pool.length)
const done = computed(() => [...counts.value.values()].filter((c) => c >= 2).length)
/** Correct answers still owed: two per item, minus what is already in. */
const owed = computed(() => [...counts.value.values()].reduce((s, c) => s + Math.max(0, 2 - c), 0))
const percent = computed(() => Math.round(((total.value * 2 - owed.value) / (total.value * 2 || 1)) * 100))
const count = computed(() => (current.value === null ? 0 : (counts.value.get(current.value) ?? 0)))
const correct = computed(() => picked.value !== null && picked.value === question.value?.answer)
/** Furigana needs tall lines; plain options can sit tighter. */
const ruby = computed(() => (question.value?.options ?? []).some((o) => o.includes('{')))
/** A strip segment's colour from how many times the item was answered right. */
function segClass(k: K) {
  const c = counts.value.get(k) ?? 0
  return c >= 2 ? 'bg-positive' : c === 1 ? 'quiz-seg-half' : 'bg-hair'
}
/** Where confetti piece `n` flies: evenly round a circle, a little jitter. */
function confetti(n: number) {
  const a = (n / 12) * Math.PI * 2
  const d = 40 + (n % 3) * 14
  const colors = ['var(--color-positive)', 'var(--color-primary)', 'var(--color-warning)', 'var(--color-accent)']
  return {
    '--x': `${Math.cos(a) * d}px`,
    '--y': `${Math.sin(a) * d - 20}px`,
    '--r': `${n * 47}deg`,
    background: colors[n % colors.length],
  }
}
/** How the streak chip looks as the run heats up: 3+, 5+, 10+, 15+. */
const streakTier = computed(() => {
  const n = streak.value
  if (n >= 15)
    return { chip: 'bg-negative/15 text-negative quiz-ring', icon: 'size-7 quiz-flicker-fast', text: 'text-lg' }
  if (n >= 10)
    return { chip: 'bg-warning/20 text-negative quiz-glow-soft', icon: 'size-6 quiz-flicker-fast', text: 'text-base' }
  if (n >= 5) return { chip: 'bg-warning/15 text-warning', icon: 'size-5 quiz-flicker', text: 'text-base' }
  return { chip: 'bg-warning/15 text-warning', icon: 'size-4', text: 'text-sm' }
})
const wide = computed(() => (question.value?.options ?? []).some((o) => plain(o).length > 12))
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Resumed: a passing note, not a row of its own. -->
    <p
      v-if="toast"
      :key="toast"
      role="status"
      class="quiz-toast bg-ink text-canvas fixed start-1/2 bottom-12 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold whitespace-nowrap shadow-lg"
    >
      <component :is="toastIcon" class="size-4" aria-hidden="true" /> {{ toast }}
    </p>
    <!-- Streak milestone (5, 10, 15 …): a warm flash over the whole screen. -->
    <div v-if="flash" :key="flash" class="quiz-flash pointer-events-none fixed inset-0 z-30" aria-hidden="true" />
    <template v-if="!finished && question">
      <!-- The run at a glance: one segment per item — grey never right, half
           green right once, green mastered; red underline = still owed after
           a miss; ring = the current one. -->
      <div>
        <div class="flex items-center gap-3">
          <div
            class="flex flex-1 items-end"
            :class="pool.length > 40 ? 'gap-px' : 'gap-1'"
            role="img"
            :aria-label="t.done(percent, owed)"
          >
            <span v-for="k in pool" :key="String(k)" class="flex flex-1 flex-col gap-0.5">
              <span
                class="quiz-seg h-2.5 rounded-full"
                :class="[
                  segClass(k),
                  k === current ? 'ring-primary ring-2 ring-offset-1 ring-offset-[var(--color-canvas)]' : '',
                  k === current && burst === 'mastered' ? 'quiz-seg-pulse' : '',
                ]"
              />
              <span class="h-0.5 rounded-full" :class="retry.has(k) ? 'bg-negative' : ''" />
            </span>
          </div>
          <!-- The streak grows with the run: bigger, hotter, livelier. -->
          <span
            v-if="streak >= 3"
            :key="streak"
            class="quiz-pop flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 font-bold"
            :class="streakTier.chip"
            :aria-label="t.streak(streak)"
          >
            <Flame :class="streakTier.icon" aria-hidden="true" />
            <span :class="streakTier.text">{{ streak }}</span>
          </span>
        </div>
        <p class="text-ink-soft mt-1.5 text-sm">
          {{ t.mastered }} <b class="text-ink">{{ done }}/{{ total }}</b> · {{ percent }}% ·
          <span class="inline-flex items-center gap-0.5" :class="wrong ? 'text-negative' : ''"
            ><X class="size-3.5" aria-hidden="true" />{{ wrong }}</span
          >
        </p>
      </div>

      <BaseCard>
        <div class="text-ink-soft flex items-center gap-2 text-sm">
          <span v-if="question.kind" v-html="notation(question.kind)" />
          <span class="ms-auto flex gap-1" :aria-label="`${count}/2`">
            <span
              v-for="n in 2"
              :key="`${n}-${count >= n}`"
              class="border-positive size-3 rounded-full border-2"
              :class="count >= n ? 'bg-positive quiz-pop' : ''"
            />
          </span>
        </div>
        <div
          class="my-3"
          :class="{
            'jp py-3 text-center text-[3.4rem] leading-tight': question.size === 'big',
            'jp text-[1.6rem] leading-[2.3]': (question.size ?? 'jp') === 'jp',
            'py-3 text-center text-xl font-bold': question.size === 'text',
          }"
          :lang="question.size === 'text' ? undefined : 'ja'"
          v-html="notation(question.prompt)"
        />
        <div class="grid gap-2.5" :class="wide ? 'grid-cols-1' : 'grid-cols-2'">
          <button
            v-for="i in order"
            :key="i"
            type="button"
            class="control focus-ring rounded-control jp px-3 py-2 text-[1.45rem] transition-colors [--control-border-width:2px]"
            :class="[
              question.options.length === 2 ? 'min-h-16' : 'min-h-12',
              picked === i ? (i === question.answer ? 'quiz-pop quiz-glow' : 'quiz-shake') : '',
              wide ? 'text-start' : 'text-center',
              ruby ? 'leading-[2]' : 'leading-snug',
              picked !== null && i === question.answer
                ? 'bg-positive/15 [--surface-border-color:var(--color-positive)]'
                : '',
              picked !== null && i === picked && i !== question.answer
                ? 'bg-negative/15 [--surface-border-color:var(--color-negative)]'
                : '',
            ]"
            :aria-pressed="picked === i"
            :disabled="picked !== null && i !== picked && i !== question.answer"
            @click="pick(i)"
            v-html="notation(question.options[i]!)"
          />
        </div>
      </BaseCard>

      <!-- After answering: the verdict and two buttons right under the
           question — explanation on the left, next question on the right. -->
      <template v-if="picked !== null">
        <div
          ref="actions"
          :key="tries"
          class="quiz-in bg-surface border-hair rounded-card relative -mt-2 scroll-mb-12 border border-s-4 p-3"
          :class="correct ? 'border-s-positive' : 'border-s-negative'"
        >
          <!-- Mastered: a stamp and a small burst of confetti. -->
          <template v-if="burst === 'mastered'">
            <span
              class="quiz-stamp font-jp text-positive border-positive absolute -top-4 end-3 grid size-14 place-items-center rounded-full border-[3px] bg-[var(--color-surface)] text-lg font-bold"
              aria-hidden="true"
              >習得</span
            >
            <span class="pointer-events-none absolute end-10 top-2" aria-hidden="true">
              <span v-for="n in 12" :key="n" class="quiz-confetti" :style="confetti(n)" />
            </span>
          </template>
          <p
            class="mb-2.5 flex items-center gap-1.5 font-bold"
            :class="correct ? 'text-positive' : 'text-negative'"
            role="status"
          >
            <component
              :is="correct ? (count >= 2 ? PartyPopper : Check) : X"
              class="size-5 shrink-0"
              aria-hidden="true"
            />
            <span v-if="correct">{{ count >= 2 ? t.correctDone : t.correctOnce }}</span>
            <span v-else>{{ t.wrong }} <span class="jp" v-html="notation(question.options[question.answer]!)" /></span>
          </p>
          <div class="flex gap-3">
            <BaseButton variant="secondary" class="flex-1 whitespace-nowrap" @click="explaining = true"
              ><Lightbulb class="size-4" aria-hidden="true" /> {{ t.explain }}</BaseButton
            >
            <BaseButton class="flex-1 whitespace-nowrap" @click="proceed">{{ t.nextQuestion }} →</BaseButton>
          </div>
        </div>
        <BaseSheet v-model="explaining" :title="correct ? t.correctTitle : t.wrongTitle" :close-label="t.close">
          <div class="grid gap-3 pb-2">
            <p v-if="!correct">
              {{ t.wrong }} <b class="jp text-lg" v-html="notation(question.options[question.answer]!)" />
              <span class="text-ink-soft block text-sm">{{ t.wrongBack }}</span>
            </p>
            <div v-if="question.explain" class="text-[15px]" v-html="notation(question.explain)" />
            <slot v-if="current !== null" name="feedback" :item="current" :correct="correct" />
            <BaseButton block @click="explaining = false">{{ t.understood }}</BaseButton>
            <!-- Extra reading below the button: browsing, not needed to go on. -->
            <slot v-if="current !== null" name="more" :item="current" />
          </div>
        </BaseSheet>
      </template>
    </template>

    <div v-else-if="finished" class="py-10 text-center">
      <div
        class="quiz-stamp font-jp text-negative border-negative mx-auto grid size-28 -rotate-6 place-items-center rounded-full border-4 text-4xl"
        aria-hidden="true"
      >
        合格
      </div>
      <h2 class="mt-6 text-2xl font-bold">{{ t.doneTitle }}</h2>
      <dl class="mx-auto mt-4 grid max-w-md grid-cols-3 gap-2">
        <div class="surface rounded-card px-2 py-3">
          <dd class="text-2xl font-bold">{{ tries ? Math.round(((tries - wrong) / tries) * 100) : 0 }}%</dd>
          <dt class="text-ink-soft text-xs">{{ t.accuracy }}</dt>
        </div>
        <div class="surface rounded-card px-2 py-3">
          <dd class="text-warning flex items-center justify-center gap-1 text-2xl font-bold">
            <Flame class="size-6" aria-hidden="true" />{{ best }}
          </dd>
          <dt class="text-ink-soft text-xs">{{ t.bestStreak }}</dt>
        </div>
        <div class="surface rounded-card px-2 py-3">
          <dd class="text-2xl font-bold" :class="wrong ? 'text-negative' : 'text-positive'">{{ wrong }}</dd>
          <dt class="text-ink-soft text-xs">{{ t.mistakes }}</dt>
        </div>
      </dl>
      <p class="text-ink-soft mt-2 text-sm">{{ t.doneStats(tries, wrong) }}</p>
      <BaseCard v-if="lastMisses.length" class="mx-auto mt-5 max-w-md text-start">
        <p class="mb-2 flex items-center gap-1.5 font-bold">
          <CircleX class="text-negative size-5" aria-hidden="true" /> {{ t.runMisses }}
        </p>
        <MissList :groups="lastGroups" />
      </BaseCard>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <BaseButton variant="secondary" @click="restart">{{ t.again }}</BaseButton>
        <BaseButton
          v-if="storageKey"
          :variant="showHistory ? 'secondary' : 'ghost'"
          @click="showHistory = !showHistory"
          >{{ t.history }}</BaseButton
        >
        <slot name="actions" />
      </div>
      <BaseCard v-if="storageKey && showHistory" class="mx-auto mt-4 max-w-md">
        <QuizHistory :storage-key="storageKey" />
      </BaseCard>
    </div>
  </div>
</template>
