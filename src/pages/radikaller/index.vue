<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BaseButton, BaseCard, BaseInput, SegmentedControl } from 'rei-kit'

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
  word: string
  reading: string
  meaning_tr: string
}
interface Kanji {
  kanji: string
  on: string[]
  kun: string[]
  meaning_tr: string
  words: Word[]
}
interface Radical {
  id: number
  radical: string
  variants: string[]
  name_jp: string
  name_romaji: string
  meaning_tr: string
  meaning_en: string
  kanji: Kanji[]
}

const { t } = usePage('/radikaller/')

const radicals = data as Radical[]
/** Every kanji with the radical it belongs to, for the kanji tests. */
const all = radicals.flatMap((r, ri) => r.kanji.map((k) => ({ ...k, ri })))
const wordCount = all.reduce((n, k) => n + k.words.length, 0)

/* ── List ── */
const query = ref('')
const opened = ref<Set<number>>(new Set())
const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? radicals.filter((r) => JSON.stringify(r).toLowerCase().includes(q)) : radicals
})
function toggle(id: number) {
  const s = new Set(opened.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  opened.value = s
}
const readingOf = (k: Kanji) =>
  [k.on.length ? `音 ${k.on.join('、')}` : '', k.kun.length ? `訓 ${k.kun.join('、')}` : ''].filter(Boolean).join('　')

/* ── Tests: the radicals, then the kanji in sets of 25 ── */
const SIZE = 25
const tests = [
  { id: 'rad', title: 'Radikal testi', keys: radicals.map((r) => r.radical).join(''), pool: radicals.map((_, i) => i) },
  ...Array.from({ length: Math.ceil(all.length / SIZE) }, (_, n) => {
    const ids = all.map((_, i) => i).slice(n * SIZE, n * SIZE + SIZE)
    return { id: `k${n + 1}`, title: `Kanji ${n + 1}`, keys: ids.map((i) => all[i]!.kanji).join(''), pool: ids }
  }),
]

const tab = ref<'list' | 'tests'>('list')
const tabs = [
  { value: 'list' as const, label: 'Liste' },
  { value: 'tests' as const, label: 'Testler' },
]
const running = ref<number | null>(null)
watch([tab, running], toTop)
const test = computed(() => (running.value === null ? null : tests[running.value]!))

const pick3 = <T,>(items: T[], not: T) => shuffle([...new Set(items)].filter((x) => x && x !== not)).slice(0, 3)
const firstReading = (k: Kanji) => (k.on[0] ?? k.kun[0] ?? '').replace(/[()]/g, '')

/** The same mix as the original app: meaning, radical, reading, word reading. */
function build(i: number): Question {
  if (test.value!.id === 'rad') {
    const r = radicals[i]!
    if (Math.random() < 0.6) {
      return {
        kind: 'Bu radikalin anlamı ne?',
        prompt: r.radical,
        size: 'big',
        options: [r.meaning_tr, ...pick3(radicals.map((x) => x.meaning_tr), r.meaning_tr)],
        answer: 0,
      }
    }
    const k = shuffle(r.kanji)[0]!
    const label = (x: Radical) => `${x.radical}　${x.meaning_tr}`
    return {
      kind: 'Bu kanjinin radikali hangisi?',
      prompt: k.kanji,
      size: 'big',
      options: [label(r), ...pick3(radicals.map(label), label(r))],
      answer: 0,
    }
  }
  const k = all[i]!
  const roll = Math.random()
  if (roll < 0.4) {
    return {
      kind: 'Bu kanjinin anlamı ne?',
      prompt: k.kanji,
      size: 'big',
      options: [k.meaning_tr, ...pick3(all.map((x) => x.meaning_tr), k.meaning_tr)],
      answer: 0,
    }
  }
  if (roll < 0.7 || !k.words.length) {
    const a = firstReading(k)
    return { kind: 'Bu kanjinin okunuşu hangisi?', prompt: k.kanji, size: 'big', options: [a, ...pick3(all.map(firstReading), a)], answer: 0 }
  }
  const w = shuffle(k.words)[0]!
  return {
    kind: 'Bu kelimenin okunuşu hangisi?',
    prompt: w.word,
    size: 'big',
    options: [w.reading, ...pick3(all.flatMap((x) => x.words.map((y) => y.reading)), w.reading)],
    answer: 0,
  }
}
</script>

<template>
  <SiteLayout>
    <template v-if="!test">
      <section class="py-6 text-center">
        <p class="font-jp text-primary text-6xl leading-none" aria-hidden="true">部首</p>
        <p class="text-ink-soft mt-3">{{ radicals.length }} radikal · {{ all.length }} kanji · {{ wordCount }} kelime</p>
      </section>
      <SegmentedControl v-model="tab" :options="tabs" class="mb-4" />

      <template v-if="tab === 'list'">
        <BaseInput v-model="query" label="Ara" type="search" label-hidden placeholder="Ara: su, 氵, deniz, 進, しんぽ…" class="mb-4" />
        <p v-if="!shown.length" class="text-ink-soft">Sonuç yok.</p>
        <BaseCard v-for="r in shown" :key="r.id" padding="none" class="mb-3 overflow-hidden">
          <!-- The row opens the card; the chevron is the real control, so the
               blurred meaning inside stays its own button rather than nesting in one. -->
          <div class="flex cursor-pointer items-center gap-4 p-4" @click="toggle(r.id)">
            <span class="jp text-primary w-14 shrink-0 text-center text-5xl leading-none">{{ r.radical }}</span>
            <span class="min-w-0 flex-1">
              <span class="block font-bold"><RevealText :text="r.meaning_tr" /></span>
              <span class="text-ink-soft block text-sm">
                <span class="jp">{{ r.name_jp }}</span> · {{ r.name_romaji }}<template v-if="r.variants.length">
                  · diğer biçim: <span class="jp">{{ r.variants.join(' ') }}</span></template
                >
              </span>
              <span class="jp text-ink-soft block truncate text-xl tracking-[0.15em]">{{ r.kanji.map((k) => k.kanji).join('') }}</span>
            </span>
            <BaseButton
              variant="ghost"
              size="sm"
              icon
              :aria-expanded="opened.has(r.id) || !!query"
              :aria-label="`${r.radical} kanjileri`"
              @click.stop="toggle(r.id)"
            >
              <span aria-hidden="true" class="transition-transform" :class="opened.has(r.id) || query ? 'rotate-180' : ''">▾</span>
            </BaseButton>
          </div>
          <div v-if="opened.has(r.id) || query" class="border-hair border-t">
            <div v-for="k in r.kanji" :key="k.kanji" class="border-hair flex gap-3 border-b px-4 py-3 last:border-0">
              <span class="jp w-12 shrink-0 text-center text-4xl leading-none">{{ k.kanji }}</span>
              <div class="min-w-0">
                <p class="font-semibold"><RevealText :text="k.meaning_tr" /></p>
                <p class="jp text-ink-soft text-sm">{{ readingOf(k) }}</p>
                <ul class="mt-1.5 flex flex-wrap gap-1.5">
                  <li v-for="w in k.words" :key="w.word" class="bg-muted rounded-control px-2 py-1 text-sm">
                    <span class="jp text-lg" lang="ja" v-html="rubyWord(w.word, w.reading)" />
                    <RevealText :text="w.meaning_tr" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </BaseCard>
      </template>

      <template v-else>
        <p class="text-ink-soft mb-3 text-[15px]">{{ t.rule }}</p>
        <div class="grid gap-3 sm:grid-cols-2">
          <BaseCard v-for="(x, i) in tests" :key="x.id" interactive as="button" class="text-start" @click="running = i">
            <p class="font-bold">{{ x.title }}</p>
            <p class="jp text-ink-soft truncate text-lg tracking-widest">{{ x.keys }}</p>
            <p class="text-primary text-sm font-semibold">{{ t.questions(x.pool.length) }} · {{ t.start }} →</p>
          </BaseCard>
        </div>
      </template>
    </template>

    <template v-else>
      <StudyHeader :title="test.title" @back="running = null" />
      <MasteryQuiz :key="test.id" :pool="test.pool" :build="build">
        <template #feedback="{ item }">
          <p v-if="test.id === 'rad'" class="mt-2">
            <span class="jp text-2xl">{{ radicals[item]!.radical }}</span> = <b>{{ radicals[item]!.meaning_tr }}</b> ·
            <span class="jp">{{ radicals[item]!.name_jp }}</span>
            <span class="jp text-ink-soft block text-lg">{{ radicals[item]!.kanji.map((k) => k.kanji).join(' ') }}</span>
          </p>
          <div v-else class="mt-2">
            <p>
              <span class="jp text-2xl">{{ all[item]!.kanji }}</span> = <b>{{ all[item]!.meaning_tr }}</b> · radikal
              <span class="jp">{{ radicals[all[item]!.ri]!.radical }}</span> ({{ radicals[all[item]!.ri]!.meaning_tr }})
            </p>
            <p class="jp text-ink-soft text-sm">{{ readingOf(all[item]!) }}</p>
            <ul class="mt-1.5 flex flex-wrap gap-1.5">
              <li v-for="w in all[item]!.words" :key="w.word" class="bg-muted rounded-control px-2 py-1 text-sm">
                <span class="jp text-lg" lang="ja" v-html="rubyWord(w.word, w.reading)" /> {{ w.meaning_tr }}
              </li>
            </ul>
          </div>
        </template>
        <template #actions>
          <BaseButton v-if="running! < tests.length - 1" @click="running = running! + 1">Sonraki test →</BaseButton>
        </template>
      </MasteryQuiz>
    </template>
  </SiteLayout>
</template>
