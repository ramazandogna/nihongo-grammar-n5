<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { BaseButton, BaseCard, SegmentedControl } from 'rei-kit'
import { Check, ChevronLeft, ChevronRight, Clock, Flag, Headphones, RotateCcw, X } from 'lucide-vue-next'

import * as exam from '@/engine/exam'
import { usePageContext } from '@/lib/page'
import { notation } from '@/lib/ruby'
import { toTop } from '@/lib/scroll'
import type { ExamGroup, ExamQuestion, ExamSection } from '@/pages/past-n3/types'
import AudioSegment from './AudioSegment.vue'
import JpText from './JpText.vue'
import RevealText from './RevealText.vue'

/**
 * A section of a past paper sat like the real thing: instructions, an
 * optional timer, every question reachable from a grid, answers kept and
 * changeable until submit, then the score, the topics, a review with the
 * reasoning and a sitting of only the missed questions.
 *
 * Listening plays the real recording, one question's stretch at a time — in
 * exam mode once, in practice mode as often as wanted. The sitting is saved
 * after every change, so a reload continues it.
 */
const {
  examId,
  section,
  audio,
  minutes = null,
} = defineProps<{
  examId: string
  section: ExamSection
  /** URL of the paper's recording, if this build has it. */
  audio?: string
  /** Suggested time for this section; null = not timed (listening is paced by the audio). */
  minutes?: number | null
}>()
const { lang } = usePageContext()
const tr = computed(() => lang.value === 'tr')
const L = computed(() =>
  tr.value
    ? {
        source: 'Kaynak: gerçek geçmiş sınav soruları. Puan bir uygulama tahminidir, resmî JLPT puanı değildir.',
        how: 'Nasıl çalışır',
        rules: [
          'Soruların arasında serbestçe gezebilir, teslim edene kadar cevabını değiştirebilirsin.',
          'Teslim edince puanın, konu başarıların ve yanlışların çıkar; her sorunun çözümünü görürsün.',
          'Sınav modunda dinleme sesi her soru için yalnızca bir kez çalar; alıştırmada istediğin kadar.',
        ],
        mode: 'Mod',
        practice: 'Alıştırma',
        examMode: 'Sınav',
        timed: (m: number) => `Süreli (${m} dk, tahmini)`,
        untimed: 'Süresiz',
        start: 'Başla',
        resume: 'Devam et',
        restart: 'Baştan başla',
        q: (n: number, t: number) => `Soru ${n} / ${t}`,
        prev: 'Önceki',
        next: 'Sonraki',
        submit: 'Teslim et',
        confirmSubmit: (n: number) => `${n} soru boş. Yine de teslim edilsin mi?`,
        yes: 'Evet, teslim et',
        no: 'Devam et',
        left: 'Kalan süre',
        timeUp: 'Süre doldu; sınav teslim edildi.',
        result: 'Sonuç',
        correct: 'doğru',
        topics: 'Konulara göre',
        review: 'Yanlışları incele',
        reviewAll: 'Tümünü incele',
        retryWrong: (n: number) => `Yanlışları tekrar çöz (${n})`,
        newSitting: 'Yeni sınav',
        yours: 'Senin cevabın',
        answer: 'Doğru cevap',
        skipped: 'Boş bıraktın',
        noAudio: 'Bu yapıda ses dosyası yok; dinleme sorusu sessiz çözülemez.',
        script: 'Metni göster',
        hideScript: 'Metni gizle',
        perfect: 'Hepsi doğru!',
        grid: 'Sorular',
        answered: 'cevaplandı',
      }
    : {
        source: 'Source: real past exam questions. The score is an app estimate, not an official JLPT score.',
        how: 'How it works',
        rules: [
          'Move freely between questions and change answers until you submit.',
          'After submitting you get your score, topic results and mistakes, with the reasoning for each.',
          'In exam mode the listening audio plays once per question; in practice as often as you like.',
        ],
        mode: 'Mode',
        practice: 'Practice',
        examMode: 'Exam',
        timed: (m: number) => `Timed (${m} min, estimate)`,
        untimed: 'Untimed',
        start: 'Start',
        resume: 'Continue',
        restart: 'Start over',
        q: (n: number, t: number) => `Question ${n} / ${t}`,
        prev: 'Previous',
        next: 'Next',
        submit: 'Submit',
        confirmSubmit: (n: number) => `${n} questions are blank. Submit anyway?`,
        yes: 'Yes, submit',
        no: 'Keep going',
        left: 'Time left',
        timeUp: 'Time is up; the exam was submitted.',
        result: 'Result',
        correct: 'correct',
        topics: 'By topic',
        review: 'Review mistakes',
        reviewAll: 'Review all',
        retryWrong: (n: number) => `Retry the missed ones (${n})`,
        newSitting: 'New sitting',
        yours: 'Your answer',
        answer: 'Answer',
        skipped: 'Left blank',
        noAudio: 'This build has no audio file; the listening question cannot be done silently.',
        script: 'Show script',
        hideScript: 'Hide script',
        perfect: 'All correct!',
        grid: 'Questions',
        answered: 'answered',
      },
)

