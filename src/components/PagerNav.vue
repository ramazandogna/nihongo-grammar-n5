<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { BaseButton } from 'rei-kit'

import { usePageContext } from '@/lib/page'

/**
 * Önceki / Sonraki for a paged topic. Sits at the bottom of the screen, above
 * the credit line, so the next page is always one press away. The arrow keys
 * do the same, unless the reader is typing.
 */
const { count, label } = defineProps<{ count: number; label?: string }>()
const index = defineModel<number>({ required: true })
const { t } = usePageContext()

function go(step: number) {
  index.value = Math.min(count - 1, Math.max(0, index.value + step))
}
function onKey(e: KeyboardEvent) {
  const el = e.target as HTMLElement
  if (e.altKey || e.metaKey || e.ctrlKey || el.closest('input, textarea, select, [role="radio"]')) return
  if (e.key === 'ArrowRight') go(1)
  if (e.key === 'ArrowLeft') go(-1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <nav class="bg-canvas/90 sticky bottom-7 z-10 mt-6 flex items-center gap-3 py-3 backdrop-blur" :aria-label="label">
    <BaseButton variant="secondary" class="flex-1" :disabled="index === 0" @click="go(-1)">← {{ t.prev }}</BaseButton>
    <span class="text-ink-soft min-w-14 text-center text-sm tabular-nums">{{ index + 1 }} / {{ count }}</span>
    <BaseButton class="flex-1" :disabled="index >= count - 1" @click="go(1)">{{ t.next }} →</BaseButton>
  </nav>
</template>
