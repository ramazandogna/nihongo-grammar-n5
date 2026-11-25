<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { BaseButton, BaseCard, CircularProgress, SegmentedControl } from 'rei-kit'

import MasteryQuiz, { type Question } from '@/components/MasteryQuiz.vue'
import PagerNav from '@/components/PagerNav.vue'
import QuizHistory from '@/components/QuizHistory.vue'
import SiteLayout from '@/components/SiteLayout.vue'
import StudyHeader from '@/components/StudyHeader.vue'
import StampToggle from '@/components/StampToggle.vue'
import LeaveTestSheet from '@/components/LeaveTestSheet.vue'
import KanjiLearnCard from '@/components/kanji/KanjiLearnCard.vue'
import Kb2Plan from '@/components/kanji/Kb2Plan.vue'
import { hasKanji, KIND_LABEL, readingOptions, spellingOptions, type Vocab } from '@/lib/jlpt'
import { similarKanji } from '@/lib/kanji-similar'
import { usePage } from '@/lib/page'
import { accuracy, loadHistory, loadRun, runProgress, saveRun, type Miss } from '@/lib/quiz-store'
import { band, hash, tallyMisses, type Band } from '@/lib/radikal-sets'
import { rubyWord } from '@/lib/ruby'
import { toTop } from '@/lib/scroll'
import { shuffle } from '@/lib/shuffle'
import { useTestRoute } from '@/lib/test-route'
import data from './data.json'

interface Word {
  w: string
  r: string
  m: string
}
interface Kanji {
  k: string
  on: string[]
  kun: string[]
  m: string
  w: Word[]
  unit: number
}

const { t } = usePage('/kanji-book-2/')

/** "ウ・ユウ" → ["ウ", "ユウ"]; "—" means none. */
const list = (s: string) => s.split('・').map((x) => x.trim()).filter((x) => x && x !== '—')
const units = data.map((u) => ({ title: u.title, tr: u.tr }))
/** Every kanji in one list; tests keep these indices as their items. */
const all: Kanji[] = data.flatMap((u, unit) =>
  u.kanji.map((k) => ({ k: k.k, on: list(k.on), kun: list(k.kun), m: k.m, w: k.w, unit })),
)
const wordCount = all.reduce((n, k) => n + k.w.length, 0)
const byChar = new Map(all.map((k) => [k.k, k]))
const idsOf = (unit: number) => all.map((k, i) => (k.unit === unit ? i : -1)).filter((i) => i >= 0)
const kanjiOf = (unit: number) => idsOf(unit).map((i) => all[i]!)

/** Units in fours: after every four comes a test across all of them. */
const blocks: number[][] = []
for (let i = 0; i < units.length; i += 4) blocks.push(units.slice(i, i + 4).map((_, j) => i + j))
const blockOf = (u: number) => blocks.findIndex((b) => b.includes(u))
const blockName = (b: number) => `Ünite ${blocks[b]![0]! + 1}–${blocks[b]![blocks[b]!.length - 1]! + 1}`
/** The block a unit closes (it is the last of its four), if any. */
const closesBlock = (u: number) => {
  const b = blockOf(u)
  return blocks[b]![blocks[b]!.length - 1] === u ? b : null
}

/* ── What the learn cards work out for each kanji ── */
const kata2hira = (s: string) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
const kunStem = (s: string) => s.replace(/[()（）.・-].*$/, '').replace(/[()（）]/g, '')
/** Which reading of the kanji a word uses: 音 if an on-reading appears in it, else 訓. */
function readingUsed(k: Kanji, w: Word): string {
  const on = k.on.find((o) => w.r.includes(kata2hira(o)))
  if (on) return `音 ${on}`
  const kun = k.kun.find((x) => kunStem(x) && w.r.includes(kunStem(x)))
  return kun ? `訓 ${kun}` : ''
}
const cardWords = (k: Kanji) => k.w.map((w) => ({ ...w, used: readingUsed(k, w) }))
/** Other kanji of this book read the same way — the JLPT spelling traps. */
const sameSound = (k: Kanji) => all.filter((x) => x.k !== k.k && x.on.some((o) => k.on.includes(o))).map((x) => x.k)
/** Look-alikes: the radical list's, plus this book's same-sounding kanji. */
const similar = (c: string) => {
  const k = byChar.get(c)
  return similarKanji(c, k ? sameSound(k) : [])
}

/* ── Views ── */
type Tab = 'learn' | 'tests' | 'stats'
const tab = ref<Tab>('learn')
const tabs = [
  { value: 'learn' as const, label: 'Ünite' },
  { value: 'tests' as const, label: 'Test' },
  { value: 'stats' as const, label: 'İstatistik' },
]
/** The unit open in learn mode, paged one at a time. */
const reading = ref<number | null>(null)

