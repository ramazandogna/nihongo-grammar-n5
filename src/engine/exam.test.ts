import { describe, expect, it } from 'vitest'

import {
  choose,
  go,
  isExamState,
  newSitting,
  retryIds,
  score,
  segmentEnds,
  submit,
  timeLeft,
  unanswered,
  type ExamItem,
} from './exam'

const items: ExamItem[] = [
  { id: 's:1', no: 1, answer: 0, options: 4, topic: 'A', start: 10 },
  { id: 's:2', no: 2, answer: 1, options: 4, topic: 'A', start: 40 },
  { id: 's:3', no: 3, answer: 2, options: 4, topic: 'B', start: 40 },
  { id: 's:4', no: 4, answer: 3, options: 4, topic: 'B', start: 90 },
  { id: 's:5', no: 5, answer: 0, options: 3, topic: 'B' },
]
const map = new Map(items.map((i) => [i.id, i]))
const ids = items.map((i) => i.id)

describe('exam sitting', () => {
  it('keeps and changes answers until submitted, then locks them', () => {
    const s = newSitting(ids, 'exam', null)
    choose(s, 's:1', 2, map)
    choose(s, 's:1', 0, map)
    choose(s, 's:9', 0, map) // unknown id
    choose(s, 's:5', 3, map) // out of range
    expect(s.answers).toEqual({ 's:1': 0 })
    submit(s)
    choose(s, 's:1', 1, map)
    expect(s.answers['s:1']).toBe(0)
  })

  it('navigation is clamped and answers survive it', () => {
    const s = newSitting(ids, 'practice', null)
    choose(s, 's:2', 1, map)
    go(s, 99)
    expect(s.current).toBe(4)
    go(s, -3)
    expect(s.current).toBe(0)
    expect(s.answers['s:2']).toBe(1)
    expect(unanswered(s)).toEqual(['s:1', 's:3', 's:4', 's:5'])
  })

  it('scores, splits wrong from skipped, groups by topic weakest first', () => {
    const s = newSitting(ids, 'exam', null)
    choose(s, 's:1', 0, map)
    choose(s, 's:2', 1, map)
    choose(s, 's:3', 0, map)
    choose(s, 's:4', 3, map)
    const r = score(s, map)
    expect(r).toMatchObject({ total: 5, correct: 3, percent: 60, wrong: ['s:3'], skipped: ['s:5'] })
    expect(r.topics[0]).toEqual({ topic: 'B', total: 3, correct: 1 })
    expect(retryIds(r)).toEqual(['s:3', 's:5'])
  })

  it('a retry sitting covers only the missed items', () => {
    const s = newSitting(['s:3', 's:5'], 'practice', null)
    expect(score(s, map).total).toBe(2)
  })

  it('timer', () => {
    const s = newSitting(ids, 'exam', 10, 0)
    expect(timeLeft(s, 0)).toBe(600)
    expect(timeLeft(s, 700_000)).toBe(0)
    expect(timeLeft(newSitting(ids, 'exam', null), 0)).toBeNull()
  })

  it('audio segments end where the next distinct start begins; no start → not playable', () => {
    const e = segmentEnds(items)
    expect(e.get('s:1')).toBe(40)
    expect(e.get('s:2')).toBe(90)
    expect(e.get('s:3')).toBe(90)
    expect(e.get('s:4')).toBeUndefined()
    expect(e.has('s:4')).toBe(true)
    expect(e.has('s:5')).toBe(false)
  })

  it('validates stored sittings', () => {
    expect(isExamState(newSitting(ids, 'exam', 5))).toBe(true)
    expect(isExamState({ ids: [], answers: { a: 'x' } })).toBe(false)
    expect(isExamState(null)).toBe(false)
  })
})
