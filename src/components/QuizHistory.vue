<script setup lang="ts">
import { computed, ref } from 'vue'
import { BaseButton } from 'rei-kit'

import { usePageContext } from '@/lib/page'
import { notation } from '@/lib/ruby'
import { accuracy, clearHistory, loadHistory, mostMissed, type Attempt } from '@/lib/quiz-store'

/**
 * A test's record on this device: the latest score as a ring, the trend of
 * the last runs as bars, the items missed most (with how often), and every
 * run with its mistakes.
 */
const { storageKey } = defineProps<{ storageKey: string }>()
const { pick, lang } = usePageContext()

const S = {
  none: ['Bu test henüz hiç bitirilmedi.', 'You have not finished this test yet.', '还没有完成过这个测试。'],
  last: ['son deneme', 'last run', '最近一次'],
  runs: ['deneme', 'runs', '次'],
  avg: ['ortalama', 'average', '平均'],
  best: ['en iyi', 'best', '最好'],
  trend: ['Son denemeler', 'Recent runs', '最近几次'],
  worst: ['En çok yanlış yaptıkların', 'Missed most often', '最常错的'],
  all: ['Tüm denemeler', 'All runs', '所有记录'],
  wrong: ['yanlış', 'wrong', '错'],
  clean: ['Hiç yanlış yok 🎉', 'No mistakes 🎉', '全对 🎉'],
  clear: ['Geçmişi sil', 'Clear history', '清除记录'],
}

const runs = ref<Attempt[]>(typeof window === 'undefined' ? [] : loadHistory(storageKey))
const open = ref<number | null>(null)
const worst = computed(() => mostMissed(runs.value, 8))
const scores = computed(() => runs.value.map(accuracy))
const last = computed(() => scores.value.at(-1) ?? 0)
const avg = computed(() => (scores.value.length ? Math.round(scores.value.reduce((s, a) => s + a, 0) / scores.value.length) : 0))
const best = computed(() => Math.max(0, ...scores.value))
const recent = computed(() => scores.value.slice(-12))
const tone = (p: number) => (p >= 85 ? 'var(--color-positive)' : p >= 60 ? 'var(--color-warning)' : 'var(--color-negative)')
/** Circumference of the r=42 ring. */
const C = 2 * Math.PI * 42
const date = (iso: string) =>
  new Date(iso).toLocaleString(lang.value === 'tr' ? 'tr-TR' : lang.value === 'zh' ? 'zh-CN' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
function reset() {
  clearHistory(storageKey)
  runs.value = []
}
</script>

<template>
  <div class="grid gap-5 text-start">
    <p v-if="!runs.length" class="text-ink-soft text-[15px]">{{ pick(S.none) }}</p>
    <template v-else>
      <!-- Score ring + numbers -->
      <div class="flex items-center gap-4">
        <div class="relative size-24 shrink-0">
          <svg viewBox="0 0 100 100" class="size-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-muted)" stroke-width="10" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              :stroke="tone(last)"
              stroke-width="10"
              stroke-linecap="round"
              :stroke-dasharray="C"
              :stroke-dashoffset="C * (1 - last / 100)"
            />
          </svg>
          <div class="absolute inset-0 grid place-content-center text-center">
            <span class="text-2xl leading-none font-bold">{{ last }}%</span>
            <span class="text-ink-soft text-[11px]">{{ pick(S.last) }}</span>
          </div>
        </div>
        <dl class="grid flex-1 grid-cols-3 gap-2 text-center">
          <div class="bg-muted rounded-control px-1 py-2">
            <dd class="text-xl font-bold">{{ runs.length }}</dd>
            <dt class="text-ink-soft text-xs">{{ pick(S.runs) }}</dt>
          </div>
          <div class="bg-muted rounded-control px-1 py-2">
            <dd class="text-xl font-bold">{{ avg }}%</dd>
            <dt class="text-ink-soft text-xs">{{ pick(S.avg) }}</dt>
          </div>
          <div class="bg-muted rounded-control px-1 py-2">
            <dd class="text-xl font-bold">{{ best }}%</dd>
            <dt class="text-ink-soft text-xs">{{ pick(S.best) }}</dt>
          </div>
        </dl>
      </div>

      <!-- Trend -->
      <div v-if="recent.length > 1">
        <p class="text-ink-soft mb-1.5 text-xs font-semibold tracking-wide uppercase">{{ pick(S.trend) }}</p>
        <div class="bg-muted rounded-control flex h-20 items-end gap-1 p-2">
          <div
            v-for="(p, i) in recent"
            :key="i"
            class="flex-1 rounded-t-[3px]"
            :style="{ height: `${Math.max(6, p)}%`, background: tone(p) }"
            :title="`${p}%`"
          />
        </div>
      </div>

      <!-- Most missed -->
      <div v-if="worst.length">
        <p class="text-ink-soft mb-1.5 text-xs font-semibold tracking-wide uppercase">{{ pick(S.worst) }}</p>
        <ul class="grid gap-1.5">
          <li v-for="w in worst" :key="w.label" class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3">
            <span class="jp min-w-0 truncate text-lg" v-html="notation(w.label)" />
            <span class="text-negative text-sm font-bold">{{ w.n }}×</span>
            <span class="bg-muted col-span-2 h-1.5 overflow-hidden rounded-full">
              <span class="bg-negative block h-full rounded-full" :style="{ width: `${(w.n / worst[0]!.n) * 100}%` }" />
            </span>
          </li>
        </ul>
      </div>

      <!-- Every run -->
      <div>
        <p class="text-ink-soft mb-1.5 text-xs font-semibold tracking-wide uppercase">{{ pick(S.all) }}</p>
        <ul class="grid gap-1.5">
          <li v-for="(a, i) in [...runs].reverse()" :key="a.at" class="border-hair rounded-control border">
            <button
              type="button"
              class="focus-ring rounded-control flex w-full items-center gap-3 px-3 py-2 text-start"
              :aria-expanded="open === i"
              @click="open = open === i ? null : i"
            >
              <span class="size-2.5 shrink-0 rounded-full" :style="{ background: tone(accuracy(a)) }" />
              <span class="min-w-0 flex-1 text-sm">{{ date(a.at) }}</span>
              <span class="font-bold">{{ accuracy(a) }}%</span>
              <span class="text-ink-soft text-sm">{{ a.wrong }} {{ pick(S.wrong) }}</span>
            </button>
            <ul v-if="open === i" class="border-hair grid gap-1 border-t px-3 py-2">
              <li v-if="!a.misses.length" class="text-positive text-sm">{{ pick(S.clean) }}</li>
              <li v-for="m in a.misses" :key="m.label" class="flex justify-between gap-3">
                <span class="jp min-w-0" v-html="notation(m.label)" />
                <span class="text-negative shrink-0 text-sm">{{ m.n }}×</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <BaseButton variant="ghost" size="sm" class="justify-self-start" @click="reset">{{ pick(S.clear) }}</BaseButton>
    </template>
  </div>
</template>
