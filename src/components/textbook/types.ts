/**
 * One textbook lesson, the shape every course page (blue-book,
 * business-nihongo, …) hands to `TextbookLesson`. All Japanese is in the
 * site's notation: {漢字|かんじ}, [[mark]].
 *
 * A new unit is one more object in the page's `data.ts`; nothing else changes.
 */
export interface Reading {
  title: string
  /** One line of context above the text, in Turkish. */
  intro?: string
  /** `who` is the speaker's label (キ, 気, A, B…) or '' for running text. */
  lines: { who: string; jp: string; tr: string }[]
  /** Questions about the text, answered behind the blur. */
  questions?: { q: string; a: string }[]
}

export interface GrammarPoint {
  title: string
  /** How it is built (接続). */
  form: string
  /** What it means, in Turkish. HTML allowed. */
  meaning: string
  note?: string
  examples: [string, string][]
}

export interface PhraseBox {
  title: string
  items: [string, string][]
}

export interface Exercise {
  /** The task, in Japanese; （　） marks the blank. */
  q: string
  /** What to do, in Turkish. */
  hint?: string
  /** A model answer; open-ended tasks say so in `note`. */
  a: string
  note?: string
}

export interface QuizItem {
  q: string
  opts: string[]
  a: number
  why: string
}

export interface Lesson {
  id: string
  title: string
  sub: string
  goals?: string[]
  readings: Reading[]
  grammar: GrammarPoint[]
  boxes?: PhraseBox[]
  /** [word, meaning]; the word game is built from these. */
  words: [string, string][]
  exercises: { title: string; items: Exercise[] }[]
  quiz: QuizItem[]
}
