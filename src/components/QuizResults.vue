<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { BaseCard } from 'rei-kit'

import { usePageContext } from '@/lib/page'
import { accuracy, diffRuns, type Attempt } from '@/lib/quiz-store'
import { notation } from '@/lib/ruby'

/**
 * The top of the end screen: grade, score counted up, the change since the
 * last run, a bar per recent run, and the items still missed / newly missed /
 * fixed. Everything comes from the test's saved history — `history` ends with
 * the run just finished.
 */
const { history, current } = defineProps<{ history: Attempt[]; current: Attempt }>()

const { lang } = usePageContext()
const S = {
  tr: {
    first: 'İlk denemen · kıyaslanacak önceki sonuç yok',
    still: 'Hâlâ hata',
    fresh: 'Bu kez hata yaptıkların',
    fixed: 'Düzelttiklerin',
    perfect: 'Kusursuz!',
    trend: (s: number[]) => `Son denemeler: ${s.map((x) => `%${x}`).join(', ')}`,
  },
  en: {
    first: 'First try',
    still: 'Still missed',
    fresh: 'Missed this time',
    fixed: 'Fixed',
    perfect: 'Flawless!',
    trend: (s: number[]) => `Recent runs: ${s.map((x) => `${x}%`).join(', ')}`,
  },
}
const s = computed(() => (lang.value === 'tr' ? S.tr : S.en))

const score = computed(() => accuracy(current))
const prev = computed(() => (history.length >= 2 ? history[history.length - 2] : undefined))
const prevScore = computed(() => (prev.value ? accuracy(prev.value) : null))
const delta = computed(() => (prevScore.value === null ? null : score.value - prevScore.value))
const diff = computed(() => diffRuns(prev.value, current))
const recent = computed(() => history.slice(-10).map(accuracy))

const grade = computed(() => {
  const v = score.value
  if (v >= 90) return { t: 'S · 達人', c: 'bg-positive text-white res-gold' }
  if (v >= 85) return { t: 'A · 上手', c: 'res-tint-positive border' }
  if (v >= 75) return { t: 'B · 合格', c: 'res-tint-primary border' }
  return { t: 'C · 再挑戦', c: 'res-tint-negative border' }
})

const shown = ref(0)
onMounted(() => {
  const end = score.value
  const reduce = typeof window === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce || typeof requestAnimationFrame === 'undefined') {
    shown.value = end
    return
  }
  const t0 = performance.now()
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / 900)
    shown.value = Math.round(end * (1 - (1 - p) ** 3))
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
})

const sections = computed(() =>
  [
    { key: 'still', title: s.value.still, items: diff.value.still, chip: 'res-chip-warning', mark: '×2' },
    { key: 'fresh', title: s.value.fresh, items: diff.value.fresh, chip: 'res-chip-negative', mark: '' },
    { key: 'fixed', title: s.value.fixed, items: diff.value.fixed, chip: 'res-chip-positive', mark: '✓' },
  ].filter((x) => x.items.length),
)
function confetti(n: number) {
  const a = (n / 12) * Math.PI * 2
  const d = 50 + (n % 3) * 16
  const colors = ['var(--color-positive)', 'var(--color-primary)', 'var(--color-warning)', 'var(--color-accent)']
  return { '--x': `${Math.cos(a) * d}px`, '--y': `${Math.sin(a) * d - 20}px`, '--r': `${n * 47}deg`, background: colors[n % 4] }
}
const BASE = 72
const H = 56
const barH = (v: number) => Math.max(2, (v / 100) * H)
const barX = (i: number) => 200 - (recent.value.length - i) * 20 + 3
/** The run's number in the whole history (1 = first ever). */
const runNo = (i: number) => history.length - recent.value.length + i + 1
const barFill = (v: number) => (v >= 75 ? 'var(--color-positive)' : 'var(--color-negative)')
</script>

