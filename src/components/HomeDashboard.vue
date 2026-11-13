<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { BookOpen, ChevronRight, Flame, Headphones, Play, Target, Trophy } from 'lucide-vue-next'

import { summarize, type Summary } from '@/lib/dashboard'
import { usePageContext } from '@/lib/page'
import { notation } from '@/lib/ruby'
import { GROUPS } from '@/site'

/**
 * The top of the home page: continue where you stopped, how the study is
 * going, what to review, and the way into JLPT practice by level.
 *
 * Browser-only data, read after mount; the prerendered page shows the JLPT
 * links and nothing else, so it never disagrees with the hydrated one.
 */
const { lang, pick } = usePageContext()
const S = {
  resume: ['Kaldığın yerden devam et', 'Continue where you left off'],
  exact: ['Aynı sorudan açılır', 'Opens on the same question'],
  page: ['Sayfası açılır; testi seçince aynı sorudan devam eder', 'Opens its page; pick the test to resume'],
  done: ['tamam', 'done'],
  streak: ['gün üst üste', 'days in a row'],
  accuracy: ['doğru oranı', 'accuracy'],
  finished: ['bitirilen test', 'tests finished'],
  weak: ['Tekrar etmen gerekenler', 'Worth reviewing'],
  weakHint: [
    'En çok yanlış yaptıkların; dokununca testinin sayfası açılır.',
    'Your most missed items; tap to open their test.',
  ],
  folders: ['Klasörlere göre', 'By folder'],
  last: ['son', 'last'],
  jlpt: ['JLPT çalışması', 'JLPT practice'],
  jlptHint: [
    'Dinleme sınavı yalnızca N3 için var: elindeki gerçek kayıtlarla.',
    'Pick a level. The listening exam exists only for N3, from the real recordings you have.',
  ],
  vocab: ['Kelime · kanji', 'Vocabulary · kanji'],
  grammar: ['Gramer', 'Grammar'],
  examShort: ['Geçmiş sınav · dinleme', 'Past paper · listening'],
  reading: ['Okuma (問題4・5)', 'Reading (問題4・5)'],
}
const LEVELS = [
  {
    level: 'N5',
    links: [
      { to: '/n5/', label: S.grammar, icon: BookOpen },
      { to: '/n5/', label: S.vocab, icon: Target },
    ],
  },
  {
    level: 'N4',
    links: [
      { to: '/n4/', label: S.grammar, icon: BookOpen },
      { to: '/n4/13-15/', label: [`13–15 · ${S.grammar[0]}`, `13–15 · ${S.grammar[1]}`], icon: BookOpen },
    ],
  },
  {
    level: 'N3',
    links: [
      { to: '/past-n3/', label: S.examShort, icon: Headphones },
      { to: '/kanji-n3-book/', label: S.reading, icon: BookOpen },
      { to: '/radikaller/', label: S.vocab, icon: Target },
    ],
  },
]

const level = ref<'N5' | 'N4' | 'N3'>('N3')
const current = computed(() => LEVELS.find((l) => l.level === level.value)!)
function onLevelKey(e: KeyboardEvent) {
  const i = LEVELS.findIndex((l) => l.level === level.value)
  const n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null
  if (n === null) return
  e.preventDefault()
  level.value = LEVELS[(n + LEVELS.length) % LEVELS.length]!.level as typeof level.value
  ;((e.currentTarget as HTMLElement).children[(n + LEVELS.length) % LEVELS.length] as HTMLElement)?.focus()
}
const sum = ref<Summary | null>(null)
onMounted(() => {
  try {
    sum.value = summarize(localStorage)
  } catch {
    sum.value = summarize(null)
  }
})
const hasStats = computed(() => !!sum.value && (sum.value.finished > 0 || !!sum.value.resume))
const pageTitle = (p: { title: string; en: { title: string } }) => (lang.value === 'en' ? p.en.title : p.title)
const date = (iso: string) =>
  new Date(iso).toLocaleDateString(lang.value === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'short' })
</script>

