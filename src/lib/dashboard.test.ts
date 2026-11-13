import { describe, expect, it } from 'vitest'

import { placeOf, summarize } from './dashboard'

class Mem {
  m = new Map<string, string>()
  getItem(k: string) {
    return this.m.get(k) ?? null
  }
  setItem(k: string, v: string) {
    this.m.set(k, v)
  }
  key(i: number) {
    return [...this.m.keys()][i] ?? null
  }
  get length() {
    return this.m.size
  }
}
const run = (at: string) =>
  JSON.stringify({
    pool: [1, 2],
    queue: [2],
    counts: [
      [1, 1],
      [2, 0],
    ],
    current: 1,
    question: { prompt: 'x', options: ['a', 'b'], answer: 0 },
    order: [0, 1],
    picked: null,
    tries: 1,
    wrong: 0,
    misses: [],
    at,
  })

describe('dashboard', () => {
  it('maps storage keys to pages; radikaller reopens the exact test', () => {
    expect(placeOf('radikaller:kan15-3')).toMatchObject({
      to: { path: '/radikaller/', query: { test: 'kan15-3' } },
      exact: true,
    })
    expect(placeOf('past-n3:2023-12:c1')?.to.path).toBe('/past-n3/')
    expect(placeOf('/blue-book/1-1:quiz')?.to.path).toBe('/blue-book/')
    expect(placeOf('/n4/13-15/x')?.to.path).toBe('/n4/13-15/')
    expect(placeOf('nothing')).toBeNull()
  })

  it('continue = most recent unfinished run; stats from history', () => {
    const s = new Mem()
    s.setItem('nihongo-run:radikaller:rad15-1', run('2026-11-10T10:00:00'))
    s.setItem('nihongo-run:matsuya:menu', run('2026-11-12T10:00:00'))
    s.setItem('nihongo-run:broken', '{')
    s.setItem(
      'nihongo-history:radikaller:rad15-2',
      JSON.stringify([
        { at: '2026-11-13T09:00:00', tries: 10, wrong: 2, misses: [{ label: '洗', n: 2 }] },
        { at: '2026-11-14T09:00:00', tries: 10, wrong: 0, misses: [] },
      ]),
    )
    const r = summarize(s, new Date('2026-11-14T20:00:00'))
    expect(r.resume?.key).toBe('matsuya:menu')
    expect(r.resume?.percent).toBe(25)
    expect(r.accuracy).toBe(90)
    expect(r.finished).toBe(2)
    expect(r.groups.self.finished).toBe(2)
    expect(r.streakDays).toBe(3) // 12, 13, 14
    expect(r.weak[0]).toMatchObject({ label: '洗', n: 2 })
  })

  it('empty or blocked storage is harmless', () => {
    expect(summarize(null).resume).toBeNull()
    expect(summarize(new Mem()).accuracy).toBeNull()
  })
})
