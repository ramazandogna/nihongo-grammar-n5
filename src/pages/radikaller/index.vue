<script setup lang="ts">
import { requestSync } from '@/lib/sync'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { Eye, Image, Lightbulb, MapPin, Puzzle, TriangleAlert, Volume2 } from 'lucide-vue-next'
import { BaseButton, BaseCard, BaseInput, CircularProgress, SegmentedControl } from 'rei-kit'

import MasteryQuiz, { type Question } from '@/components/MasteryQuiz.vue'
import PagerNav from '@/components/PagerNav.vue'
import QuizHistory from '@/components/QuizHistory.vue'
import RevealText from '@/components/RevealText.vue'
import SiteLayout from '@/components/SiteLayout.vue'
import StudyHeader from '@/components/StudyHeader.vue'
import StampToggle from '@/components/StampToggle.vue'
import StudyPlan from '@/components/StudyPlan.vue'
import LeaveTestSheet from '@/components/LeaveTestSheet.vue'
import ScorePills from '@/components/radikaller/ScorePills.vue'
import OkumaPassage from '@/components/radikaller/OkumaPassage.vue'
import { indexOkuma, okumaQuestion } from '@/lib/okuma'
import { hasKanji, KIND_LABEL, readingOptions, spellingOptions, type Vocab } from '@/lib/jlpt'
import { usePage } from '@/lib/page'
import { accuracy, loadHistory, loadRun, runProgress, saveRun } from '@/lib/quiz-store'
import { rubyWord } from '@/lib/ruby'
import { toTop } from '@/lib/scroll'
import { useTestRoute } from '@/lib/test-route'
import { shuffle } from '@/lib/shuffle'
import { band, groupsOf, hash, tallyMisses, type Band } from '@/lib/radikal-sets'
import type { Miss } from '@/lib/quiz-store'
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
  /** Marked by the teacher as N3-relevant. */
  n3?: boolean
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
  learn: ['Radikal', 'Radicals'],
  tests: ['Test', 'Tests'],
  statsTab: ['İstatistik', 'Stats'],
  learned: ['öğrendim', 'learned'],
  kanjiDone: [(a: number, b: number) => `${a}/${b} kanji`, (a: number, b: number) => `${a}/${b} kanji`],
  studyLocked: ['Önce tüm kanjileri “öğrendim” olarak işaretle.', 'Mark every kanji as learned first.'],
  short: [(n: number) => `Kısa test ${n}`, (n: number) => `Short test ${n}`],
  long: [(n: number) => `Uzun test ${n}`, (n: number) => `Long test ${n}`],
  n3Test: ['N3 kitap kanjileri', 'N3 book kanji'],
  prepLead: [
    'Genel hazırlık: tüm radikallerden karışık kanji (N3 işaretliler öncelikli). Hepsini yeşile çevir!',
    'General review: mixed kanji from all radicals (N3-marked first). Turn them all green!',
  ],
  review: ['Tekrar etmen gereken radikaller', 'Radicals to review'],
  reviewNone: ['Şimdilik tekrar gereken radikal yok.', 'Nothing to review for now.'],
  untested: ['test yok', 'no test'],
  topKanji: ['En çok hata yaptığın 10 kanji', 'Your 10 most-missed kanji'],
  topRad: ['En çok hata yapılan radikaller', 'Most-missed radicals'],
  noMiss: ['Henüz hata kaydı yok — bir test çöz.', 'No mistakes recorded yet — take a test.'],
  progress: ['Genel ilerleme', 'Overall progress'],
  radStudied: [
    (a: number, b: number) => `${a}/${b} radikal çalışıldı`,
    (a: number, b: number) => `${a}/${b} radicals studied`,
  ],
  kanjiLearned: [
    (a: number, b: number) => `${a}/${b} kanji öğrenildi`,
    (a: number, b: number) => `${a}/${b} kanji learned`,
  ],
  bands: ['Radikal testleri', 'Radical tests'],
  bandNames: [
    { none: 'çözülmedi', fail: '<75', pass: '75+', good: '85+', strong: '90+' },
    { none: 'not taken', fail: '<75', pass: '75+', good: '85+', strong: '90+' },
  ],
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
  studied: ['çalıştım', 'studied'],
  groupTest: [(a: string) => `${a}. radikal testi`, (a: string) => `Radicals ${a} test`],
  groupSub: [(rs: string) => `${rs} radikallerinin tüm kanjileri`, (rs: string) => `All kanji of ${rs}`],
  genel: [(n: number) => `Genel hazırlık ${n}`, (n: number) => `General review ${n}`],
  genelLead: [
    'Genel hazırlık: tüm radikallerden karışık kanji (N3 işaretliler öncelikli).',
    'General review: mixed kanji from all radicals (N3-marked first).',
  ],
  allRads: ['Tüm radikaller', 'All radicals'],
  nextRad: ['Sonraki radikal →', 'Next radical →'],
  retry: ['Tekrar çöz', 'Take it again'],
  failed: ['kaldı', 'failed'],
  okuTest: [(r: string) => `読 ${r} okuma sınavı (JLPT tarzı)`, (r: string) => `読 ${r} reading exam (JLPT style)`],
  okuTitle: [(r: string) => `${r} okuma sınavı`, (r: string) => `${r} reading exam`],
  okuSub: [
    'Metni oku · 15 soru: 漢字読み, 表記, 文脈規定',
    'Read the passage · 15 questions: 漢字読み, 表記, 文脈規定',
  ],
  pillTest: ['Test', 'Test'],
  pillOku: ['Okuma', 'Reading'],
  okuPassed: [
    (a: number, b: number) => `Okuma sınavları: ${a}/${b} geçti`,
    (a: number, b: number) => `Reading exams: ${a}/${b} passed`,
  ],
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
type Tab = 'learn' | 'tests' | 'stats'
const tab = ref<Tab>('learn')
const tabs = computed(() => [
  { value: 'learn' as const, label: u('learn') },
  { value: 'tests' as const, label: u('tests') },
  { value: 'stats' as const, label: u('statsTab') },
])
const query = ref('')
const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? radicals.filter((r) => JSON.stringify(r).toLowerCase().includes(q)) : radicals
})
/** The radical open in learn mode (index into `radicals`), paged one at a time. */
const reading = ref<number | null>(null)

