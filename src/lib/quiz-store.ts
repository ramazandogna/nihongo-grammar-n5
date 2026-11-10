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
  misses: [K, number][]
  /** Questions answered wrong, kept so they come back exactly the same. */
  retry?: [K, unknown][]
}

/** One missed item. `group` gathers items under a parent — a kanji under its radical. */
export interface Miss {
  label: string
  n: number
  group?: string
}

export interface MissGroup {
  /** Empty for items that belong to no group. */
  group: string
  n: number
  items: { label: string; n: number }[]
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
 * Sum misses by group, then by item inside each group, both most-missed
 * first. A group's total is its items' sum, so a radical whose kanji were
 * missed 4 + 2 times ranks as 6 even if no single kanji reaches that.
 */
export function groupMisses(misses: Miss[], top = 10): MissGroup[] {
  const groups = new Map<string, Map<string, number>>()
  for (const x of misses) {
    const g = groups.get(x.group ?? '') ?? new Map<string, number>()
    g.set(x.label, (g.get(x.label) ?? 0) + x.n)
    groups.set(x.group ?? '', g)
  }
  const out = [...groups].map(([group, items]) => ({
    group,
    n: [...items.values()].reduce((s, n) => s + n, 0),
    items: [...items].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n),
  }))
  // Ungrouped items rank one by one, as groups of their own.
  const flat = out.filter((g) => !g.group).flatMap((g) => g.items.map((it) => ({ group: '', n: it.n, items: [it] })))
  return [...out.filter((g) => g.group), ...flat].sort((a, b) => b.n - a.n).slice(0, top)
}

/** Across every run: the items (or groups) missed most often. */
export const mostMissed = (history: Attempt[], top = 10) =>
  groupMisses(
    history.flatMap((a) => a.misses),
    top,
  )
