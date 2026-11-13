/**
 * A JLPT-style section sitting: answers kept per question, a submit, a score
 * and the mistakes — independent of the mastery drill, which stays as it is.
 *
 * Pure functions over plain data, so the rules are testable and the saved
 * state is plain JSON.
 */

export interface ExamItem {
  /** Stable id inside the exam: `${sectionId}:${no}`. */
  id: string
  no: number
  answer: number
  options: number
  /** What the item is grouped under in the results (passage title, question type). */
  topic: string
  /** Listening: where its audio starts, seconds. */
  start?: number
}

export interface ExamState {
  /** Ids this sitting covers, in order (all questions, or only the ones missed last time). */
  ids: string[]
  answers: Record<string, number>
  /** Listening items whose audio has been played (exam mode allows once). */
  played: string[]
  current: number
  mode: 'practice' | 'exam'
  /** Epoch ms when the timer ends; null = untimed. */
  deadline: number | null
  submitted: boolean
  startedAt: string
}

export function newSitting(
  ids: string[],
  mode: 'practice' | 'exam',
  minutes: number | null,
  now = Date.now(),
): ExamState {
  return {
    ids: [...ids],
    answers: {},
    played: [],
    current: 0,
    mode,
    deadline: minutes ? now + minutes * 60_000 : null,
    submitted: false,
    startedAt: new Date(now).toISOString(),
  }
}

/** Choose (or change, before submitting) the answer of one item. */
export function choose(s: ExamState, id: string, option: number, items: Map<string, ExamItem>) {
  const it = items.get(id)
  if (s.submitted || !it || !s.ids.includes(id) || option < 0 || option >= it.options) return
  s.answers[id] = option
}

export function go(s: ExamState, index: number) {
  s.current = Math.max(0, Math.min(s.ids.length - 1, index))
}

export const unanswered = (s: ExamState) => s.ids.filter((id) => s.answers[id] === undefined)

export const timeLeft = (s: ExamState, now = Date.now()) =>
  s.deadline === null ? null : Math.max(0, Math.round((s.deadline - now) / 1000))

export interface Result {
  total: number
  correct: number
  percent: number
  wrong: string[]
  skipped: string[]
  topics: { topic: string; total: number; correct: number }[]
}

export function score(s: ExamState, items: Map<string, ExamItem>): Result {
  const topics = new Map<string, { topic: string; total: number; correct: number }>()
  const wrong: string[] = []
  const skipped: string[] = []
  let correct = 0
  for (const id of s.ids) {
    const it = items.get(id)
    if (!it) continue
    const t = topics.get(it.topic) ?? { topic: it.topic, total: 0, correct: 0 }
    t.total++
    const a = s.answers[id]
    if (a === it.answer) {
      correct++
      t.correct++
    } else if (a === undefined) skipped.push(id)
    else wrong.push(id)
    topics.set(it.topic, t)
  }
  const total = s.ids.filter((id) => items.has(id)).length
  return {
    total,
    correct,
    percent: total ? Math.round((correct / total) * 100) : 0,
    wrong,
    skipped,
    topics: [...topics.values()].sort((a, b) => a.correct / a.total - b.correct / b.total),
  }
}

export function submit(s: ExamState) {
  s.submitted = true
}

/** The ids to sit again: everything answered wrong or left blank. */
export const retryIds = (r: Result) => [...r.wrong, ...r.skipped]

/**
 * Where each listening item's audio stops: the next item's start (in time
 * order), or undefined for the last one (end of file). Items without a start
 * get none — they are not playable rather than guessed.
 */
export function segmentEnds(items: ExamItem[]): Map<string, number | undefined> {
  const timed = items.filter((i) => i.start !== undefined).sort((a, b) => a.start! - b.start!)
  const out = new Map<string, number | undefined>()
  timed.forEach((it, i) => {
    let j = i + 1
    while (j < timed.length && timed[j]!.start === it.start) j++
    out.set(it.id, timed[j]?.start)
  })
  return out
}

const isInt = (n: unknown) => typeof n === 'number' && Number.isInteger(n) && n >= 0
/** A stored sitting, if it is well formed. */
export function isExamState(v: unknown): v is ExamState {
  if (!v || typeof v !== 'object') return false
  const s = v as ExamState
  return (
    Array.isArray(s.ids) &&
    s.ids.every((x) => typeof x === 'string') &&
    !!s.answers &&
    typeof s.answers === 'object' &&
    Object.values(s.answers).every(isInt) &&
    Array.isArray(s.played) &&
    isInt(s.current) &&
    (s.mode === 'practice' || s.mode === 'exam') &&
    (s.deadline === null || typeof s.deadline === 'number') &&
    typeof s.submitted === 'boolean' &&
    typeof s.startedAt === 'string'
  )
}
