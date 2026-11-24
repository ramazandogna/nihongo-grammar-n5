/** Stable string hash (FNV-1a), so sampled test pools survive reloads. */
export function hash(s: string): number {
  let h = 0x811c9dc5
  for (const c of s) {
    h ^= c.codePointAt(0)!
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h
}

/** Consecutive groups of `n` (the last may be smaller). */
export const groupsOf = <T>(xs: T[], n = 3): T[][] =>
  Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, i * n + n))

export interface SampleItem {
  key: string
  n3?: boolean
}

/**
 * `sets` mixed pools of about `size` indices, deterministic for the same items.
 * Every n3 item lands in some set; the rest fill up in a hashed order.
 */
export function mixedSets(items: SampleItem[], sets: number, size: number, seed = 'genel'): number[][] {
  const order = (xs: number[]) => xs.sort((a, b) => hash(seed + items[a]!.key) - hash(seed + items[b]!.key))
  const idx = items.map((_, i) => i)
  const n3 = order(idx.filter((i) => items[i]!.n3 === true))
  const rest = order(idx.filter((i) => items[i]!.n3 !== true))
  const out: number[][] = Array.from({ length: sets }, () => [])
  n3.forEach((i, j) => out[j % sets]!.push(i))
  let r = 0
  for (const set of out) while (set.length < size && r < rest.length) set.push(rest[r++]!)
  return out.filter((s) => s.length).map((s) => s.sort((a, b) => a - b))
}

/** Score band: <75 failed, ≥75 pass, ≥85 good, ≥90 strong. */
export type Band = 'fail' | 'pass' | 'good' | 'strong'
export const band = (p: number): Band => (p >= 90 ? 'strong' : p >= 85 ? 'good' : p >= 75 ? 'pass' : 'fail')
