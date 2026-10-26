/** The shape `scripts/extract-legacy.ts` writes for the n5 / n4 guides. */
export type Block =
  | { t: 'header'; icon: string; title: string; sub: string }
  | { t: 'rule'; tone: string; html: string }
  | { t: 'example'; jp: string; romaji: string; tr: string; tag: string }
  | { t: 'card'; title: string; id?: string; blocks: Block[] }
  | { t: 'daily'; label: string; blocks: Block[] }
  | { t: 'cols'; blocks: Block[] }
  | { t: 'table'; html: string }
  | { t: 'heading'; html: string }
  | { t: 'html'; html: string }

export interface GuideData {
  hero: { title: string; lead: string; badge: string }
  toc: { label: string; links: { id: string; emoji: string; label: string }[] }[]
  sections: { id: string; hub?: boolean; blocks: Block[] }[]
  quizzes: { n: number; title: string; sub: string; items: { q: string; opts: string[]; ans: number; exp: string }[] }[]
}