/* ── Tests ──
   Storage keys stay `kb2:u<n>` / `kb2:b<n>` with the same index pools,
   so runs saved by the earlier page keep going. */
interface TestDef {
  id: string
  kind: 'unit' | 'block' | 'mix'
  /** Unit, block or mixed-test number. */
  n: number
  pool: number[]
}
const unitTest = (u: number): TestDef => ({ id: `u${u}`, kind: 'unit', n: u, pool: idsOf(u) })
const blockTest = (b: number): TestDef => ({ id: `b${b}`, kind: 'block', n: b, pool: blocks[b]!.flatMap(idsOf) })
/** Long mixed tests: every kanji in exactly one, in a hash-stable order. */
const MIX = 7
const hashed = all.map((_, i) => i).sort((a, b) => hash(`kb2-mix${all[a]!.k}`) - hash(`kb2-mix${all[b]!.k}`))
const mixTests: TestDef[] = Array.from({ length: MIX }, (_, j) => ({
  id: `m${j + 1}`,
  kind: 'mix' as const,
  n: j + 1,
  pool: hashed.slice(Math.round((j * all.length) / MIX), Math.round(((j + 1) * all.length) / MIX)).sort((a, b) => a - b),
}))
const unitTests = units.map((_, u) => unitTest(u))
const blockTests = blocks.map((_, b) => blockTest(b))
const allTests = [...unitTests, ...blockTests, ...mixTests]
const storageKey = (x: TestDef) => `kb2:${x.id}`
const title = (x: TestDef) =>
  x.kind === 'unit'
    ? `${x.n + 1}. ünite testi`
    : x.kind === 'block'
      ? `${blockName(x.n)} blok testi`
      : `Karışık test ${x.n}`
const keysOf = (x: TestDef) => x.pool.map((i) => all[i]!.k).join('')

const { testId, openTest, askClose, asking, leave, stay, leftOnPurpose, markFinished } = useTestRoute()
/** The open test, read from the URL so the back button closes it. */
const running = computed<TestDef | null>(() => allTests.find((x) => x.id === testId.value) ?? null)
const historyOf = ref<string | null>(null)
watch([tab, running, reading], toTop)

/** Per test, read from storage: the last score and the unfinished run, if any. */
interface TestState {
  runs: number
  last: number | null
  open: number | null
  at: string
}
const states = ref(new Map<string, TestState>())
function readStates() {
  const m = new Map<string, TestState>()
  for (const x of allTests) {
    const h = loadHistory(storageKey(x))
    const run = loadRun<number>(storageKey(x))
    const live = run && run.current !== null ? run : null
    m.set(x.id, {
      runs: h.length,
      last: h.length ? accuracy(h[h.length - 1]!) : null,
      open: live ? runProgress(live) : null,
      at: live?.at ?? '',
    })
  }
  states.value = m
  readMisses()
}
/** Every miss across this book's test histories, reduced to [unit, kanji char]. */
const misses = ref<Miss[]>([])
const HIST_PREFIX = 'nihongo-history:'
function readMisses() {
  const out: Miss[] = []
  try {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(`${HIST_PREFIX}kb2:`)) keys.push(k.slice(HIST_PREFIX.length))
    }
    for (const k of keys)
      for (const a of loadHistory(k))
        for (const x of a.misses) {
          // New runs file the kanji in `path`; older ones named it first in the label.
          const c = [...(x.path?.[1] ?? x.label)][0]
          const kj = c ? byChar.get(c) : undefined
          if (kj) out.push({ ...x, path: [String(kj.unit), kj.k] })
        }
  } catch {
    // No storage: no stats.
  }
  misses.value = out
}
const score = (x: TestDef) => states.value.get(x.id)?.last ?? null
const openOf = (x: TestDef) => states.value.get(x.id)?.open ?? null
const summary = (x: TestDef) => {
  const st = states.value.get(x.id)
  return st?.runs ? `${st.runs} deneme · son %${st.last}` : ''
}
function startOver(x: TestDef) {
  saveRun(storageKey(x), null)
  openTest(x.id)
}
/** A finished test opens fresh; an unfinished one resumes. */
const openFresh = (x: TestDef) => (score(x) !== null && openOf(x) === null ? startOver(x) : openTest(x.id))
const unitScore = (u: number) => score(unitTests[u]!)

/** Score colour: <75 failed (red), ≥75 pass (yellow), ≥85 green, ≥90 filled green. */
const tone = (p: number) => {
  const b = band(p)
  return b === 'fail' ? 'var(--color-negative)' : b === 'pass' ? 'var(--color-warning)' : 'var(--color-positive)'
}
const badge = (p: number) =>
  band(p) === 'strong'
    ? { color: 'var(--color-canvas)', background: tone(p) }
    : { color: tone(p), background: `color-mix(in oklab, ${tone(p)} 14%, transparent)` }

