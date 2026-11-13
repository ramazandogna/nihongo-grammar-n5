# Release notes (beta, 2026-11-14)

## New

**JLPT N3 exam mode.** Every past-paper section has a "Sınav" (exam) tab.
- Exam or practice mode, with an optional timer.
- A question grid, and answers that stay until you submit.
- After submitting:
  - a score, marked as an estimate, not an official JLPT score;
  - results per topic;
  - a review with the reasoning;
  - "retry the missed ones".

**Listening.** Plays the real recording, one question's stretch at a time.
- Exam mode allows one play per question. Practice allows replays.
- The player shows play/pause, progress, time, loading and error states.

**Home dashboard.**
- Continue where you left off.
- Day streak, accuracy and tests finished.
- Progress per folder.
- Items missed most.
- JLPT by level.

**Progress backup** (Settings → Yedek).
- Export to a file or the clipboard.
- Import with a check and a preview, then merge or replace, with undo.
- A reminder after 14 days without a backup.

**Theme.** The settings menu offers System, Light and Dark.

## Fixed

- A broken saved test no longer breaks its page.
- A dark phone no longer flashes white on the first visit.
- A failed save (private window, full storage) is now shown instead of silently lost.
- An open tab survives a new deploy: it reloads once instead of showing a broken page.
- Two N5/N4 questions had a duplicated option. The correct answers are unchanged.

## Changed

- The credit footer is no longer fixed over the content.
- Buttons are larger (44 px).
- Furigana is at least 10 px.
- The language markers on the menu are text badges instead of flags.
- The Chinese interface is gone. Chinese course content on N4 13–15 stays.
- `vue-i18n` (unused) is removed. vitest is added for tests.

## For maintainers

- New commands:
  - `pnpm test`
  - `pnpm content:validate`
- CI now:
  - runs the tests and the validation;
  - checks the base path;
  - fails if exam audio or PDFs reach a public build.
- Read `planning/INGESTION.md` before adding material.

## Round 2: design (2026-11-14)

- **New stage bar on every topic page.** Okuma, Gramer, Kelime, Alıştırma and Test (and Öğren / Test / Sınav) show an icon with a whole label. The bar stays under the header while you scroll and works with the arrow keys.
- **New home page.** A compact greeting, the continue card first, and the JLPT levels as one picker. Folders have counts, rotating chevrons and a gentle entrance. About is now its own section, and the footer is a clean © line with About and GitHub links.
- **Motion.** Taps press, cards lift on hover, pages and swapped content rise in. All of it is off when the system asks for reduced motion.
- **Hidden meanings.** They fade in instead of popping, are tinted so it is clear they can be tapped, and are no longer read aloud before they are revealed. Reading passages have a "Tüm çevirileri göster" button.
