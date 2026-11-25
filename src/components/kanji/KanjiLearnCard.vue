<script setup lang="ts">
import { BaseCard } from 'rei-kit'

import RevealText from '@/components/RevealText.vue'
import StampToggle from '@/components/StampToggle.vue'
import { rubyWord } from '@/lib/ruby'

/**
 * One kanji to learn, laid out for reading exams: the glyph, then its on
 * (音) reading big, then its words very large with furigana. The kanji's own
 * meaning stays small. Marked learned it turns green with a 済 seal.
 */
export interface LearnWord {
  w: string
  r: string
  m: string
  /** Which reading of the kanji the word uses, e.g. "音 ビョウ". */
  used?: string
}
const { kanji, on, kun, meaning, words, learned, just = false, num } = defineProps<{
  id?: string
  kanji: string
  on: string[]
  kun: string[]
  meaning: string
  words: LearnWord[]
  learned: boolean
  /** Just ticked: play the pop and the seal once. */
  just?: boolean
  /** "3.4": unit and place. */
  num?: string
}>()
const emit = defineEmits<{ toggle: [] }>()

/** Confetti dot `n` of 6 behind the learned seal. */
function sealDot(n: number) {
  const a = (n / 6) * Math.PI * 2
  const colors = ['var(--color-positive)', 'var(--color-warning)', 'var(--color-primary)']
  return { '--x': `${Math.cos(a) * 34}px`, '--y': `${Math.sin(a) * 34}px`, '--r': `${n * 60}deg`, background: colors[n % 3] }
}
</script>

<template>
  <BaseCard
    :id="id"
    class="kanji-card relative min-w-0 scroll-mt-4 overflow-hidden"
    :class="[learned ? 'kanji-learned' : '', just ? 'quiz-pop' : '']"
  >
    <span
      v-if="learned"
      class="pointer-events-none absolute end-2 bottom-2 grid size-11 place-items-center"
      aria-hidden="true"
    >
      <template v-if="just">
        <span v-for="n in 6" :key="n" class="quiz-confetti" :style="sealDot(n)" />
      </template>
      <span
        class="kanji-seal jp grid size-11 rotate-[-12deg] place-items-center rounded-full text-xl font-bold"
        :class="just ? 'kanji-seal-in' : ''"
        >済</span
      >
    </span>

    <div class="flex items-start gap-3">
      <button
        type="button"
        class="jp focus-ring rounded-control w-16 shrink-0 text-center text-6xl leading-none"
        :class="learned ? 'text-positive' : ''"
        :aria-pressed="learned"
        :aria-label="`${kanji} · öğrendim`"
        @click="emit('toggle')"
      >
        {{ kanji }}
      </button>
      <div class="min-w-0 flex-1">
        <div class="flex items-start gap-2">
          <div class="min-w-0 flex-1">
            <p v-if="num" class="text-ink-soft text-xs tabular-nums">{{ num }}</p>
            <!-- On (音) first and loudest: it is what compounds are read with. -->
            <p v-if="on.length" class="flex flex-wrap items-center gap-2">
              <span class="bg-primary text-canvas rounded-control px-1.5 py-0.5 text-xs font-bold" title="音読み"
                >音</span
              >
              <span class="jp text-primary text-4xl leading-tight font-bold break-all">{{ on.join('・') }}</span>
            </p>
            <p v-if="kun.length" class="mt-1 flex flex-wrap items-center gap-2">
              <span class="bg-muted rounded-control px-1.5 py-0.5 text-xs font-bold" title="訓読み">訓</span>
              <span class="jp text-ink-soft text-xl">{{ kun.join('・') }}</span>
            </p>
          </div>
          <StampToggle :checked="learned" label="öğrendim" size="sm" @toggle="emit('toggle')" />
        </div>
        <p class="text-ink-soft mt-1 text-sm">Anlamı: <RevealText :text="meaning" /></p>
      </div>
    </div>

    <!-- The words matter most: very large, furigana readable, meaning under. -->
    <ul class="mt-4 grid gap-2">
      <li v-for="w in words" :key="w.w" class="bg-muted rounded-card min-w-0 px-4 py-3">
        <div class="flex min-w-0 items-end justify-between gap-3">
          <span
            class="jp word-ruby text-[2.6rem] leading-[1.9] break-all min-[400px]:text-5xl"
            lang="ja"
            v-html="rubyWord(w.w, w.r)"
          />
          <span v-if="w.used" class="jp text-primary shrink-0 pb-2 text-base font-bold">{{ w.used }}</span>
        </div>
        <p class="text-lg"><RevealText :text="w.m" /></p>
      </li>
    </ul>
  </BaseCard>
</template>

<style scoped>
.word-ruby :deep(rt) {
  font-size: 0.5em;
}
</style>
