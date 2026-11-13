# Execution log (2026-11-14)

**How the work was split**
- The 7 specialists (user-level agent definitions) wrote the blueprint reviews.
- The QA engineer independently reviewed the finished diff.
- All code was written by the lead, the main session. The specialists are read-only advisors.
  - This was deliberate: having one writer means no two agents edit the same file.
  - It is not the "specialists implement" model the brief asked for.

| Phase | Scope | Result |
|---|---|---|
| 0 Discovery | Baseline build and type-check. Audio and question mapping (56 listening questions, every one with a start time) | ACCEPTED, see BASELINE.md |
| 1 Storage safety | `isSavedRun` and `isAttempt` validation. Corrupt runs are ignored and never deleted. `storageError` notice. vitest added | ACCEPTED: unit tests, plus a browser check that a corrupt run does not break the page |
| 2 Mastery engine | `src/engine/mastery.ts` (pure, injectable rng). MasteryQuiz now drives it through `reactive` and `toRefs` | ACCEPTED: 15 engine tests, browser regression on dev and on the production build, QA parity review ("no behaviour regression") |
| 3 Progress backup | `src/lib/backup.ts` and `BackupSheet.vue`: export, clipboard copy, validated import, preview, merge or replace, safety copy and undo, 14-day reminder | ACCEPTED: 14 tests, export checked in the browser |
| 4 Audio and deploy | AudioSegment player. Stale-chunk reload. `404.html`. CI guards: base path, test, validate, no mp3/pdf in a CI build | ACCEPTED for local and private builds. **Public hosting of the recordings was not done** (see FINAL_QA) |
| 5 Theme and mobile | System/Light/Dark control. First-visit flash fixed. `color-scheme` and `theme-color` metas. 44 px targets. Safe area. Toast fits 360 px. Footer no longer fixed. Reduced motion for haptics and scroll. Furigana at least 10 px | ACCEPTED: 22 route × width checks with no overflow, dark first paint verified |
| 6 Localization | Chinese interface dictionary removed (`UiLang = tr \| en`, Chinese content kept). `vue-i18n` removed | PARTIAL: radikaller `U` and QuizHistory `S` are still page-local TR/EN tables |
| 7 Dashboard | Continue card, day streak, accuracy, tests finished, per-folder progress, most-missed items, JLPT by level | ACCEPTED: 3 tests, plus browser check that Continue opens the same question (radikaller) |
| 8 Unified Learn/Reading/Test | past-n3 sections have Learn / Test / Exam tabs | PARTIAL: not rolled out to every page. No per-option explanations, because no such data exists |
| 9 JLPT exam | `src/engine/exam.ts` and `JlptExam.vue`. Covers: instructions; exam or practice mode; optional timer (estimate); question grid; answers kept and changeable; submit with a blanks warning; result; topics; review with reasoning, script and replay; retry the missed questions; once-only audio in exam mode; resume after reload | ACCEPTED for N3, the only level with real papers and audio. 7 tests, plus a full production-build walk-through with real audio |
| 10 Content | `scripts/content-validate.ts`, `content/keys.lock.json` (routes), wired into CI | PARTIAL: validator done, and it found and fixed 2 duplicate-option questions (n5 and n4; the correct answers were unchanged). No `course.json` or stable content ids yet |
| 11 Ingestion | `planning/INGESTION.md`, gitignored `/inbox/` | ACCEPTED as a documented workflow, not an in-app uploader |
| 12 Verification | See FINAL_QA.md | Done |

## QA review → fixes

| # | Defect (QA) | Fix |
|---|---|---|
| 1 | Stored or imported run could carry script HTML into `v-html` | Allow-list of tags for every stored question string (`safeMarkup`). Tests added |
| 2 | Once-only audio stuck after a system pause | `pause` listener. Resuming continues from where it stopped |
| 3 | Stale "continue" in the exam intro | `saved` is refreshed on save and re-read on intro |
| 4 | Mismatched saved sitting gave a blank page | Validated against the section on load. `current` clamped. Imports validated too |
| 5 | Silent import failure, half-written state | Error shown. Rollback from the safety copy |
| 6 | Audio leaked about 250 ms into the next question | `requestAnimationFrame` stop at `end` |
| 7 | iOS Safari seek before metadata | Seek after `loadedmetadata` |
| 9 | `null` miss entries passed validation | `isMiss` check |
| 10 | Reload-once flag never cleared | Cleared 5 s after a good load |
| 8 | Theme icon hydration mismatch | Not reproduced. Left as NOT VERIFIED |

# Round 2: UX/UI transformation (2026-11-14)

**Ownership.** The lead implemented. QA (sonnet) independently inspected the real screens at 4 widths in light and dark and reported 5 defects. The high and medium ones were fixed and re-verified. Specialists stayed read-only by definition, so this was not specialist-implemented.

| Step | Result |
|---|---|
| Git and Markdown audit, untracking internal docs | Done. See GIT_CLEANUP.md |
| Baseline screenshots | Done: `ux-audit/shots/before-*` |
| Rendering decision | Keep SSG (`architecture/RENDERING_STRATEGY.md`) |
| StudyTabs (critical mobile tab bar) | Done. QA found the bar was not sticky. Fixed with `contents` on the StudyHeader root. Verified the tablist stays at 57px after scrolling |
| Home redesign (greeting, JLPT level picker, folders, About, footer) | Done. Screenshots at 5 widths |
| Motion tokens, press/lift/rise/page/fade-up transitions | Done |
| Reveal: animated, screen-reader safe, reveal-all per passage | Done. Browser check: 17 hidden → 6 after show-all (the rest are question answers, by design) |
| Touch targets on header, footer and level picker | Fixed to 44px, measured |
| QA low items | Toast overlapping the footer: open. Router `next()` deprecation warning: open, existed before this round |