/* ── Ticks kept in this browser, read after mount ── */
const STUDIED = 'nihongo-kb2:studied'
const KANJI_KEY = (c: string) => `nihongo-kb2:kanji:${c}`
const LAST_UNIT = 'nihongo-kb2:unit'
const studied = ref(new Set<number>())
const learned = ref(new Set<string>())
onMounted(() => {
  try {
    const raw = localStorage.getItem(STUDIED)
    if (raw) studied.value = new Set((JSON.parse(raw) as unknown[]).filter((x): x is number => typeof x === 'number'))
  } catch {
    // No storage or bad data: nothing ticked.
  }
  const s = new Set<string>()
  try {
    for (const k of all) if (localStorage.getItem(KANJI_KEY(k.k)) === '1') s.add(k.k)
  } catch {
    // No storage: nothing ticked.
  }
  learned.value = s
})

/* ── Pick up where the reader left off ── */
onMounted(() => {
  readStates()
  if (testId.value || leftOnPurpose()) return
  const open = allTests
    .map((x) => ({ x, st: states.value.get(x.id)! }))
    .filter(({ st }) => st.open !== null)
    .sort((a, b) => b.st.at.localeCompare(a.st.at))[0]
  if (open) {
    openTest(open.x.id)
    return
  }
  try {
    const saved = localStorage.getItem(LAST_UNIT)
    if (saved !== null && units[Number(saved)]) reading.value = Number(saved)
  } catch {
    // No storage: start on the list.
  }
})
watch(reading, (i) => {
  try {
    if (i === null) localStorage.removeItem(LAST_UNIT)
    else localStorage.setItem(LAST_UNIT, String(i))
  } catch {
    // No storage: nothing to remember.
  }
})
watch(running, (x) => {
  if (!x) readStates()
})

const justLearned = ref('')
let justTimer: ReturnType<typeof setTimeout> | undefined
function toggleLearned(c: string) {
  const s = new Set(learned.value)
  const on = !s.has(c)
  if (on) s.add(c)
  else s.delete(c)
  learned.value = s
  if (on) {
    justLearned.value = c
    clearTimeout(justTimer)
    justTimer = setTimeout(() => (justLearned.value = ''), 400)
  }
  try {
    if (on) localStorage.setItem(KANJI_KEY(c), '1')
    else localStorage.removeItem(KANJI_KEY(c))
  } catch {
    // No storage: the tick lasts for this visit.
  }
}
const learnedOf = (u: number) => kanjiOf(u).filter((k) => learned.value.has(k.k)).length
const allLearned = (u: number) => learnedOf(u) === idsOf(u).length
/** The unit tick opens only once all its kanji are learned (it can always be unticked). */
const canTick = (u: number) => studied.value.has(u) || allLearned(u)
function toggleStudied(u: number) {
  if (!canTick(u)) return
  const s = new Set(studied.value)
  if (s.has(u)) s.delete(u)
  else s.add(u)
  studied.value = s
  try {
    localStorage.setItem(STUDIED, JSON.stringify([...s]))
  } catch {
    // No storage: the tick lasts for this visit.
  }
}
function toCard(c: string) {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  document.getElementById(`kanji-${c}`)?.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
}

/* ── Stats ── */
const toReview = computed(() =>
  units
    .map((_, u) => ({ u, p: unitScore(u) }))
    .filter(({ u, p }) => (p !== null ? p < 85 : studied.value.has(u)))
    .sort((a, b) => (a.p ?? -1) - (b.p ?? -1)),
)
const topKanji = computed(() => tallyMisses(misses.value, 1, 10))
const learnedCount = computed(() => all.filter((k) => learned.value.has(k.k)).length)
type BandKey = Band | 'none'
const BAND_ORDER: BandKey[] = ['strong', 'good', 'pass', 'fail', 'none']
const BAND_NAME: Record<BandKey, string> = { none: 'çözülmedi', fail: '<75', pass: '75+', good: '85+', strong: '90+' }
const bandColor: Record<BandKey, string> = {
  strong: 'var(--color-positive)',
  good: 'color-mix(in oklab, var(--color-positive) 55%, transparent)',
  pass: 'var(--color-warning)',
  fail: 'var(--color-negative)',
  none: 'var(--color-hair, #8884)',
}
const bandCounts = computed(() => {
  const c: Record<BandKey, number> = { strong: 0, good: 0, pass: 0, fail: 0, none: 0 }
  units.forEach((_, u) => {
    const p = unitScore(u)
    c[p === null ? 'none' : band(p)]++
  })
  return c
})