/* ── The section's questions, with their group and audio stretch ── */
interface Row {
  item: exam.ExamItem
  q: ExamQuestion
  g: ExamGroup
}
const rows = computed<Row[]>(() =>
  section.groups.flatMap((g) =>
    g.items.map((q) => ({
      q,
      g,
      item: {
        id: `${section.id}:${q.no}`,
        no: q.no,
        answer: q.a,
        options: q.opts.length,
        topic: g.title ?? section.title,
        start: q.start ?? g.start,
      },
    })),
  ),
)
const byId = computed(() => new Map(rows.value.map((r) => [r.item.id, r])))
const items = computed(() => new Map(rows.value.map((r) => [r.item.id, r.item])))
const ends = computed(() => exam.segmentEnds(rows.value.map((r) => r.item)))
const listening = computed(() => section.part === '聴解')

/* ── Sitting, saved after every change ── */
const KEY = computed(() => `nihongo-exam:${examId}:${section.id}`)
const sitting = ref<exam.ExamState | null>(null)
const saved = ref<exam.ExamState | null>(null)
const stage = ref<'intro' | 'sit' | 'result' | 'review'>('intro')
const reviewOnlyWrong = ref(true)
const chooseMode = ref<'practice' | 'exam'>('exam')
const timed = ref(minutes !== null)
const confirming = ref(false)
const timedStr = computed({ get: () => (timed.value ? 'on' : 'off'), set: (v: string) => (timed.value = v === 'on') })
const reviewStr = computed({
  get: () => (reviewOnlyWrong.value ? 'wrong' : 'all'),
  set: (v: string) => (reviewOnlyWrong.value = v === 'wrong'),
})
const timeUp = ref(false)
const scriptOpen = reactive<Record<string, boolean>>({})

function load(): exam.ExamState | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY.value) ?? 'null')
    // A sitting saved for a different version of this section is dropped, not shown blank.
    if (!exam.isExamState(v) || !v.ids.length || !v.ids.every((id) => items.value.has(id))) return null
    for (const [id, a] of Object.entries(v.answers))
      if (!items.value.has(id) || a >= items.value.get(id)!.options) return null
    v.current = Math.min(v.current, v.ids.length - 1)
    return v
  } catch {
    return null
  }
}
function save() {
  try {
    if (sitting.value) localStorage.setItem(KEY.value, JSON.stringify(sitting.value))
    saved.value = sitting.value ? { ...sitting.value } : saved.value
  } catch {
    // Not kept; the sitting still works for this visit.
  }
}
onMounted(() => {
  saved.value = load()
  if (saved.value?.submitted) {
    sitting.value = saved.value
    stage.value = 'result'
  }
})

function begin(ids = rows.value.map((r) => r.item.id), mode = chooseMode.value) {
  const all = ids.length === rows.value.length
  sitting.value = exam.newSitting(ids, mode, timed.value && all && minutes ? minutes : null)
  timeUp.value = false
  stage.value = 'sit'
  save()
  toTop()
}
function resumeSaved() {
  sitting.value = load()
  if (!sitting.value) return
  stage.value = 'sit'
  toTop()
}

const cur = computed(() => {
  const s = sitting.value
  return s ? byId.value.get(s.ids[s.current]!) : undefined
})
function pick(i: number) {
  if (!sitting.value || !cur.value) return
  exam.choose(sitting.value, cur.value.item.id, i, items.value)
  save()
}
function go(i: number) {
  if (!sitting.value) return
  audioRef.value?.pause()
  exam.go(sitting.value, i)
  save()
  toTop()
}
function markPlayed() {
  const s = sitting.value
  if (s && cur.value && !s.played.includes(cur.value.item.id)) {
    s.played.push(cur.value.item.id)
    save()
  }
}
const blanks = computed(() => (sitting.value ? exam.unanswered(sitting.value).length : 0))
function trySubmit() {
  if (blanks.value && !confirming.value) {
    confirming.value = true
    return
  }
  doSubmit()
}
function doSubmit() {
  if (!sitting.value) return
  confirming.value = false
  audioRef.value?.pause()
  exam.submit(sitting.value)
  save()
  stage.value = 'result'
  toTop()
}
const result = computed(() => (sitting.value ? exam.score(sitting.value, items.value) : null))

