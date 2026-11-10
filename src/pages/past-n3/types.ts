/**
 * A past JLPT N3 paper, taught: every question with its answer and the
 * reasoning in Turkish, readings and listening scripts with line-by-line
 * translations.
 *
 * The papers themselves are copyrighted and stay out of the repository: the
 * data lives in `assets/past-n3/app/*.ts` (gitignored) and the page shows a
 * notice when it is missing, so the public build has the page but not the
 * content.
 */
export interface ExamQuestion {
  no: number
  /** Notation: {漢字|かな}, [tested word] underlined, （　） the blank. */
  q: string
  opts: string[]
  /** 0-based. */
  a: number
  /** Why — in Turkish; the traps too. */
  why: string
  /** Listening: where this question starts in the MP3, in seconds. */
  start?: number
}

export interface ScriptLine {
  who: string
  jp: string
  tr: string
}

export interface ExamGroup {
  /** A reading passage or a listening setup, line by line. */
  title?: string
  /** Listening: where this conversation starts in the MP3, in seconds. */
  start?: number
  passage?: { jp: string; tr: string }[]
  script?: ScriptLine[]
  items: ExamQuestion[]
}

export interface ExamSection {
  id: string
  part: '文字・語彙' | '文法' | '読解' | '聴解'
  title: string
  /** How this question type works and how to attack it. */
  how: string
  groups: ExamGroup[]
}

export interface Exam {
  id: string
  title: string
  /** The listening MP3's file name in assets/past-n3/app/audio/. */
  audio?: string
  sections: ExamSection[]
}