/* ── Questions: JLPT style, each with a gloss on every option ── */
const vocab: Vocab[] = all.flatMap((k) => k.w.map((w) => ({ word: w.w, reading: w.r, meaning: w.m })))
const words = all.flatMap((k) => k.w)
const pick3 = (xs: string[], not: string) => shuffle([...new Set(xs)].filter((x) => x && x !== not)).slice(0, 3)
const kanjiGloss = (k: Kanji) => `${k.k} · ${[...k.on, ...k.kun].join('・')} · ${k.m}`
const readGloss = (r: string) =>
  [...new Set(words.filter((w) => w.r === r).map((w) => `${w.w} · ${w.m}`))].slice(0, 2).join(' / ')
const spellGloss = (s: string) => {
  const w = words.find((x) => x.w === s)
  if (w) return `${w.r} · ${w.m}`
  const k = byChar.get(s)
  if (k) return kanjiGloss(k)
  // A made-up spelling: gloss its kanji one by one.
  return [...s]
    .map((c) => byChar.get(c))
    .filter((k): k is Kanji => !!k)
    .map((k) => `${k.k} ${k.m}`)
    .join(' · ')
}
const meanGloss = (mean: string) => {
  const k = all.find((x) => x.m === mean)
  return k ? kanjiGloss(k) : ''
}
const K_MEAN = '意味 · bu kanjinin anlamı (benzer kanjiler arasından)'
function glossed(q: Question): Question {
  const g = q.options.map((o) =>
    q.kind === KIND_LABEL.yomi ? readGloss(o) : q.kind === KIND_LABEL.hyouki ? spellGloss(o) : meanGloss(o),
  )
  return { ...q, glosses: g }
}
function rawBuild(i: number): Question {
  const k = all[i]!
  const w = shuffle(k.w)[0]
  const path = [`${k.unit + 1}. ünite`, `${k.k} ${k.m}`]
  const stat = { label: w ? `{${w.w}|${w.r}} ${w.m}` : `${k.k} · anlam sorusu`, path }
  const explain = w
    ? `<b class="jp">${rubyWord(w.w, w.r)}</b> = ${w.m} · ${k.k}: ${readingUsed(k, w) || [...k.on, ...k.kun].join('・')}`
    : `${k.k} = ${k.m}`
  const roll = Math.random()
  if (w && roll < 0.45 && hasKanji(w.w)) {
    const options = readingOptions({ word: w.w, reading: w.r, meaning: w.m }, vocab)
    if (options.length === 4)
      return { kind: KIND_LABEL.yomi, prompt: `[${w.w}]`, size: 'jp', options, answer: 0, explain, stat }
  }
  if (w && roll < 0.8 && hasKanji(w.w)) {
    const options = spellingOptions({ word: w.w, reading: w.r, meaning: w.m }, similar)
    if (options.length === 4)
      return { kind: KIND_LABEL.hyouki, prompt: `[${w.r}]`, size: 'jp', options, answer: 0, explain, stat }
  }
  // Meaning, with look-alike and same-unit kanji as the wrong options.
  const near = shuffle(
    [...similar(k.k), ...kanjiOf(k.unit).map((x) => x.k)]
      .map((c) => byChar.get(c)?.m)
      .filter((x): x is string => !!x),
  )
  return {
    kind: K_MEAN,
    prompt: k.k,
    size: 'big',
    options: [k.m, ...pick3([...near, ...all.map((x) => x.m)], k.m)],
    answer: 0,
    explain,
    stat: { ...stat, label: `${k.k} · anlam sorusu` },
  }
}
const build = (i: number) => glossed(rawBuild(i))
const itemLabel = (i: number) => `${all[i]!.k} · ${all[i]!.m}`

/* ── After a test: what comes next ── */
const lastScore = ref<number | null>(null)
function onFinish() {
  markFinished()
  const x = running.value
  void nextTick(() => {
    if (!x) return
    const h = loadHistory(storageKey(x))
    lastScore.value = h.length ? accuracy(h[h.length - 1]!) : null
  })
}
watch(running, () => (lastScore.value = null))
/** Leave the finished test for a unit page. */
function goUnit(u: number | null) {
  reading.value = u
  askClose()
}
const nextUnit = (u: number) => (u + 1 < units.length ? u + 1 : null)
</script>