/* ── Tests ── */
interface TestDef {
  id: string
  n?: number
  /** For the per-radical test. */
  radical?: string
  /** For group tests: "1·2·3". */
  group?: string
  kind: 'rad' | 'kan' | 'oku'
  /** For the okuma exam: index of its radical. */
  ri?: number
  keys: string
  pool: number[]
}
/** Test items are keyed by the kanji itself, so saved runs survive data growing. */
const indexOf = new Map(all.map((k, i) => [k.kanji, i]))
const ix = (c: string) => indexOf.get(c) ?? 0
const prepSet = (prefix: string, ids: number[], n?: number): TestDef => ({
  id: n ? `${prefix}-${n}` : prefix,
  n,
  kind: 'kan',
  keys: ids.map((i) => all[i]!.kanji).join(''),
  pool: ids,
})
/**
 * General prep. Every kanji is in exactly one long test: all kanji in a
 * hash-stable shuffled order, cut into 13 even sets of ~30. Short tests are
 * the first 80 of another such order, in sets of 10. Plus every N3 kanji.
 */
const LONG = 13
const hashed = (seed: string) =>
  all.map((_, i) => i).sort((a, b) => hash(seed + all[a]!.kanji) - hash(seed + all[b]!.kanji))
const cut = (xs: number[], n: number) =>
  Array.from({ length: n }, (_, k) => xs.slice(Math.round((k * xs.length) / n), Math.round(((k + 1) * xs.length) / n)))
const prepTests: TestDef[] = [
  ...cut(hashed('kisa').slice(0, 80), 8).map((ids, i) => prepSet('kisa10', ids, i + 1)),
  ...cut(hashed('uzun'), LONG).map((ids, i) => prepSet('uzun30', ids, i + 1)),
  prepSet(
    'n3',
    all.map((k, i) => (k.n3 === true ? i : -1)).filter((i) => i >= 0),
  ),
].filter((x) => x.pool.length)
/** Learn-list groups of three radicals (indices), each with a test of all their kanji. */
const groups = groupsOf(radicals.map((_, i) => i))
function groupTest(g: number[]): TestDef {
  const first = radicals[g[0]!]!
  const last = radicals[g[g.length - 1]!]!
  const ids = all.map((k, i) => (g.includes(k.ri) ? i : -1)).filter((i) => i >= 0)
  return {
    id: `g-${first.id}-${last.id}`,
    kind: 'kan',
    keys: ids.map((i) => all[i]!.kanji).join(''),
    pool: ids,
    group: g.map((i) => i + 1).join('·'),
  }
}
const groupTests = groups.map(groupTest)
/** The group a radical closes (it is the last of its three), if any. */
const closesGroup = (ri: number) => {
  const g = groups.find((x) => x[x.length - 1] === ri)
  return g ? groupTest(g) : null
}
/** The per-radical test from learn mode: that radical's kanji. */
function radicalTest(ri: number): TestDef {
  const ids = all.map((k, i) => (k.ri === ri ? i : -1)).filter((i) => i >= 0)
  return { id: `r-${radicals[ri]!.id}`, radical: radicals[ri]!.radical, kind: 'kan', keys: '', pool: ids }
}

/** Reading exams, one file per radical; a radical without one has no exam. */
const okumaById = indexOkuma(import.meta.glob('./okuma/*.json', { eager: true }))
const okumaOf = (ri: number) => okumaById.get(radicals[ri]!.id) ?? null
/** The okuma exam of a radical: items are the question numbers. */
function okumaTest(ri: number): TestDef | null {
  const o = okumaOf(ri)
  if (!o) return null
  return {
    id: `o-${radicals[ri]!.id}`,
    radical: radicals[ri]!.radical,
    ri,
    kind: 'oku',
    keys: '',
    pool: o.questions.map((q) => q.n),
  }
}
const okumaTests = radicals.map((_, ri) => okumaTest(ri)).filter((x): x is TestDef => !!x)

