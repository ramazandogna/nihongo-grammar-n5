import { ref } from 'vue'

/**
 * Where a test lives between visits, and what it remembers after it ends.
 *
 * A run in progress is saved after every answer, so leaving the page — a
 * stray tap on a link, a phone that locks — loses nothing: the next visit
 * opens on the same question. A finished run is appended to the test's
 * history: how many answers, how many wrong, and which items were missed.
 *
 * Browser storage only, per device, and every access is guarded: a private
 * window or blocked storage just means the test starts fresh.
 */
export interface SavedRun<K> {
  /** The pool this run was made for, so a changed test does not resume a stale run. */
  pool: K[]
  queue: K[]
  counts: [K, number][]
  current: K | null
  question: unknown
  order: number[]
  picked: number | null
  tries: number
  wrong: number
  /** Mistakes so far, keyed by their stat label. */
  misses: [string, unknown][]
  /** Questions answered wrong, kept so they come back exactly the same. */
  retry?: [K, unknown][]
  /** Right answers in a row now, and the best so far. */
  streak?: number
  best?: number
  /** When it was last saved, ISO — to find the most recent unfinished test. */
  at?: string
}

/**
 * One missed question. `path` files it under its groups, outermost first —
 * a word under its kanji under its radical. (`group` is the older one-level
 * form, still read from saved history.)
 */
export interface Miss {
  label: string
  n: number
  path?: string[]
  group?: string
}

/** A node of the mistakes tree: a group with its total, or a single miss. */
export interface MissNode {
  label: string
  n: number
  children: MissNode[]
}

export interface Attempt {
  /** When it finished, ISO. */
  at: string
  tries: number
  wrong: number
  /** Items missed in this run, with how many times. */
  misses: Miss[]
}

const RUN = (key: string) => `nihongo-run:${key}`
const HISTORY = (key: string) => `nihongo-history:${key}`

function read<T>(k: string): T | null {
  try {
    const v = localStorage.getItem(k)
    return v ? (JSON.parse(v) as T) : null
  } catch {
    return null
  }
}
/** Set once a write fails (quota, private mode), so the layout can say progress is not being kept. */
export const storageError = ref(false)
function write(k: string, v: unknown) {
  try {
    if (v === null) localStorage.removeItem(k)
    else localStorage.setItem(k, JSON.stringify(v))
  } catch {
    // Storage blocked or full: this run is not kept — say so once.
    storageError.value = true
  }
}

const isArr = Array.isArray
const isInt = (n: unknown) => typeof n === 'number' && Number.isInteger(n) && n >= 0
const isKey = (k: unknown) => typeof k === 'string' || typeof k === 'number'
/**
 * Stored question text is rendered as markup, so it may only hold the tags
 * the content itself uses — no attributes beyond class, no handlers.
 */
const SAFE_TAG =
  /^<\/?(ruby|rt|rp|b|i|u|s|mark|br|span|small|strong|em|code|sub|sup|p|div)(\s+class="[\w\s:/\[\]-]*")?\s*\/?>$/i
export const safeMarkup = (s: string) => (s.match(/<[^>]*>?/g) ?? []).every((t) => SAFE_TAG.test(t))
const safeText = (x: unknown) => typeof x !== 'string' || safeMarkup(x)
const isQuestion = (q: unknown): boolean => {
  if (!q || typeof q !== 'object') return false
  const o = q as Record<string, unknown>
  return (
    typeof o.prompt === 'string' &&
    isArr(o.options) &&
    o.options.length > 0 &&
    o.options.every((x) => typeof x === 'string') &&
    isInt(o.answer) &&
    (o.answer as number) < o.options.length &&
    [o.prompt, o.kind, o.explain, ...o.options].every(safeText) &&
    (o.stat === undefined || safeText((o.stat as { label?: unknown })?.label))
  )
}
const isMiss = (m: unknown): boolean =>
  !!m && typeof m === 'object' && typeof (m as Miss).label === 'string' && isInt((m as Miss).n)

/**
 * Whether a stored value has the shape of a saved run. Anything else — a
 * hand-edited key, an older format, a half-written value — is ignored rather
 * than crashing the page on every visit.
 */
