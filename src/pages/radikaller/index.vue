<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { BaseButton, BaseCard, BaseInput, SegmentedControl } from 'rei-kit'

import MasteryQuiz, { type Question } from '@/components/MasteryQuiz.vue'
import PagerNav from '@/components/PagerNav.vue'
import QuizHistory from '@/components/QuizHistory.vue'
import RevealText from '@/components/RevealText.vue'
import SiteLayout from '@/components/SiteLayout.vue'
import StudyHeader from '@/components/StudyHeader.vue'
import { hasKanji, KIND_LABEL, readingOptions, spellingOptions, type Vocab } from '@/lib/jlpt'
import { usePage } from '@/lib/page'
import { accuracy, loadHistory } from '@/lib/quiz-store'
import { rubyWord } from '@/lib/ruby'
import { toTop } from '@/lib/scroll'
import { shuffle } from '@/lib/shuffle'
import data from './data.json'
import { GUIDE, POSITION_TR } from './guide'

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
const all = radicals.flatMap((r, ri) => r.kanji.map((k) => ({ ...k, ri })))
const wordCount = all.reduce((n, k) => n + k.words.length, 0)
const vocab: Vocab[] = all.flatMap((k) => k.words.map((w) => ({ word: w.word, reading: w.reading, meaning: w.meaning_tr })))
const byChar = new Map(all.map((k) => [k.kanji, k]))

/* ── What the learn cards work out for each kanji ── */
const kata2hira = (s: string) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
const kunStem = (s: string) => s.replace(/[()（）.・-].*$/, '').replace(/[()（）]/g, '')
/** Which reading of the kanji a word uses: 音 if an on-reading appears in it, else 訓. */
function readingUsed(k: Kanji, w: Word): string {
  const on = k.on.find((o) => w.reading.includes(kata2hira(o)))
  if (on) return `音 ${on}`
  const kun = k.kun.find((x) => kunStem(x) && w.reading.includes(kunStem(x)))
  return kun ? `訓 ${kun}` : ''
}
/** Other kanji in this set read the same way — the JLPT spelling traps. */
const sameSound = (k: Kanji) =>
  all.filter((x) => x.kanji !== k.kanji && x.on.some((o) => k.on.includes(o))).map((x) => x.kanji)
/** Look-alikes: same radical. */
const sameRadical = (k: Kanji & { ri: number }) => radicals[k.ri]!.kanji.filter((x) => x.kanji !== k.kanji).map((x) => x.kanji)
const similar = (c: string) => {
  const k = byChar.get(c)
  if (!k) return []
  return [...new Set([...sameRadical(k), ...sameSound(k)])]
}

/* ── Views ── */
type Tab = 'learn' | 'tests'
const tab = ref<Tab>('learn')
const tabs = [
  { value: 'learn' as const, label: 'Öğren' },
  { value: 'tests' as const, label: 'Testler' },
]
const query = ref('')
const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? radicals.filter((r) => JSON.stringify(r).toLowerCase().includes(q)) : radicals
})
/** The radical open in learn mode (index into `radicals`), paged one at a time. */
const reading = ref<number | null>(null)

/* ── Tests: short sets, JLPT-style ── */
const SIZE = 10
const chunk = <T,>(xs: T[], n: number) => Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, i * n + n))
interface TestDef {
  id: string
  title: string
  kind: 'rad' | 'kan'
  keys: string
  pool: number[]
}
const tests: TestDef[] = [
  ...chunk(
    radicals.map((_, i) => i),
    11,
  ).map((ids, n) => ({
    id: `rad${n + 1}`,
    title: `Radikal ${n + 1}`,
    kind: 'rad' as const,
    keys: ids.map((i) => radicals[i]!.radical).join(''),
    pool: ids,
  })),
  ...chunk(
    all.map((_, i) => i),
    SIZE,
  ).map((ids, n) => ({
    id: `kan${n + 1}`,
    title: `Kanji ${n + 1}`,
    kind: 'kan' as const,
    keys: ids.map((i) => all[i]!.kanji).join(''),
    pool: ids,
  })),
]
/** The per-radical test from learn mode: that radical's kanji. */
function radicalTest(ri: number): TestDef {
  const ids = all.map((k, i) => (k.ri === ri ? i : -1)).filter((i) => i >= 0)
  return { id: `r-${radicals[ri]!.id}`, title: `${radicals[ri]!.radical} kanjileri`, kind: 'kan', keys: '', pool: ids }
}

