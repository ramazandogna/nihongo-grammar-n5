# Baseline (before implementation, 2026-11-14)

| Check | Result |
|---|---|
| Git status | clean except the new docs (ARCHITECTURE.md, DATA_MODEL.md, PLAN.md, planning/) |
| `pnpm type-check` | PASS (exit 0) |
| `VITE_BASE=/nihongo-grammar-n5/ pnpm build` | PASS, 5.7 s, `dist/` 52 MB, 534 files |
| Unit tests | none existed |
| Content validation | none existed |

## Audio and exam material found on this machine

All of it is in the gitignored folder `assets/past-n3/`:
- `app/` holds two complete N3 papers, `2023-07` and `2023-12`. Each paper has three data files: `moji`, `bunpou` and `choukai`.
- `app/audio/` holds `2023-07.mp3` (14.6 MB) and `2023-12.mp3` (20.2 MB).
- `真题/` is the raw archive: 48 MP3s and 195 PDFs from 1999–2023.
  - The papers are not transcribed into question data, so they are not usable as questions yet.

The audio-to-question mapping is already in the data, so nothing has to be guessed:
- Every listening question of both papers has a start time in seconds.
- Each paper has 28 listening questions, so 56 mapped questions in all.
- The sources are `start` fields in `2023-07.choukai.ts` and `2023-12.choukai.ts`.

How the audio reaches the build:
- The page loads it with `import.meta.glob('/assets/past-n3/app/audio/*.mp3')`.
- Any build made on a machine that has the files includes them, as `dist/assets/2023-*.mp3`.
- A CI build from git has neither the data nor the audio, because both are gitignored.

## Deployment

- `.github/workflows/deploy.yml` builds on every push to `main` with `VITE_BASE=/<repo>/` and deploys to GitHub Pages.
- The site URL is public.