const { testId, openTest, askClose, asking, leave, stay, leftOnPurpose, markFinished } = useTestRoute()
/** The open test, read from the URL so the back button closes it. */
const running = computed<TestDef | null>(() => {
  const id = testId.value
  if (!id) return null
  if (id.startsWith('r-')) {
    const ri = radicals.findIndex((r) => `r-${r.id}` === id)
    return ri >= 0 ? radicalTest(ri) : null
  }
  if (id.startsWith('o-')) return okumaTests.find((x) => x.id === id) ?? null
  return [...prepTests, ...groupTests].find((x) => x.id === id) ?? null
})
const title = (x: TestDef) =>
  x.kind === 'oku'
    ? u('okuTitle')(x.radical!)
    : x.radical
      ? u('kanjiOf')(x.radical)
      : x.group
        ? u('groupTest')(x.group)
        : x.id === 'n3'
          ? u('n3Test')
          : x.id.startsWith('kisa')
            ? u('short')(x.n!)
            : x.id.startsWith('uzun')
              ? u('long')(x.n!)
              : `Kanji ${x.n}`
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
const allTests = () => [...prepTests, ...groupTests, ...radicals.map((_, ri) => radicalTest(ri)), ...okumaTests]
function readStates() {
  const m = new Map<string, TestState>()
  for (const x of allTests()) {
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
/** Every miss across all radikaller test histories, with paths reduced to [radical char, kanji char]. */
const misses = ref<Miss[]>([])
const HIST_PREFIX = 'nihongo-history:'
function readMisses() {
  const out: Miss[] = []
  try {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(`${HIST_PREFIX}radikaller:`)) keys.push(k.slice(HIST_PREFIX.length))
    }
    for (const k of keys)
      for (const a of loadHistory(k))
        for (const x of a.misses)
          if (x.path && x.path.length >= 2) out.push({ ...x, path: [x.path[0]!.split(' ')[0]!, [...x.path[1]!][0]!] })
  } catch {
    // No storage: no stats.
  }
  misses.value = out
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
    requestSync()
  } catch {
    // No storage: nothing to remember.
  }
})
// Back on the list after a test: refresh scores and progress.
watch(running, (x) => {
  if (!x) readStates()
})
/** Score colour: <75 failed (red), ≥75 pass (yellow), ≥85 green, ≥90 filled green. */
const tone = (p: number) => {
  const b = band(p)
  return b === 'fail' ? 'var(--color-negative)' : b === 'pass' ? 'var(--color-warning)' : 'var(--color-positive)'
}
const badge = (p: number) =>
  band(p) === 'strong'
    ? { color: 'var(--color-canvas)', background: tone(p) }
    : { color: tone(p), background: `color-mix(in oklab, ${tone(p)} 14%, transparent)` }

