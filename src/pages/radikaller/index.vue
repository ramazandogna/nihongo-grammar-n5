<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Eye, Image, Lightbulb, MapPin, Puzzle, TriangleAlert, Volume2 } from 'lucide-vue-next'
import { BaseButton, BaseCard, BaseInput, SegmentedControl } from 'rei-kit'

import MasteryQuiz, { type Question } from '@/components/MasteryQuiz.vue'
import PagerNav from '@/components/PagerNav.vue'
import QuizHistory from '@/components/QuizHistory.vue'
import RevealText from '@/components/RevealText.vue'
import SiteLayout from '@/components/SiteLayout.vue'
import StudyHeader from '@/components/StudyHeader.vue'
import LeaveTestSheet from '@/components/LeaveTestSheet.vue'
import { hasKanji, KIND_LABEL, readingOptions, spellingOptions, type Vocab } from '@/lib/jlpt'
import { usePage } from '@/lib/page'
import { accuracy, loadHistory, loadRun, runProgress, saveRun } from '@/lib/quiz-store'
import { rubyWord } from '@/lib/ruby'
import { toTop } from '@/lib/scroll'
import { useTestRoute } from '@/lib/test-route'
import { shuffle } from '@/lib/shuffle'
import data from './data.json'
import { GUIDE, POSITION_TR } from './guide'
import { GUIDE_EN, POSITION_EN } from './guide-en'

