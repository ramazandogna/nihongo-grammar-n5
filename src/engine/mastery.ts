/**
 * The mastery rules of every test, free of Vue and the browser.
 *
 * - An item is mastered after two right answers since its last miss.
 * - A right answer that is not yet mastery sends the item 4–7 places back.
 * - A wrong answer resets the item's count, keeps that exact question and
 *   brings it back 2 places later; it is shown unchanged until mastered.
 * - From the second miss of that stored question on, it is shown with two
 *   options: the right one and one wrong one, re-picked on every showing.
 * - Options are reshuffled on every showing.
 * - A wrong answer resets the streak; `best` keeps the longest.
 *
 * Positions are clamped to the queue length, so with 0–1 items left a missed
 * question comes straight back.
 *
 * State is mutated in place (the component holds it in `reactive`), and all
 * randomness comes through `rng` so tests are deterministic.
 */

export interface Question {
  kind?: string
  prompt: string
  size?: 'big' | 'jp' | 'text'
  options: string[]
  answer: number
  explain?: string
  stat?: { label: string; path?: string[] }
}

export interface Retry {
  q: Question
  wrong: number
}

export interface Miss {
  label: string
  n: number
  path?: string[]
  group?: string
}

export type Rng = () => number

export interface RunState<K> {
  queue: K[]
  counts: Map<K, number>
  current: K | null
  question: Question | null
  order: number[]
  picked: number | null
  tries: number
  wrong: number
  streak: number
  best: number
  misses: Map<string, Miss>
  retry: Map<K, Retry>
}

export const MASTERY = 2

export function shuffleWith<T>(a: readonly T[], rng: Rng): T[] {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[r[i], r[j]] = [r[j]!, r[i]!]
  }
  return r
}

export function emptyState<K>(): RunState<K> {
  return {
    queue: [],
    counts: new Map(),
    current: null,
    question: null,
    order: [],
    picked: null,
    tries: 0,
    wrong: 0,
    streak: 0,
    best: 0,
    misses: new Map(),
    retry: new Map(),
  }
}

/** A fresh run over `pool`. Call `next` afterwards. */
export function reset<K>(s: RunState<K>, pool: readonly K[], rng: Rng) {
  s.queue = shuffleWith(pool, rng)
  s.counts = new Map(pool.map((k) => [k, 0]))
  s.misses = new Map()
  s.retry = new Map()
  s.current = null
  s.question = null
  s.order = []
  s.picked = null
  s.tries = 0
  s.wrong = 0
  s.streak = 0
  s.best = 0
}

/** Missed twice: keep the right option and one wrong one at random. */
export function halve(q: Question, rng: Rng): Question {
  if (q.options.length <= 2) return q
  const wrongs = q.options.map((_, i) => i).filter((i) => i !== q.answer)
  const w = wrongs[Math.floor(rng() * wrongs.length)]!
  return { ...q, options: [q.options[q.answer]!, q.options[w]!], answer: 0 }
}

/** Show the next item. Returns false when the queue is empty (run finished). */
export function next<K>(s: RunState<K>, build: (k: K) => Question, rng: Rng): boolean {
  const k = s.queue.shift()
  if (k === undefined) {
    s.current = null
    return false
  }
  s.current = k
  const r = s.retry.get(k)
  s.question = r ? (r.wrong >= 2 ? halve(r.q, rng) : r.q) : build(k)
  s.order = shuffleWith(
    s.question.options.map((_, i) => i),
    rng,
  )
  s.picked = null
  return true
}

export interface Outcome {
  correct: boolean
  mastered: boolean
  /** Streak value when it hits a multiple of 5, else null. */
  milestone: number | null
}

/** Answer option `i` (index into `question.options`). Null if not answerable now. */
export function answer<K>(s: RunState<K>, i: number, rng: Rng, labelOf?: (k: K) => string): Outcome | null {
  if (s.picked !== null || s.current === null || !s.question) return null
  s.picked = i
  s.tries++
  const k = s.current
  const q = s.question
  if (i === q.answer) {
    const c = (s.counts.get(k) ?? 0) + 1
    s.counts.set(k, c)
    if (c >= MASTERY) s.retry.delete(k)
    else s.queue.splice(Math.min(s.queue.length, 4 + Math.floor(rng() * 4)), 0, k)
    s.streak++
    s.best = Math.max(s.best, s.streak)
    return { correct: true, mastered: c >= MASTERY, milestone: s.streak % 5 === 0 ? s.streak : null }
  }
  s.wrong++
  s.streak = 0
  const stat = q.stat ?? { label: labelOf ? labelOf(k) : String(k) }
  const m = s.misses.get(stat.label) ?? { label: stat.label, n: 0, ...(stat.path ? { path: stat.path } : {}) }
  m.n++
  s.misses.set(stat.label, m)
  s.counts.set(k, 0)
  // Keep the original question (all its options) so halving can re-pick.
  const r = s.retry.get(k) ?? { q, wrong: 0 }
  r.wrong++
  s.retry.set(k, r)
  s.queue.splice(Math.min(s.queue.length, 2), 0, k)
  return { correct: false, mastered: false, milestone: null }
}

export function progress<K>(s: RunState<K>, total: number) {
  const values = [...s.counts.values()]
  const done = values.filter((c) => c >= MASTERY).length
  const owed = values.reduce((sum, c) => sum + Math.max(0, MASTERY - c), 0)
  const percent = Math.round(((total * MASTERY - owed) / (total * MASTERY || 1)) * 100)
  return { done, owed, percent }
}
