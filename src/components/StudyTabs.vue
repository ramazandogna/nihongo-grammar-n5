<script setup lang="ts" generic="V extends string">
import { computed, nextTick, onMounted, ref, type Component } from 'vue'
import {
  BookOpen,
  BookText,
  ClipboardCheck,
  GraduationCap,
  Headphones,
  Languages,
  PencilLine,
  Puzzle,
  Target,
} from 'lucide-vue-next'

/**
 * The stages of one topic — Reading, Grammar, Words, Practice, Test … — as a
 * tab bar that holds up on a phone.
 *
 * Every tab is an icon over a short label in equal columns, so five fit in
 * 328px without a word being split; the selected one sits on a sliding pill.
 * From `sm` up the label goes beside the icon. Arrow keys move between tabs
 * (WAI-ARIA tabs pattern) and the bar sticks under the site header, so the
 * stage can be switched at any scroll depth.
 */
const { tabs } = defineProps<{ tabs: readonly { value: V; label: string }[] }>()
const model = defineModel<V>({ required: true })

/** An icon per known stage; anything else gets a neutral one. */
const ICONS: Record<string, Component> = {
  read: BookOpen,
  reading: BookOpen,
  grammar: Languages,
  words: BookText,
  learn: GraduationCap,
  practice: PencilLine,
  test: Target,
  exam: ClipboardCheck,
  listen: Headphones,
  game: Puzzle,
}
const icon = (v: string) => ICONS[v] ?? BookText

const index = computed(() =>
  Math.max(
    0,
    tabs.findIndex((t) => t.value === model.value),
  ),
)
const buttons = ref<HTMLButtonElement[]>([])
function select(i: number, focus = false) {
  const t = tabs[(i + tabs.length) % tabs.length]
  if (!t) return
  model.value = t.value
  if (focus) nextTick(() => buttons.value[(i + tabs.length) % tabs.length]?.focus())
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') select(index.value + 1, true)
  else if (e.key === 'ArrowLeft') select(index.value - 1, true)
  else if (e.key === 'Home') select(0, true)
  else if (e.key === 'End') select(tabs.length - 1, true)
  else return
  e.preventDefault()
}

/* The pill slides; without a measured position (SSR, first paint) it is simply placed. */
const ready = ref(false)
onMounted(() => requestAnimationFrame(() => (ready.value = true)))
</script>

<template>
  <div
    class="study-tabs bg-canvas/85 sticky top-[calc(3rem+1px)] z-10 -mx-4 px-4 py-2 backdrop-blur sm:mx-0 sm:px-0"
    :style="{ '--n': tabs.length, '--i': index }"
  >
    <div role="tablist" class="surface rounded-card relative grid p-1" :class="ready ? 'is-ready' : ''" @keydown="onKey">
      <span class="study-tabs-pill bg-primary rounded-control absolute inset-y-1 start-1" aria-hidden="true" />
      <button
        v-for="(t, i) in tabs"
        :key="t.value"
        ref="buttons"
        type="button"
        role="tab"
        :aria-selected="i === index"
        :tabindex="i === index ? 0 : -1"
        class="focus-ring rounded-control press relative z-[1] flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-1.5 transition-colors duration-200 sm:flex-row sm:gap-2"
        :class="i === index ? 'text-on-primary' : 'text-ink-soft hover:text-ink'"
        @click="select(i)"
      >
        <component :is="icon(t.value)" class="size-5 shrink-0" aria-hidden="true" />
        <span class="max-w-full truncate text-[12px] leading-tight font-semibold sm:text-sm">{{ t.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
[role='tablist'] {
  grid-template-columns: repeat(var(--n), minmax(0, 1fr));
}
.study-tabs-pill {
  width: calc((100% - 0.5rem) / var(--n));
  transform: translateX(calc(var(--i) * 100%));
}
:dir(rtl) .study-tabs-pill {
  transform: translateX(calc(var(--i) * -100%));
}
@media (prefers-reduced-motion: no-preference) {
  .is-ready .study-tabs-pill {
    transition: transform var(--motion-medium) var(--ease-out-soft);
  }
}
</style>