<template>
  <div class="mx-auto grid w-full max-w-md gap-4 text-start">
    <div class="quiz-in relative text-center">
      <span
        v-if="score >= 90 || !current.misses.length"
        class="pointer-events-none absolute start-1/2 top-4"
        aria-hidden="true"
      >
        <span v-for="n in 12" :key="n" class="quiz-confetti" :style="confetti(n)" />
      </span>
      <span class="quiz-stamp inline-flex rounded-full px-3 py-1 text-sm font-black tracking-wider" :class="grade.c">{{
        grade.t
      }}</span>
      <p class="mt-2 text-7xl leading-none font-black tabular-nums" :aria-label="`%${score}`">%{{ shown }}</p>
      <p class="mt-2 flex items-center justify-center gap-2 text-lg tabular-nums">
        <template v-if="delta !== null">
          <span class="text-ink-soft">%{{ prevScore }} → %{{ score }}</span>
          <span
            class="rounded-full px-2 font-bold"
            :class="delta > 0 ? 'res-tint-positive' : delta < 0 ? 'res-tint-negative' : 'text-ink-soft'"
            >{{ delta > 0 ? `▲${delta}` : delta < 0 ? `▼${-delta}` : '= 0' }}</span
          >
        </template>
        <span v-else class="text-ink-soft">{{ s.first }}</span>
      </p>
    </div>

    <svg
      v-if="recent.length > 1"
      viewBox="0 0 200 84"
      class="quiz-in h-24 w-full"
      style="animation-delay: 60ms"
      role="img"
      :aria-label="s.trend(recent)"
    >
      <line x1="0" x2="200" :y1="BASE - 0.75 * H" :y2="BASE - 0.75 * H" class="res-line" />
      <text x="0" :y="BASE - 0.75 * H - 2" class="res-axis">75</text>
      <g v-for="(v, i) in recent" :key="i">
        <rect
          class="res-bar"
          :style="{ '--i': i }"
          :x="barX(i)"
          :y="BASE - barH(v)"
          width="14"
          :height="barH(v)"
          rx="2"
          :fill="barFill(v)"
          :fill-opacity="i === recent.length - 1 ? 1 : 0.4"
          :stroke="i === recent.length - 1 ? 'var(--color-ink)' : 'none'"
          stroke-width="1"
        />
        <text
          :x="barX(i) + 7"
          :y="BASE - barH(v) - 3"
          text-anchor="middle"
          class="res-val"
          :class="i === recent.length - 1 ? 'res-val-now' : ''"
          >{{ v }}</text
        >
        <text :x="barX(i) + 7" :y="BASE + 10" text-anchor="middle" class="res-axis">{{
          runNo(i)
        }}</text>
      </g>
    </svg>

    <p v-if="!current.misses.length" class="quiz-in text-positive text-center text-xl font-black">{{ s.perfect }}</p>
    <BaseCard
      v-for="(sec, si) in sections"
      :key="sec.key"
      class="quiz-in"
      :style="{ animationDelay: `${(si + 2) * 60}ms` }"
    >
      <p class="mb-2 flex items-center gap-2 font-bold">
        {{ sec.title }}
        <span class="bg-muted rounded-full px-2 text-sm tabular-nums">{{ sec.items.length }}</span>
      </p>
      <ul class="flex flex-wrap gap-1.5">
        <li
          v-for="l in sec.items"
          :key="l"
          class="jp relative grid min-h-10 min-w-10 max-w-full place-items-center rounded-lg border px-2 text-xl [overflow-wrap:anywhere]"
          :class="sec.chip"
        >
          <span v-html="notation(l)" />
          <span
            v-if="sec.mark"
            class="absolute -top-1.5 -end-1.5 rounded-full bg-[var(--color-surface)] px-1 font-sans text-[10px] leading-4 font-bold"
            aria-hidden="true"
            >{{ sec.mark }}</span
          >
        </li>
      </ul>
    </BaseCard>
  </div>
</template>
