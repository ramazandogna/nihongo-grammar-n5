import { describe, expect, it } from 'vitest'
import { band, groupsOf, mixedSets } from './radikal-sets'

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
})
