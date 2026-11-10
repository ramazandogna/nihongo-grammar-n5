<script setup lang="ts" generic="K extends string | number">
import { computed, onMounted, ref, watch } from 'vue'
import { BaseButton, BaseCard, BaseSheet, ProgressBar } from 'rei-kit'

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
}

/**
 * The one test engine of the site.
 *
 * Every question is asked until it has been answered correctly twice. A wrong
 * answer brings it back two questions later; a first right answer sends it a
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
const { pool, build, storageKey, label, group } = defineProps<{
  pool: readonly K[]
  build: (key: K) => Question
  storageKey?: string
  /** How an item is named in the mistakes list (notation allowed). */
  label?: (key: K) => string
  /** The parent an item's mistakes add up under — a kanji's radical. */
  group?: (key: K) => string
}>()
defineSlots<{
  feedback?: (p: { item: K; correct: boolean }) => unknown
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
/** This run's mistakes, per item. */
const misses = ref(new Map<K, number>())
const resumed = ref(false)
const showHistory = ref(false)
/** The explanation sheet, opened from the bar after answering. */
const explaining = ref(false)
const actions = ref<HTMLElement | null>(null)
/** The finished run's mistakes, kept for the end screen. */
const lastMisses = ref<Miss[]>([])
const lastGroups = computed(() => groupMisses(lastMisses.value, Infinity))
/** Questions answered wrong: they come back exactly as they were, not rebuilt. */
const retry = ref(new Map<K, Question>())

function start() {
  queue.value = shuffle(pool)
  counts.value = new Map(pool.map((k) => [k, 0]))
  misses.value = new Map()
  retry.value = new Map()
  tries.value = 0
  wrong.value = 0
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
  })
}
/** The saved run, if it belongs to this same test. */
function resume(): boolean {
  if (!storageKey) return false
  const run = loadRun<K>(storageKey)
  const same = run && run.pool.length === pool.length && run.pool.every((k) => pool.includes(k))
  if (!run || !same || run.current === null) return false
  queue.value = run.queue
  counts.value = new Map(run.counts)
  current.value = run.current
  question.value = run.question as Question
  order.value = run.order
  picked.value = run.picked
  tries.value = run.tries
  wrong.value = run.wrong
  misses.value = new Map(run.misses)
  retry.value = new Map((run.retry ?? []) as [K, Question][])
  finished.value = false
  resumed.value = true
  return true
}
function finish() {
  finished.value = true
  current.value = null
  lastMisses.value = [...misses.value]
    .sort((a, b) => b[1] - a[1])
    .map(([k, n]) => ({ label: label ? label(k) : String(k), n, ...(group ? { group: group(k) } : {}) }))
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
  question.value = retry.value.get(k) ?? build(k)
  order.value = shuffle(question.value.options.map((_, i) => i))
  picked.value = null
}
function pick(i: number) {
  if (picked.value !== null || current.value === null || !question.value) return
  picked.value = i
  tries.value++
  const k = current.value
  if (i === question.value.answer) {
    retry.value.delete(k)
    const c = (counts.value.get(k) ?? 0) + 1
    counts.value.set(k, c)
    if (c < 2) queue.value.splice(Math.min(queue.value.length, 4 + Math.floor(Math.random() * 4)), 0, k)
  } else {
    wrong.value++
    misses.value.set(k, (misses.value.get(k) ?? 0) + 1)
    retry.value.set(k, question.value)
    queue.value.splice(Math.min(queue.value.length, 2), 0, k)
  }
  persist()
  // On a short screen, bring the buttons under the question into view.
  requestAnimationFrame(() => actions.value?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }))
}
function proceed() {
  explaining.value = false
  next()
  persist()
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
    if (!resume()) start()
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
const wide = computed(() => (question.value?.options ?? []).some((o) => plain(o).length > 12))
</script>

<template>
  <div class="flex flex-col gap-4">
    <template v-if="!finished && question">
      <div>
        <p v-if="resumed" class="text-primary mb-2 text-sm font-semibold">{{ t.resumed }}</p>
        <ProgressBar :value="total * 2 - owed" :max="total * 2" :label="t.progress" size="sm" />
        <div class="text-ink-soft mt-1.5 flex flex-wrap justify-between gap-x-3 text-sm">
          <span>{{ t.done(percent, owed) }}</span>
          <span>{{ t.mastered }} {{ done }}/{{ total }} · {{ t.mistakes }} {{ wrong }}</span>
        </div>
      </div>

      <BaseCard>
        <div class="text-ink-soft flex items-center gap-2 text-sm">
          <span v-if="question.kind" v-html="notation(question.kind)" />
          <span class="ms-auto flex gap-1" :aria-label="`${count}/2`">
            <span
              v-for="n in 2"
              :key="n"
              class="border-positive size-2.5 rounded-full border-2"
              :class="count >= n ? 'bg-positive' : ''"
            />
          </span>
        </div>
        <div
          class="my-3"
          :class="{
            'jp py-3 text-center text-5xl leading-tight': question.size === 'big',
            'jp text-[1.4rem] leading-[2.3]': (question.size ?? 'jp') === 'jp',
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
            class="control focus-ring rounded-control jp min-h-12 px-3 py-2 text-xl [--control-border-width:2px]"
            :class="[
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
          class="bg-surface border-hair rounded-card -mt-2 scroll-mb-12 border border-s-4 p-3"
          :class="correct ? 'border-s-positive' : 'border-s-negative'"
        >
          <p class="mb-2.5 font-bold" :class="correct ? 'text-positive' : 'text-negative'" role="status">
            <template v-if="correct">✓ {{ count >= 2 ? t.correctDone : t.correctOnce }}</template>
            <template v-else
              >✗ {{ t.wrong }} <span class="jp" v-html="notation(question.options[question.answer]!)"
            /></template>
          </p>
          <div class="flex gap-3">
            <BaseButton variant="secondary" class="flex-1 whitespace-nowrap" @click="explaining = true"
              >💡 {{ t.explain }}</BaseButton
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
          </div>
        </BaseSheet>
      </template>
    </template>

    <div v-else-if="finished" class="py-10 text-center">
      <div
        class="font-jp text-negative border-negative mx-auto grid size-28 -rotate-6 place-items-center rounded-full border-4 text-4xl"
        aria-hidden="true"
      >
        合格
      </div>
      <h2 class="mt-6 text-2xl font-bold">{{ t.doneTitle }}</h2>
      <p class="text-ink-soft">
        {{ t.doneStats(tries, wrong) }} · {{ t.rate(tries ? Math.round(((tries - wrong) / tries) * 100) : 0) }}
      </p>
      <BaseCard v-if="lastMisses.length" class="mx-auto mt-5 max-w-md text-start">
        <p class="mb-2 font-bold">❌ {{ t.runMisses }}</p>
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
