<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BaseButton, BaseCard } from 'rei-kit'

import { plain } from '@/lib/ruby'
import { toTop } from '@/lib/scroll'
import { shuffle } from '@/lib/shuffle'
import JpText from '../JpText.vue'
import MasteryQuiz, { type Question } from '../MasteryQuiz.vue'
import PagerNav from '../PagerNav.vue'
import RevealText from '../RevealText.vue'
import StudyHeader from '../StudyHeader.vue'
import type { Lesson } from './types'

/**
 * One textbook unit, the same way for every course: read the text, learn the
 * grammar, drill the words, do the exercises, take the test. Meanings sit
 * behind the shared blur everywhere, and the long tabs go one item per page.
 */
const { lesson } = defineProps<{ lesson: Lesson }>()
const emit = defineEmits<{ back: [] }>()

type Tab = 'read' | 'grammar' | 'words' | 'practice' | 'test'
const tab = ref<Tab>('read')
const tabs = [
  { value: 'read' as const, label: 'Okuma' },
  { value: 'grammar' as const, label: 'Gramer' },
  { value: 'words' as const, label: 'Kelime' },
  { value: 'practice' as const, label: 'Alıştırma' },
  { value: 'test' as const, label: 'Test' },
]
const page = ref(0)
const wordGame = ref(false)
watch(tab, () => {
  page.value = 0
  wordGame.value = false
  toTop()
})
watch(page, toTop)

/** Grammar and the phrase boxes share the pager: points first, then boxes. */
const grammarPages = computed(() => lesson.grammar.length + (lesson.boxes?.length ?? 0))

const wordPool = computed(() => lesson.words.map((_, i) => i))
function buildWord(i: number): Question {
  const [w, m] = lesson.words[i]!
  const toMeaning = Math.random() < 0.6
  const others = shuffle(wordPool.value.filter((j) => j !== i)).slice(0, 3)
  const options = [toMeaning ? m : w, ...others.map((j) => (toMeaning ? lesson.words[j]![1] : lesson.words[j]![0]))]
  return toMeaning
    ? { kind: 'Anlamı ne?', prompt: w, size: 'big', options, answer: 0 }
    : { kind: 'Hangi kelime?', prompt: m, size: 'text', options, answer: 0 }
}
const quizPool = computed(() => lesson.quiz.map((_, i) => i))
function buildQuiz(i: number): Question {
  const q = lesson.quiz[i]!
  return { kind: `Soru ${i + 1}`, prompt: q.q, options: q.opts, answer: q.a, explain: q.why }
}
const longWords = computed(() => lesson.words.some(([w]) => plain(w).length > 7))
</script>

