<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Flame, Play, Trophy } from 'lucide-vue-next'

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
  folders: ['Bölümlere göre', 'By section'],
  last: ['son', 'last'],
  jlpt: ['JLPT çalışması', 'JLPT practice'],
  jlptHint: [
    'Dinleme sınavı yalnızca N3 için var: elindeki gerçek kayıtlarla.',
    'Pick a level. The listening exam exists only for N3, from the real recordings you have.',
  ],
  vocab: ['Kelime · kanji', 'Vocabulary · kanji'],
  grammar: ['Gramer', 'Grammar'],
  examShort: ['Geçmiş sınav · dinleme', 'Past paper · listening'],
  reading: ['Okuma (問題4・5) · dinleme', 'Reading (問題4・5) · listening'],
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

  </div>
</template>