/* ── "Studied" ticks per radical (by id), kept in this browser ── */
const STUDIED = 'nihongo-radikaller:studied'
const studied = ref(new Set<number>())
onMounted(() => {
  try {
    const raw = localStorage.getItem(STUDIED)
    if (raw) studied.value = new Set((JSON.parse(raw) as unknown[]).filter((x): x is number => typeof x === 'number'))
  } catch {
    // No storage or bad data: nothing ticked.
  }
})
/* ── "Learned" ticks per kanji, one key per kanji char ── */
const KANJI_KEY = (c: string) => `nihongo-radikaller:kanji:${c}`
const learned = ref(new Set<string>())
onMounted(() => {
  const s = new Set<string>()
  try {
    for (const k of all) if (localStorage.getItem(KANJI_KEY(k.kanji)) === '1') s.add(k.kanji)
  } catch {
    // No storage: nothing ticked.
  }
  learned.value = s
})
const justLearned = ref('')
let justTimer: ReturnType<typeof setTimeout> | undefined
/** Confetti dot `n` of 6 behind the learned seal. */
function sealDot(n: number) {
  const a = (n / 6) * Math.PI * 2
  const colors = ['var(--color-positive)', 'var(--color-warning)', 'var(--color-primary)']
  return {
    '--x': `${Math.cos(a) * 34}px`,
    '--y': `${Math.sin(a) * 34}px`,
    '--r': `${n * 60}deg`,
    background: colors[n % 3],
  }
}
function toCard(c: string) {
  document.getElementById(`kanji-${c}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' })
}
function toggleLearned(c: string) {
  const s = new Set(learned.value)
  const on = !s.has(c)
  if (on) s.add(c)
  else s.delete(c)
  learned.value = s
  if (on) {
    // Pop the card, seal and chip once — on the change, not on every mount.
    justLearned.value = c
    clearTimeout(justTimer)
    justTimer = setTimeout(() => (justLearned.value = ''), 400)
  }
  try {
    if (on) localStorage.setItem(KANJI_KEY(c), '1')
    else localStorage.removeItem(KANJI_KEY(c))
    requestSync()
  } catch {
    // No storage: the tick lasts for this visit.
  }
}
const learnedOf = (r: Radical) => r.kanji.filter((k) => learned.value.has(k.kanji)).length
const allLearned = (r: Radical) => learnedOf(r) === r.kanji.length
/** The radical tick opens only once all its kanji are learned (it can always be unticked). */
const canTick = (r: Radical) => studied.value.has(r.id) || allLearned(r)
function toggleStudied(id: number) {
  const r = radicals.find((x) => x.id === id)
  if (r && !canTick(r)) return
  const s = new Set(studied.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  studied.value = s
  try {
    localStorage.setItem(STUDIED, JSON.stringify([...s]))
    requestSync()
  } catch {
    // No storage: the tick lasts for this visit.
  }
}

/* ── Stats screen ── */
const toReview = computed(() =>
  radicals
    .map((r, ri) => ({ r, ri, p: radScore(ri), o: okuScore(ri) }))
    .filter(({ r, p, o }) => (p !== null ? p < 85 : studied.value.has(r.id)) || (o !== null && o < 85))
    .sort((a, b) => Math.min(a.p ?? -1, a.o ?? 101) - Math.min(b.p ?? -1, b.o ?? 101)),
)
const okuPassed = computed(() => okumaTests.filter((x) => (score(x) ?? 0) >= 75).length)
const topKanji = computed(() => tallyMisses(misses.value, 1, 10))
const topRads = computed(() => tallyMisses(misses.value, 0, 10))
const radByChar = new Map(radicals.map((r, ri) => [r.radical, ri]))
const learnedCount = computed(() => all.filter((k) => learned.value.has(k.kanji)).length)
type BandKey = Band | 'none'
const BAND_ORDER: BandKey[] = ['strong', 'good', 'pass', 'fail', 'none']
const bandColor: Record<BandKey, string> = {
  strong: 'var(--color-positive)',
  good: 'color-mix(in oklab, var(--color-positive) 55%, transparent)',
  pass: 'var(--color-warning)',
  fail: 'var(--color-negative)',
  none: 'var(--color-hair, #8884)',
}
const bandCounts = computed(() => {
  const c: Record<BandKey, number> = { strong: 0, good: 0, pass: 0, fail: 0, none: 0 }
  radicals.forEach((_, ri) => {
    const p = radScore(ri)
    c[p === null ? 'none' : band(p)]++
  })
  return c
})
const openRadical = (ri: number) => {
  reading.value = ri
}

const groupAfter = (ri: number) => (query.value.trim() ? null : closesGroup(ri))
const radScore = (ri: number) => score(radicalTest(ri))
const okuScore = (ri: number) => {
  const x = okumaTest(ri)
  return x ? score(x) : null
}
/** The okuma exam's button opens a fresh run once one is finished, else resumes. */
const openOku = (ri: number) => {
  const x = okumaTest(ri)!
  if (okuScore(ri) !== null && openOf(x) === null) startOver(x)
  else openTest(x.id)
}
/** After the radical test: done with the okuma exam too (or there is none). */
const okuDone = (ri: number) => !okumaOf(ri) || (okuScore(ri) ?? 0) >= 75
const nextRad = (ri: number) => {
  if (ri + 1 < radicals.length) reading.value = ri + 1
  else reading.value = null
}

const pick3 = (xs: string[], not: string) => shuffle([...new Set(xs)].filter((x) => x && x !== not)).slice(0, 3)

/** Attach per-option glosses (aligned with options) without depending on Question declaring them yet. */
const withGlosses = (q: Question, glosses: string[]): Question => Object.assign(q, { glosses })
const kanjiGloss = (k: Kanji) => `${k.kanji} · ${[...k.on, ...k.kun].join('・')} · ${m(k)}`
const words = all.flatMap((k) => k.words)
/** Words read `r`, as "word · meaning". */
const readGloss = (r: string) =>
  [...new Set(words.filter((w) => w.reading === r).map((w) => `${w.word} · ${m(w)}`))].slice(0, 2).join(' / ')
/** A spelled word or kanji: "reading · meaning" if known. */
const spellGloss = (s: string) => {
  const w = words.find((x) => x.word === s)
  if (w) return `${w.reading} · ${m(w)}`
  const k = byChar.get(s)
  if (k) return kanjiGloss(k)
  // A made-up spelling: gloss its kanji one by one.
  return [...s]
    .map((c) => byChar.get(c))
    .filter((k): k is NonNullable<typeof k> => !!k)
    .map((k) => `${k.kanji} ${m(k)}`)
    .join(' · ')
}
/** Kanji (or radicals) whose meaning is `mean`. */
const meanGloss = (mean: string) => {
  const k = all.find((x) => m(x) === mean)
  return k ? kanjiGloss(k) : ''
}

function build(i: number): Question {
  return glossed(rawBuild(i))
}

/* ── The okuma exam runs in the same MasteryQuiz; the passage above it follows
   the current question, read from the built question and the saved run. ── */
const okN = ref<number | null>(null)
const okAnswered = ref(false)
const okFinished = ref(false)
function okBuild(n: number): Question {
  const test = running.value!
  const q = okumaOf(test.ri!)!.questions.find((x) => x.n === n)!
  okN.value = n
  okAnswered.value = false
  okFinished.value = false
  const r = radicals[test.ri!]!
  return okumaQuestion(q, [`${r.radical} ${m(r)}`, `${q.word} ${q.meaning_tr}`], okumaOf(test.ri!)!.questions)
}
function okSync() {
  const x = running.value
  if (x?.kind !== 'oku') return
  void nextTick(() => {
    const run = loadRun<number>(storageKey(x))
    if (run && run.current !== null) {
      okN.value = run.current
      okAnswered.value = run.picked !== null
      okFinished.value = false
    } else if (!okFinished.value) okAnswered.value = okN.value !== null
  })
}
watch(
  running,
  (x) => {
    okN.value = null
    okAnswered.value = false
    okFinished.value = false
    if (x?.kind === 'oku') okSync()
  },
  { immediate: true },
)
function onFinish() {
  if (running.value?.kind === 'oku') okFinished.value = true
  markFinished()
}
const okWord = (n: number) => okumaOf(running.value!.ri!)?.questions.find((q) => q.n === n)
const okWordRuby = (n: number) => {
  const q = okWord(n)
  return q ? rubyWord(q.word, q.reading) : ''
}
const quizPool = computed(() => {
  const x = running.value!
  return x.kind === 'oku' ? x.pool : x.pool.map((i) => all[i]!.kanji)
})
const quizBuild = (k: string | number) =>
  running.value!.kind === 'oku' ? okBuild(k as number) : build(ix(k as string))
const quizLabel = (k: string | number) => {
  const x = running.value!
  if (x.kind !== 'oku') return itemLabel(ix(k as string))
  const q = okumaOf(x.ri!)!.questions.find((y) => y.n === k)
  return q ? `${k}. {${q.word}|${q.reading}} ${q.meaning_tr}` : String(k)
}
function glossed(q: Question): Question {
  const test = running.value!
  if (test.kind === 'rad') {
    const rg = (o: string) => {
      const r = radicals.find((x) => m(x) === o || `${x.radical}　${m(x)}` === o)
      return r ? `${r.radical} · ${r.name_jp} · ${m(r)}` : ''
    }
    return withGlosses(q, q.options.map(rg))
  }
  const kind = q.kind
  const g = q.options.map((o) =>
    kind === u('yomi') ? readGloss(o) : kind === u('hyouki') ? spellGloss(o) : meanGloss(o),
  )
  return withGlosses(q, g)
}
function rawBuild(i: number): Question {
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
      <StudyHeader :title="title(running)" :sub="running.kind === 'oku' ? u('okuSub') : u('runSub')" @back="askClose" />
      <OkumaPassage
        v-if="running.kind === 'oku'"
        :okuma="okumaOf(running.ri!)!"
        :current="okN"
        :answered="okAnswered"
        :finished="okFinished"
        :en="en"
      />
      <div class="contents" @click.capture="okSync" @keyup.capture="okSync">
        <MasteryQuiz
          :key="running.id"
          :pool="quizPool"
          :build="quizBuild"
          :storage-key="storageKey(running)"
          @finish="onFinish"
          :label="quizLabel"
        >
          <template #feedback="{ item }">
            <div v-if="running.kind === 'oku'" class="bg-muted rounded-card min-w-0 px-4 py-3">
              <span
                class="jp word-ruby text-[2.2rem] leading-[1.9] break-all"
                lang="ja"
                v-html="okWordRuby(item as number)"
              />
              <p class="text-lg">{{ okWord(item as number)?.meaning_tr }}</p>
            </div>
            <!-- The kanji large, its readings labelled, its words with furigana,
               and the other kanji of its radical. -->
            <div v-else-if="running.kind === 'kan'" class="grid gap-4">
              <div class="flex items-center gap-4">
                <span class="jp text-primary w-20 shrink-0 text-center text-7xl leading-none">{{
                  all[ix(item as string)]!.kanji
                }}</span>
                <dl class="grid min-w-0 gap-1.5">
                  <div v-if="all[ix(item as string)]!.on.length">
                    <dt class="text-ink-soft text-xs">{{ u('onLabel') }}</dt>
                    <dd class="jp text-xl">{{ all[ix(item as string)]!.on.join('・') }}</dd>
                  </div>
                  <div v-if="all[ix(item as string)]!.kun.length">
                    <dt class="text-ink-soft text-xs">{{ u('kunLabel') }}</dt>
                    <dd class="jp text-xl">{{ all[ix(item as string)]!.kun.join('・') }}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <p class="text-ink-soft mb-1 text-sm font-semibold">{{ u('wordsLabel') }}</p>
                <ul class="grid gap-1.5">
                  <li
                    v-for="w in all[ix(item as string)]!.words"
                    :key="w.word"
                    class="bg-muted rounded-control flex min-w-0 flex-wrap items-center gap-x-3 px-3 py-1.5"
                  >
                    <span
                      class="jp word-ruby text-2xl leading-[2.2] break-all min-[400px]:text-3xl"
                      lang="ja"
                      v-html="rubyWord(w.word, w.reading)"
                    />
                    <span class="text-base">{{ m(w) }}</span>
                    <span
                      v-if="readingUsed(all[ix(item as string)]!, w)"
                      class="jp text-primary ms-auto text-sm font-semibold"
                      >{{ readingUsed(all[ix(item as string)]!, w) }}</span
                    >
                  </li>
                </ul>
              </div>
            </div>
            <div v-else class="grid gap-2">
              <p class="text-ink-soft text-sm font-semibold">
                {{ u('familyLabel')(radicals[ix(item as string)]!.radical) }}
              </p>
              <ul class="grid grid-cols-3 gap-2">
                <li
                  v-for="k in radicals[ix(item as string)]!.kanji"
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
              <template v-if="sameRadical(all[ix(item as string)]!).length">
                <p class="text-ink-soft mb-1 text-sm font-semibold">
                  {{ u('familyLabel')(radicals[all[ix(item as string)]!.ri]!.radical) }}
                </p>
                <ul class="grid grid-cols-4 gap-2">
                  <li
                    v-for="c in sameRadical(all[ix(item as string)]!)"
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
      </div>
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
              <ScorePills
                class="ms-auto self-start"
                :test="radScore(ri)"
                :okuma="okuScore(ri)"
                :badge="badge"
                :test-label="u('pillTest')"
                :okuma-label="u('pillOku')"
              />
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

          <div class="flex items-center gap-3">
            <div class="flex min-w-0 flex-1 flex-wrap gap-1.5">
              <a
                v-for="k in r.kanji"
                :key="k.kanji"
                :href="`#kanji-${k.kanji}`"
                class="jp focus-ring grid size-11 place-items-center rounded-lg border text-lg"
                :class="[learned.has(k.kanji) ? 'chip-on' : 'chip-off', justLearned === k.kanji ? 'quiz-pop' : '']"
                :aria-label="`${k.kanji} · ${learned.has(k.kanji) ? u('learned') : '—'}`"
                @click.prevent="toCard(k.kanji)"
                >{{ k.kanji }}</a
              >
            </div>
            <CircularProgress
              size="sm"
              tone="positive"
              :value="learnedOf(r)"
              :max="r.kanji.length"
              :label="u('kanjiLearned')(learnedOf(r), r.kanji.length)"
              ><span class="text-xs font-bold tabular-nums"
                >{{ learnedOf(r) }}/{{ r.kanji.length }}</span
              ></CircularProgress
            >
          </div>

          <BaseCard
            v-for="k in r.kanji"
            :id="`kanji-${k.kanji}`"
            :key="k.kanji"
            class="kanji-card relative min-w-0 scroll-mt-4 overflow-hidden"
            :class="[learned.has(k.kanji) ? 'kanji-learned' : '', justLearned === k.kanji ? 'quiz-pop' : '']"
          >
            <span
              v-if="learned.has(k.kanji)"
              class="pointer-events-none absolute end-2 bottom-2 grid size-11 place-items-center"
              aria-hidden="true"
            >
              <template v-if="justLearned === k.kanji">
                <span v-for="n in 6" :key="n" class="quiz-confetti" :style="sealDot(n)" />
              </template>
              <span
                class="kanji-seal jp grid size-11 rotate-[-12deg] place-items-center rounded-full text-xl font-bold"
                :class="justLearned === k.kanji ? 'kanji-seal-in' : ''"
                >済</span
              >
            </span>
            <div class="flex items-start gap-3">
              <button
                type="button"
                class="jp focus-ring rounded-control w-16 shrink-0 text-center text-6xl leading-none"
                :class="learned.has(k.kanji) ? 'text-positive' : ''"
                :aria-pressed="learned.has(k.kanji)"
                :aria-label="`${k.kanji} · ${u('learned')}`"
                @click="toggleLearned(k.kanji)"
              >
                {{ k.kanji }}
              </button>
              <div class="min-w-0 flex-1">
                <div class="flex items-start gap-2">
                  <p class="min-w-0 flex-1 text-lg font-bold"><RevealText :text="m(k)" /></p>
                  <StampToggle
                    :checked="learned.has(k.kanji)"
                    :label="u('learned')"
                    size="sm"
                    @toggle="toggleLearned(k.kanji)"
                  />
                </div>
                <p class="text-ink-soft text-sm">{{ u('radicalOf')(r.radical, m(r)) }}</p>
                <!-- Readings: on (Chinese) first and loudest, kun quieter. -->
                <div class="mt-2 grid gap-1.5">
                  <p v-if="k.on.length" class="flex flex-wrap items-center gap-2">
                    <span class="bg-primary text-canvas rounded-control px-1.5 py-0.5 text-xs font-bold" title="音読み"
                      >音</span
                    >
                    <span class="jp text-primary text-3xl leading-tight font-bold">{{ k.on.join('・') }}</span>
                  </p>
                  <p v-if="k.kun.length" class="flex flex-wrap items-center gap-2">
                    <span class="bg-muted rounded-control px-1.5 py-0.5 text-xs font-bold" title="訓読み">訓</span>
                    <span class="jp text-ink-soft text-xl">{{ k.kun.join('・') }}</span>
                  </p>
                </div>
              </div>
            </div>
            <!-- The words matter most: big, furigana readable, meaning under. -->
            <ul class="mt-4 grid gap-2">
              <li v-for="w in k.words" :key="w.word" class="bg-muted rounded-card min-w-0 px-4 py-3">
                <div class="flex min-w-0 items-end justify-between gap-3">
                  <span
                    class="jp word-ruby text-[2.6rem] leading-[1.9] break-all min-[400px]:text-5xl"
                    lang="ja"
                    v-html="rubyWord(w.word, w.reading)"
                  />
                  <span v-if="readingUsed(k, w)" class="jp text-primary shrink-0 pb-2 text-base font-bold">{{
                    readingUsed(k, w)
                  }}</span>
                </div>
                <p class="text-lg"><RevealText :text="m(w)" /></p>
              </li>
            </ul>
            <div v-if="sameSound(k).length || sameRadical({ ...k, ri }).length" class="mt-3 grid gap-1 pe-12 text-sm">
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

          <div class="grid gap-2">
            <StampToggle
              class="justify-self-start"
              glyph="✓"
              :checked="studied.has(r.id)"
              :disabled="!canTick(r)"
              :label="u('studied')"
              :hint="u('kanjiDone')(learnedOf(r), r.kanji.length)"
              @toggle="toggleStudied(r.id)"
            />
            <p v-if="!canTick(r)" class="text-ink-soft text-sm">{{ u('studyLocked') }}</p>
            <div class="flex items-center gap-2">
              <BaseButton
                class="min-w-0 flex-1"
                :variant="radScore(ri) !== null && radScore(ri)! >= 75 ? 'secondary' : 'primary'"
                @click="
                  radScore(ri) !== null && openOf(radicalTest(ri)) === null
                    ? startOver(radicalTest(ri))
                    : openTest(radicalTest(ri).id)
                "
                >{{ radScore(ri) !== null && radScore(ri)! < 75 ? u('retry') : u('radTest')(r.radical) }}</BaseButton
              >
              <span
                v-if="radScore(ri) !== null"
                class="shrink-0 rounded-full px-2 py-0.5 text-sm font-bold"
                :style="badge(radScore(ri)!)"
                >{{ radScore(ri) }}%</span
              >
            </div>
            <div v-if="okumaOf(ri) && radScore(ri) !== null && radScore(ri)! >= 75" class="flex items-center gap-2">
              <BaseButton class="min-w-0 flex-1" :variant="okuDone(ri) ? 'secondary' : 'primary'" @click="openOku(ri)"
                >{{ okuScore(ri) !== null && okuScore(ri)! < 75 ? u('retry') : u('okuTest')(r.radical)
                }}<template v-if="openOf(okumaTest(ri)!) !== null">
                  · {{ openOf(okumaTest(ri)!) }}%</template
                ></BaseButton
              >
              <span
                v-if="okuScore(ri) !== null"
                class="shrink-0 rounded-full px-2 py-0.5 text-sm font-bold"
                :style="badge(okuScore(ri)!)"
                >{{ okuScore(ri) }}%</span
              >
            </div>
            <template v-if="radScore(ri) !== null && radScore(ri)! >= 75 && okuDone(ri)">
              <BaseButton v-if="closesGroup(ri)" block @click="openTest(closesGroup(ri)!.id)"
                >{{ u('groupTest')(closesGroup(ri)!.group!)
                }}<template v-if="score(closesGroup(ri)!) !== null">
                  · {{ score(closesGroup(ri)!) }}%</template
                ></BaseButton
              >
              <BaseButton v-if="ri + 1 < radicals.length" block variant="secondary" @click="nextRad(ri)">{{
                u('nextRad')
              }}</BaseButton>
            </template>
          </div>
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
        <StudyPlan :open="studied.size === 0" />
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
          <template v-for="r in shown" :key="r.id">
            <li class="flex min-w-0 items-stretch gap-2">
              <button
                type="button"
                class="surface focus-ring rounded-card flex w-full min-w-0 items-center gap-3 p-3 text-start"
                :class="allLearned(r) ? 'rad-done' : ''"
                @click="reading = radicals.indexOf(r)"
              >
                <CircularProgress
                  size="md"
                  tone="positive"
                  class="shrink-0"
                  :value="learnedOf(r)"
                  :max="r.kanji.length"
                  :label="u('kanjiLearned')(learnedOf(r), r.kanji.length)"
                  ><span class="jp text-primary text-2xl leading-none">{{ r.radical }}</span></CircularProgress
                >
                <span class="min-w-0 flex-1">
                  <span class="flex items-center gap-1.5 font-bold"
                    >{{ m(r)
                    }}<span
                      v-if="allLearned(r)"
                      class="jp text-positive rounded border border-current px-1 text-xs font-bold"
                      >済</span
                    ></span
                  >
                  <span class="jp text-ink-soft block text-sm">{{ r.name_jp }}</span>
                  <span class="mt-1 flex flex-wrap gap-1" aria-hidden="true">
                    <span
                      v-for="k in r.kanji"
                      :key="k.kanji"
                      class="jp inline-grid size-7 place-items-center rounded-md border text-base"
                      :class="learned.has(k.kanji) ? 'chip-on' : 'chip-off'"
                      >{{ k.kanji }}</span
                    >
                  </span>
                  <ScorePills
                    row
                    class="mt-1.5"
                    :test="radScore(radicals.indexOf(r))"
                    :okuma="okuScore(radicals.indexOf(r))"
                    :badge="badge"
                    :test-label="u('pillTest')"
                    :okuma-label="u('pillOku')"
                    :failed="u('failed')"
                  />
                </span>
                <span class="text-ink-soft shrink-0" aria-hidden="true">→</span>
              </button>
              <StampToggle
                class="surface rounded-card w-16"
                layout="stack"
                size="sm"
                glyph="✓"
                :checked="studied.has(r.id)"
                :disabled="!canTick(r)"
                :label="u('studied')"
                :hint="canTick(r) ? undefined : u('kanjiDone')(learnedOf(r), r.kanji.length)"
                :title="canTick(r) ? u('studied') : u('studyLocked')"
                @toggle="toggleStudied(r.id)"
              />
            </li>
            <li v-if="groupAfter(radicals.indexOf(r))" class="min-w-0">
              <BaseCard class="border-primary border-s-4">
                <div class="flex items-start gap-3">
                  <div class="min-w-0 flex-1">
                    <p class="font-bold">{{ title(groupAfter(radicals.indexOf(r))!) }}</p>
                    <p class="text-ink-soft text-sm">
                      {{ u('kanN')(groupAfter(radicals.indexOf(r))!.pool.length) }} ·
                      <span class="jp">{{
                        groups
                          .find((g) => g.includes(radicals.indexOf(r)))!
                          .map((i) => radicals[i]!.radical)
                          .join(' ')
                      }}</span>
                    </p>
                  </div>
                  <span
                    v-if="score(groupAfter(radicals.indexOf(r))!) !== null"
                    class="shrink-0 rounded-full px-2 py-0.5 text-sm font-bold"
                    :style="badge(score(groupAfter(radicals.indexOf(r))!)!)"
                    >{{ score(groupAfter(radicals.indexOf(r))!) }}%</span
                  >
                </div>
                <div
                  v-if="openOf(groupAfter(radicals.indexOf(r))!) !== null"
                  class="bg-muted mt-2 h-1.5 overflow-hidden rounded-full"
                >
                  <span
                    class="bg-primary block h-full rounded-full"
                    :style="{ width: `${openOf(groupAfter(radicals.indexOf(r))!)}%` }"
                  />
                </div>
                <BaseButton size="sm" block class="mt-3" @click="openTest(groupAfter(radicals.indexOf(r))!.id)">
                  <template v-if="openOf(groupAfter(radicals.indexOf(r))!) !== null"
                    >{{ t.continueTest }} · {{ openOf(groupAfter(radicals.indexOf(r))!) }}% →</template
                  >
                  <template v-else>{{ t.start }} →</template>
                </BaseButton>
              </BaseCard>
            </li>
          </template>
        </ul>
      </template>

      <template v-else-if="tab === 'tests'">
        <StudyPlan />
        <p class="text-ink-soft mb-3 text-[15px]">{{ u('prepLead') }}</p>
        <p class="text-ink-soft mb-3 text-[15px]">{{ u('testsLead') }}</p>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <BaseCard v-for="x in prepTests" :key="x.id" class="min-w-0">
            <div class="flex items-start gap-3">
              <span
                class="jp rounded-control grid size-11 shrink-0 place-items-center text-xl font-bold"
                :class="x.id === 'n3' ? 'bg-primary text-canvas' : 'bg-muted text-primary'"
                aria-hidden="true"
                >{{ x.id === 'n3' ? '本' : x.id.startsWith('uzun') ? '長' : '短' }}</span
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
                :style="badge(score(x)!)"
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
      <!-- Stats: what to review, where the mistakes are, how far along -->
      <div v-else class="grid min-w-0 gap-4">
        <BaseCard class="min-w-0">
          <h2 class="mb-3 text-lg font-bold">{{ u('progress') }}</h2>
          <p class="text-[15px]">{{ u('radStudied')(studied.size, radicals.length) }}</p>
          <div class="bg-muted mt-1 mb-3 h-2 overflow-hidden rounded-full">
            <span class="bg-primary block h-full" :style="{ width: `${(studied.size / radicals.length) * 100}%` }" />
          </div>
          <p class="text-[15px]">{{ u('kanjiLearned')(learnedCount, all.length) }}</p>
          <div class="bg-muted mt-1 mb-3 h-2 overflow-hidden rounded-full">
            <span class="bg-primary block h-full" :style="{ width: `${(learnedCount / all.length) * 100}%` }" />
          </div>
          <p v-if="okumaTests.length" class="mb-3 text-[15px]">
            <span class="jp text-primary me-1 font-bold" aria-hidden="true">読</span
            >{{ u('okuPassed')(okuPassed, radicals.length) }}
          </p>
          <p class="text-[15px]">{{ u('bands') }}</p>
          <div class="mt-1 flex h-4 overflow-hidden rounded-full">
            <span
              v-for="b in BAND_ORDER"
              v-show="bandCounts[b]"
              :key="b"
              class="block h-full"
              :style="{ width: `${(bandCounts[b] / radicals.length) * 100}%`, background: bandColor[b] }"
            />
          </div>
          <ul class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
            <li v-for="b in BAND_ORDER" :key="b" class="flex items-center gap-1">
              <span class="inline-block size-3 rounded-sm" :style="{ background: bandColor[b] }" />
              {{ u('bandNames')[b] }}: <b>{{ bandCounts[b] }}</b>
            </li>
          </ul>
        </BaseCard>

        <BaseCard class="min-w-0">
          <h2 class="mb-3 text-lg font-bold">{{ u('review') }}</h2>
          <p v-if="!toReview.length" class="text-ink-soft">{{ u('reviewNone') }}</p>
          <ul v-else class="grid gap-2">
            <li v-for="x in toReview" :key="x.r.id">
              <button
                type="button"
                class="bg-muted focus-ring rounded-control flex w-full min-w-0 items-center gap-3 px-3 py-2 text-start"
                @click="openRadical(x.ri)"
              >
                <span class="jp text-primary w-10 shrink-0 text-center text-3xl leading-none">{{ x.r.radical }}</span>
                <span class="min-w-0 flex-1 truncate font-semibold">{{ m(x.r) }}</span>
                <ScorePills
                  v-if="x.p !== null || x.o !== null"
                  :test="x.p"
                  :okuma="x.o"
                  :badge="badge"
                  :test-label="u('pillTest')"
                  :okuma-label="u('pillOku')"
                />
                <span v-else class="text-ink-soft shrink-0 text-sm">{{ u('untested') }}</span>
                <span class="text-ink-soft shrink-0" aria-hidden="true">→</span>
              </button>
            </li>
          </ul>
        </BaseCard>

        <BaseCard class="min-w-0">
          <h2 class="mb-3 text-lg font-bold">{{ u('topKanji') }}</h2>
          <p v-if="!topKanji.length" class="text-ink-soft">{{ u('noMiss') }}</p>
          <ul v-else class="grid gap-2">
            <li v-for="x in topKanji" :key="x.label" class="flex min-w-0 items-center gap-3">
              <span class="jp w-12 shrink-0 text-center text-4xl leading-none">{{ x.label }}</span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm">{{ byChar.get(x.label) ? m(byChar.get(x.label)!) : '' }}</p>
                <div class="flex items-center gap-2">
                  <span
                    class="block h-3 rounded-full"
                    :style="{ width: `${(x.n / topKanji[0]!.n) * 85}%`, background: 'var(--color-negative)' }"
                  />
                  <span class="shrink-0 text-sm font-bold">{{ x.n }}</span>
                </div>
              </div>
            </li>
          </ul>
        </BaseCard>

        <BaseCard class="min-w-0">
          <h2 class="mb-3 text-lg font-bold">{{ u('topRad') }}</h2>
          <p v-if="!topRads.length" class="text-ink-soft">{{ u('noMiss') }}</p>
          <ul v-else class="grid gap-2">
            <li v-for="x in topRads" :key="x.label">
              <button
                type="button"
                class="focus-ring flex w-full min-w-0 items-center gap-3 text-start"
                :disabled="radByChar.get(x.label) === undefined"
                @click="openRadical(radByChar.get(x.label)!)"
              >
                <span class="jp text-primary w-12 shrink-0 text-center text-3xl leading-none">{{ x.label }}</span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm">
                    {{ radByChar.get(x.label) !== undefined ? m(radicals[radByChar.get(x.label)!]!) : '' }}
                  </p>
                  <div class="flex items-center gap-2">
                    <span
                      class="block h-3 rounded-full"
                      :style="{ width: `${(x.n / topRads[0]!.n) * 85}%`, background: 'var(--color-warning)' }"
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