const running = ref<TestDef | null>(null)
const historyOf = ref<string | null>(null)
watch([tab, running, reading], toTop)

const storageKey = (x: TestDef) => `radikaller:${x.id}`
// History lives in this browser only; read it after hydration so the
// prerendered page and the first client render agree.
const mounted = ref(false)
onMounted(() => (mounted.value = true))
const summary = (x: TestDef) => {
  if (!mounted.value) return ''
  const h = loadHistory(storageKey(x))
  return h.length ? `${h.length} deneme · son %${accuracy(h.at(-1)!)}` : ''
}

const pick3 = (xs: string[], not: string) => shuffle([...new Set(xs)].filter((x) => x && x !== not)).slice(0, 3)
const RAD_KIND = '部首 · bu kanjinin radikali'

function build(i: number): Question {
  const test = running.value!
  if (test.kind === 'rad') {
    const r = radicals[i]!
    const label = (x: Radical) => `${x.radical}　${x.meaning_tr}`
    if (Math.random() < 0.5) {
      return { kind: 'Radikalin anlamı', prompt: r.radical, size: 'big', options: [r.meaning_tr, ...pick3(radicals.map((x) => x.meaning_tr), r.meaning_tr)], answer: 0 }
    }
    const k = shuffle(r.kanji)[0]!
    return { kind: RAD_KIND, prompt: k.kanji, size: 'big', options: [label(r), ...pick3(radicals.map(label), label(r))], answer: 0, explain: `${k.kanji} = ${k.meaning_tr} · radikali ${r.radical} (${r.meaning_tr})` }
  }
  const k = all[i]!
  const w = shuffle(k.words)[0]
  const explain = w
    ? `<b class="jp">${rubyWord(w.word, w.reading)}</b> = ${w.meaning_tr} · ${k.kanji}: ${readingUsed(k, w) || [...k.on, ...k.kun].join('・')}`
    : `${k.kanji} = ${k.meaning_tr}`
  const roll = Math.random()
  if (w && roll < 0.45) {
    const v = { word: w.word, reading: w.reading, meaning: w.meaning_tr }
    return { kind: KIND_LABEL.yomi, prompt: `[${w.word}]`, size: 'jp', options: readingOptions(v, vocab), answer: 0, explain }
  }
  if (w && roll < 0.8 && hasKanji(w.word)) {
    const opts = spellingOptions({ word: w.word, reading: w.reading, meaning: w.meaning_tr }, similar)
    if (opts.length === 4) return { kind: KIND_LABEL.hyouki, prompt: `[${w.reading}]`, size: 'jp', options: opts, answer: 0, explain }
  }
  // Meaning, with look-alike kanji as the wrong options.
  const lookalike = shuffle([...sameRadical(k), ...sameSound(k)].map((c) => byChar.get(c)!.meaning_tr))
  const opts = [k.meaning_tr, ...pick3([...lookalike, ...all.map((x) => x.meaning_tr)], k.meaning_tr)]
  return { kind: '意味 · bu kanjinin anlamı (benzer kanjiler arasından)', prompt: k.kanji, size: 'big', options: opts, answer: 0, explain }
}
const itemLabel = (i: number) => {
  const test = running.value!
  if (test.kind === 'rad') return `${radicals[i]!.radical} ${radicals[i]!.meaning_tr}`
  return `${all[i]!.kanji} ${all[i]!.meaning_tr}`
}
</script>

