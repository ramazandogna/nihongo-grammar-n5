# Architecture

Status: Phase 0 (discovery) and Phase 1 (target design). Nothing here has been implemented yet unless marked **(exists)**.

## 1. Current state (as of 2026-11-14)

| Concern | Where it lives today | Assessment |
| --- | --- | --- |
| Pages / routing | `src/pages/<path>/index.vue` + registry `src/site.ts` **(exists)** | Good. Route = folder, prerendered by vite-ssg, GitHub Pages base path via `VITE_BASE`. Keep. |
| Environments | `GROUPS` in `src/site.ts`: `self`, `school`, `work` **(exists)** | Good. These are the three environments; only naming/descriptions need to grow. |
| Content | Per page: `data.json` (n5, n4, kanji-book-2, kanji-n3-book, matsuya, radikaller) and `.ts` (blue-book, business-nihongo, reading, listening, menu) | Version-controlled and static. No common schema, no validation, no source attribution, ids only where a page needed them. |
| Quiz engine | `src/components/MasteryQuiz.vue` (537 lines), used by 6 pages **(exists)** | One engine already, which is correct. But the state machine (counts, retry, halving, queue) is mixed into the component, so it cannot be unit-tested. |
| Question builder | `src/lib/jlpt.ts`, `kanji-similar.ts` **(exists)** | Reusable. |
| Progress | `src/lib/quiz-store.ts`: `nihongo-run:<key>`, `nihongo-history:<key>` in localStorage **(exists)** | Works, guarded. No schema version, no export/import, keys tied to test ids (`rad15-*`, `kan15-*`). |
| Preferences | `src/lib/prefs.ts`, rei-kit `useTheme` **(exists)** | lang/furigana/hide/theme persisted. Theme: system/light/dark already. |
| UI strings | `src/lib/i18n.ts` (shared) + per-component dicts (`S` in QuizHistory, `U` in radikaller, hard-coded TR in ReadingLesson) | Scattered. `vue-i18n` is a dependency but unused. `zh` still exists in `Lang`. |
| Tests | none | Type-check passes (`vue-tsc --build`, exit 0). No unit tests. |

### Verified mastery algorithm (MasteryQuiz.vue)

- An item is mastered at `count === 2`.
- **Correct answer.** `count++`. If 2: drop from `retry`, item done. Else requeue 4–7 places later.
- **Wrong answer.**
  - `count = 0`, so a previous correct is lost. The exact question is stored in `retry` with `wrong++`, then requeued 2 places later.
  - A retried question is shown unchanged until mastered.
- **Two wrong answers.** From `retry.wrong >= 2` on, the question is halved at display time. It keeps the correct option plus one wrong option, re-picked at random on each showing.
- **Shuffling.** Options are shuffled on every showing.
- **Streaks.** A correct answer increments the streak and a wrong one resets it to 0. `best` is the maximum streak.

This matches the intended behaviour in the brief. One nuance: "wrong twice" counts wrong answers on the *stored retry question*, not on the item across question types. That is intentional and is kept.

## 2. Target architecture

```
src/
  site.ts                  registry: environments → courses → pages (kept, extended)
  content/                 NEW: typed content, one folder per course
    schema.ts              content types (see DATA_MODEL.md)
    <course-id>/*.json
  engine/                  NEW: framework-free learning logic
    mastery.ts             pure state machine extracted from MasteryQuiz
    mastery.test.ts        unit tests (vitest)
  lib/
    progress/              quiz-store.ts + versioned envelope, migrations, export/import
    i18n/tr.ts, en.ts      every UI string, one place
  components/              presentation only; MasteryQuiz becomes a view over engine/mastery
scripts/
  content-validate.ts      schema, duplicate ids, broken references, stats
```

### Decisions

1. **Storage for content.** Use JSON files in git, typed by TypeScript interfaces and checked by a validation script that runs before the build.
   - There is no database and no backend.
   - The site is static, single-user and under 2 MB of content, and git gives history, review and rollback for free.
2. **Storage for progress.** Keep localStorage, behind a versioned envelope (`nihongo-progress-v` + migrations).
   - IndexedDB is not justified: the data is small key/value runs and histories.
   - Old keys are read and migrated, never deleted.
   - Export/import works on one JSON file.
3. **Quiz engine.** Extract the logic from `MasteryQuiz.vue` into `engine/mastery.ts` with identical behaviour, proven by tests written against the *current* behaviour first.
   - The component keeps its animations and slots.
   - The saved-run format stays readable.
4. **i18n.** Move every interface string into `tr`/`en` dictionaries (the existing `i18n.ts` pattern, extended).
   - Adopting `vue-i18n` is optional. The current typed-dict approach is type-safe and smaller, so the recommendation is to keep it and remove the unused `vue-i18n` dependency later.
   - Content languages stay per page (`langs` in `site.ts`), which already satisfies "a course declares its languages".
5. **Theme.** rei-kit `useTheme` already does system/light/dark. Only the no-flash inline script in `index.html` needs verifying.
6. **Ingestion.** This is a documented, assisted workflow, not an in-app uploader:
   - source files are placed in a gitignored `inbox/`;
   - extraction goes into a draft JSON with `source` and `status: 'unverified'` fields;
   - `pnpm content:validate` checks the draft;
   - the draft is merged into the course.
   - Copyrighted originals stay out of git, as `assets/past-n3/` already does.

### What stays unchanged

- Routes and URLs.
- Test ids, and therefore users' saved runs and histories.
- The mastery rules.
- The rei-kit components.
- The deploy workflow.
- The gitignored past-exam data.

## 3. Agent organisation

The brief asks for project-level agent definition files. They are **not added**, because the owner requires that nothing referring to the assistant tool appears in the repository or on GitHub. The role split (architect, frontend, learning engine, content, QA) is applied as a working practice instead. If definition files are wanted, they can live in the user-level config outside the repo.