interface Word {
  word: string
  reading: string
  meaning_tr: string
  meaning_en: string
}
interface Kanji {
  kanji: string
  on: string[]
  kun: string[]
  meaning_tr: string
  meaning_en: string
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

const { t, lang } = usePage('/radikaller/')
const en = computed(() => lang.value === 'en')
/** A meaning in the page's language. */
const m = (x: { meaning_tr: string; meaning_en: string }) => (en.value ? x.meaning_en : x.meaning_tr)
const guide = (c: string) => {
  const g = GUIDE[c]
  if (!g) return undefined
  return en.value ? { ...g, ...GUIDE_EN[c]! } : g
}
const position = (c: string) => (en.value ? POSITION_EN : POSITION_TR)[GUIDE[c]!.pos]
const U = {
  learn: ['Öğren', 'Learn'],
  tests: ['Testler', 'Tests'],
  search: ['Ara: su, 氵, deniz, 進, しんぽ…', 'Search: water, 氵, sea, 進, しんぽ…'],
  searchLabel: ['Ara', 'Search'],
  none: ['Sonuç yok.', 'No results.'],
  lead: [
    (r: number, k: number, w: number) => `${r} radikal · ${k} kanji · ${w} kelime`,
    (r: number, k: number, w: number) => `${r} radicals · ${k} kanji · ${w} words`,
  ],
  other: ['Diğer biçim:', 'Other form:'],
  where: ['Nerede?', 'Where?'],
  origin: ['Neyin resmi?', 'A picture of what?'],
  lends: ['Kanjiye kattığı anlam', 'What it lends the kanji'],
  hook: ['Akılda tutma', 'Memory hook'],
  confuse: ['Karıştırma (JLPT tuzağı)', 'Do not confuse (JLPT trap)'],
  radicalOf: [(r: string, mm: string) => `${r} (${mm}) radikali`, (r: string, mm: string) => `radical ${r} (${mm})`],
  on: ['· Çince kökenli; çoğunlukla bileşik kelimelerde', '· from Chinese; mostly in compounds'],
  kun: ['· Japonca; çoğunlukla tek başına / fiillerde', '· native Japanese; mostly alone / in verbs'],
  same: ['Aynı okunan:', 'Same reading:'],
  sameNote: [' — 表記 sorularında bunlar şık olarak gelir', ' — these show up as options in 表記 questions'],
  sameRad: ['Aynı radikal:', 'Same radical:'],
  radTest: [
    (r: string) => `試 ${r} kanjilerinin testi (JLPT tarzı)`,
    (r: string) => `試 Test the ${r} kanji (JLPT style)`,
  ],
  testsLead: [
    'Sorular JLPT tarzında: 漢字読み (okunuş, ゛・uzun ses・っ tuzaklarıyla), 表記 (aynı radikalli/aynı okunan kanjiler arasından doğru yazılış) ve anlam. Testten çıksan da kaldığın yerden devam eder.',
    'Questions are JLPT style: 漢字読み (reading, with ゛ / long-vowel / っ traps), 表記 (the right spelling among kanji with the same radical or reading) and meaning. Leave a test and it picks up where you stopped.',
  ],
  runSub: [
    'Her soru 2 kez doğru bilinene kadar · ilerleme kaydedilir',
    'Until every question is right twice · progress is saved',
  ],
  radN: [(n: number) => `${n} radikal`, (n: number) => `${n} radicals`],
  kanN: [(n: number) => `${n} kanji`, (n: number) => `${n} kanji`],
  runs: [(n: number, p: number) => `${n} deneme · son %${p}`, (n: number, p: number) => `${n} runs · last ${p}%`],
  stats: ['İstatistik', 'Stats'],
  never: ['Henüz çözülmedi', 'Not taken yet'],
  radTitle: [(n: number) => `Radikal ${n}`, (n: number) => `Radicals ${n}`],
  kanjiOf: [(r: string) => `${r} kanjileri`, (r: string) => `${r} kanji`],
  kRad: ['部首 · bu kanjinin radikali', '部首 · this kanji’s radical'],
  kRadMean: ['Radikalin anlamı', 'Meaning of the radical'],
  meaningQ: ['anlam sorusu', 'meaning question'],
  onLabel: ['音読み · Çince kökenli okunuş', '音読み · on reading (from Chinese)'],
  kunLabel: ['訓読み · Japonca okunuş', '訓読み · kun reading (native)'],
  wordsLabel: ['Kelimeler', 'Words'],
  familyLabel: [(r: string) => `${r} radikalli diğer kanjiler`, (r: string) => `Other kanji with ${r}`],
  kMean: ['意味 · bu kanjinin anlamı (benzer kanjiler arasından)', '意味 · this kanji’s meaning (among look-alikes)'],
  yomi: [KIND_LABEL.yomi, '問題1 漢字読み · reading of the underlined word'],
  hyouki: [KIND_LABEL.hyouki, '問題2 表記 · the right kanji for the hiragana word'],
} as const
const u = <K extends keyof typeof U>(k: K): (typeof U)[K][0] => U[k][en.value ? 1 : 0] as (typeof U)[K][0]

const radicals = data as Radical[]
const all = radicals.flatMap((r, ri) => r.kanji.map((k) => ({ ...k, ri })))
const wordCount = all.reduce((n, k) => n + k.words.length, 0)
const vocab: Vocab[] = all.flatMap((k) =>
  k.words.map((w) => ({ word: w.word, reading: w.reading, meaning: w.meaning_tr })),
)
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
const sameRadical = (k: Kanji & { ri: number }) =>
  radicals[k.ri]!.kanji.filter((x) => x.kanji !== k.kanji).map((x) => x.kanji)
const similar = (c: string) => {
  const k = byChar.get(c)
  if (!k) return []
  return [...new Set([...sameRadical(k), ...sameSound(k)])]
}

/* ── Views ── */
type Tab = 'learn' | 'tests'
const tab = ref<Tab>('learn')
const tabs = computed(() => [
  { value: 'learn' as const, label: u('learn') },
  { value: 'tests' as const, label: u('tests') },
])
const query = ref('')
const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? radicals.filter((r) => JSON.stringify(r).toLowerCase().includes(q)) : radicals
})
/** The radical open in learn mode (index into `radicals`), paged one at a time. */
const reading = ref<number | null>(null)

