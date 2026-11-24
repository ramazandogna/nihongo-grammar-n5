/**
 * Radical reading exams (読解 · 漢字): one passage per radical with 15
 * JLPT-style questions — 5 漢字読み, 5 表記, 5 文脈規定 — whose target words
 * are marked in the passage as [[n|word]].
 */
import type { Question } from '@/engine/mastery'

export type OkumaType = 'yomi' | 'hyouki' | 'bunmyaku'
export interface OkumaQuestion {
  n: number
  type: OkumaType
  word: string
  reading: string
  meaning_tr: string
  sentence: string
  options: string[]
  explain_tr: string
}
export interface Okuma {
  radicalId: number
  title: string
  title_tr: string
  text: string
  text_tr: string
  questions: OkumaQuestion[]
}

export const OKUMA_KIND: Record<OkumaType, string> = {
  yomi: '問題1 漢字読み',
  hyouki: '問題2 表記',
  bunmyaku: '問題3 文脈規定',
}

/** Files loaded through import.meta.glob, keyed by radicalId (bad or sample files skipped). */
export function indexOkuma(mods: Record<string, unknown>): Map<number, Okuma> {
  const out = new Map<number, Okuma>()
  for (const [path, mod] of Object.entries(mods)) {
    if (/\/_[^/]*$/.test(path)) continue
    const o = ((mod as { default?: unknown })?.default ?? mod) as Partial<Okuma>
    if (typeof o?.radicalId !== 'number' || typeof o.text !== 'string' || !Array.isArray(o.questions)) continue
    if (!o.questions.length) continue
    out.set(o.radicalId, o as Okuma)
  }
  return out
}

export type Segment = { text: string } | { n: number; word: string }

/** The passage split into plain text and numbered targets. */
export function segments(text: string): Segment[] {
  const out: Segment[] = []
  const re = /\[\[(\d+)\|([^\]]+)\]\]/g
  let last = 0
  for (const m of text.matchAll(re)) {
    if (m.index! > last) out.push({ text: text.slice(last, m.index) })
    out.push({ n: Number(m[1]), word: m[2]! })
    last = m.index! + m[0].length
  }
  if (last < text.length) out.push({ text: text.slice(last) })
  return out
}

/**
 * How a target shows in the passage while the exam runs, so the text never
 * gives an answer away: 漢字読み words in kanji, 表記 words in hiragana,
 * 文脈規定 words as a blank. Revealed targets show as written.
 */
export function shownTarget(q: OkumaQuestion | undefined, word: string, revealed: boolean): string {
  if (!q || revealed || q.type === 'yomi') return word
  return q.type === 'hyouki' ? q.reading : '（　　）'
}

/** The question's sentence in the site's notation: [x] underlines, （　　） stays a blank. */
export function okumaPrompt(q: OkumaQuestion, all: readonly OkumaQuestion[] = []): string {
  q = { ...q, sentence: maskOthers(q.sentence, q, all) }
  const target = q.type === 'hyouki' ? q.reading : q.word
  if (q.type === 'bunmyaku') {
    const s = q.sentence.replace(/\[\[[^\]]*\]\]/g, '（　　）')
    return s
  }
  return /\[\[[^\]]*\]\]/.test(q.sentence)
    ? q.sentence.replace(/\[\[[^\]]*\]\]/g, `[${target}]`)
    : q.sentence.replace(q.word, `[${target}]`)
}

/**
 * Hide other questions' answers in a sentence: every other 表記 target shows
 * as its reading, every other 文脈規定 target as a blank. The sentence's own
 * [[target]] marks are left alone.
 */
export function maskOthers(sentence: string, q: OkumaQuestion, all: readonly OkumaQuestion[]): string {
  const others = all
    .filter((x) => x.n !== q.n && x.type !== 'yomi' && x.word && x.word !== q.word)
    .sort((a, b) => b.word.length - a.word.length)
  return sentence
    .split(/(\[\[[^\]]*\]\])/)
    .map((part, i) => {
      if (i % 2) return part
      for (const x of others) part = part.split(x.word).join(x.type === 'hyouki' ? x.reading : '（　　）')
      return part
    })
    .join('')
}

/** Per-option glosses (aligned with options). */
export function okumaGlosses(q: OkumaQuestion): string[] {
  if (q.type === 'yomi') return q.options.map((o) => (o === q.reading ? `${q.word} · ${q.meaning_tr}` : ''))
  return q.options.map((o) => (o === q.word ? `${q.reading} · ${q.meaning_tr}` : ''))
}

export function okumaQuestion(q: OkumaQuestion, path?: string[], all: readonly OkumaQuestion[] = []): Question {
  return {
    kind: OKUMA_KIND[q.type],
    prompt: okumaPrompt(q, all),
    size: 'jp',
    options: [...q.options],
    glosses: okumaGlosses(q),
    answer: 0,
    explain: q.explain_tr,
    stat: { label: `{${q.word}|${q.reading}} ${q.meaning_tr}`, path },
  }
}
