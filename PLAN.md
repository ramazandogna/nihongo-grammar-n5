# Plan

Each phase ends buildable (`pnpm build` green) and is committed separately.

## Phase 0 — Discovery ✅
- Type-check passes. MasteryQuiz behaviour verified against the brief (see ARCHITECTURE.md §1).

## Phase 1 — Architecture ✅
- ARCHITECTURE.md, DATA_MODEL.md, this file.

## Phase 2 — Foundation
1. Add `vitest` (dev only). Write tests against the **current** MasteryQuiz rules: first/second correct, first/second wrong, halving, repeats, mastery, streak, restore.
2. Extract `src/engine/mastery.ts` (pure), make MasteryQuiz use it; same tests must pass. Saved runs stay readable.
3. Versioned progress envelope + migration from current keys (non-destructive) + export/import buttons in the settings menu.
4. Move scattered UI strings (QuizHistory `S`, radikaller `U`, ReadingLesson TR literals) into `i18n.ts`; drop `zh` from the interface (content `zh` on n4/13-15 kept as content).

## Phase 3 — Learning experience
- Learn / Reading / Test tabs as one pattern per topic (StudyHeader tabs already exist).
- Wrong-answer explanation model (`explain.wrong[i]`) shown in the explanation sheet; missing → "explanation not available", never invented.
- Dashboard: continue card (most recent unfinished run across pages), streak, review list from `mostMissed`.

## Phase 4 — Content
- `src/content/` + `content:validate` script, prebuild hook.
- Migrate one course first (matsuya), then the rest.
- Ingestion workflow doc + gitignored `inbox/`.

## Phase 5 — Polish
- 360px audit, a11y pass, no-flash theme check, bundle size, deploy verification.
