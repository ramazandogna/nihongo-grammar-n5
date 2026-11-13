# Data model

Proposed (Phase 1). Existing `data.json` files are migrated to this shape course by course. No record is dropped: a field the schema does not know goes into `extra`.

## Content

```ts
type LangCode = 'ja' | 'tr' | 'en'
type Localized = Partial<Record<Exclude<LangCode, 'ja'>, string>>

interface Source {
  book?: string        // "Blue Book", "ISI ビジネス日本語 中級Ⅰ", "workplace"
  lesson?: string      // "3-2"
  page?: number
  file?: string        // original file name (file itself is not committed if copyrighted)
}

interface Base {
  id: string           // stable, never reused: "<course>:<kind>:<slug>", e.g. "radikaller:kanji:洗"
  source?: Source
  status?: 'verified' | 'unverified' | 'generated'   // generated = made by us, not from the book
  tags?: string[]
}

interface Vocab extends Base { kind: 'vocab'; jp: string; reading: string; meaning: Localized; example?: Example[] }
interface Kanji extends Base { kind: 'kanji'; char: string; on: string[]; kun: string[]; meaning: Localized; radical?: string; words?: string[] /* vocab ids */ }
interface Grammar extends Base { kind: 'grammar'; pattern: string; explain: Localized; contrast?: { with: string; note: Localized }[]; example: Example[] }
interface Passage extends Base { kind: 'passage'; title?: string; lines: { jp: string; tr?: string; en?: string }[]; questions?: string[] /* question ids */ }
interface Question extends Base {
  kind: 'question'
  prompt: string                 // notation: {漢字|かんじ}, [[mark]], [word]
  options: string[]
  answer: number | null          // null = answer key unknown → excluded from tests, flagged by validator
  explain?: Localized & { wrong?: Record<number, Localized> }   // why each wrong option is wrong
  topic?: string                 // id of the vocab/kanji/grammar it tests
}
interface Example { jp: string; tr?: string; en?: string }
```

### Course manifest

Each course has `src/content/<course>/course.json`:

```json
{ "id": "blue-book", "environment": "school", "langs": ["ja", "tr"], "units": [{ "id": "1-1", "title": { "tr": "…" } }] }
```

### Validation rules (`pnpm content:validate`)

- Every `id` is unique across all content.
- Every reference resolves: `words`, `questions`, `topic`, `radical`.
- `answer` is inside `options`, and the options have no duplicates.
- Each language a course declares exists on its records. A missing language is reported, not invented.
- `answer: null` and `status: 'unverified'` are listed as warnings.
- The validator prints statistics per course.

## Progress (browser)

```ts
interface ProgressEnvelope {
  v: 1
  runs: Record<string, SavedRun>        // key = test id (unchanged from today)
  history: Record<string, Attempt[]>
}
```

- Today's `nihongo-run:<key>` and `nihongo-history:<key>` entries are read as version 0 and migrated to version 1 on first load.
- The old keys are kept until the user exports a backup.
- Export and import write and read this envelope as one `.json` file.
- Progress refers to content only by question/test id. Moving files between folders never orphans progress.
