<script setup lang="ts">
import type { MissGroup } from '@/lib/quiz-store'
import { notation } from '@/lib/ruby'

/**
 * Missed items, most-missed first, each with a bar scaled to the top one.
 * Grouped items (kanji under their radical) show the group's total on top and
 * the items with their own counts beneath it.
 */
const { groups } = defineProps<{ groups: MissGroup[] }>()
const width = (n: number) => `${(n / (groups[0]?.n || 1)) * 100}%`
</script>

<template>
  <ul class="grid gap-2.5">
    <li v-for="g in groups" :key="g.group || g.items[0]!.label">
      <div class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3">
        <span
          class="jp min-w-0 truncate text-lg"
          :class="g.group ? 'font-bold' : ''"
          v-html="notation(g.group || g.items[0]!.label)"
        />
        <span class="text-negative text-sm font-bold">{{ g.n }}×</span>
        <span class="bg-muted col-span-2 h-1.5 overflow-hidden rounded-full">
          <span class="bg-negative block h-full rounded-full" :style="{ width: width(g.n) }" />
        </span>
      </div>
      <ul v-if="g.group" class="border-hair mt-1 ms-2 grid gap-0.5 border-s-2 ps-3">
        <li v-for="it in g.items" :key="it.label" class="flex justify-between gap-3">
          <span class="jp text-ink-soft min-w-0" v-html="notation(it.label)" />
          <span class="text-negative shrink-0 text-sm">{{ it.n }}×</span>
        </li>
      </ul>
    </li>
  </ul>
</template>