/* ── Timer ── */
const now = ref(Date.now())
let tick: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  tick = setInterval(() => {
    now.value = Date.now()
    const s = sitting.value
    if (stage.value === 'sit' && s && !s.submitted && exam.timeLeft(s, now.value) === 0) {
      timeUp.value = true
      doSubmit()
    }
  }, 1000)
})
onBeforeUnmount(() => clearInterval(tick))
const left = computed(() => (sitting.value ? exam.timeLeft(sitting.value, now.value) : null))
const clock = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`

/* ── Review ── */
const reviewRows = computed(() => {
  const r = result.value
  if (!r || !sitting.value) return []
  const ids = reviewOnlyWrong.value ? exam.retryIds(r) : sitting.value.ids
  return ids.map((id) => byId.value.get(id)!).filter(Boolean)
})
const audioRef = ref<InstanceType<typeof AudioSegment> | null>(null)
watch(stage, (st) => {
  audioRef.value?.pause()
  if (st === 'intro') saved.value = load()
})
</script>

<template>
  <div class="grid gap-4">
    <p class="text-ink-soft bg-muted rounded-control px-3 py-2 text-xs">{{ L.source }}</p>

    <!-- Intro -->
    <template v-if="stage === 'intro'">
      <BaseCard>
        <p class="mb-2 font-bold">{{ L.how }}</p>
        <ul class="grid list-disc gap-1 ps-5 text-[15px]">
          <li v-for="r in L.rules" :key="r">{{ r }}</li>
        </ul>
        <p class="mt-3 text-[15px]">{{ section.how }}</p>
      </BaseCard>
      <BaseCard class="grid gap-3">
        <div class="grid gap-1.5">
          <span class="text-ink-soft text-xs font-semibold">{{ L.mode }}</span>
          <SegmentedControl
            v-model="chooseMode"
            :options="[
              { value: 'exam', label: L.examMode },
              { value: 'practice', label: L.practice },
            ]"
          />
        </div>
        <SegmentedControl
          v-if="minutes"
          v-model="timedStr"
          :options="[
            { value: 'on', label: L.timed(minutes) },
            { value: 'off', label: L.untimed },
          ]"
        />
        <p v-if="listening && !audio" role="alert" class="text-negative text-sm">{{ L.noAudio }}</p>
        <BaseButton v-if="saved && !saved.submitted" block @click="resumeSaved">
          {{ L.resume }} · {{ Object.keys(saved.answers).length }}/{{ saved.ids.length }}
        </BaseButton>
        <BaseButton block :variant="saved && !saved.submitted ? 'secondary' : 'primary'" @click="begin()">
          {{ saved && !saved.submitted ? L.restart : L.start }} · {{ rows.length }}
        </BaseButton>
      </BaseCard>
    </template>

    <!-- Sitting -->
    <template v-else-if="stage === 'sit' && sitting && cur">
      <div class="flex items-center gap-2 text-sm">
        <span class="font-semibold">{{ L.q(sitting.current + 1, sitting.ids.length) }}</span>
        <span class="text-ink-soft">· {{ sitting.ids.length - blanks }} {{ L.answered }}</span>
        <span
          v-if="left !== null"
          class="ms-auto inline-flex items-center gap-1 font-semibold tabular-nums"
          :class="left < 60 ? 'text-negative' : ''"
          :aria-label="L.left"
          role="timer"
          ><Clock class="size-4" aria-hidden="true" />{{ clock(left) }}</span
        >
      </div>

      <!-- Group context: passage or listening -->
      <BaseCard v-if="cur.g.passage">
        <JpText v-if="cur.g.title" :text="cur.g.title" as="h2" class="mb-2 text-lg font-bold" />
        <div v-for="(p, pi) in cur.g.passage" :key="pi" class="mb-2">
          <JpText :text="p.jp.replace(/\[\[|\]\]/g, '')" as="p" class="text-[1.15rem] leading-[2.2]" />
        </div>
      </BaseCard>
      <BaseCard v-if="listening" class="grid gap-2">
        <p class="text-ink-soft flex items-center gap-1.5 text-sm">
          <Headphones class="size-4" aria-hidden="true" />{{ cur.g.title ?? section.title }}
        </p>
        <AudioSegment
          v-if="audio && cur.item.start !== undefined"
          ref="audioRef"
          :key="cur.item.id"
          :src="audio"
          :start="cur.item.start"
          :end="ends.get(cur.item.id)"
          :once="sitting.mode === 'exam'"
          :spent="sitting.mode === 'exam' && sitting.played.includes(cur.item.id)"
          @played="markPlayed"
        />
        <p v-else role="alert" class="text-negative text-sm">{{ L.noAudio }}</p>
      </BaseCard>

      <BaseCard>
        <p class="text-ink-soft text-sm">{{ cur.q.no }}.</p>
        <JpText :text="cur.q.q" as="p" class="text-[1.25rem] leading-[2.2]" />
        <div class="mt-3 grid gap-2" role="radiogroup" :aria-label="L.q(sitting.current + 1, sitting.ids.length)">
          <button
            v-for="(o, oi) in cur.q.opts"
            :key="oi"
            type="button"
            role="radio"
            :aria-checked="sitting.answers[cur.item.id] === oi"
            class="control focus-ring rounded-control press jp min-h-12 px-3 py-2 text-start text-lg leading-loose [--control-border-width:2px]"
            :class="
              sitting.answers[cur.item.id] === oi ? 'bg-primary/15 [--surface-border-color:var(--color-primary)]' : ''
            "
            @click="pick(oi)"
          >
            <span class="text-ink-soft me-2 text-sm">{{ oi + 1 }}</span><span v-html="notation(o)" />
          </button>
        </div>
      </BaseCard>

      <div class="flex gap-2">
        <BaseButton variant="secondary" :disabled="sitting.current === 0" @click="go(sitting.current - 1)">
          <ChevronLeft class="size-4" aria-hidden="true" />{{ L.prev }}
        </BaseButton>
        <BaseButton v-if="sitting.current < sitting.ids.length - 1" class="flex-1" @click="go(sitting.current + 1)"
          >{{ L.next }}<ChevronRight class="size-4" aria-hidden="true"
        /></BaseButton>
        <BaseButton v-else class="flex-1" variant="positive" @click="trySubmit"
          ><Flag class="size-4" aria-hidden="true" />{{ L.submit }}</BaseButton
        >
      </div>
      <div
        v-if="confirming"
        role="alertdialog"
        class="border-warning bg-muted rounded-control grid gap-2 border-s-4 p-3"
      >
        <p class="text-[15px]">{{ L.confirmSubmit(blanks) }}</p>
        <div class="flex gap-2">
          <BaseButton size="sm" variant="positive" @click="doSubmit">{{ L.yes }}</BaseButton>
          <BaseButton size="sm" variant="ghost" @click="confirming = false">{{ L.no }}</BaseButton>
        </div>
      </div>

      <!-- Question grid -->
      <details class="surface rounded-card p-3">
        <summary class="cursor-pointer text-sm font-semibold">{{ L.grid }}</summary>
        <div class="mt-3 grid grid-cols-6 gap-1.5 sm:grid-cols-10">
          <button
            v-for="(id, i) in sitting.ids"
            :key="id"
            type="button"
            class="focus-ring rounded-cell min-h-11 text-sm font-semibold tabular-nums"
            :class="[
              sitting.answers[id] !== undefined ? 'bg-primary text-on-primary' : 'bg-muted',
              i === sitting.current ? 'ring-ink ring-2' : '',
            ]"
            :aria-current="i === sitting.current ? 'step' : undefined"
            @click="go(i)"
          >
            {{ byId.get(id)?.q.no }}
          </button>
        </div>
        <BaseButton class="mt-3" block variant="positive" @click="trySubmit">{{ L.submit }}</BaseButton>
      </details>
    </template>

    <!-- Result -->
    <template v-else-if="stage === 'result' && result">
      <p v-if="timeUp" role="status" class="text-warning font-semibold">{{ L.timeUp }}</p>
      <BaseCard class="text-center">
        <p class="text-ink-soft text-sm">{{ L.result }}</p>
        <p class="text-5xl font-bold" :class="result.percent >= 60 ? 'text-positive' : 'text-negative'">
          {{ result.percent }}%
        </p>
        <p class="text-ink-soft">{{ result.correct }} / {{ result.total }} {{ L.correct }}</p>
      </BaseCard>
      <BaseCard v-if="result.topics.length > 1">
        <p class="mb-2 font-bold">{{ L.topics }}</p>
        <ul class="grid gap-2">
          <li v-for="tp in result.topics" :key="tp.topic" class="grid gap-1">
            <div class="flex justify-between gap-2 text-sm">
              <JpText :text="tp.topic" class="min-w-0 truncate" />
              <span class="shrink-0 font-semibold tabular-nums">{{ tp.correct }}/{{ tp.total }}</span>
            </div>
            <div class="bg-hair h-1.5 overflow-hidden rounded-full">
              <div
                class="h-full rounded-full"
                :class="tp.correct / tp.total >= 0.6 ? 'bg-positive' : 'bg-negative'"
                :style="{ width: `${(tp.correct / tp.total) * 100}%` }"
              />
            </div>
          </li>
        </ul>
      </BaseCard>
      <div class="grid gap-2">
        <BaseButton v-if="exam.retryIds(result).length" block @click="begin(exam.retryIds(result), 'practice')">
          <RotateCcw class="size-4" aria-hidden="true" />{{ L.retryWrong(exam.retryIds(result).length) }}
        </BaseButton>
        <p v-else class="text-positive text-center font-bold">{{ L.perfect }}</p>
        <BaseButton
          block
          variant="secondary"
          @click="((reviewOnlyWrong = exam.retryIds(result).length > 0), (stage = 'review'))"
          >{{ exam.retryIds(result).length ? L.review : L.reviewAll }}</BaseButton
        >
        <BaseButton block variant="ghost" @click="stage = 'intro'">{{ L.newSitting }}</BaseButton>
      </div>
    </template>

    <!-- Review -->
    <template v-else-if="stage === 'review' && sitting">
      <SegmentedControl
        v-model="reviewStr"
        :options="[
          { value: 'wrong', label: L.review },
          { value: 'all', label: L.reviewAll },
        ]"
      />
      <BaseCard v-for="r in reviewRows" :key="r.item.id" class="grid gap-2">
        <p class="text-ink-soft text-sm">{{ r.q.no }}.</p>
        <AudioSegment
          v-if="listening && audio && r.item.start !== undefined"
          :src="audio"
          :start="r.item.start"
          :end="ends.get(r.item.id)"
        />
        <JpText :text="r.q.q" as="p" class="text-[1.2rem] leading-[2.2]" />
        <p class="flex items-start gap-1.5 text-[15px]">
          <component
            :is="sitting.answers[r.item.id] === r.q.a ? Check : X"
            class="mt-1 size-4 shrink-0"
            :class="sitting.answers[r.item.id] === r.q.a ? 'text-positive' : 'text-negative'"
            aria-hidden="true"
          />
          <span>
            <template v-if="sitting.answers[r.item.id] === undefined">{{ L.skipped }}</template>
            <template v-else
              >{{ L.yours }}: <span class="jp" v-html="notation(r.q.opts[sitting.answers[r.item.id]!]!)"
            /></template>
            <br />
            {{ L.answer }}: <b class="jp" v-html="notation(r.q.opts[r.q.a]!)" />
          </span>
        </p>
        <div class="bg-muted rounded-control px-3 py-2 text-[15px]" v-html="notation(r.q.why)" />
        <template v-if="r.g.script">
          <BaseButton
            size="sm"
            variant="ghost"
            class="justify-self-start"
            @click="scriptOpen[r.item.id] = !scriptOpen[r.item.id]"
          >
            {{ scriptOpen[r.item.id] ? L.hideScript : L.script }}
          </BaseButton>
          <div v-if="scriptOpen[r.item.id]" class="grid gap-2">
            <div v-for="(l, li) in r.g.script" :key="li" class="flex gap-3">
              <span v-if="l.who" class="jp text-primary w-10 shrink-0 pt-1.5 font-bold">{{ l.who }}</span>
              <div class="min-w-0">
                <JpText :text="l.jp" as="p" class="text-[1.1rem] leading-[2.2]" />
                <p class="text-ink-soft text-[15px]"><RevealText :text="l.tr" /></p>
              </div>
            </div>
          </div>
        </template>
      </BaseCard>
      <BaseButton block variant="secondary" @click="stage = 'result'">{{ L.result }}</BaseButton>
    </template>
  </div>
</template>