/* ── Tests: short sets, JLPT-style ── */
/** About this many items per test (each answered right twice → ~30 answers). */
const SIZE = 15
/** Split into sets of about `n`, evened out so the last one is not a stub. */
const chunk = <T,>(xs: T[], n: number) => {
  const sets = Math.max(1, Math.round(xs.length / n))
  return Array.from({ length: sets }, (_, i) =>
    xs.slice(Math.round((i * xs.length) / sets), Math.round(((i + 1) * xs.length) / sets)),
  )
}
interface TestDef {
  id: string
  n?: number
  /** For the per-radical test. */
  radical?: string
  kind: 'rad' | 'kan'
  keys: string
  pool: number[]
}
const tests: TestDef[] = [
  ...chunk(
    radicals.map((_, i) => i),
    SIZE,
  ).map((ids, n) => ({
    // Ids carry the set size: tests of 10/11 kept their old history under the old ids.
    id: `rad15-${n + 1}`,
    n: n + 1,
    kind: 'rad' as const,
    keys: ids.map((i) => radicals[i]!.radical).join(''),
    pool: ids,
  })),
  ...chunk(
    all.map((_, i) => i),
    SIZE,
  ).map((ids, n) => ({
    id: `kan15-${n + 1}`,
    n: n + 1,
    kind: 'kan' as const,
    keys: ids.map((i) => all[i]!.kanji).join(''),
    pool: ids,
  })),
]
/** The per-radical test from learn mode: that radical's kanji. */
function radicalTest(ri: number): TestDef {
  const ids = all.map((k, i) => (k.ri === ri ? i : -1)).filter((i) => i >= 0)
  return { id: `r-${radicals[ri]!.id}`, radical: radicals[ri]!.radical, kind: 'kan', keys: '', pool: ids }
}

const { testId, openTest, askClose, asking, leave, stay, leftOnPurpose, markFinished } = useTestRoute()
/** The open test, read from the URL so the back button closes it. */
const running = computed<TestDef | null>(() => {
  const id = testId.value
  if (!id) return null
  if (id.startsWith('r-')) {
    const ri = radicals.findIndex((r) => `r-${r.id}` === id)
    return ri >= 0 ? radicalTest(ri) : null
  }
  return tests.find((x) => x.id === id) ?? null
})
const title = (x: TestDef) =>
  x.radical ? u('kanjiOf')(x.radical) : x.kind === 'rad' ? u('radTitle')(x.n!) : `Kanji ${x.n}`
const historyOf = ref<string | null>(null)
watch([tab, running, reading], toTop)

const storageKey = (x: TestDef) => `radikaller:${x.id}`
/** Per test, read once from storage: the last score and the unfinished run, if any. */
interface TestState {
  runs: number
  last: number | null
  /** Progress of an unfinished run, 0–100. */
  open: number | null
  at: string
}
const states = ref(new Map<string, TestState>())
const allTests = () => [...tests, ...radicals.map((_, ri) => radicalTest(ri))]
function readStates() {
  const m = new Map<string, TestState>()
  for (const x of allTests()) {
    const h = loadHistory(storageKey(x))
    const run = loadRun<number>(storageKey(x))
    const live = run && run.current !== null ? run : null
    m.set(x.id, {
      runs: h.length,
      last: h.length ? accuracy(h.at(-1)!) : null,
      open: live ? runProgress(live) : null,
      at: live?.at ?? '',
    })
  }
  states.value = m
}
const summary = (x: TestDef) => {
  const st = states.value.get(x.id)
  return st?.runs ? u('runs')(st.runs, st.last!) : ''
}
/** Last run's accuracy, for the badge on the card. */
const score = (x: TestDef) => states.value.get(x.id)?.last ?? null
/** Progress of the unfinished run, or null. */
const openOf = (x: TestDef) => states.value.get(x.id)?.open ?? null
function startOver(x: TestDef) {
  saveRun(storageKey(x), null)
  openTest(x.id)
}

/* ── Pick up where the reader left off ──
   Storage is read after hydration, so the prerendered page stays the list. */