<template>
  <StudyHeader v-model="tab" :title="lesson.title" :sub="lesson.sub" :tabs="tabs" @back="emit('back')" />

  <!-- Reading: one text per page -->
  <template v-if="tab === 'read'">
    <BaseCard v-if="lesson.goals && page === 0" class="mb-4">
      <p class="mb-1 text-sm font-semibold">🎯 Bu dersin hedefi</p>
      <ul class="grid list-disc gap-1 ps-5 text-[15px]">
        <li v-for="(g, i) in lesson.goals" :key="i">{{ g }}</li>
      </ul>
    </BaseCard>
    <BaseCard v-for="(r, i) in lesson.readings" v-show="page === i" :key="i">
      <JpText :text="r.title" as="h2" class="text-2xl font-bold" />
      <p v-if="r.intro" class="text-ink-soft mt-1 text-[15px]">{{ r.intro }}</p>
      <div class="mt-3 grid gap-3">
        <div v-for="(l, j) in r.lines" :key="j" class="flex gap-3">
          <span v-if="l.who" class="jp text-primary w-10 shrink-0 pt-2 text-lg font-bold">{{ l.who }}</span>
          <div class="min-w-0">
            <JpText :text="l.jp" as="p" class="text-[1.3rem] leading-[2.2]" />
            <p class="text-ink-soft text-[15px]"><RevealText :text="l.tr" /></p>
          </div>
        </div>
      </div>
      <div v-if="r.questions?.length" class="border-hair mt-5 border-t pt-4">
        <p class="mb-2 font-bold">❓ Sorular</p>
        <div v-for="(q, j) in r.questions" :key="j" class="bg-muted rounded-control mb-2 px-3 py-2">
          <JpText :text="q.q" as="p" class="text-lg leading-[2.1]" />
          <p class="text-[15px]">→ <RevealText :text="q.a" /></p>
        </div>
      </div>
    </BaseCard>
    <PagerNav v-if="lesson.readings.length > 1" v-model="page" :count="lesson.readings.length" />
  </template>

  <!-- Grammar: one point (or phrase box) per page -->
  <template v-else-if="tab === 'grammar'">
    <BaseCard v-for="(g, i) in lesson.grammar" v-show="page === i" :key="i">
      <p class="text-ink-soft text-sm">Gramer {{ i + 1 }} / {{ lesson.grammar.length }}</p>
      <JpText
        :text="g.title"
        as="h2"
        class="text-primary border-negative my-2 border-s-4 ps-3 text-2xl leading-[1.9] font-bold"
      />
      <p class="text-[17px]" v-html="g.meaning" />
      <JpText :text="`接続：${g.form}`" as="div" class="bg-muted rounded-control my-3 block px-3 py-2 text-lg leading-[2.1]" />
      <p v-if="g.note" class="border-warning mb-3 border-s-4 ps-3 text-[15px]" v-html="g.note" />
      <div class="grid gap-2.5">
        <div v-for="(e, j) in g.examples" :key="j" class="border-hair rounded-control border border-s-4 border-s-primary px-4 py-2.5">
          <JpText :text="e[0]" as="p" class="text-[1.3rem] leading-[2.2]" />
          <p class="text-[15px]"><RevealText :text="e[1]" /></p>
        </div>
      </div>
    </BaseCard>
    <BaseCard v-for="(b, i) in lesson.boxes ?? []" v-show="page === lesson.grammar.length + i" :key="`b${i}`">
      <JpText :text="b.title" as="h2" class="mb-3 text-xl font-bold" />
      <ul class="grid gap-1.5">
        <li v-for="(it, j) in b.items" :key="j" class="bg-muted rounded-control flex flex-wrap items-center gap-x-4 px-3 py-1.5">
          <JpText :text="it[0]" class="min-w-32 text-xl leading-[2.1]" />
          <span class="text-[15px]"><RevealText :text="it[1]" /></span>
        </li>
      </ul>
    </BaseCard>
    <PagerNav v-model="page" :count="grammarPages" />
  </template>

  <!-- Words: the list, then the game -->
  <template v-else-if="tab === 'words'">
    <template v-if="!wordGame">
      <BaseButton block class="mb-4" @click="wordGame = true">🎮 Kelime oyunu ({{ lesson.words.length }} kelime)</BaseButton>
      <ul class="grid gap-1.5">
        <li
          v-for="(w, i) in lesson.words"
          :key="i"
          class="surface rounded-control flex flex-wrap items-center gap-x-4 px-3 py-1.5"
        >
          <JpText :text="w[0]" class="text-xl leading-[2.1]" :class="longWords ? 'min-w-44' : 'min-w-28'" />
          <span class="text-[15px]"><RevealText :text="w[1]" /></span>
        </li>
      </ul>
    </template>
    <template v-else>
      <BaseButton variant="ghost" size="sm" class="mb-3" @click="wordGame = false">← Kelime listesi</BaseButton>
      <MasteryQuiz :pool="wordPool" :build="buildWord">
        <template #feedback="{ item }">
          <p class="mt-2"><JpText :text="lesson.words[item]![0]" class="text-xl" /> = <b>{{ lesson.words[item]![1] }}</b></p>
        </template>
      </MasteryQuiz>
    </template>
  </template>

  <!-- Exercises: answers behind the blur -->
  <template v-else-if="tab === 'practice'">
    <BaseCard v-for="(set, i) in lesson.exercises" v-show="page === i" :key="i">
      <JpText :text="set.title" as="h2" class="mb-3 text-xl font-bold" />
      <div v-for="(e, j) in set.items" :key="j" class="border-hair mb-3 border-b pb-3 last:border-0">
        <p class="text-ink-soft text-sm">{{ j + 1 }}.<span v-if="e.hint"> {{ e.hint }}</span></p>
        <JpText :text="e.q" as="p" class="text-[1.25rem] leading-[2.2]" />
        <p class="text-[17px]">→ <span class="jp"><RevealText :text="e.a" /></span></p>
        <p v-if="e.note" class="text-ink-soft text-sm" v-html="e.note" />
      </div>
    </BaseCard>
    <PagerNav v-if="lesson.exercises.length > 1" v-model="page" :count="lesson.exercises.length" />
  </template>

  <!-- Test -->
  <MasteryQuiz v-else :pool="quizPool" :build="buildQuiz" />
</template>
