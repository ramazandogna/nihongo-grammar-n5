<script setup lang="ts" generic="V extends string">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SegmentedControl } from 'rei-kit'
import { ChevronLeft, Info } from 'lucide-vue-next'

import { usePageContext } from '@/lib/page'
import { notation } from '@/lib/ruby'

/**
 * The bar above one section of a study page, in one compact row: back, the
 * section's name and, when there is more to say, an info button whose bubble
 * holds it — so a phone keeps its screen for the content. Tabs, if any, go
 * underneath.
 */
const { sub } = defineProps<{ title: string; sub?: string; tabs?: readonly { value: V; label: string }[] }>()
const view = defineModel<V>()
const emit = defineEmits<{ back: [] }>()
const { t } = usePageContext()

/* Tap to open (hover does not exist on a phone); outside tap or Esc closes. */
const infoOpen = ref(false)
const infoRoot = ref<HTMLElement | null>(null)
function onDocPointer(e: PointerEvent) {
  if (!infoRoot.value?.contains(e.target as Node)) infoOpen.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') infoOpen.value = false
}
onMounted(() => {
  document.addEventListener('pointerdown', onDocPointer)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointer)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="mb-4 flex flex-col gap-3">
    <div class="flex min-h-11 items-center gap-1">
      <button
        type="button"
        class="focus-ring text-ink-soft hover:text-ink rounded-control -ms-2 grid size-11 shrink-0 place-items-center"
        :aria-label="t.back"
        :title="t.back"
        @click="emit('back')"
      >
        <ChevronLeft class="size-6" aria-hidden="true" />
      </button>
      <h1 class="jp min-w-0 truncate text-xl font-bold" v-html="notation(title)" />
      <div v-if="sub" ref="infoRoot" class="relative shrink-0">
        <button
          type="button"
          class="focus-ring text-ink-soft hover:text-primary rounded-control grid size-11 place-items-center"
          :aria-label="t.info"
          :aria-expanded="infoOpen"
          aria-controls="study-info"
          @click="infoOpen = !infoOpen"
        >
          <Info class="size-4" aria-hidden="true" />
        </button>
        <p
          v-if="infoOpen"
          id="study-info"
          role="status"
          class="bg-ink text-canvas absolute start-0 top-full z-30 mt-1 w-56 rounded-[10px] px-3 py-2 text-[13px] leading-snug shadow-lg"
        >
          {{ sub }}
        </p>
      </div>
      <div class="ms-auto flex shrink-0 items-center"><slot name="end" /></div>
    </div>
    <SegmentedControl v-if="tabs && view !== undefined" v-model="view" :options="tabs" />
  </div>
</template>
