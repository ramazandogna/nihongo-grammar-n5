import { describe, expect, it } from 'vitest'

import { answer, emptyState, halve, next, progress, reset, type Question, type RunState } from './mastery'

/** Deterministic rng from a list of values, cycling. */
const seq = (...v: number[]) => {
  let i = 0
  return () => v[i++ % v.length]!
}
const q = (k: string): Question => ({ prompt: k, options: [`${k}-ok`, `${k}-a`, `${k}-b`, `${k}-c`], answer: 0 })

function setup(pool: string[], rng = seq(0)) {
  const s = emptyState<string>()
  const built: string[] = []
  const build = (k: string) => (built.push(k), q(k))
  reset(s, pool, rng)
  next(s, build, rng)
  return { s, build, built, rng }
}
const right = (s: RunState<string>, rng = seq(0)) => answer(s, s.question!.answer, rng)
const miss = (s: RunState<string>, rng = seq(0)) =>
  answer(
    s,
    s.question!.options.findIndex((_, i) => i !== s.question!.answer),
    rng,
  )

describe('mastery engine', () => {
  it('starts with every count at 0 and the queue a permutation of the pool', () => {
    const { s } = setup(['a', 'b', 'c'])
    expect([...s.counts.values()]).toEqual([0, 0, 0])
    expect([s.current, ...s.queue].sort()).toEqual(['a', 'b', 'c'])
  })

  it('first correct: count 1, requeued 4–7 places back (clamped)', () => {
    const pool = 'abcdefghij'.split('')
    for (const [r, at] of [
      [0, 4],
      [0.99, 7],
    ] as const) {
      const { s } = setup(pool)
      const k = s.current!
      right(s, seq(r))
      expect(s.counts.get(k)).toBe(1)
      expect(s.queue.indexOf(k)).toBe(at)
    }
    const short = setup(['a', 'b'])
    right(short.s, seq(0.99))
    expect(short.s.queue.indexOf('a') >= 0 || short.s.queue.indexOf('b') >= 0).toBe(true)
    expect(short.s.queue.length).toBe(2)
    expect(short.s.queue[1]).toBe(short.s.current) // clamped to length 1
  })

  it('second correct masters the item: removed, never requeued', () => {
    const { s, build, rng } = setup(['a'])
    expect(right(s)!.mastered).toBe(false)
    next(s, build, rng)
    const out = right(s)!
    expect(out.mastered).toBe(true)
    expect(s.counts.get('a')).toBe(2)
    expect(s.queue).toEqual([])
    expect(next(s, build, rng)).toBe(false)
  })

  it('wrong: count reset to 0, exact question stored, requeued 2 places later', () => {
    const { s } = setup('abcdef'.split(''))
    const k = s.current!
    right(s)
    // bring it back
    s.queue = [k, ...s.queue.filter((x) => x !== k)]
    next(s, q, seq(0))
    const shown = s.question
    miss(s)
    expect(s.counts.get(k)).toBe(0)
    expect(s.retry.get(k)).toEqual({ q: shown, wrong: 1 })
    expect(s.queue.indexOf(k)).toBe(2)
  })

  it('short queue: a miss with 0–1 items left comes straight back', () => {
    const { s, build, rng } = setup(['a'])
    miss(s)
    expect(s.queue).toEqual(['a'])
    next(s, build, rng)
    expect(s.current).toBe('a')
  })

  it('a retried question is shown unchanged, without rebuilding', () => {
    const { s, build, built, rng } = setup(['a'])
    const first = s.question
    miss(s)
    next(s, build, rng)
    expect(built).toEqual(['a'])
    expect(s.question).toBe(first)
  })

  it('second miss on the stored question → two options with the right one', () => {
    const { s, build, rng } = setup(['a'])
    miss(s)
    next(s, build, rng)
    expect(s.question!.options).toHaveLength(4)
    miss(s)
    next(s, build, seq(0.5))
    expect(s.question!.options).toHaveLength(2)
    expect(s.question!.options[s.question!.answer]).toBe('a-ok')
    expect(s.order.slice().sort()).toEqual([0, 1])
  })

  it('the wrong option of a halved question is re-picked each showing', () => {
    const base = q('x')
    expect(halve(base, seq(0)).options).toEqual(['x-ok', 'x-a'])
    expect(halve(base, seq(0.99)).options).toEqual(['x-ok', 'x-c'])
    expect(halve({ ...base, options: ['x-ok', 'y'] }, seq(0)).options).toEqual(['x-ok', 'y'])
  })

  it('a miss on a halved showing keeps the original full question in retry', () => {
    const { s, build, rng } = setup(['a'])
    miss(s)
    next(s, build, rng)
    miss(s)
    next(s, build, rng)
    miss(s)
    expect(s.retry.get('a')!.q.options).toHaveLength(4)
    expect(s.retry.get('a')!.wrong).toBe(3)
  })

  it('correct then wrong resets the count; two more corrects are needed', () => {
    const { s, build, rng } = setup(['a'])
    right(s)
    next(s, build, rng)
    miss(s)
    expect(s.counts.get('a')).toBe(0)
    next(s, build, rng)
    expect(right(s)!.mastered).toBe(false)
    next(s, build, rng)
    expect(right(s)!.mastered).toBe(true)
    expect(s.retry.has('a')).toBe(false)
  })

  it('options are reshuffled on every showing', () => {
    const s = emptyState<string>()
    reset(s, ['a'], seq(0))
    next(s, q, seq(0))
    const o1 = [...s.order]
    miss(s)
    next(s, q, seq(0.99))
    expect(s.order).not.toEqual(o1)
    expect([...s.order].sort()).toEqual([0, 1, 2, 3])
  })

  it('streak: grows, resets on a miss, best keeps the max, milestone at 5', () => {
    const pool = 'abcdefgh'.split('')
    const { s, build, rng } = setup(pool)
    let ms: number | null = null
    for (let i = 0; i < 5; i++) {
      ms = right(s)!.milestone
      next(s, build, rng)
    }
    expect(s.streak).toBe(5)
    expect(ms).toBe(5)
    miss(s)
    expect(s.streak).toBe(0)
    expect(s.best).toBe(5)
  })

  it('misses are filed by stat label/path, falling back to label(k)', () => {
    const s = emptyState<string>()
    reset(s, ['a'], seq(0))
    next(s, (k) => ({ ...q(k), stat: { label: '洗濯', path: ['氵', '洗'] } }), seq(0))
    miss(s)
    expect(s.misses.get('洗濯')).toEqual({ label: '洗濯', n: 1, path: ['氵', '洗'] })
    const t = emptyState<string>()
    reset(t, ['b'], seq(0))
    next(t, q, seq(0))
    answer(t, 1, seq(0), (k) => `L:${k}`)
    expect(t.misses.get('L:b')!.n).toBe(1)
  })

  it('ignores a second pick on the same showing', () => {
    const { s } = setup(['a'])
    right(s)
    expect(answer(s, 1, seq(0))).toBeNull()
    expect(s.tries).toBe(1)
  })

  it('random answer sequences always terminate with everything mastered', () => {
    for (let seed = 1; seed < 40; seed++) {
      let x = seed
      const rng = () => (x = (x * 16807) % 2147483647) / 2147483647
      const pool = Array.from({ length: 1 + (seed % 9) }, (_, i) => `k${i}`)
      const s = emptyState<string>()
      reset(s, pool, rng)
      let steps = 0
      while (next(s, q, rng)) {
        const ok = rng() < 0.6
        answer(s, ok ? s.question!.answer : (s.question!.answer + 1) % s.question!.options.length, rng)
        if (++steps > 5000) throw new Error('did not terminate')
      }
      expect(progress(s, pool.length).percent).toBe(100)
      expect([...s.counts.values()].every((c) => c === 2)).toBe(true)
    }
  })
})