const LAST_LESSON = 'nihongo-radikaller:lesson'
onMounted(() => {
  readStates()
  if (testId.value || leftOnPurpose()) return
  // The most recently touched unfinished test opens straight away…
  const open = allTests()
    .map((x) => ({ x, st: states.value.get(x.id)! }))
    .filter(({ st }) => st.open !== null)
    .sort((a, b) => b.st.at.localeCompare(a.st.at))[0]
  if (open) {
    openTest(open.x.id)
    return
  }
  // …otherwise the last radical lesson that was open.
  try {
    const saved = localStorage.getItem(LAST_LESSON)
    if (saved !== null && radicals[Number(saved)]) reading.value = Number(saved)
  } catch {
    // No storage: start on the list.
  }
})
watch(reading, (i) => {
  try {
    if (i === null) localStorage.removeItem(LAST_LESSON)
    else localStorage.setItem(LAST_LESSON, String(i))
  } catch {
    // No storage: nothing to remember.
  }
})
// Back on the list after a test: refresh scores and progress.
watch(running, (x) => {
  if (!x) readStates()
})
const tone = (p: number) =>
  p >= 85 ? 'var(--color-positive)' : p >= 60 ? 'var(--color-warning)' : 'var(--color-negative)'

const pick3 = (xs: string[], not: string) => shuffle([...new Set(xs)].filter((x) => x && x !== not)).slice(0, 3)

function build(i: number): Question {
  const test = running.value!
  if (test.kind === 'rad') {
    const r = radicals[i]!
    const label = (x: Radical) => `${x.radical}　${m(x)}`
    if (Math.random() < 0.5) {
      return {
        kind: u('kRadMean'),
        prompt: r.radical,
        size: 'big',
        options: [m(r), ...pick3(radicals.map(m), m(r))],
        answer: 0,
        explain: `${r.radical} = ${m(r)} · ${r.name_jp}`,
      }
    }
    const k = shuffle(r.kanji)[0]!
    return {
      kind: u('kRad'),
      prompt: k.kanji,
      size: 'big',
      options: [label(r), ...pick3(radicals.map(label), label(r))],
      answer: 0,
      explain: `${k.kanji} = ${m(k)} · ${u('radicalOf')(r.radical, m(r))}`,
    }
  }
  const k = all[i]!
  const r = radicals[k.ri]!
  const w = shuffle(k.words)[0]
  // Statistics: the word under its kanji under its radical.
  const path = [`${r.radical} ${m(r)}`, `${k.kanji} ${m(k)}`]
  const stat = { label: w ? `{${w.word}|${w.reading}} ${m(w)}` : `${k.kanji} · ${u('meaningQ')}`, path }
  const explain = w
    ? `<b class="jp">${rubyWord(w.word, w.reading)}</b> = ${m(w)} · ${k.kanji}: ${readingUsed(k, w) || [...k.on, ...k.kun].join('・')}`
    : `${k.kanji} = ${m(k)}`
  const roll = Math.random()
  if (w && roll < 0.45) {
    const v = { word: w.word, reading: w.reading, meaning: m(w) }
    return {
      kind: u('yomi'),
      prompt: `[${w.word}]`,
      size: 'jp',
      options: readingOptions(v, vocab),
      answer: 0,
      explain,
      stat,
    }
  }
  if (w && roll < 0.8 && hasKanji(w.word)) {
    const opts = spellingOptions({ word: w.word, reading: w.reading, meaning: m(w) }, similar)
    if (opts.length === 4)
      return { kind: u('hyouki'), prompt: `[${w.reading}]`, size: 'jp', options: opts, answer: 0, explain, stat }
  }
  // Meaning, with look-alike kanji as the wrong options.
  const lookalike = shuffle([...sameRadical(k), ...sameSound(k)].map((c) => m(byChar.get(c)!)))
  const opts = [m(k), ...pick3([...lookalike, ...all.map(m)], m(k))]
  return {
    kind: u('kMean'),
    prompt: k.kanji,
    size: 'big',
    options: opts,
    answer: 0,
    explain,
    stat: { ...stat, label: `${k.kanji} · ${u('meaningQ')}` },
  }
}
const itemLabel = (i: number) => {
  const test = running.value!
  if (test.kind === 'rad') return `${radicals[i]!.radical} ${m(radicals[i]!)}`
  return `${all[i]!.kanji} ${m(all[i]!)}`
}
</script>

