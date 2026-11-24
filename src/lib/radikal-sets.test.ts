import { describe, expect, it } from 'vitest'
import { band, coverSets, groupsOf, mixedSets, tallyMisses } from './radikal-sets'

describe('radikal-sets', () => {
  it('groups by three', () => {
    expect(groupsOf([1, 2, 3, 4, 5, 6, 7])).toEqual([[1, 2, 3], [4, 5, 6], [7]])
  })
  it('bands', () => {
    expect([74, 75, 85, 90].map(band)).toEqual(['fail', 'pass', 'good', 'strong'])
  })
  it('samples deterministically and covers every n3 item', () => {
    const items = Array.from({ length: 200 }, (_, i) => ({ key: `k${i}`, n3: i % 7 === 0 }))
    const a = mixedSets(items, 4, 20)
    expect(a).toEqual(mixedSets(items, 4, 20))
    expect(a).toHaveLength(4)
    const flat = a.flat()
    expect(new Set(flat).size).toBe(flat.length)
    for (let i = 0; i < 200; i += 7) expect(flat).toContain(i)
    expect(a.every((s) => s.length === 20)).toBe(true)
  })
  it('covers with distinct full sets, n3 first', () => {
    const items = Array.from({ length: 50 }, (_, i) => ({ key: `k${i}`, n3: i < 5 }))
    const a = coverSets(items, 8, 10, 's')
    expect(a).toEqual(coverSets(items, 8, 10, 's'))
    expect(a.every((s) => s.length === 10 && new Set(s).size === 10)).toBe(true)
    expect(new Set(a.flat()).size).toBe(50)
    for (let i = 0; i < 5; i++) expect(a.flat().filter((x) => x === i).length).toBeGreaterThan(0)
  })
  it('tallies misses by path level', () => {
    const r = tallyMisses(
      [
        { n: 2, path: ['A', 'x'] },
        { n: 3, path: ['B', 'x'] },
        { n: 1, path: ['A', 'y'] },
        { n: 1 },
      ],
      1,
    )
    expect(r).toEqual([
      { label: 'x', n: 5 },
      { label: 'y', n: 1 },
    ])
  })
})
