import radicals from '@/pages/radikaller/data.json'

/**
 * Look-alikes for any kanji the radical list knows: kanji with the same
 * radical (they look alike) and kanji with the same on-reading (they sound
 * alike). These are the wrong spellings a JLPT 表記 question offers.
 *
 * Pages whose own word lists are small (Matsuya, Kanji Book 2) borrow this
 * so their spelling questions get real traps rather than random kanji.
 */
const groupOf = new Map<string, string[]>()
const onOf = new Map<string, string[]>()
for (const r of radicals) {
  const chars = r.kanji.map((k) => k.kanji)
  for (const k of r.kanji) {
    groupOf.set(k.kanji, chars)
    onOf.set(k.kanji, k.on)
  }
}
const all = [...groupOf.keys()]

export function similarKanji(c: string, extra: string[] = []): string[] {
  const same = groupOf.get(c) ?? []
  const on = onOf.get(c) ?? []
  const sound = on.length ? all.filter((x) => x !== c && (onOf.get(x) ?? []).some((o) => on.includes(o))) : []
  return [...new Set([...same, ...sound, ...extra])].filter((x) => x !== c)
}