<template>
  <div class="grid gap-3">
    <!-- Continue -->
    <RouterLink
      v-if="sum?.resume"
      :to="sum.resume.place.to"
      class="surface rounded-card focus-ring press lift border-primary rise-in flex items-center gap-4 border-s-4 p-4"
    >
      <span class="relative grid size-14 shrink-0 place-items-center">
        <svg viewBox="0 0 36 36" class="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-hair)" stroke-width="4" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="var(--color-primary)"
            stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="`${(sum.resume.percent / 100) * 94.2} 94.2`"
          />
        </svg>
        <span class="text-sm font-bold">{{ sum.resume.percent }}%</span>
      </span>
      <span class="min-w-0 flex-1">
        <span class="text-ink-soft block text-xs font-semibold">{{ pick(S.resume) }}</span>
        <span class="block truncate font-bold">{{ pageTitle(sum.resume.place.page) }}</span>
        <span class="text-ink-soft block text-xs">{{ pick(sum.resume.place.exact ? S.exact : S.page) }}</span>
      </span>
      <Play class="text-primary size-6 shrink-0" aria-hidden="true" />
    </RouterLink>

    <!-- Stats -->
    <dl v-if="hasStats && sum" class="grid grid-cols-3 gap-2 text-center">
      <div class="surface rounded-card px-1 py-3">
        <dd class="flex items-center justify-center gap-1 text-2xl font-bold">
          <Flame class="text-warning size-5" aria-hidden="true" />{{ sum.streakDays }}
        </dd>
        <dt class="text-ink-soft text-xs">{{ pick(S.streak) }}</dt>
      </div>
      <div class="surface rounded-card px-1 py-3">
        <dd class="text-2xl font-bold">{{ sum.accuracy ?? '–' }}<span v-if="sum.accuracy !== null">%</span></dd>
        <dt class="text-ink-soft text-xs">{{ pick(S.accuracy) }}</dt>
      </div>
      <div class="surface rounded-card px-1 py-3">
        <dd class="flex items-center justify-center gap-1 text-2xl font-bold">
          <Trophy class="text-positive size-5" aria-hidden="true" />{{ sum.finished }}
        </dd>
        <dt class="text-ink-soft text-xs">{{ pick(S.finished) }}</dt>
      </div>
    </dl>

    <!-- Per folder -->
    <div v-if="hasStats && sum" class="surface rounded-card grid gap-2 p-4">
      <p class="text-ink-soft text-xs font-semibold tracking-wide uppercase">{{ pick(S.folders) }}</p>
      <div v-for="g in GROUPS" :key="g.id" class="flex items-center justify-between gap-2 text-[15px]">
        <span class="min-w-0 truncate">{{ lang === 'en' ? g.en.title : g.title }}</span>
        <span class="text-ink-soft shrink-0 text-sm tabular-nums">
          {{ sum.groups[g.id].finished }} {{ pick(S.finished) }}
          <template v-if="sum.groups[g.id].last"> · {{ pick(S.last) }} {{ date(sum.groups[g.id].last!) }}</template>
        </span>
      </div>
    </div>

    <!-- Weak items -->
    <div v-if="sum?.weak.length" class="surface rounded-card grid gap-2 p-4">
      <p class="font-bold">{{ pick(S.weak) }}</p>
      <p class="text-ink-soft text-sm">{{ pick(S.weakHint) }}</p>
      <ul class="flex flex-wrap gap-2">
        <li v-for="w in sum.weak" :key="w.label + w.n">
          <RouterLink
            v-if="w.place"
            :to="w.place.to"
            class="bg-muted focus-ring rounded-control jp inline-flex min-h-11 items-center gap-2 px-3"
          >
            <span v-html="notation(w.label)" /><span class="text-negative text-sm font-semibold">{{ w.n }}×</span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <!-- JLPT by level: one card, a level picker, that level's ways in -->
    <section class="surface rounded-card grid gap-3 p-4" aria-labelledby="jlpt-title">
      <div class="flex items-center justify-between gap-3">
        <h2 id="jlpt-title" class="font-bold">{{ pick(S.jlpt) }}</h2>
        <div role="tablist" class="bg-muted rounded-control flex gap-1 p-1" @keydown="onLevelKey">
          <button
            v-for="lv in LEVELS"
            :key="lv.level"
            type="button"
            role="tab"
            :aria-selected="level === lv.level"
            :tabindex="level === lv.level ? 0 : -1"
            class="focus-ring rounded-control press min-h-11 min-w-11 px-2 text-sm font-extrabold"
            :class="level === lv.level ? 'bg-primary text-on-primary shadow-sm' : 'text-ink-soft hover:text-ink'"
            @click="level = lv.level as typeof level"
          >
            {{ lv.level }}
          </button>
        </div>
      </div>
      <Transition name="fade-up" mode="out-in">
        <ul :key="level" role="tabpanel" class="grid gap-1">
          <li v-for="l in current.links" :key="l.to + l.label[0]">
            <RouterLink
              :to="l.to"
              class="focus-ring rounded-control press group flex min-h-12 items-center gap-3 px-2 hover:bg-[var(--color-muted)]"
            >
              <span class="bg-primary/10 rounded-control grid size-9 shrink-0 place-items-center"
                ><component :is="l.icon" class="text-primary size-[18px]" aria-hidden="true"
              /></span>
              <span class="min-w-0 flex-1 text-[15px] font-medium">{{ pick(l.label) }}</span>
              <ChevronRight class="text-ink-soft size-4 shrink-0" aria-hidden="true" />
            </RouterLink>
          </li>
        </ul>
      </Transition>
      <p v-if="level === 'N3'" class="text-ink-soft text-xs">{{ pick(S.jlptHint) }}</p>
    </section>
  </div>
</template>
