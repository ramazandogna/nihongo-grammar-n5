import { beforeEach, describe, expect, it } from 'vitest'
import type { SavedRun } from './quiz-store'

class MemStorage {
  m = new Map<string, string>()
  full = false
  getItem(k: string) {
    return this.m.get(k) ?? null
  }
  setItem(k: string, v: string) {
    if (this.full) throw new Error('QuotaExceededError')
    this.m.set(k, String(v))
  }
  removeItem(k: string) {
    this.m.delete(k)
  }
  key(i: number) {
    return [...this.m.keys()][i] ?? null
  }
  get length() {
    return this.m.size
  }
  clear() {
    this.m.clear()
  }
}
const mem = new MemStorage()
;(globalThis as { localStorage?: unknown }).localStorage = mem

const store = await import('./quiz-store')

const good: SavedRun<number> = {
  pool: [1, 2],
  queue: [2],
  counts: [
    [1, 0],
    [2, 0],
  ],
  current: 1,
  question: { prompt: 'x', options: ['a', 'b', 'c', 'd'], answer: 0 },
  order: [2, 0, 1, 3],
  picked: null,
  tries: 0,
  wrong: 0,
  misses: [],
}

describe('quiz-store validation', () => {
  beforeEach(() => {
    mem.clear()
    mem.full = false
    store.storageError.value = false
  })

  it('loads a valid run, including an old one without retry/streak/at', () => {
    mem.setItem('nihongo-run:t', JSON.stringify(good))
    expect(store.loadRun('t')).toEqual(good)
  })

  it.each([
    ['not json', '{'],
    ['empty pool object', '{"pool":[]}'],
    ['array', '[]'],
    ['string', '"x"'],
    ['bad counts', JSON.stringify({ ...good, counts: [[1, 'x']] })],
    ['answer out of range', JSON.stringify({ ...good, question: { ...(good.question as object), answer: 9 } })],
    ['order mismatch', JSON.stringify({ ...good, order: [0] })],
    ['bad retry', JSON.stringify({ ...good, retry: [[1, { q: null, wrong: 1 }]] })],
  ])('ignores a corrupt run (%s) without throwing', (_, raw) => {
    mem.setItem('nihongo-run:t', raw)
    expect(() => store.loadRun('t')).not.toThrow()
    expect(store.loadRun('t')).toBeNull()
    // never deleted on read
    expect(mem.getItem('nihongo-run:t')).toBe(raw)
  })

  it('rejects a stored question with unsafe markup but keeps real ruby/mark markup', () => {
    const q = (prompt: string) =>
      JSON.stringify({ ...good, question: { prompt, options: ['a', 'b', 'c', 'd'], answer: 0 } })
    mem.setItem('nihongo-run:t', q('<img src=x onerror=alert(1)>'))
    expect(store.loadRun('t')).toBeNull()
    mem.setItem('nihongo-run:t', q('<a href="javascript:alert(1)">x</a>'))
    expect(store.loadRun('t')).toBeNull()
    mem.setItem('nihongo-run:t', q('<ruby>隣<rt>となり</rt></ruby>に<mark>座</mark><span class="g1">る</span><br/>'))
    expect(store.loadRun('t')).not.toBeNull()
  })

  it('rejects null miss entries', () => {
    mem.setItem('nihongo-run:t', JSON.stringify({ ...good, misses: [['x', null]] }))
    expect(store.loadRun('t')).toBeNull()
  })

  it('filters malformed attempts from history', () => {
    const a = { at: '2026-01-01T00:00:00Z', tries: 4, wrong: 1, misses: [{ label: 'x', n: 1 }] }
    mem.setItem('nihongo-history:t', JSON.stringify([a, { at: 1 }, null, 'x']))
    expect(store.loadHistory('t')).toEqual([a])
    mem.setItem('nihongo-history:t', '{"a":1}')
    expect(store.loadHistory('t')).toEqual([])
  })

  it('caps history at HISTORY_CAP', () => {
    for (let i = 0; i < 55; i++)
      store.addAttempt('t', { at: `2026-01-01T00:00:${String(i).padStart(2, '0')}Z`, tries: 1, wrong: 0, misses: [] })
    expect(store.loadHistory('t')).toHaveLength(store.HISTORY_CAP)
  })

  it('flags a failed write instead of swallowing it silently', () => {
    mem.full = true
    store.saveRun('t', good)
    expect(store.storageError.value).toBe(true)
  })

  it('runProgress and accuracy', () => {
    expect(
      store.runProgress({
        ...good,
        counts: [
          [1, 2],
          [2, 1],
        ],
      } as never),
    ).toBe(75)
    expect(store.accuracy({ tries: 0, wrong: 0 })).toBe(0)
    expect(store.accuracy({ tries: 4, wrong: 1 })).toBe(75)
  })
})
