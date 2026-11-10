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
function write(k: string, v: unknown) {
  try {
    if (v === null) localStorage.removeItem(k)
    else localStorage.setItem(k, JSON.stringify(v))
  } catch {
    // Storage blocked: this run simply is not kept.
  }
}

export const loadRun = <K>(key: string) => read<SavedRun<K>>(RUN(key))
/** How far a saved run is, 0–100: right answers given of the two per item owed. */
export function runProgress(run: SavedRun<unknown>): number {
  const owed = run.counts.reduce((s, [, c]) => s + Math.max(0, 2 - c), 0)
  return Math.round(((run.pool.length * 2 - owed) / (run.pool.length * 2 || 1)) * 100)
}
export const saveRun = <K>(key: string, run: SavedRun<K> | null) => write(RUN(key), run)

export const loadHistory = (key: string) => read<Attempt[]>(HISTORY(key)) ?? []
export function addAttempt(key: string, a: Attempt) {
  // The last 50 runs are plenty to see a trend, and keep storage small.
  write(HISTORY(key), [...loadHistory(key), a].slice(-50))
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