<template>
  <SiteLayout>
    <!-- A test running -->
    <template v-if="running">
      <StudyHeader :title="running.title" sub="Her soru 2 kez doğru bilinene kadar · ilerleme kaydedilir" @back="running = null" />
      <MasteryQuiz :key="running.id" :pool="running.pool" :build="build" :storage-key="storageKey(running)" :label="itemLabel">
        <template #feedback="{ item }">
          <div v-if="running.kind === 'kan'" class="mt-2 text-[15px]">
            <p class="jp text-ink-soft">{{ all[item]!.on.join('・') }} ／ {{ all[item]!.kun.join('・') }}</p>
            <ul class="mt-1.5 flex flex-wrap gap-1.5">
              <li v-for="w in all[item]!.words" :key="w.word" class="bg-muted rounded-control px-2 py-1 text-sm">
                <span class="jp text-lg" lang="ja" v-html="rubyWord(w.word, w.reading)" /> {{ w.meaning_tr }}
              </li>
            </ul>
          </div>
        </template>
      </MasteryQuiz>
    </template>

    <!-- One radical, learned in depth -->
    <template v-else-if="reading !== null">
      <StudyHeader :title="`${radicals[reading]!.radical} · ${radicals[reading]!.name_jp}`" @back="reading = null" />
      <template v-for="(r, ri) in radicals" :key="r.id">
        <div v-if="reading === ri" class="grid gap-4">
          <BaseCard>
            <div class="flex items-center gap-4">
              <span class="jp text-primary w-20 shrink-0 text-center text-7xl leading-none">{{ r.radical }}</span>
              <div class="min-w-0">
                <p class="text-xl font-bold"><RevealText :text="r.meaning_tr" /></p>
                <p class="jp text-ink-soft">{{ r.name_jp }} · {{ r.name_romaji }}</p>
                <p v-if="r.variants.length" class="text-ink-soft text-sm">
                  Diğer biçim: <span class="jp text-ink text-lg">{{ r.variants.join(' ') }}</span>
                </p>
                <p v-if="GUIDE[r.radical]" class="bg-muted rounded-cell mt-1 inline-block px-2 text-sm font-semibold">
                  {{ POSITION_TR[GUIDE[r.radical]!.pos] }}
                </p>
              </div>
            </div>
            <dl v-if="GUIDE[r.radical]" class="mt-4 grid gap-2 text-[15px]">
              <div><dt class="font-bold">📍 Nerede?</dt><dd>{{ GUIDE[r.radical]!.where }}</dd></div>
              <div><dt class="font-bold">🖼️ Neyin resmi?</dt><dd>{{ GUIDE[r.radical]!.origin }}</dd></div>
              <div><dt class="font-bold">🧩 Kanjiye kattığı anlam</dt><dd>{{ GUIDE[r.radical]!.lends }}</dd></div>
              <div class="border-primary border-s-4 ps-3"><dt class="font-bold">💡 Akılda tutma</dt><dd>{{ GUIDE[r.radical]!.hook }}</dd></div>
              <div v-if="GUIDE[r.radical]!.confuse" class="border-negative border-s-4 ps-3">
                <dt class="font-bold">⚠️ Karıştırma (JLPT tuzağı)</dt><dd>{{ GUIDE[r.radical]!.confuse }}</dd>
              </div>
            </dl>
          </BaseCard>

          <BaseCard v-for="k in r.kanji" :key="k.kanji">
            <div class="flex items-start gap-4">
              <span class="jp w-16 shrink-0 text-center text-6xl leading-none">{{ k.kanji }}</span>
              <div class="min-w-0 flex-1">
                <p class="text-lg font-bold"><RevealText :text="k.meaning_tr" /></p>
                <p class="text-ink-soft text-sm">{{ r.radical }} ({{ r.meaning_tr }}) radikali</p>
                <div class="mt-1.5 grid gap-1 text-[15px]">
                  <p v-if="k.on.length"><b>音読み</b> <span class="jp text-lg">{{ k.on.join('・') }}</span> <span class="text-ink-soft text-sm">· Çince kökenli; çoğunlukla bileşik kelimelerde</span></p>
                  <p v-if="k.kun.length"><b>訓読み</b> <span class="jp text-lg">{{ k.kun.join('・') }}</span> <span class="text-ink-soft text-sm">· Japonca; çoğunlukla tek başına / fiillerde</span></p>
                </div>
              </div>
            </div>
            <ul class="mt-3 grid gap-1.5">
              <li v-for="w in k.words" :key="w.word" class="bg-muted rounded-control flex flex-wrap items-center gap-x-3 gap-y-0.5 px-3 py-1.5">
                <span class="jp min-w-24 text-xl leading-loose" lang="ja" v-html="rubyWord(w.word, w.reading)" />
                <span class="text-[15px]"><RevealText :text="w.meaning_tr" /></span>
                <span v-if="readingUsed(k, w)" class="jp text-primary ms-auto text-sm font-semibold">{{ readingUsed(k, w) }}</span>
              </li>
            </ul>
            <div v-if="sameSound(k).length || sameRadical({ ...k, ri }).length" class="mt-3 grid gap-1 text-sm">
              <p v-if="sameSound(k).length">
                <b>🔊 Aynı okunan:</b> <span class="jp text-lg">{{ sameSound(k).join(' ') }}</span>
                <span class="text-ink-soft"> — 表記 sorularında bunlar şık olarak gelir</span>
              </p>
              <p><b>👀 Aynı radikal:</b> <span class="jp text-lg">{{ sameRadical({ ...k, ri }).join(' ') }}</span></p>
            </div>
          </BaseCard>

          <BaseButton block @click="running = radicalTest(ri)">試 {{ r.radical }} kanjilerinin testi (JLPT tarzı)</BaseButton>
        </div>
      </template>
      <PagerNav v-model="reading" :count="radicals.length" />
    </template>

    <!-- Home: learn list and tests -->
    <template v-else>
      <section class="py-6 text-center">
        <p class="font-jp text-primary text-6xl leading-none" aria-hidden="true">部首</p>
        <p class="text-ink-soft mt-3">{{ radicals.length }} radikal · {{ all.length }} kanji · {{ wordCount }} kelime</p>
      </section>
      <SegmentedControl v-model="tab" :options="tabs" class="mb-4" />

      <template v-if="tab === 'learn'">
        <BaseInput v-model="query" label="Ara" type="search" label-hidden placeholder="Ara: su, 氵, deniz, 進, しんぽ…" class="mb-4" />
        <p v-if="!shown.length" class="text-ink-soft">Sonuç yok.</p>
        <!-- minmax(0,1fr) + min-w-0: a grid item is otherwise as wide as its
             longest line, and the kanji row is one long unbroken line. -->
        <ul class="grid grid-cols-[minmax(0,1fr)] gap-2">
          <li v-for="r in shown" :key="r.id" class="min-w-0">
            <button
              type="button"
              class="surface focus-ring rounded-card flex w-full min-w-0 items-center gap-4 p-3 text-start"
              @click="reading = radicals.indexOf(r)"
            >
              <span class="jp text-primary w-14 shrink-0 text-center text-5xl leading-none">{{ r.radical }}</span>
              <span class="min-w-0 flex-1">
                <span class="block font-bold">{{ r.meaning_tr }}</span>
                <span class="jp text-ink-soft block text-sm">{{ r.name_jp }}</span>
                <span class="jp text-ink-soft block truncate text-lg tracking-[0.12em]">{{ r.kanji.map((k) => k.kanji).join('') }}</span>
              </span>
              <span class="text-ink-soft shrink-0" aria-hidden="true">→</span>
            </button>
          </li>
        </ul>
      </template>

      <template v-else>
        <p class="text-ink-soft mb-3 text-[15px]">
          Sorular JLPT tarzında: 漢字読み (okunuş, ゛・uzun ses・っ tuzaklarıyla), 表記 (aynı radikalli/aynı okunan kanjiler
          arasından doğru yazılış) ve anlam. Testten çıksan da kaldığın yerden devam eder.
        </p>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <BaseCard v-for="x in tests" :key="x.id" class="min-w-0">
            <p class="font-bold">{{ x.title }}</p>
            <p class="jp text-ink-soft truncate text-lg tracking-widest">{{ x.keys }}</p>
            <p class="text-ink-soft text-sm">{{ x.pool.length }} {{ x.kind === 'rad' ? 'radikal' : 'kanji' }}<template v-if="summary(x)"> · {{ summary(x) }}</template></p>
            <div class="mt-2 flex gap-2">
              <BaseButton size="sm" class="flex-1" @click="running = x">{{ t.start }} →</BaseButton>
              <BaseButton size="sm" variant="ghost" @click="historyOf = historyOf === x.id ? null : x.id">📊</BaseButton>
            </div>
            <div v-if="historyOf === x.id" class="border-hair mt-3 border-t pt-3">
              <QuizHistory :storage-key="storageKey(x)" />
            </div>
          </BaseCard>
        </div>
      </template>
    </template>
  </SiteLayout>
</template>
