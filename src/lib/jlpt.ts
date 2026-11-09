import { shuffle } from './shuffle'

/**
 * JLPT-style questions built from a word list.
 *
 * The exam never asks “what does 海 mean?”. It underlines a word and asks
 * for its reading among near-misses (問題1 漢字読み), gives the reading and
 * asks which kanji spell it among look-alikes (問題2 表記), or asks which word
 * fits (文脈). These generators make the wrong options the way the exam does:
 * a dakuten added or lost, a long vowel stretched or cut, a small っ or ゃ
 * moved — and, for spelling, a kanji swapped for one with the same radical
 * or the same sound.
 */
export interface Vocab {
  word: string
  reading: string
  meaning: string
}

const DAKU: Record<string, string> = {
  か: 'が', き: 'ぎ', く: 'ぐ', け: 'げ', こ: 'ご', さ: 'ざ', し: 'じ', す: 'ず', せ: 'ぜ', そ: 'ぞ',
  た: 'だ', ち: 'ぢ', つ: 'づ', て: 'で', と: 'ど', は: 'ば', ひ: 'び', ふ: 'ぶ', へ: 'べ', ほ: 'ぼ',
}
const UNDAKU = Object.fromEntries(Object.entries(DAKU).map(([a, b]) => [b, a]))
const HANDAKU: Record<string, string> = { は: 'ぱ', ひ: 'ぴ', ふ: 'ぷ', へ: 'ぺ', ほ: 'ぽ' }
/** Rows whose vowel is o / u: a long vowel there is written with う. */
const O_OR_U = /[こごそぞとどのほぼぽもよろおくぐすずつづぬふぶぷむゆるうょゅ]/
const CAN_GEMINATE = /[かきくけこさしすせそたちつてとぱぴぷぺぽ]/

/** Every one-step slip a learner makes on this reading, in the exam’s own style. */
export function readingSlips(r: string): string[] {
  const out = new Set<string>()
  const ch = [...r]
  ch.forEach((c, i) => {
    const pre = ch.slice(0, i).join('')
    const post = ch.slice(i + 1).join('')
    if (DAKU[c]) out.add(pre + DAKU[c] + post)
    if (UNDAKU[c]) out.add(pre + UNDAKU[c] + post)
    if (HANDAKU[c]) out.add(pre + HANDAKU[c] + post)
    // long ↔ short: drop a う after an o/u sound, or add one
    if (c === 'う' && i > 0 && O_OR_U.test(ch[i - 1]!)) out.add(pre + post)
    if (O_OR_U.test(c) && c !== 'う' && ch[i + 1] !== 'う' && i < ch.length - 1) out.add(pre + c + 'う' + post)
    if (c === 'い' && i > 0 && /[えけせてねへめれげぜでべぺ]/.test(ch[i - 1]!)) out.add(pre + post)
    // っ in or out
    if (c === 'っ') out.add(pre + 'つ' + post)
    if (i > 0 && CAN_GEMINATE.test(c) && ch[i - 1] !== 'っ' && /[いちくつ]/.test(ch[i - 1]!)) {
      out.add(ch.slice(0, i - 1).join('') + 'っ' + c + post)
    }
    // ゃゅょ swapped, or made big
    if (c === 'ゅ') out.add(pre + 'ょ' + post)
    if (c === 'ょ') out.add(pre + 'ゅ' + post)
    if (c === 'ゃ') out.add(pre + 'や' + post)
  })
  out.delete(r)
  return [...out].filter((x) => x.length > 0 && !x.startsWith('っ') && !x.startsWith('う'))
}

/** Three wrong readings: exam-style slips first, real readings of other words to fill. */
export function readingOptions(target: Vocab, pool: Vocab[]): string[] {
  const slips = shuffle(readingSlips(target.reading)).slice(0, 3)
  const fill = shuffle(pool.map((p) => p.reading)).filter((r) => r !== target.reading && !slips.includes(r))
  return [target.reading, ...slips, ...fill].slice(0, 4)
}

const KANJI = /[㐀-鿿]/

/**
 * Three wrong spellings: one kanji of the word swapped for a look-alike
 * (`similar` — same radical, same sound). The exam’s 表記 trap exactly:
 * 帰宅 / 帰室 / 着宅.
 */
export function spellingOptions(target: Vocab, similar: (k: string) => string[]): string[] {
  const chars = [...target.word]
  const out = new Set<string>()
  const spots = shuffle(chars.map((c, i) => (KANJI.test(c) ? i : -1)).filter((i) => i >= 0))
  for (const i of spots) {
    for (const s of shuffle(similar(chars[i]!))) {
      if (s === chars[i]) continue
      out.add([...chars.slice(0, i), s, ...chars.slice(i + 1)].join(''))
      if (out.size >= 3) break
    }
    if (out.size >= 3) break
  }
  out.delete(target.word)
  return [target.word, ...[...out].slice(0, 3)]
}

/** Can this word be asked as 表記? It needs a kanji, and look-alikes for it. */
export const hasKanji = (w: string) => KANJI.test(w)

export type JlptKind = 'yomi' | 'hyouki' | 'imi'
export const KIND_LABEL: Record<JlptKind, string> = {
  yomi: '問題1 漢字読み · altı çizili kelimenin okunuşu',
  hyouki: '問題2 表記 · hiragana kelimenin doğru kanjisi',
  imi: '意味 · kelimenin anlamı',
}

export interface JlptQuestion {
  kind: string
  prompt: string
  size: 'big' | 'jp' | 'text'
  options: string[]
  answer: 0
}

/**
 * One JLPT-style question about a word, the type chosen per showing:
 * reading (漢字読み), spelling (表記), or meaning with words from the same set
 * as the wrong options. Words without kanji, or too long to be an exam word
 * (whole phrases), only get the meaning question.
 */
export function jlptQuestion(v: Vocab, pool: Vocab[], similar: (k: string) => string[]): JlptQuestion {
  const examWord = hasKanji(v.word) && [...v.reading].length <= 10 && !/[・／\s]/.test(v.reading)
  const roll = Math.random()
  if (examWord && roll < 0.4) {
    const options = readingOptions(v, pool.filter((p) => p.reading !== v.reading))
    if (options.length === 4) return { kind: KIND_LABEL.yomi, prompt: `[${v.word}]`, size: 'jp', options, answer: 0 }
  }
  if (examWord && roll < 0.75) {
    const options = spellingOptions(v, similar)
    if (options.length === 4) return { kind: KIND_LABEL.hyouki, prompt: `[${v.reading}]`, size: 'jp', options, answer: 0 }
  }
  const wrong = shuffle([...new Set(pool.map((p) => p.meaning))].filter((m) => m !== v.meaning)).slice(0, 3)
  return { kind: KIND_LABEL.imi, prompt: v.word, size: [...v.word].length > 6 ? 'jp' : 'big', options: [v.meaning, ...wrong], answer: 0 }
}
