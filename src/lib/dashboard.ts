import { PAGES, type Group, type SitePage } from '@/site'
import { isAttempt, isSavedRun, runProgress, type Attempt, type Miss } from './quiz-store'

/**
 * What the home page shows about this browser's study: the test to continue,
 * day streak, accuracy, finished tests per folder and the items missed most.
 * Read-only over the existing storage keys.
 */

type Store = Pick<Storage, 'getItem' | 'key' | 'length'>

export interface Place {
  page: SitePage
  /** Router location: path plus query (radikaller can reopen the exact test). */
  to: { path: string; query?: Record<string, string> }
  /** Opens on the saved question itself, not only on its page. */
  exact: boolean
}

/** Which page a test's storage key belongs to. */
export function placeOf(key: string): Place | null {
  const by = (path: string) => PAGES.find((p) => p.path === path)
  const prefixes: [string, string][] = [
    ['past-n3:', '/past-n3/'],
    ['matsuya:', '/matsuya/'],
    ['kanji-n3:', '/kanji-n3-book/'],
    ['kb2:', '/kanji-book-2/'],
    ['1315:', '/n4/13-15/'],
  ]
  if (key.startsWith('radikaller:')) {
    const page = by('/radikaller/')
    return page ? { page, to: { path: page.path, query: { test: key.slice(11) } }, exact: true } : null
  }
  for (const [pre, path] of prefixes) {
    const page = by(path)
    if (key.startsWith(pre) && page) return { page, to: { path }, exact: false }
  }
  // Textbook and guide pages key their tests by their own path.
  const page = [...PAGES].sort((a, b) => b.path.length - a.path.length).find((p) => key.startsWith(p.path))
  return page ? { page, to: { path: page.path }, exact: false } : null
}

function json(s: Store, k: string): unknown {
  try {
    return JSON.parse(s.getItem(k) ?? 'null')
  } catch {
    return null
  }
}
function all(s: Store, prefix: string): string[] {
  const out: string[] = []
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i)
    if (k?.startsWith(prefix)) out.push(k)
  }
  return out
}
const day = (iso: string) => {
  const d = new Date(iso)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export interface Summary {
  resume: { key: string; place: Place; percent: number; at: string } | null
  streakDays: number
  accuracy: number | null
  finished: number
  answers: number
  groups: Record<Group, { finished: number; last: string | null }>
  weak: { label: string; n: number; place: Place | null }[]
}

export function summarize(s: Store | null, now = new Date()): Summary {
  const groups: Summary['groups'] = {
    self: { finished: 0, last: null },
    school: { finished: 0, last: null },
    work: { finished: 0, last: null },
  }
  const empty: Summary = { resume: null, streakDays: 0, accuracy: null, finished: 0, answers: 0, groups, weak: [] }
  if (!s) return empty
  const days = new Set<string>()

  let resume: Summary['resume'] = null
  for (const k of all(s, 'nihongo-run:')) {
    const run = json(s, k)
    if (!isSavedRun(run) || run.current === null) continue
    const key = k.slice('nihongo-run:'.length)
    const place = placeOf(key)
    const at = run.at ?? ''
    if (at) days.add(day(at))
    if (place && (!resume || at > resume.at)) resume = { key, place, percent: runProgress(run), at }
  }

  let tries = 0
  let wrong = 0
  let finished = 0
  const misses = new Map<string, { label: string; n: number; key: string }>()
  for (const k of all(s, 'nihongo-history:')) {
    const h = json(s, k)
    if (!Array.isArray(h)) continue
    const key = k.slice('nihongo-history:'.length)
    const place = placeOf(key)
    for (const a of h.filter(isAttempt) as Attempt[]) {
      finished++
      tries += a.tries
      wrong += a.wrong
      days.add(day(a.at))
      if (place) {
        const g = groups[place.page.group ?? 'self']
        g.finished++
        if (!g.last || a.at > g.last) g.last = a.at
      }
      for (const m of a.misses as Miss[]) {
        const id = `${key}|${m.label}`
        const cur = misses.get(id) ?? { label: m.label, n: 0, key }
        cur.n += m.n
        misses.set(id, cur)
      }
    }
  }

  // Days in a row, ending today (or yesterday, so the streak survives until tonight).
  let streakDays = 0
  const d = new Date(now)
  if (!days.has(day(d.toISOString()))) d.setDate(d.getDate() - 1)
  while (days.has(day(d.toISOString()))) {
    streakDays++
    d.setDate(d.getDate() - 1)
  }

  const weak = [...misses.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, 6)
    .map((m) => ({ label: m.label, n: m.n, place: placeOf(m.key) }))
  return {
    resume,
    streakDays,
    accuracy: tries ? Math.round(((tries - wrong) / tries) * 100) : null,
    finished,
    answers: tries,
    groups,
    weak,
  }
}
