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
}

export interface Attempt {
  /** When it finished, ISO. */
  at: string
  tries: number
  wrong: number
  /** Items missed in this run, with how many times. */
  misses: { label: string; n: number }[]
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

/** Across every run: the items missed most often. */
export function mostMissed(history: Attempt[], top = 10) {
  const m = new Map<string, number>()
  for (const a of history) for (const x of a.misses) m.set(x.label, (m.get(x.label) ?? 0) + x.n)
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([label, n]) => ({ label, n }))
}
