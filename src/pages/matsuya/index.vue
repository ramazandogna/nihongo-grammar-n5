<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BaseButton, BaseCard } from 'rei-kit'

import MasteryQuiz, { type Question } from '@/components/MasteryQuiz.vue'
import RevealText from '@/components/RevealText.vue'
import SiteLayout from '@/components/SiteLayout.vue'
import StudyHeader from '@/components/StudyHeader.vue'
import { usePage } from '@/lib/page'
import { rubyWord } from '@/lib/ruby'
import { toTop } from '@/lib/scroll'
import { shuffle } from '@/lib/shuffle'
import data from './data.json'

interface Word {
  w: string
  r: string
  romaji: string
  tr: string
  note: string
  cat: number
}

const { t } = usePage('/matsuya/')

const cats = data.map((c) => ({ title: c.title, note: c.note }))
const all: Word[] = data.flatMap((c, cat) => c.words.map((w) => ({ ...w, cat })))
const idsOf = (cat: number) => all.map((w, i) => (w.cat === cat ? i : -1)).filter((i) => i >= 0)

/** `null` is the list; `-1` is the test over every word. */
const cat = ref<number | null>(null)
const view = ref<'learn' | 'test'>('learn')
const tabs = computed(() => [
  { value: 'learn' as const, label: t.value.learn },
  { value: 'test' as const, label: t.value.test },
])
watch([cat, view], toTop)

function open(c: number, v: 'learn' | 'test' = 'learn') {
  cat.value = c
  view.value = v
}

const pool = computed(() => (cat.value === -1 ? all.map((_, i) => i) : cat.value === null ? [] : idsOf(cat.value)))

/** The word to its meaning, or the meaning to the word — chosen per showing. */
function build(i: number): Question {
  const w = all[i]!
  const toMeaning = Math.random() < 0.5
  const others = shuffle(pool.value.length >= 8 ? pool.value : all.map((_, j) => j)).filter((j) => j !== i)
  const value = (x: Word) => (toMeaning ? x.tr : rubyWord(x.w, x.r))
  const options = [value(w)]
  for (const j of others) {
    const v = value(all[j]!)
    if (!options.includes(v)) options.push(v)
    if (options.length === 4) break
  }
  return toMeaning
    ? { kind: 'Anlamı ne?', prompt: rubyWord(w.w, w.r), size: 'big', options, answer: 0 }
    : { kind: 'Hangi kelime?', prompt: w.tr, size: 'text', options, answer: 0 }
}
</script>

<template>
  <SiteLayout>
    <template v-if="cat === null">
      <section class="py-6 text-center">
        <p class="font-jp text-primary text-6xl leading-none" aria-hidden="true">松屋</p>
        <p class="text-ink-soft mt-3">{{ all.length }} kelime · {{ cats.length }} bölüm · önce öğren, sonra test</p>
      </section>
      <div class="grid gap-3">
        <BaseCard v-for="(c, k) in cats" :key="k">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h2 class="font-bold">{{ c.title }}</h2>
            <span class="text-ink-soft text-sm">{{ idsOf(k).length }} kelime</span>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-2">
            <BaseButton variant="secondary" size="sm" @click="open(k)">学 {{ t.learn }}</BaseButton>
            <BaseButton size="sm" @click="open(k, 'test')">試 {{ t.test }}</BaseButton>
          </div>
        </BaseCard>
        <BaseButton variant="secondary" block @click="open(-1, 'test')">総 Genel test ({{ all.length }} kelime)</BaseButton>
      </div>
    </template>

    <template v-else>
      <StudyHeader
        v-if="cat >= 0"
        v-model="view"
        :title="cats[cat]!.title"
        :tabs="tabs"
        @back="cat = null"
      />
      <StudyHeader v-else title="Genel test" @back="cat = null" />

      <div v-if="cat >= 0 && view === 'learn'" class="grid gap-3">
        <p class="bg-muted rounded-control border-primary border-s-4 px-4 py-3 text-[15px]" v-html="cats[cat]!.note" />
        <BaseCard v-for="i in idsOf(cat)" :key="i" padding="sm">
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span class="jp min-w-32 text-2xl leading-[2.1]" lang="ja" v-html="rubyWord(all[i]!.w, all[i]!.r)" />
            <span class="min-w-0 flex-1">
              <span class="block font-semibold"><RevealText :text="all[i]!.tr" /></span>
              <span class="text-ink-soft block text-sm">{{ all[i]!.r }} · {{ all[i]!.romaji }}</span>
              <span v-if="all[i]!.note" class="text-ink-soft block text-sm" v-html="all[i]!.note" />
            </span>
          </div>
        </BaseCard>
        <BaseButton @click="view = 'test'">{{ t.test }} →</BaseButton>
      </div>

      <MasteryQuiz v-else :key="cat" :pool="pool" :build="build">
        <template #feedback="{ item }">
          <p class="mt-2">
            <span class="jp text-xl" lang="ja" v-html="rubyWord(all[item]!.w, all[item]!.r)" /> =
            <b>{{ all[item]!.tr }}</b>
            <span class="text-ink-soft text-sm"> ({{ all[item]!.romaji }})</span>
          </p>
        </template>
        <template #actions>
          <BaseButton v-if="cat >= 0 && cat < cats.length - 1" @click="open(cat + 1)">Sonraki bölüm →</BaseButton>
        </template>
      </MasteryQuiz>
    </template>
  </SiteLayout>
</template>
