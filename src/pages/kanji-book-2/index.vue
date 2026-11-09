<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BaseButton, BaseCard } from 'rei-kit'

import MasteryQuiz, { type Question } from '@/components/MasteryQuiz.vue'
import PagerNav from '@/components/PagerNav.vue'
import RevealText from '@/components/RevealText.vue'
import SiteLayout from '@/components/SiteLayout.vue'
import StudyHeader from '@/components/StudyHeader.vue'
import { usePage } from '@/lib/page'
import { rubyWord } from '@/lib/ruby'
import { toTop } from '@/lib/scroll'
import { jlptQuestion, type Vocab } from '@/lib/jlpt'
import { similarKanji } from '@/lib/kanji-similar'
import { shuffle } from '@/lib/shuffle'
import data from './data.json'

interface Word {
  w: string
  r: string
  m: string
}
interface Kanji {
  k: string
  on: string
  kun: string
  m: string
  w: Word[]
  unit: number
}

const { t } = usePage('/kanji-book-2/')

const units = data.map((u) => ({ title: u.title, tr: u.tr }))
/** Every kanji in one list, so a test can mix units by index. */
const all: Kanji[] = data.flatMap((u, unit) => u.kanji.map((k) => ({ ...(k as Omit<Kanji, 'unit'>), unit })))
const idsOf = (unit: number) => all.map((k, i) => (k.unit === unit ? i : -1)).filter((i) => i >= 0)

/** Units in fours: after every four comes a test across all of them. */
const blocks: number[][] = []
for (let i = 0; i < units.length; i += 4) blocks.push(units.slice(i, i + 4).map((_, j) => i + j))
const blockOf = (u: number) => blocks.findIndex((b) => b.includes(u))
const blockName = (b: number) => `Ünite ${blocks[b]![0]! + 1}–${blocks[b]!.at(-1)! + 1}`

type Scope = { kind: 'unit'; u: number } | { kind: 'block'; b: number }
const scope = ref<Scope | null>(null)
const view = ref<'learn' | 'test'>('learn')
const tabs = computed(() => [
  { value: 'learn' as const, label: t.value.learn },
  { value: 'test' as const, label: t.value.test },
])
/** One kanji card on screen at a time while learning. */
const card = ref(0)
watch([scope, view], () => {
  card.value = 0
  toTop()
})
watch(card, toTop)

function openUnit(u: number, v: 'learn' | 'test' = 'learn') {
  scope.value = { kind: 'unit', u }
  view.value = v
}
function openBlock(b: number) {
  scope.value = { kind: 'block', b }
  view.value = 'test'
}

const pool = computed(() => {
  const s = scope.value
  if (!s) return []
  return s.kind === 'unit' ? idsOf(s.u) : blocks[s.b]!.flatMap(idsOf)
})

/**
 * A different question each time a kanji comes up: its meaning, the reading
 * of one of its words, or the word for a meaning. Wrong options come from the
 * same test, so they look like the right one.
 */
/** Every word of every unit, for wrong options. */
const allWords: Vocab[] = all.flatMap((k) => k.w.map((w) => ({ word: w.w, reading: w.r, meaning: w.m })))
/** Look-alikes: the radical list's, plus the other kanji of this book. */
const similar = (c: string) => similarKanji(c, shuffle(all.map((x) => x.k)).slice(0, 6))

/**
 * JLPT-style: one of the kanji's words, asked as reading, spelling or
 * meaning; now and then the kanji itself, among look-alikes.
 */
function build(i: number): Question {
  const k = all[i]!
  const w = k.w[Math.floor(Math.random() * k.w.length)]!
  if (Math.random() < 0.2) {
    const look = shuffle(similar(k.k).map((c) => all.find((x) => x.k === c)?.m).filter((m): m is string => !!m && m !== k.m))
    const options = [k.m, ...[...new Set([...look, ...shuffle(all.map((x) => x.m))])].filter((m) => m !== k.m).slice(0, 3)]
    return { kind: '意味 · bu kanjinin anlamı', prompt: k.k, size: 'big', options, answer: 0 }
  }
  return jlptQuestion({ word: w.w, reading: w.r, meaning: w.m }, allWords, similar)
}

const nextAfter = computed(() => {
  const s = scope.value
  if (!s) return null
  if (s.kind === 'unit') {
    const b = blockOf(s.u)
    if (blocks[b]!.at(-1) === s.u) return { label: `${blockName(b)} genel testi`, go: () => openBlock(b) }
    return s.u < units.length - 1 ? { label: 'Sonraki ünite →', go: () => openUnit(s.u + 1) } : null
  }
  return s.b < blocks.length - 1 ? { label: 'Sonraki ünite →', go: () => openUnit(blocks[s.b + 1]![0]!) } : null
})
</script>