<template>
  <SiteLayout>
    <!-- A test running -->
    <template v-if="running">
      <StudyHeader
        :title="title(running)"
        sub="Her soru 2 kez doğru bilinene kadar · ilerleme kaydedilir"
        @back="askClose"
      />
      <MasteryQuiz
        :key="running.id"
        :pool="running.pool"
        :build="build"
        :storage-key="storageKey(running)"
        :label="itemLabel"
        @finish="onFinish"
      >
        <template #feedback="{ item }">
          <div class="grid gap-4">
            <div class="flex items-center gap-4">
              <span class="jp text-primary w-20 shrink-0 text-center text-7xl leading-none">{{ all[item]!.k }}</span>
              <dl class="grid min-w-0 gap-1.5">
                <div v-if="all[item]!.on.length">
                  <dt class="text-ink-soft text-xs">音読み · Çince kökenli okunuş</dt>
                  <dd class="jp text-primary text-2xl font-bold">{{ all[item]!.on.join('・') }}</dd>
                </div>
                <div v-if="all[item]!.kun.length">
                  <dt class="text-ink-soft text-xs">訓読み · Japonca okunuş</dt>
                  <dd class="jp text-xl">{{ all[item]!.kun.join('・') }}</dd>
                </div>
                <dd class="text-ink-soft text-sm">{{ all[item]!.m }}</dd>
              </dl>
            </div>
            <div>
              <p class="text-ink-soft mb-1 text-sm font-semibold">Kelimeler</p>
              <ul class="grid gap-1.5">
                <li
                  v-for="w in all[item]!.w"
                  :key="w.w"
                  class="bg-muted rounded-control flex min-w-0 flex-wrap items-center gap-x-3 px-3 py-1.5"
                >
                  <span
                    class="jp word-ruby text-2xl leading-[2.2] break-all min-[400px]:text-3xl"
                    lang="ja"
                    v-html="rubyWord(w.w, w.r)"
                  />
                  <span class="text-base">{{ w.m }}</span>
                  <span v-if="readingUsed(all[item]!, w)" class="jp text-primary ms-auto text-sm font-semibold">{{
                    readingUsed(all[item]!, w)
                  }}</span>
                </li>
              </ul>
            </div>
          </div>
        </template>
        <template #more="{ item }">
          <div v-if="sameSound(all[item]!).length">
            <p class="text-ink-soft mb-1 text-sm font-semibold">Aynı okunan kanjiler (表記 tuzağı)</p>
            <ul class="grid grid-cols-4 gap-2">
              <li v-for="c in sameSound(all[item]!)" :key="c" class="bg-muted rounded-control px-1 py-1.5 text-center">
                <span class="jp block text-3xl leading-tight">{{ c }}</span>
                <span class="block truncate text-xs">{{ byChar.get(c)!.m }}</span>
              </li>
            </ul>
          </div>
        </template>
        <template #actions>
          <template v-if="running.kind === 'unit'">
            <template v-if="lastScore !== null && lastScore >= 75">
              <BaseButton v-if="closesBlock(running.n) !== null" @click="openFresh(blockTests[closesBlock(running.n)!]!)"
                >総 {{ blockName(closesBlock(running.n)!) }} blok testi</BaseButton
              >
              <BaseButton
                v-if="nextUnit(running.n) !== null"
                :variant="closesBlock(running.n) !== null ? 'secondary' : 'primary'"
                @click="goUnit(nextUnit(running.n))"
                >Sonraki ünite →</BaseButton
              >
            </template>
            <BaseButton variant="ghost" @click="goUnit(running.n)">Üniteye dön</BaseButton>
          </template>
          <BaseButton
            v-else-if="running.kind === 'block' && lastScore !== null && lastScore >= 75 && running.n + 1 < blocks.length"
            @click="goUnit(blocks[running.n + 1]![0]!)"
            >Sonraki ünite →</BaseButton
          >
        </template>
      </MasteryQuiz>
      <LeaveTestSheet :open="asking" @leave="leave" @stay="stay" />
    </template>

    <!-- One unit: its kanji cards, then the test flow -->
    <template v-else-if="reading !== null">
      <StudyHeader :title="`${reading + 1}. ünite · ${units[reading]!.title}`" :sub="units[reading]!.tr" @back="reading = null" />
      <template v-for="(_, ui) in units" :key="ui">
        <div v-if="reading === ui" class="grid gap-4">
          <div class="flex items-center gap-3">
            <div class="flex min-w-0 flex-1 flex-wrap gap-1.5">
              <a
                v-for="k in kanjiOf(ui)"
                :key="k.k"
                :href="`#kanji-${k.k}`"
                class="jp focus-ring grid size-11 place-items-center rounded-lg border text-lg"
                :class="[learned.has(k.k) ? 'chip-on' : 'chip-off', justLearned === k.k ? 'quiz-pop' : '']"
                :aria-label="`${k.k} · ${learned.has(k.k) ? 'öğrendim' : '—'}`"
                @click.prevent="toCard(k.k)"
                >{{ k.k }}</a
              >
            </div>
            <CircularProgress
              size="sm"
              tone="positive"
              :value="learnedOf(ui)"
              :max="idsOf(ui).length"
              :label="`${learnedOf(ui)}/${idsOf(ui).length} kanji öğrenildi`"
              ><span class="text-xs font-bold tabular-nums">{{ learnedOf(ui) }}/{{ idsOf(ui).length }}</span></CircularProgress
            >
          </div>

          <KanjiLearnCard
            v-for="(k, n) in kanjiOf(ui)"
            :id="`kanji-${k.k}`"
            :key="k.k"
            :num="`${ui + 1}.${n + 1}`"
            :kanji="k.k"
            :on="k.on"
            :kun="k.kun"
            :meaning="k.m"
            :words="cardWords(k)"
            :learned="learned.has(k.k)"
            :just="justLearned === k.k"
            @toggle="toggleLearned(k.k)"
          />

          <div class="grid gap-2">
            <StampToggle
              class="justify-self-start"
              glyph="✓"
              :checked="studied.has(ui)"
              :disabled="!canTick(ui)"
              label="çalıştım"
              :hint="`${learnedOf(ui)}/${idsOf(ui).length} kanji`"
              @toggle="toggleStudied(ui)"
            />
            <p v-if="!canTick(ui)" class="text-ink-soft text-sm">Önce tüm kanjileri “öğrendim” olarak işaretle.</p>
            <div class="flex items-center gap-2">
              <BaseButton
                class="min-w-0 flex-1"
                :variant="unitScore(ui) !== null && unitScore(ui)! >= 75 ? 'secondary' : 'primary'"
                @click="openFresh(unitTests[ui]!)"
                >{{ unitScore(ui) !== null && unitScore(ui)! < 75 ? 'Tekrar çöz' : '試 Ünite testi (JLPT tarzı)'
                }}<template v-if="openOf(unitTests[ui]!) !== null"> · {{ openOf(unitTests[ui]!) }}%</template></BaseButton
              >
              <span
                v-if="unitScore(ui) !== null"
                class="shrink-0 rounded-full px-2 py-0.5 text-sm font-bold tabular-nums"
                :style="badge(unitScore(ui)!)"
                >%{{ unitScore(ui) }}</span
              >
            </div>
            <template v-if="unitScore(ui) !== null && unitScore(ui)! >= 75">
              <div v-if="closesBlock(ui) !== null" class="flex items-center gap-2">
                <BaseButton class="min-w-0 flex-1" @click="openFresh(blockTests[closesBlock(ui)!]!)"
                  >総 {{ blockName(closesBlock(ui)!) }} blok testi<template
                    v-if="openOf(blockTests[closesBlock(ui)!]!) !== null"
                  >
                    · {{ openOf(blockTests[closesBlock(ui)!]!) }}%</template
                  ></BaseButton
                >
                <span
                  v-if="score(blockTests[closesBlock(ui)!]!) !== null"
                  class="shrink-0 rounded-full px-2 py-0.5 text-sm font-bold tabular-nums"
                  :style="badge(score(blockTests[closesBlock(ui)!]!)!)"
                  >%{{ score(blockTests[closesBlock(ui)!]!) }}</span
                >
              </div>
              <BaseButton v-if="ui + 1 < units.length" block variant="secondary" @click="reading = ui + 1"
                >Sonraki ünite →</BaseButton
              >
            </template>
          </div>
        </div>
      </template>
      <PagerNav v-model="reading" :count="units.length" label="Üniteler" />
    </template>

    <!-- Home: units, tests, stats -->
    <template v-else>
      <section class="py-6 text-center">
        <p class="font-jp text-primary text-6xl leading-none" aria-hidden="true">漢字 2</p>
        <p class="text-ink-soft mt-3">{{ units.length }} ünite · {{ all.length }} kanji · {{ wordCount }} kelime</p>
      </section>
      <SegmentedControl v-model="tab" :options="tabs" class="mb-4" />

      <template v-if="tab === 'learn'">
        <Kb2Plan :open="studied.size === 0" />
        <ul class="grid grid-cols-[minmax(0,1fr)] gap-2">
          <template v-for="(un, ui) in units" :key="ui">
            <li class="flex min-w-0 items-stretch gap-2">
              <button
                type="button"
                class="surface focus-ring rounded-card flex w-full min-w-0 items-center gap-3 p-3 text-start"
                :class="allLearned(ui) ? 'rad-done' : ''"
                @click="reading = ui"
              >
                <CircularProgress
                  size="md"
                  tone="positive"
                  class="shrink-0"
                  :value="learnedOf(ui)"
                  :max="idsOf(ui).length"
                  :label="`${learnedOf(ui)}/${idsOf(ui).length} kanji öğrenildi`"
                  ><span class="text-primary text-lg leading-none font-bold tabular-nums">{{ ui + 1 }}</span></CircularProgress
                >
                <span class="min-w-0 flex-1">
                  <span class="flex items-center gap-1.5 font-bold"
                    ><span class="jp min-w-0 truncate">{{ un.title }}</span
                    ><span v-if="allLearned(ui)" class="jp text-positive shrink-0 rounded border border-current px-1 text-xs font-bold"
                      >済</span
                    ></span
                  >
                  <span class="text-ink-soft block truncate text-sm">{{ un.tr }}</span>
                  <span class="mt-1 flex flex-wrap gap-1" aria-hidden="true">
                    <span
                      v-for="k in kanjiOf(ui)"
                      :key="k.k"
                      class="jp inline-grid size-7 place-items-center rounded-md border text-base"
                      :class="learned.has(k.k) ? 'chip-on' : 'chip-off'"
                      >{{ k.k }}</span
                    >
                  </span>
                  <span
                    v-if="unitScore(ui) !== null"
                    class="mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-bold whitespace-nowrap tabular-nums"
                    :style="badge(unitScore(ui)!)"
                    >Test %{{ unitScore(ui) }}<template v-if="unitScore(ui)! < 75"> · kaldı</template></span
                  >
                </span>
                <span class="text-ink-soft shrink-0" aria-hidden="true">→</span>
              </button>
              <StampToggle
                class="surface rounded-card w-16"
                layout="stack"
                size="sm"
                glyph="✓"
                :checked="studied.has(ui)"
                :disabled="!canTick(ui)"
                label="çalıştım"
                :hint="canTick(ui) ? undefined : `${learnedOf(ui)}/${idsOf(ui).length} kanji`"
                :title="canTick(ui) ? 'çalıştım' : 'Önce tüm kanjileri “öğrendim” olarak işaretle.'"
                @toggle="toggleStudied(ui)"
              />
            </li>
            <li v-if="closesBlock(ui) !== null" class="min-w-0">
              <BaseCard class="border-primary border-s-4">
                <div class="flex items-start gap-3">
                  <div class="min-w-0 flex-1">
                    <p class="font-bold">{{ title(blockTests[closesBlock(ui)!]!) }}</p>
                    <p class="text-ink-soft text-sm">{{ blockTests[closesBlock(ui)!]!.pool.length }} kanji</p>
                  </div>
                  <span
                    v-if="score(blockTests[closesBlock(ui)!]!) !== null"
                    class="shrink-0 rounded-full px-2 py-0.5 text-sm font-bold tabular-nums"
                    :style="badge(score(blockTests[closesBlock(ui)!]!)!)"
                    >%{{ score(blockTests[closesBlock(ui)!]!) }}</span
                  >
                </div>
                <div v-if="openOf(blockTests[closesBlock(ui)!]!) !== null" class="bg-muted mt-2 h-1.5 overflow-hidden rounded-full">
                  <span class="bg-primary block h-full rounded-full" :style="{ width: `${openOf(blockTests[closesBlock(ui)!]!)}%` }" />
                </div>
                <BaseButton size="sm" block class="mt-3" @click="openTest(blockTests[closesBlock(ui)!]!.id)">
                  <template v-if="openOf(blockTests[closesBlock(ui)!]!) !== null"
                    >{{ t.continueTest }} · {{ openOf(blockTests[closesBlock(ui)!]!) }}% →</template
                  >
                  <template v-else>{{ t.start }} →</template>
                </BaseButton>
              </BaseCard>
            </li>
          </template>
        </ul>
      </template>

      <template v-else-if="tab === 'tests'">
        <Kb2Plan />
        <p class="text-ink-soft mb-3 text-[15px]">
          Sorular JLPT tarzında: 漢字読み (okunuş, ゛・uzun ses・っ tuzaklarıyla), 表記 (benzer veya aynı okunan kanjiler
          arasından doğru yazılış) ve anlam. Blok testleri 4 ünitenin, karışık testler ise hepsi birlikte bütün kanjilerin
          testidir. Testten çıksan da kaldığın yerden devam eder.
        </p>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <BaseCard v-for="x in [...blockTests, ...mixTests]" :key="x.id" class="min-w-0">
            <div class="flex items-start gap-3">
              <span
                class="jp rounded-control grid size-11 shrink-0 place-items-center text-xl font-bold"
                :class="x.kind === 'block' ? 'bg-primary text-canvas' : 'bg-muted text-primary'"
                aria-hidden="true"
                >{{ x.kind === 'block' ? '総' : '混' }}</span
              >
              <div class="min-w-0 flex-1">
                <p class="font-bold">{{ title(x) }}</p>
                <p class="text-ink-soft text-sm">{{ x.pool.length }} kanji</p>
              </div>
              <span
                v-if="score(x) !== null"
                class="shrink-0 rounded-full px-2 py-0.5 text-sm font-bold tabular-nums"
                :style="badge(score(x)!)"
                >%{{ score(x) }}</span
              >
            </div>
            <p class="jp text-ink-soft mt-2 truncate text-lg tracking-widest">{{ keysOf(x) }}</p>
            <p class="text-ink-soft text-xs">{{ summary(x) || 'Henüz çözülmedi' }}</p>
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
                İstatistik
              </BaseButton>
            </div>
            <div v-if="historyOf === x.id" class="border-hair mt-3 border-t pt-3">
              <QuizHistory :storage-key="storageKey(x)" />
            </div>
          </BaseCard>
        </div>
      </template>

      <!-- Stats: how far along, what to review, where the mistakes are -->
      <div v-else class="grid min-w-0 gap-4">
        <BaseCard class="min-w-0">
          <h2 class="mb-3 text-lg font-bold">Genel ilerleme</h2>
          <p class="text-[15px]">{{ studied.size }}/{{ units.length }} ünite çalışıldı</p>
          <div class="bg-muted mt-1 mb-3 h-2 overflow-hidden rounded-full">
            <span class="bg-primary block h-full" :style="{ width: `${(studied.size / units.length) * 100}%` }" />
          </div>
          <p class="text-[15px]">{{ learnedCount }}/{{ all.length }} kanji öğrenildi</p>
          <div class="bg-muted mt-1 mb-3 h-2 overflow-hidden rounded-full">
            <span class="bg-primary block h-full" :style="{ width: `${(learnedCount / all.length) * 100}%` }" />
          </div>
          <p class="text-[15px]">Ünite testleri</p>
          <div class="mt-1 flex h-4 overflow-hidden rounded-full">
            <span
              v-for="b in BAND_ORDER"
              v-show="bandCounts[b]"
              :key="b"
              class="block h-full"
              :style="{ width: `${(bandCounts[b] / units.length) * 100}%`, background: bandColor[b] }"
            />
          </div>
          <ul class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
            <li v-for="b in BAND_ORDER" :key="b" class="flex items-center gap-1">
              <span class="inline-block size-3 rounded-sm" :style="{ background: bandColor[b] }" />
              {{ BAND_NAME[b] }}: <b>{{ bandCounts[b] }}</b>
            </li>
          </ul>
        </BaseCard>

        <BaseCard class="min-w-0">
          <h2 class="mb-3 text-lg font-bold">Tekrar etmen gereken üniteler</h2>
          <p v-if="!toReview.length" class="text-ink-soft">Şimdilik tekrar gereken ünite yok.</p>
          <ul v-else class="grid gap-2">
            <li v-for="x in toReview" :key="x.u">
              <button
                type="button"
                class="bg-muted focus-ring rounded-control flex w-full min-w-0 items-center gap-3 px-3 py-2 text-start"
                @click="reading = x.u"
              >
                <span class="text-primary w-8 shrink-0 text-center text-xl font-bold tabular-nums">{{ x.u + 1 }}</span>
                <span class="jp min-w-0 flex-1 truncate font-semibold">{{ units[x.u]!.title }}</span>
                <span
                  v-if="x.p !== null"
                  class="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums"
                  :style="badge(x.p)"
                  >%{{ x.p }}</span
                >
                <span v-else class="text-ink-soft shrink-0 text-sm">test yok</span>
                <span class="text-ink-soft shrink-0" aria-hidden="true">→</span>
              </button>
            </li>
          </ul>
        </BaseCard>

        <BaseCard class="min-w-0">
          <h2 class="mb-3 text-lg font-bold">En çok hata yaptığın 10 kanji</h2>
          <p v-if="!topKanji.length" class="text-ink-soft">Henüz hata kaydı yok — bir test çöz.</p>
          <ul v-else class="grid gap-2">
            <li v-for="x in topKanji" :key="x.label">
              <button
                type="button"
                class="focus-ring flex w-full min-w-0 items-center gap-3 text-start"
                @click="reading = byChar.get(x.label)!.unit"
              >
                <span class="jp w-12 shrink-0 text-center text-4xl leading-none">{{ x.label }}</span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm">
                    <span class="jp text-primary font-bold">{{ byChar.get(x.label)!.on.join('・') }}</span>
                    · {{ byChar.get(x.label)!.m }} · {{ byChar.get(x.label)!.unit + 1 }}. ünite
                  </p>
                  <div class="flex items-center gap-2">
                    <span
                      class="block h-3 rounded-full"
                      :style="{ width: `${(x.n / topKanji[0]!.n) * 85}%`, background: 'var(--color-negative)' }"
                    />
                    <span class="shrink-0 text-sm font-bold">{{ x.n }}</span>
                  </div>
                </div>
              </button>
            </li>
          </ul>
        </BaseCard>
      </div>
    </template>
  </SiteLayout>
</template>

<style scoped>
.word-ruby :deep(rt) {
  font-size: 0.5em;
}
</style>
