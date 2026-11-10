<script setup lang="ts">
import type { MissNode } from '@/lib/quiz-store'
import { notation } from '@/lib/ruby'

/**
 * The mistakes tree, most-missed first: groups (radical, then kanji) with
 * their totals, and the missed words under them. Only the top level gets a
 * bar, scaled to the largest — enough to see what to study first.
 */
const { groups, depth = 0 } = defineProps<{ groups: MissNode[]; depth?: number }>()
const width = (n: number) => `${(n / (groups[0]?.n || 1)) * 100}%`
</script>

<template>
  <ul class="grid" :class="depth === 0 ? 'gap-3' : 'border-hair mt-1 ms-2 gap-1 border-s-2 ps-3'">
    <li v-for="g in groups" :key="g.label">
      <div class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3">
        <span
          class="jp min-w-0"
          :class="[
            depth === 0 ? 'text-xl' : depth === 1 ? 'text-lg' : 'text-ink-soft text-lg',
            g.children.length ? 'font-bold' : '',
          ]"
          v-html="notation(g.label)"
        />
        <span class="text-negative text-sm" :class="g.children.length ? 'font-bold' : ''">{{ g.n }}×</span>
        <span v-if="depth === 0" class="bg-muted col-span-2 mt-0.5 h-1.5 overflow-hidden rounded-full">
          <span class="bg-negative block h-full rounded-full" :style="{ width: width(g.n) }" />
        </span>
      </div>
      <MissList v-if="g.children.length" :groups="g.children" :depth="depth + 1" />
    </li>
  </ul>
</template>
