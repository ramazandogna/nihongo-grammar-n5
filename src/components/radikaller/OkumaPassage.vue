<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { BookOpen, ChevronDown, Languages } from 'lucide-vue-next'
import { BaseCard } from 'rei-kit'

import { segments, shownTarget, type Okuma } from '@/lib/okuma'
import { notation, rubyWord } from '@/lib/ruby'

/**
 * The reading passage above an okuma question: collapsible, no furigana, the
 * current target marked and the others numbered. Targets of 表記 / 文脈規定
 * questions show as hiragana / a blank until the exam is over, so the text
 * never answers a question. The Turkish translation opens once finished, or
 * on an explicit tap.
 */
const props = defineProps<{
  okuma: Okuma
  /** Question number being asked, or null. */
  current: number | null
  /** The current question has been answered. */
  answered: boolean
  finished: boolean
  en?: boolean
}>()

const open = ref(true)
const showTr = ref(false)
/** Furigana over every kanji, offered once the exam is over (never during it). */
const furi = ref(false)
const hasRuby = computed(() => typeof props.okuma.text_ruby === 'string')
const rubyOn = computed(() => props.finished && furi.value && hasRuby.value)
watch(
  () => props.finished,
  (f) => {
    if (f) {
      open.value = true
      showTr.value = true
    }
  },
  { immediate: true },
)
const body = ref<HTMLElement | null>(null)
/** Keep the current target in view inside the scrolling passage, not the page. */
function follow() {
  void nextTick(() => {
    const box = body.value
    const el = box?.querySelector<HTMLElement>('.okuma-now')
    if (!box || !el) return
    const top = el.offsetTop - box.clientHeight / 2 + el.offsetHeight / 2
    const smooth = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    box.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'auto' })
  })
}
watch(() => [props.current, open.value], follow, { immediate: true })
const byN = computed(() => new Map(props.okuma.questions.map((q) => [q.n, q])))
const parts = computed(() => segments(rubyOn.value ? props.okuma.text_ruby! : props.okuma.text))
const shown = (n: number, word: string) =>
  shownTarget(byN.value.get(n), word, props.finished || (props.answered && n === props.current))
const L = computed(() =>
  props.en
    ? { text: 'Passage', tr: 'Translation', trHint: 'Shows the Turkish translation', furi: 'Furigana' }
    : { text: 'Metin', tr: 'Çeviri', trHint: 'Türkçe çeviriyi gösterir', furi: 'Furigana' },
)
</script>

<template>
  <BaseCard class="okuma-card mb-3 min-w-0">
    <div class="flex items-center gap-2">
      <span class="okuma-seal jp grid size-9 shrink-0 rotate-[-8deg] place-items-center rounded-full text-base font-bold" aria-hidden="true">読</span>
      <div class="min-w-0 flex-1">
        <p class="jp truncate font-bold" lang="ja">{{ okuma.title }}</p>
        <p v-if="finished || showTr" class="text-ink-soft truncate text-xs">{{ okuma.title_tr }}</p>
      </div>
      <button
        type="button"
        class="focus-ring rounded-control bg-muted flex shrink-0 items-center gap-1 px-2 py-1 text-sm font-semibold"
        :aria-expanded="open"
        @click="open = !open"
      >
        <BookOpen class="size-4" aria-hidden="true" />{{ L.text }}
        <ChevronDown class="okuma-chev size-4" :class="open ? 'rotate-180' : ''" aria-hidden="true" />
      </button>
    </div>
    <div v-if="open" class="mt-3 grid gap-3">
      <p ref="body" class="okuma-text jp relative max-h-[38vh] overflow-y-auto overscroll-contain pe-1 text-[1.15rem] leading-[2.1]" lang="ja" tabindex="0">
        <template v-for="(s, i) in parts" :key="i">
          <span v-if="'text' in s && rubyOn" v-html="notation(s.text)" /><template v-else-if="'text' in s">{{ s.text }}</template>
          <span
            v-else
            class="okuma-target"
            :class="s.n === current && !finished ? 'okuma-now' : ''"
            :aria-current="s.n === current && !finished ? 'true' : undefined"
            ><sup class="okuma-num">{{ s.n }}</sup><span v-if="rubyOn" v-html="rubyWord(s.word, byN.get(s.n)?.reading ?? s.word)" /><template v-else>{{ shown(s.n, s.word) }}</template></span
          >
        </template>
      </p>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          v-if="finished && hasRuby"
          type="button"
          role="switch"
          class="focus-ring rounded-control flex min-h-9 items-center gap-1.5 px-2 text-sm font-semibold"
          :class="furi ? 'bg-primary text-canvas' : 'bg-muted text-primary'"
          :aria-checked="furi"
          @click="furi = !furi"
        >
          <span class="jp" aria-hidden="true">ふ</span>{{ L.furi }}
        </button>
        <button
          type="button"
          class="focus-ring rounded-control text-primary flex items-center gap-1 text-sm font-semibold"
          :aria-expanded="showTr"
          :title="L.trHint"
          @click="showTr = !showTr"
        >
          <Languages class="size-4" aria-hidden="true" />{{ L.tr }}
          <ChevronDown class="okuma-chev size-4" :class="showTr ? 'rotate-180' : ''" aria-hidden="true" />
        </button>
        <p v-if="showTr" class="border-primary text-ink-soft mt-2 border-s-4 ps-3 text-[15px]">{{ okuma.text_tr }}</p>
      </div>
    </div>
  </BaseCard>
</template>