<template>
  <SiteLayout>
    <template v-if="!scope">
      <section class="py-6 text-center">
        <p class="font-jp text-primary text-6xl leading-none" aria-hidden="true">漢字 2</p>
        <p class="text-ink-soft mt-3">{{ all.length }} kanji · {{ units.length }} ünite · önce öğren, sonra test</p>
      </section>
      <section v-for="(b, bi) in blocks" :key="bi" class="mb-6">
        <h2 class="text-ink-soft mb-2 text-sm font-semibold">{{ blockName(bi) }}</h2>
        <div class="grid gap-3">
          <BaseCard v-for="u in b" :key="u">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <h3 class="font-bold">{{ u + 1 }}. ünite · <span class="jp">{{ units[u]!.title }}</span></h3>
              <span class="text-ink-soft text-sm">{{ idsOf(u).length }} kanji</span>
            </div>
            <p class="jp text-primary my-2 text-xl tracking-[0.15em]">{{ idsOf(u).map((i) => all[i]!.k).join('') }}</p>
            <div class="grid grid-cols-2 gap-2">
              <BaseButton variant="secondary" size="sm" @click="openUnit(u)">学 {{ t.learn }}</BaseButton>
              <BaseButton size="sm" @click="openUnit(u, 'test')">試 {{ t.test }}</BaseButton>
            </div>
          </BaseCard>
          <BaseButton variant="secondary" block @click="openBlock(bi)">
            総 {{ blockName(bi) }} genel testi ({{ b.flatMap(idsOf).length }} kanji)
          </BaseButton>
        </div>
      </section>
    </template>

    <template v-else-if="scope.kind === 'unit'">
      <StudyHeader
        v-model="view"
        :title="`${scope.u + 1}. ünite · ${units[scope.u]!.title}`"
        :sub="units[scope.u]!.tr"
        :tabs="tabs"
        @back="scope = null"
      />
      <div v-if="view === 'learn'" class="grid gap-4">
        <BaseCard v-for="(i, n) in idsOf(scope.u)" v-show="card === n" :key="i">
          <p class="text-ink-soft text-sm">{{ scope.u + 1 }}.{{ n + 1 }}</p>
          <div class="flex items-center gap-4">
            <span class="jp w-20 text-center text-6xl leading-none">{{ all[i]!.k }}</span>
            <div>
              <p class="text-ink-soft text-sm">
                音 <b class="jp text-ink">{{ all[i]!.on }}</b> · 訓 <b class="jp text-ink">{{ all[i]!.kun }}</b>
              </p>
              <p class="text-lg font-bold"><RevealText :text="all[i]!.m" /></p>
            </div>
          </div>
          <ul class="mt-3 grid gap-1.5">
            <li v-for="w in all[i]!.w" :key="w.w" class="bg-muted rounded-control flex items-center gap-3 px-3 py-1.5">
              <span class="jp min-w-28 text-xl leading-loose" lang="ja" v-html="rubyWord(w.w, w.r)" />
              <span class="text-[15px]"><RevealText :text="w.m" /></span>
            </li>
          </ul>
        </BaseCard>
        <PagerNav v-model="card" :count="idsOf(scope.u).length" />
        <div v-show="card === idsOf(scope.u).length - 1" class="flex flex-wrap gap-3">
          <BaseButton @click="view = 'test'">Bu ünitenin testi</BaseButton>
          <BaseButton v-if="nextAfter" variant="secondary" @click="nextAfter.go">{{ nextAfter.label }}</BaseButton>
        </div>
      </div>
    </template>

    <template v-else>
      <StudyHeader :title="`${blockName(scope.b)} testi`" @back="scope = null" />
    </template>

    <MasteryQuiz
      v-if="scope && view === 'test'"
      :key="JSON.stringify(scope)"
      :pool="pool"
      :build="build"
      :storage-key="`kb2:${scope.kind === 'unit' ? `u${scope.u}` : `b${scope.b}`}`"
      :label="(i: number) => `${all[i]!.k} · ${all[i]!.m}`"
    >
      <template #feedback="{ item }">
        <p class="mt-2">
          <span class="jp text-2xl">{{ all[item]!.k }}</span> = <b>{{ all[item]!.m }}</b>
          <span class="jp text-ink-soft text-sm">({{ all[item]!.on }} · {{ all[item]!.kun }})</span>
        </p>
        <ul class="mt-2 grid gap-1">
          <li v-for="w in all[item]!.w" :key="w.w" class="flex gap-3">
            <span class="jp min-w-28 text-[1.4rem] leading-[2.3]" lang="ja" v-html="rubyWord(w.w, w.r)" />
            <span class="text-[15px]">{{ w.m }}</span>
          </li>
        </ul>
      </template>
      <template #actions>
        <BaseButton v-if="nextAfter" @click="nextAfter.go">{{ nextAfter.label }}</BaseButton>
      </template>
    </MasteryQuiz>
  </SiteLayout>
</template>
