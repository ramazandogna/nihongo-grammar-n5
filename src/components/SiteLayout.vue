<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { BaseButton, BaseSwitch, PageContainer, SegmentedControl, useTheme } from 'rei-kit'
import { Moon, Sun } from 'lucide-vue-next'

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
const theme = useTheme()

const langOptions = computed(() => page.langs.map((l) => ({ value: l, label: LANG_LABEL[l] })))
const shownLang = computed({
  get: () => (page.langs.includes(lang.value) ? lang.value : page.langs[0]!),
  set: (v) => (lang.value = v),
})

// Light or dark, nothing else: a stored "system" (from before) reads as
// whatever it currently resolves to, and the first press picks a real side.
const isDark = computed(() =>
  theme.value === 'dark' ||
  (theme.value === 'system' && typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches),
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
      <PageContainer width="reading" class="flex flex-col gap-2 py-3">
        <div class="flex items-center gap-3">
          <RouterLink
            v-if="page.path !== '/'"
            to="/"
            class="focus-ring text-ink-soft hover:text-ink rounded-control shrink-0 text-sm font-semibold"
          >
            ← {{ t.home }}
          </RouterLink>
          <span class="flex min-w-0 flex-1 items-center gap-2">
            <span class="font-jp text-primary text-xl leading-none" aria-hidden="true">{{ page.icon }}</span>
            <span class="truncate text-base font-bold">{{ page.title }}</span>
          </span>
          <BaseButton variant="ghost" size="sm" icon :aria-label="themeLabel" :title="themeLabel" @click="cycleTheme">
            <component :is="themeIcon" class="size-4" aria-hidden="true" />
          </BaseButton>
        </div>
        <div
          v-if="page.langs.length > 1 || furiganaSwitch || hideSwitch"
          class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
        >
          <SegmentedControl v-if="page.langs.length > 1" v-model="shownLang" :options="langOptions" />
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
        href="https://www.instagram.com/ramazandogna/"
        target="_blank"
        rel="noopener noreferrer"
        class="focus-ring text-primary rounded-cell font-semibold"
        >Ramazan Dogna</a
      >
    </footer>
  </div>
</template>
