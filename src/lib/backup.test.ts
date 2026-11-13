import { describe, expect, it } from 'vitest'

import { applyBackup, collect, mergeHistory, needsBackup, parseBackup, undoImport } from './backup'

class Mem {
  m = new Map<string, string>()
  getItem(k: string) {
    return this.m.get(k) ?? null
  }
  setItem(k: string, v: string) {
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
}
const run = (at: string, label = '洗濯') =>
  JSON.stringify({
    pool: [1],
    queue: [],
    counts: [[1, 0]],
    current: 1,
    question: { prompt: 'x', options: ['a', 'b'], answer: 0 },
    order: [1, 0],
    picked: null,
    tries: 1,
    wrong: 1,
    misses: [[label, { label, n: 1, path: ['氵'] }]],
    at,
  })
const att = (at: string, label = 'x') => ({ at, tries: 2, wrong: 1, misses: [{ label, n: 1 }] })
function seeded() {
  const s = new Mem()
  s.setItem('nihongo-run:a', run('2026-11-01T00:00:00Z'))
  s.setItem('nihongo-history:a', JSON.stringify([att('2026-10-01T00:00:00Z')]))
  s.setItem('nihongo-lang', 'tr')
  s.setItem('other-app', 'keep me')
  return s
}

describe('backup', () => {
  it('export → import into an empty browser gives identical keys', () => {
    const src = seeded()
    const text = JSON.stringify(collect(src))
    const r = parseBackup(text)
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.preview).toMatchObject({ runs: 1, histories: 1, attempts: 1, other: 1 })
    const dst = new Mem()
    expect(applyBackup(r.file, 'replace', dst)).toBe(true)
    for (const k of ['nihongo-run:a', 'nihongo-history:a', 'nihongo-lang']) expect(dst.getItem(k)).toBe(src.getItem(k))
    expect(dst.getItem('other-app')).toBeNull() // never exported
  })

  it('merge unions history without duplicates and keeps the newer run', () => {
    const here = seeded()
    const file = collect(seeded())
    file.data['nihongo-history:a'] = JSON.stringify([att('2026-10-01T00:00:00Z'), att('2026-10-02T00:00:00Z')])
    file.data['nihongo-run:a'] = run('2026-01-01T00:00:00Z', 'old')
    const r = parseBackup(JSON.stringify(file))
    if (!r.ok) throw new Error(r.error)
    applyBackup(r.file, 'merge', here)
    expect(JSON.parse(here.getItem('nihongo-history:a')!)).toHaveLength(2)
    expect(here.getItem('nihongo-run:a')).toContain('洗濯')
  })

  it('backs up before import and can undo', () => {
    const here = seeded()
    const before = here.getItem('nihongo-history:a')
    const r = parseBackup(JSON.stringify({ ...collect(new Mem()), data: {} }))
    if (!r.ok) throw new Error()
    applyBackup(r.file, 'replace', here)
    expect(here.getItem('nihongo-history:a')).toBeNull()
    expect(here.getItem('other-app')).toBe('keep me') // not ours, untouched
    expect(undoImport(here)).toBe(true)
    expect(here.getItem('nihongo-history:a')).toBe(before)
  })

  it.each([
    ['too large', 'x'.repeat(2_000_001), 'size'],
    ['not json', '{', 'json'],
    ['wrong format', '{"format":"x","v":1,"data":{}}', 'format'],
    ['unknown version', '{"format":"nihongo-progress","v":9,"data":{}}', 'version'],
    ['__proto__ key', '{"format":"nihongo-progress","v":1,"data":{"__proto__":"x"}}', 'key'],
    ['foreign key', '{"format":"nihongo-progress","v":1,"data":{"evil":"x"}}', 'key'],
    ['non-string value', '{"format":"nihongo-progress","v":1,"data":{"nihongo-lang":5}}', 'value'],
    ['bad run', '{"format":"nihongo-progress","v":1,"data":{"nihongo-run:a":"{}"}}', 'value'],
  ])('rejects a hostile file: %s', (_, text, error) => {
    expect(parseBackup(text)).toEqual({ ok: false, error })
  })

  it('rejects HTML in mistake labels (they are rendered as markup)', () => {
    const f = collect(new Mem())
    f.data['nihongo-history:a'] = JSON.stringify([att('2026-10-01T00:00:00Z', '<img src=x onerror=alert(1)>')])
    expect(parseBackup(JSON.stringify(f))).toEqual({ ok: false, error: 'value' })
    const g = collect(new Mem())
    g.data['nihongo-run:a'] = run('2026-11-01T00:00:00Z', '<script>')
    expect(parseBackup(JSON.stringify(g))).toEqual({ ok: false, error: 'value' })
  })

  it('mergeHistory sorts, dedupes and caps', () => {
    const a = Array.from({ length: 40 }, (_, i) =>
      att(`2026-01-${String((i % 28) + 1).padStart(2, '0')}T00:00:${String(i).padStart(2, '0')}Z`),
    )
    expect(mergeHistory(a, a)).toHaveLength(40)
    expect(
      mergeHistory(
        a,
        a.map((x) => ({ ...x, at: x.at.replace('2026', '2025') })),
      ),
    ).toHaveLength(50)
  })

  it('reminds after 14 days only when there is progress', () => {
    const s = new Mem()
    expect(needsBackup(s)).toBe(false)
    s.setItem('nihongo-history:a', '[]')
    expect(needsBackup(s)).toBe(true)
    s.setItem('nihongo-backup-at', new Date(Date.now() - 3 * 86_400_000).toISOString())
    expect(needsBackup(s)).toBe(false)
    expect(needsBackup(s, Date.now() + 12 * 86_400_000)).toBe(true)
  })
})
