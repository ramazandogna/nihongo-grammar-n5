# Final QA (2026-11-14)

All browser checks are **automated**, run with Playwright Chromium headless against `vite preview` of the production build with base `/nihongo-grammar-n5/`. No manual check on a real phone was done.

| Check | Status | Evidence |
|---|---|---|
| Type-check (`vue-tsc --build`) | PASS | exit 0 |
| Unit tests (`pnpm test`) | PASS | 54/54: mastery 15, exam 7, storage 15, backup 14, dashboard 3 |
| Mastery engine rules | PASS | unit tests, plus browser: wrong → count 0, back at position 2; second miss → 2 options |
| Storage corruption | PASS | corrupt run → page works, key not deleted |
| Export / import equivalence | PASS | unit round-trip. Browser export produces a file containing the run |
| Hostile import files | PASS | size, json, format, version, `__proto__`, foreign key, bad run, HTML label, script in question |
| Content validation | PASS | 0 errors, 0 warnings, after fixing 2 duplicate-option questions |
| Production build | PASS | `pnpm build` exit 0 |
| GitHub Pages base path | PASS | assets under `/nihongo-grammar-n5/`. CI guard added |
| 404 / unknown URL | PASS | goes back home |
| Audio files present in build | PASS (local build) | `dist/assets/2023-07-*.mp3`, `2023-12-*.mp3` |
| Audio playback from build | PASS | HTTP 206. The player advanced to 0:03 of a 1:31 question stretch |
| Exam once-only audio | PASS | spent after a play, survives navigation and reload |
| Listening exam end to end | PASS | start, play, answer all, navigate (answer kept), reload, resume, submit, result 3/6, review (3 cards with audio), retry the missed (3 questions, practice replay) |
| Route smoke, 11 routes × 360 / 1280 px | PASS | all 200, horizontal overflow 0, no page errors |
| First-visit dark theme without flash | PASS | `.dark` on `<html>` at first paint |
| English UI | PASS | home shows "JLPT practice", no Turkish dashboard strings |
| Turkish UI | PASS | default |
| Continue resumes the exact question | PASS for radikaller | other pages open the page; the test resumes once it is selected |
| Existing quiz regression | PASS | browser run on the production build |
| Real phone (iOS Safari / Android) | NOT VERIFIED | |
| Screen reader pass | NOT VERIFIED | |
| Theme icon hydration on a dark phone (QA #8) | NOT VERIFIED | |
| **Recordings on the public GitHub Pages site** | **NOT DONE (declined)** | see below |

## Recordings on the hosted site

The two JLPT recordings are integrated and play in any build made on a machine that has `assets/past-n3/`:
- local `pnpm build && pnpm preview`;
- a private server you copy `dist/` to.

They are **not** committed to git and **not** published on the public GitHub Pages site, for two reasons:
1. They are copyrighted exam recordings, and a public URL distributes them.
2. The CI build only sees what is in git.

The CI guard fails a deploy that contains `.mp3` or `.pdf`.

## Remaining limitations

- **JLPT levels:** listening and full past-paper exams exist only for N3, because only N3 papers and audio are available. N5 and N4 link to their grammar, vocabulary and quiz pages.
- **Learn / Reading / Test tabs:** not unified on every page.
- **Wrong-answer explanations:** no per-option explanations, because no data exists. The existing general explanations are shown.
- **Stable content ids:** `course.json` manifests and stable content ids are not added. Only the URL lock exists.
- **Strings:** radikaller and QuizHistory strings are still page-local (TR/EN, not mixed).
- **Fonts:** the font `woff` duplicates are not removed (about 490 files in `dist/`).
- **Commit status:** nothing has been committed or pushed.


# Round 2 verification (2026-11-14, production build plus dev)

| Check | Status | Evidence |
|---|---|---|
| Type-check, 54 unit tests, content validation | PASS | exit 0, 54/54, 0 errors |
| Production build | PASS | exit 0, 2 mp3 in `dist/assets` (local build) |
| 11 routes × 360/1280, no overflow, no errors | PASS | smoke: 22/22 |
| StudyTabs at 360–1440: no split labels, sticky, arrow/Home/End keys, aria-selected | PASS | QA run plus sticky.cjs (top 57px after a scroll of 900px) |
| Before/after screenshots | PASS | `ux-audit/shots/` at 360, 390, 768, 1024, 1440, light and dark for home |
| Reveal semantics (button while veiled, text aria-hidden) | PASS | QA DOM check |
| Reveal-all per passage | PASS | 17 → 6 veiled, back to 17 |
| Touch targets on header and footer | PASS | all 44px measured |
| Listening exam with real audio, production build | PASS | 206, 0:03 elapsed, once-only, result, retry |
| Mastery quiz regression | PASS | e2e on the production build |
| Dark first paint, EN UI, continue card, export | PASS | smoke |
| Real iOS/Android, screen reader, measured contrast | NOT VERIFIED | |
| Recordings on the public site | NOT DONE (declined, copyright) | |
| Open items | | Toast over the footer (low). Router `next()` warning (low, pre-existing). Matsuya emoji titles. Two back chevrons. Vocabulary "mark difficult" / quick review. Word lookup in reading |
