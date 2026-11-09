<script setup lang="ts">
import { computed, ref } from 'vue'
import { BaseButton } from 'rei-kit'

import { notation } from '@/lib/ruby'
import { accuracy, clearHistory, loadHistory, mostMissed, type Attempt } from '@/lib/quiz-store'

/**
 * A test's record on this device: every finished run with its accuracy and
 * mistakes, and across all of them the items missed most. Opened from the
 * test list and from the end of a run.
 */
const { storageKey } = defineProps<{ storageKey: string }>()

const runs = ref<Attempt[]>(typeof window === 'undefined' ? [] : loadHistory(storageKey))
const open = ref<number | null>(null)
const worst = computed(() => mostMissed(runs.value))
const avg = computed(() =>
  runs.value.length ? Math.round(runs.value.reduce((s, a) => s + accuracy(a), 0) / runs.value.length) : 0,
)
const date = (iso: string) =>
  new Date(iso).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
function reset() {
  clearHistory(storageKey)
  runs.value = []
}
</script>

<template>
  <div class="grid gap-4 text-start">
    <p v-if="!runs.length" class="text-ink-soft text-[15px]">Bu test henüz hiç bitirilmedi.</p>
    <template v-else>
      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="bg-muted rounded-control p-2">
          <p class="text-2xl font-bold">{{ runs.length }}</p>
          <p class="text-ink-soft text-xs">deneme</p>
        </div>
        <div class="bg-muted rounded-control p-2">
          <p class="text-2xl font-bold">%{{ avg }}</p>
          <p class="text-ink-soft text-xs">ortalama doğru</p>
        </div>
        <div class="bg-muted rounded-control p-2">
          <p class="text-2xl font-bold">%{{ accuracy(runs.at(-1)!) }}</p>
          <p class="text-ink-soft text-xs">son deneme</p>
        </div>
      </div>

      <div v-if="worst.length">
        <p class="mb-1.5 font-bold">🔥 En çok yanlış yaptıkların</p>
        <ul class="grid gap-1">
          <li v-for="w in worst" :key="w.label" class="bg-muted rounded-control flex items-center justify-between gap-3 px-3 py-1.5">
            <span class="jp min-w-0 text-lg" v-html="notation(w.label)" />
            <span class="text-negative shrink-0 text-sm font-bold">{{ w.n }}×</span>
          </li>
        </ul>
      </div>

      <div>
        <p class="mb-1.5 font-bold">🗓️ Denemeler</p>
        <ul class="grid gap-1.5">
          <li v-for="(a, i) in [...runs].reverse()" :key="a.at" class="border-hair rounded-control border">
            <button
              type="button"
              class="focus-ring rounded-control flex w-full items-center gap-3 px-3 py-2 text-start"
              :aria-expanded="open === i"
              @click="open = open === i ? null : i"
            >
              <span class="text-ink-soft w-8 shrink-0 text-sm">#{{ runs.length - i }}</span>
              <span class="min-w-0 flex-1 text-sm">{{ date(a.at) }}</span>
              <span class="font-bold">%{{ accuracy(a) }}</span>
              <span class="text-ink-soft text-sm">{{ a.wrong }} yanlış</span>
            </button>
            <ul v-if="open === i" class="border-hair grid gap-1 border-t px-3 py-2">
              <li v-if="!a.misses.length" class="text-positive text-sm">Hiç yanlış yok 🎉</li>
              <li v-for="m in a.misses" :key="m.label" class="flex justify-between gap-3">
                <span class="jp min-w-0" v-html="notation(m.label)" />
                <span class="text-negative shrink-0 text-sm">{{ m.n }}×</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <BaseButton variant="ghost" size="sm" class="justify-self-start" @click="reset">Geçmişi sil</BaseButton>
    </template>
  </div>
</template>