<template>
  <SiteLayout>
    <!-- A test running -->
    <template v-if="running">
      <StudyHeader :title="title(running)" :sub="u('runSub')" @back="askClose" />
      <MasteryQuiz
        :key="running.id"
        :pool="running.pool"
        :build="build"
        :storage-key="storageKey(running)"
        @finish="markFinished"
        :label="itemLabel"
      >
        <template #feedback="{ item }">
          <!-- The kanji large, its readings labelled, its words with furigana,
               and the other kanji of its radical. -->
          <div v-if="running.kind === 'kan'" class="grid gap-4">
            <div class="flex items-center gap-4">
              <span class="jp text-primary w-20 shrink-0 text-center text-7xl leading-none">{{
                all[item]!.kanji
              }}</span>
              <dl class="grid min-w-0 gap-1.5">
                <div v-if="all[item]!.on.length">
                  <dt class="text-ink-soft text-xs">{{ u('onLabel') }}</dt>
                  <dd class="jp text-2xl">{{ all[item]!.on.join('・') }}</dd>
                </div>
                <div v-if="all[item]!.kun.length">
                  <dt class="text-ink-soft text-xs">{{ u('kunLabel') }}</dt>
                  <dd class="jp text-2xl">{{ all[item]!.kun.join('・') }}</dd>
                </div>
              </dl>
            </div>
            <div>
              <p class="text-ink-soft mb-1 text-sm font-semibold">{{ u('wordsLabel') }}</p>
              <ul class="grid gap-1.5">
                <li
                  v-for="w in all[item]!.words"
                  :key="w.word"
                  class="bg-muted rounded-control flex flex-wrap items-center gap-x-3 px-3 py-1"
                >
                  <span class="jp text-2xl leading-[2.1]" lang="ja" v-html="rubyWord(w.word, w.reading)" />
                  <span class="text-[15px]">{{ m(w) }}</span>
                  <span v-if="readingUsed(all[item]!, w)" class="jp text-primary ms-auto text-sm font-semibold">{{
                    readingUsed(all[item]!, w)
                  }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div v-else class="grid gap-2">
            <p class="text-ink-soft text-sm font-semibold">{{ u('familyLabel')(radicals[item]!.radical) }}</p>
            <ul class="grid grid-cols-3 gap-2">
              <li
                v-for="k in radicals[item]!.kanji"
                :key="k.kanji"
                class="bg-muted rounded-control px-1 py-2 text-center"
              >
                <span class="jp block text-4xl leading-tight">{{ k.kanji }}</span>
                <span class="block text-xs">{{ m(k) }}</span>
              </li>
            </ul>
          </div>
        </template>
        <template #more="{ item }">
          <div v-if="running.kind === 'kan'">
            <template v-if="sameRadical(all[item]!).length">
              <p class="text-ink-soft mb-1 text-sm font-semibold">
                {{ u('familyLabel')(radicals[all[item]!.ri]!.radical) }}
              </p>
              <ul class="grid grid-cols-4 gap-2">
                <li
                  v-for="c in sameRadical(all[item]!)"
                  :key="c"
                  class="bg-muted rounded-control px-1 py-1.5 text-center"
                >
                  <span class="jp block text-3xl leading-tight">{{ c }}</span>
                  <span class="block truncate text-xs">{{ m(byChar.get(c)!) }}</span>
                </li>
              </ul>
            </template>
          </div>
        </template>
      </MasteryQuiz>
      <LeaveTestSheet :open="asking" @leave="leave" @stay="stay" />
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
                <p class="text-xl font-bold"><RevealText :text="m(r)" /></p>
                <p class="jp text-ink-soft">{{ r.name_jp }} · {{ r.name_romaji }}</p>
                <p v-if="r.variants.length" class="text-ink-soft text-sm">
                  {{ u('other') }} <span class="jp text-ink text-lg">{{ r.variants.join(' ') }}</span>
                </p>
                <p v-if="GUIDE[r.radical]" class="bg-muted rounded-cell mt-1 inline-block px-2 text-sm font-semibold">
                  {{ position(r.radical) }}
                </p>
              </div>
            </div>
            <dl v-if="guide(r.radical)" class="mt-4 grid gap-2 text-[15px]">
              <div>
                <dt class="font-bold">
                  <MapPin class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle" aria-hidden="true" />{{
                    u('where')
                  }}
                </dt>
                <dd>{{ guide(r.radical)!.where }}</dd>
              </div>
              <div>
                <dt class="font-bold">
                  <Image class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle" aria-hidden="true" />{{
                    u('origin')
                  }}
                </dt>
                <dd>{{ guide(r.radical)!.origin }}</dd>
              </div>
              <div>
                <dt class="font-bold">
                  <Puzzle class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle" aria-hidden="true" />{{
                    u('lends')
                  }}
                </dt>
                <dd>{{ guide(r.radical)!.lends }}</dd>
              </div>
              <div class="border-primary border-s-4 ps-3">
                <dt class="font-bold">
                  <Lightbulb
                    class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle"
                    aria-hidden="true"
                  />{{ u('hook') }}
                </dt>
                <dd>{{ guide(r.radical)!.hook }}</dd>
              </div>
              <div v-if="guide(r.radical)!.confuse" class="border-negative border-s-4 ps-3">
                <dt class="font-bold">
                  <TriangleAlert
                    class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle"
                    aria-hidden="true"
                  />{{ u('confuse') }}
                </dt>
                <dd>{{ guide(r.radical)!.confuse }}</dd>
              </div>
            </dl>
          </BaseCard>

          <BaseCard v-for="k in r.kanji" :key="k.kanji">
            <div class="flex items-start gap-4">
              <span class="jp w-16 shrink-0 text-center text-6xl leading-none">{{ k.kanji }}</span>
              <div class="min-w-0 flex-1">
                <p class="text-lg font-bold"><RevealText :text="m(k)" /></p>
                <p class="text-ink-soft text-sm">{{ u('radicalOf')(r.radical, m(r)) }}</p>
                <div class="mt-1.5 grid gap-1 text-[15px]">
                  <p v-if="k.on.length">
                    <b>音読み</b> <span class="jp text-lg">{{ k.on.join('・') }}</span>
                    <span class="text-ink-soft text-sm">{{ u('on') }}</span>
                  </p>
                  <p v-if="k.kun.length">
                    <b>訓読み</b> <span class="jp text-lg">{{ k.kun.join('・') }}</span>
                    <span class="text-ink-soft text-sm">{{ u('kun') }}</span>
                  </p>
                </div>
              </div>
            </div>
            <ul class="mt-3 grid gap-1.5">
              <li
                v-for="w in k.words"
                :key="w.word"
                class="bg-muted rounded-control flex flex-wrap items-center gap-x-3 gap-y-0.5 px-3 py-1.5"
              >
                <span class="jp min-w-24 text-xl leading-loose" lang="ja" v-html="rubyWord(w.word, w.reading)" />
                <span class="text-[15px]"><RevealText :text="m(w)" /></span>
                <span v-if="readingUsed(k, w)" class="jp text-primary ms-auto text-sm font-semibold">{{
                  readingUsed(k, w)
                }}</span>
              </li>
            </ul>
            <div v-if="sameSound(k).length || sameRadical({ ...k, ri }).length" class="mt-3 grid gap-1 text-sm">
              <p v-if="sameSound(k).length">
                <b
                  ><Volume2
                    class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle"
                    aria-hidden="true"
                  />{{ u('same') }}</b
                >
                <span class="jp text-lg">{{ sameSound(k).join(' ') }}</span>
                <span class="text-ink-soft">{{ u('sameNote') }}</span>
              </p>
              <p>
                <b
                  ><Eye class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle" aria-hidden="true" />{{
                    u('sameRad')
                  }}</b
                >
                <span class="jp text-lg">{{ sameRadical({ ...k, ri }).join(' ') }}</span>
              </p>
            </div>
          </BaseCard>

          <BaseButton block @click="openTest(radicalTest(ri).id)">{{ u('radTest')(r.radical) }}</BaseButton>
        </div>
      </template>
      <PagerNav v-model="reading" :count="radicals.length" />
    </template>

    <!-- Home: learn list and tests -->
    <template v-else>
      <section class="py-6 text-center">
        <p class="font-jp text-primary text-6xl leading-none" aria-hidden="true">部首</p>
        <p class="text-ink-soft mt-3">{{ u('lead')(radicals.length, all.length, wordCount) }}</p>
      </section>
      <SegmentedControl v-model="tab" :options="tabs" class="mb-4" />

      <template v-if="tab === 'learn'">
        <BaseInput
          v-model="query"
          :label="u('searchLabel')"
          type="search"
          label-hidden
          :placeholder="u('search')"
          class="mb-4"
        />
        <p v-if="!shown.length" class="text-ink-soft">{{ u('none') }}</p>
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
                <span class="block font-bold">{{ m(r) }}</span>
                <span class="jp text-ink-soft block text-sm">{{ r.name_jp }}</span>
                <span class="jp text-ink-soft block truncate text-lg tracking-[0.12em]">{{
                  r.kanji.map((k) => k.kanji).join('')
                }}</span>
              </span>
              <span class="text-ink-soft shrink-0" aria-hidden="true">→</span>
            </button>
          </li>
        </ul>
      </template>

      <template v-else>
        <p class="text-ink-soft mb-3 text-[15px]">{{ u('testsLead') }}</p>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <BaseCard v-for="x in tests" :key="x.id" class="min-w-0">
            <div class="flex items-start gap-3">
              <span
                class="jp rounded-control grid size-11 shrink-0 place-items-center text-xl font-bold"
                :class="x.kind === 'rad' ? 'bg-primary text-canvas' : 'bg-muted text-primary'"
                aria-hidden="true"
                >{{ x.kind === 'rad' ? '部' : '漢' }}</span
              >
              <div class="min-w-0 flex-1">
                <p class="font-bold">{{ title(x) }}</p>
                <p class="text-ink-soft text-sm">
                  {{ x.kind === 'rad' ? u('radN')(x.pool.length) : u('kanN')(x.pool.length) }}
                </p>
              </div>
              <span
                v-if="score(x) !== null"
                class="shrink-0 rounded-full px-2 py-0.5 text-sm font-bold"
                :style="{
                  color: tone(score(x)!),
                  background: `color-mix(in oklab, ${tone(score(x)!)} 14%, transparent)`,
                }"
                >{{ score(x) }}%</span
              >
            </div>
            <p class="jp text-ink-soft mt-2 truncate text-lg tracking-widest">{{ x.keys }}</p>
            <p class="text-ink-soft text-xs">{{ summary(x) || u('never') }}</p>
            <div v-if="openOf(x) !== null" class="bg-muted mt-2 h-1.5 overflow-hidden rounded-full">
              <span class="bg-primary block h-full rounded-full" :style="{ width: `${openOf(x)}%` }" />
            </div>
            <div class="mt-3 flex gap-2">
              <template v-if="openOf(x) !== null">
                <BaseButton size="sm" class="flex-1" @click="openTest(x.id)"
                  >{{ t.continueTest }} · {{ openOf(x) }}% →</BaseButton
                >
                <BaseButton
                  size="sm"
                  variant="ghost"
                  :aria-label="t.restartTest"
                  :title="t.restartTest"
                  @click="startOver(x)"
                  >↺</BaseButton
                >
              </template>
              <BaseButton v-else size="sm" class="flex-1" @click="openTest(x.id)">{{ t.start }} →</BaseButton>
              <BaseButton
                size="sm"
                :variant="historyOf === x.id ? 'secondary' : 'ghost'"
                :aria-expanded="historyOf === x.id"
                @click="historyOf = historyOf === x.id ? null : x.id"
              >
                <svg viewBox="0 0 20 20" class="size-4" fill="currentColor" aria-hidden="true">
                  <rect x="2" y="11" width="4" height="7" rx="1" />
                  <rect x="8" y="6" width="4" height="12" rx="1" />
                  <rect x="14" y="2" width="4" height="16" rx="1" />
                </svg>
                {{ u('stats') }}
              </BaseButton>
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