export function isSavedRun(v: unknown): v is SavedRun<string | number> {
  if (!v || typeof v !== 'object') return false
  const r = v as Record<string, unknown>
  if (!isArr(r.pool) || !r.pool.every(isKey)) return false
  if (!isArr(r.queue) || !r.queue.every(isKey)) return false
  if (!isArr(r.counts) || !r.counts.every((c) => isArr(c) && c.length === 2 && isKey(c[0]) && isInt(c[1]))) return false
  if (r.current !== null && !isKey(r.current)) return false
  if (r.current !== null && !isQuestion(r.question)) return false
  if (!isArr(r.order) || !r.order.every(isInt)) return false
  if (r.picked !== null && !isInt(r.picked)) return false
  if (!isInt(r.tries) || !isInt(r.wrong)) return false
  if (!isArr(r.misses) || !r.misses.every((m) => isArr(m) && typeof m[0] === 'string' && isMiss(m[1]))) return false
  if (
    r.retry !== undefined &&
    (!isArr(r.retry) ||
      !r.retry.every(
        (x) =>
          isArr(x) &&
          isKey(x[0]) &&
          !!x[1] &&
          isQuestion((x[1] as { q: unknown }).q) &&
          isInt((x[1] as { wrong: unknown }).wrong),
      ))
  )
    return false
  if (r.streak !== undefined && !isInt(r.streak)) return false
  if (r.best !== undefined && !isInt(r.best)) return false
  if (r.question && isQuestion(r.question)) {
    const n = (r.question as { options: unknown[] }).options.length
    if (r.order.length !== n) return false
  }
  return true
}
export const isAttempt = (a: unknown): a is Attempt =>
  !!a &&
  typeof a === 'object' &&
  typeof (a as Attempt).at === 'string' &&
  isInt((a as Attempt).tries) &&
  isInt((a as Attempt).wrong) &&
  isArr((a as Attempt).misses) &&
  (a as Attempt).misses.every(isMiss)

export function loadRun<K>(key: string): SavedRun<K> | null {
  const v = read<unknown>(RUN(key))
  return isSavedRun(v) ? (v as SavedRun<K>) : null
}
/** How far a saved run is, 0–100: right answers given of the two per item owed. */
export function runProgress(run: SavedRun<unknown>): number {
  const owed = run.counts.reduce((s, [, c]) => s + Math.max(0, 2 - c), 0)
  return Math.round(((run.pool.length * 2 - owed) / (run.pool.length * 2 || 1)) * 100)
}
export const saveRun = <K>(key: string, run: SavedRun<K> | null) => write(RUN(key), run)

export function loadHistory(key: string): Attempt[] {
  const v = read<unknown>(HISTORY(key))
  return Array.isArray(v) ? v.filter(isAttempt) : []
}
/** How many attempts a test's history keeps. */
export const HISTORY_CAP = 50
export function addAttempt(key: string, a: Attempt) {
  // The last 50 runs are plenty to see a trend, and keep storage small.
  write(HISTORY(key), [...loadHistory(key), a].slice(-HISTORY_CAP))
}
export const clearHistory = (key: string) => write(HISTORY(key), null)

/** Share of first-time-right answers: the run’s answers minus its mistakes. */
export const accuracy = (a: { tries: number; wrong: number }) =>
  a.tries ? Math.round(((a.tries - a.wrong) / a.tries) * 100) : 0

/**
 * Build the mistakes tree, most-missed first at every level. A group's count
 * is the sum of everything under it, so a radical whose kanji were missed
 * 4 + 2 times ranks as 6. A level with a single group (every kanji from the
 * same radical) is skipped at the top — it would only repeat the total.
 */
export function groupMisses(misses: Miss[], top = 10): MissNode[] {
  const root: MissNode = { label: '', n: 0, children: [] }
  for (const m of misses) {
    let node = root
    for (const name of [...(m.path ?? (m.group ? [m.group] : [])), m.label]) {
      let child = node.children.find((c) => c.label === name)
      if (!child) node.children.push((child = { label: name, n: 0, children: [] }))
      child.n += m.n
      node = child
    }
  }
  const tidy = (nodes: MissNode[]): MissNode[] =>
    nodes.map((c) => ({ ...c, children: tidy(c.children) })).sort((a, b) => b.n - a.n)
  // Only the outermost level is dropped; a lone kanji still lists its words.
  const only = root.children.length === 1 ? root.children[0]! : null
  const level = only && only.children.some((c) => c.children.length) ? only.children : root.children
  return tidy(level).slice(0, top)
}

/** Across every run: the mistakes tree. */
export const mostMissed = (history: Attempt[], top = 10) =>
  groupMisses(
    history.flatMap((a) => a.misses),
    top,
  )
