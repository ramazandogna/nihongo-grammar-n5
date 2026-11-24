<script setup lang="ts">
import { ref, watch } from 'vue'

/**
 * A hanko-style checkbox. Off: a faint dashed ring. On: a seal is pressed
 * onto the page (drops in, turns, ink bleeds) and stays as a pale green mark.
 * The press plays only on the change, never on mount; reduced motion just
 * swaps the look.
 */
const { checked, disabled = false, glyph = '済', size = 'md', layout = 'row' } = defineProps<{
  checked: boolean
  label: string
  /** A short line under/next to the label, e.g. "3/11 kanji" while locked. */
  hint?: string
  disabled?: boolean
  glyph?: string
  size?: 'sm' | 'md'
  layout?: 'row' | 'stack'
}>()
const emit = defineEmits<{ toggle: [] }>()

const pressed = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
watch(
  () => checked,
  (on) => {
    if (!on) return
    pressed.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (pressed.value = false), 600)
  },
)
function toggle() {
  if (!disabled) emit('toggle')
}
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="checked"
    :aria-disabled="disabled || undefined"
    :aria-label="hint ? `${label} · ${hint}` : label"
    class="stamp focus-ring rounded-control inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 text-sm font-semibold"
    :class="[
      layout === 'stack' ? 'flex-col gap-0.5 px-1 py-1.5 text-[11px] leading-tight' : 'px-1.5',
      disabled ? 'stamp-disabled cursor-not-allowed' : 'cursor-pointer',
      checked ? 'stamp-on' : '',
    ]"
    @click="toggle"
  >
    <span class="stamp-seal jp relative grid shrink-0 place-items-center rounded-full" :class="size === 'sm' ? 'size-8 text-sm' : 'size-10 text-lg'" aria-hidden="true">
      <span v-if="checked" class="stamp-ink grid size-full place-items-center rounded-full font-bold" :class="pressed ? 'stamp-press' : ''">{{ glyph }}</span>
    </span>
    <span class="text-center">
      <span class="block">{{ label }}</span>
      <span v-if="hint" class="text-ink-soft block text-[11px] font-normal tabular-nums">{{ hint }}</span>
    </span>
  </button>
</template>
