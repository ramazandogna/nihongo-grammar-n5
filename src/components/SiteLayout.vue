<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { BaseButton, BaseSwitch, PageContainer, SegmentedControl, useTheme } from 'rei-kit'
import { ChevronLeft, DatabaseBackup, Languages, Menu, Moon, Sun, TriangleAlert, X } from 'lucide-vue-next'

import { LANG_LABEL } from '@/lib/i18n'
import { usePageContext } from '@/lib/page'
import { furigana, hideAnswers, lang } from '@/lib/prefs'
import { daysSinceExport, needsBackup } from '@/lib/backup'
import { storageError } from '@/lib/quiz-store'
import BackupSheet from './BackupSheet.vue'

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
const hasSettings = true
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

// The header button is a quick light/dark flip; the menu offers all three.
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
const themeOptions = computed(() => [
  { value: 'system', label: t.value.system },
  { value: 'light', label: t.value.light },
  { value: 'dark', label: t.value.dark },
])
const themeChoice = computed({
  get: () => theme.value as string,
  set: (v: string) => (theme.value = v as typeof theme.value),
})

/* ── Backup ── */
const backupOpen = ref(false)
function openBackup() {
  closeMenu()
  backupOpen.value = true
}
/** Remind on the home page only, once there is progress and no recent export. */
const remindBackup = ref(false)
const backupDays = ref<number | null>(null)
onMounted(() => {
  if (page.path !== '/') return
  try {
    if (sessionStorage.getItem('nihongo-left:backup-reminder') === '1') return
  } catch {
    // no session storage: remind anyway
  }
  remindBackup.value = needsBackup()
  backupDays.value = daysSinceExport()
})
function dismissReminder() {
  remindBackup.value = false
  try {
    sessionStorage.setItem('nihongo-left:backup-reminder', '1')
  } catch {
    // nothing to remember it in
  }
}
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <header class="border-hair bg-surface/80 sticky top-0 z-20 border-b backdrop-blur">
      <PageContainer width="reading" class="relative flex h-12 items-center gap-2">
        <RouterLink
          v-if="page.path !== '/' && !playing"
          to="/"
          class="focus-ring text-ink-soft hover:text-ink rounded-control -ms-1 grid size-11 shrink-0 place-items-center"
          :aria-label="t.home"
          :title="t.home"
        >
          <ChevronLeft class="size-5" aria-hidden="true" />
        </RouterLink>
        <span class="flex min-w-0 flex-1 items-center gap-2">
          <span class="font-jp text-primary text-xl leading-none" aria-hidden="true">{{ page.icon }}</span>
          <span class="truncate text-base font-bold">{{ page.title }}</span>
        </span>
        <BaseButton variant="ghost" size="sm" icon class="size-11" :aria-label="themeLabel" :title="themeLabel" @click="cycleTheme">
          <component :is="themeIcon" class="size-5" aria-hidden="true" />
        </BaseButton>
        <BaseButton
          v-if="hasSettings"
          ref="menuButton"
          class="relative size-11"
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
          <div class="grid gap-1.5">
            <span class="text-ink-soft text-xs font-semibold">{{ t.theme }}</span>
            <SegmentedControl v-model="themeChoice" :options="themeOptions" />
          </div>
          <BaseButton variant="ghost" size="sm" class="justify-start" @click="openBackup">
            <DatabaseBackup class="size-4" aria-hidden="true" />{{ t.backup }}
          </BaseButton>
        </div>
      </PageContainer>
    </header>

    <main class="flex-1">
      <PageContainer width="reading" class="py-6">
        <p
          v-if="storageError"
          role="alert"
          class="border-warning bg-muted rounded-control mb-4 flex items-start gap-2 border-s-4 px-3 py-2 text-sm"
        >
          <TriangleAlert class="text-warning mt-0.5 size-4 shrink-0" aria-hidden="true" />{{ t.storageError }}
        </p>
        <div
          v-if="remindBackup && !playing"
          role="status"
          class="border-primary bg-muted rounded-control mb-4 flex flex-wrap items-center gap-2 border-s-4 px-3 py-2 text-sm"
        >
          <span class="min-w-0 flex-1">{{ t.backupReminder(backupDays) }}</span>
          <BaseButton size="sm" @click="openBackup">{{ t.backupNow }}</BaseButton>
          <BaseButton size="sm" variant="ghost" @click="dismissReminder">{{ t.dismiss }}</BaseButton>
        </div>
        <slot />
      </PageContainer>
    </main>

    <!-- In the flow, not fixed: a credit line should not cover a quiz on a phone. -->
    <footer v-if="!playing" class="border-hair mt-8 border-t pb-[env(safe-area-inset-bottom)]">
      <PageContainer
        width="reading"
        class="text-ink-soft flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-4 text-sm"
      >
        <span class="flex items-center gap-2">
          <span class="font-jp text-primary text-base leading-none" aria-hidden="true">日本語</span>
          <span>© 2026 Ramazan Doğan</span>
        </span>
        <span class="flex items-center gap-1">
          <RouterLink to="/#about" class="focus-ring hover:text-ink rounded-control inline-flex min-h-11 items-center px-2">{{
            t.about
          }}</RouterLink>
          <a
            href="https://github.com/ramazandogna"
            target="_blank"
            rel="noopener noreferrer"
            class="focus-ring hover:text-ink rounded-control inline-flex min-h-11 items-center px-2"
            >GitHub</a
          >
        </span>
      </PageContainer>
    </footer>
    <BackupSheet v-model="backupOpen" @exported="remindBackup = false" />
  </div>
</template>
