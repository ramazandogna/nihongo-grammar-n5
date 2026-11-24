<script setup lang="ts">
import type { StyleValue } from 'vue'

/** "Test %90" and "Okuma %92": the last score of each, coloured by band; missing ones hidden. */
defineProps<{
  test: number | null
  okuma: number | null
  badge: (p: number) => StyleValue
  testLabel: string
  okumaLabel: string
  /** Appended to a failing score (e.g. "kaldı"). */
  failed?: string
  /** Side by side (list rows) instead of stacked. */
  row?: boolean
}>()
</script>

<template>
  <span v-if="test !== null || okuma !== null" :class="row ? 'flex flex-wrap items-center gap-1' : 'flex shrink-0 flex-col items-end gap-1'">
    <span
      v-if="test !== null"
      class="rounded-full px-2 py-0.5 text-xs font-bold whitespace-nowrap tabular-nums"
      :style="badge(test)"
      >{{ testLabel }} %{{ test }}<template v-if="failed && test < 75"> · {{ failed }}</template></span
    >
    <span
      v-if="okuma !== null"
      class="rounded-full px-2 py-0.5 text-xs font-bold whitespace-nowrap tabular-nums"
      :style="badge(okuma)"
      >{{ okumaLabel }} %{{ okuma }}<template v-if="failed && okuma < 75"> · {{ failed }}</template></span
    >
  </span>
</template>
