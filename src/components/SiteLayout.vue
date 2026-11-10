<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { BaseButton, BaseSwitch, PageContainer, SegmentedControl, useTheme } from 'rei-kit'
import { ChevronLeft, Languages, Menu, Moon, Sun, X } from 'lucide-vue-next'

import { LANG_LABEL } from '@/lib/i18n'
import { usePageContext } from '@/lib/page'
import { furigana, hideAnswers, lang } from '@/lib/prefs'

/**
 * The frame every page shares: one column width, one header, one set of
 * switches, one footer. A page only brings its content.
 *
 * `furiganaSwitch` / `hideSwitch` are off for pages with nothing to govern —
 * a switch that does nothing reads as broken.
 */
const { furiganaSwitch = true, hideSwitch = true } = defineProps<{
  furiganaSwitch?: boolean
  hideSwitch?: boolean
}>()

const { page, t } = usePageContext()
const route = useRoute()
/** A test is open (`?test=`): the page becomes a game screen — no home link. */
const playing = computed(() => typeof route.query.test === 'string')

/* ── Settings menu: language, furigana, hidden answers ──
   Behind one button, so a phone keeps its screen for the content. */
const hasSettings = computed(() => page.langs.length > 1 || furiganaSwitch || hideSwitch)
const menuOpen = ref(false)
const menuButton = ref<{ $el: HTMLElement } | null>(null)
const menuPanel = ref<HTMLElement | null>(null)
function closeMenu(refocus = false) {
  menuOpen.value = false
  if (refocus) menuButton.value?.$el?.focus()
}
function onDocPointer(e: PointerEvent) {
  const target = e.target as Node
  if (menuPanel.value?.contains(target) || menuButton.value?.$el?.contains(target)) return
  closeMenu()
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && menuOpen.value) closeMenu(true)
}
onMounted(() => {
  document.addEventListener('pointerdown', onDocPointer)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointer)
  document.removeEventListener('keydown', onKey)
})
watch(
  () => route.fullPath,
  () => closeMenu(),
)
const theme = useTheme()

const langOptions = computed(() => page.langs.map((l) => ({ value: l, label: LANG_LABEL[l] })))
const shownLang = computed({
  get: () => (page.langs.includes(lang.value) ? lang.value : page.langs[0]!),
  set: (v) => (lang.value = v),
})

// Light or dark, nothing else: a stored "system" (from before) reads as
// whatever it currently resolves to, and the first press picks a real side.
const isDark = computed(
  () =>
    theme.value === 'dark' ||
    (theme.value === 'system' &&
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-color-scheme: dark)').matches),
)
const themeIcon = computed(() => (isDark.value ? Moon : Sun))
const themeLabel = computed(() => `${t.value.theme}: ${isDark.value ? t.value.dark : t.value.light}`)
function cycleTheme() {
  theme.value = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <header class="border-hair bg-surface/80 sticky top-0 z-20 border-b backdrop-blur">
      <PageContainer width="reading" class="relative flex h-12 items-center gap-2">
        <RouterLink
          v-if="page.path !== '/' && !playing"
          to="/"
          class="focus-ring text-ink-soft hover:text-ink rounded-control -ms-1 grid size-10 shrink-0 place-items-center"
          :aria-label="t.home"
          :title="t.home"
        >
          <ChevronLeft class="size-5" aria-hidden="true" />
        </RouterLink>
        <span class="flex min-w-0 flex-1 items-center gap-2">
          <span class="font-jp text-primary text-xl leading-none" aria-hidden="true">{{ page.icon }}</span>
          <span class="truncate text-base font-bold">{{ page.title }}</span>
        </span>
        <BaseButton variant="ghost" size="sm" icon :aria-label="themeLabel" :title="themeLabel" @click="cycleTheme">
          <component :is="themeIcon" class="size-5" aria-hidden="true" />
        </BaseButton>
        <BaseButton
          v-if="hasSettings"
          ref="menuButton"
          variant="ghost"
          size="sm"
          icon
          :aria-label="t.settings"
          :title="t.settings"
          :aria-expanded="menuOpen"
          aria-controls="site-settings"
          @click="menuOpen = !menuOpen"
        >
          <component :is="menuOpen ? X : Menu" class="size-5" aria-hidden="true" />
          <!-- A dot while answers are hidden, so the state is visible without opening the menu. -->
          <span
            v-if="hideAnswers && hideSwitch && !menuOpen"
            class="bg-primary absolute end-1.5 top-1.5 size-2 rounded-full"
            aria-hidden="true"
          />
        </BaseButton>

        <div
          v-if="menuOpen"
          id="site-settings"
          ref="menuPanel"
          class="surface rounded-card absolute end-4 top-[calc(100%+8px)] z-40 grid w-64 gap-3 p-3 shadow-lg"
        >
          <div v-if="page.langs.length > 1" class="grid gap-1.5">
            <span class="text-ink-soft flex items-center gap-1.5 text-xs font-semibold">
              <Languages class="size-3.5" aria-hidden="true" /> {{ t.language }}
            </span>
            <SegmentedControl v-model="shownLang" :options="langOptions" />
          </div>
          <BaseSwitch v-if="furiganaSwitch" v-model="furigana" :label="t.furigana" />
          <BaseSwitch v-if="hideSwitch" v-model="hideAnswers" :label="t.hide" />
        </div>
      </PageContainer>
    </header>

    <main class="flex-1">
      <PageContainer width="reading" class="py-6">
        <slot />
      </PageContainer>
    </main>

    <!-- Fixed to the bottom of every page; the padding below keeps it off the content. -->
    <div class="h-8" aria-hidden="true" />
    <footer
      class="bg-canvas/95 border-hair text-ink-soft fixed inset-x-0 bottom-0 z-30 border-t py-1.5 text-center text-xs backdrop-blur"
    >
      {{ t.credit }}
      <a
        href="https://github.com/ramazandogna"
        target="_blank"
        rel="noopener noreferrer"
        class="focus-ring text-primary rounded-cell font-semibold"
        >Ramazan Dogna</a
      >
    </footer>
  </div>
</template>
