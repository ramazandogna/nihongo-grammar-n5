# 日本語 Nihongo

A personal Japanese study site: the books from my Japanese classes, the Japanese I use at work, and JLPT N5–N3 preparation.

**Live:** https://ramazandogna.github.io/nihongo-grammar-n5/

Explanations are in Turkish, and the menu is in Turkish and English. Some pages are also in English and Chinese.

## Features

- **Furigana on every kanji.** One switch turns it on or off.
- **Hidden meanings.** Translations are blurred until you tap them, so you guess first.
- **One topic per page.** Long lists are split into pages.
- **JLPT-style tests.**
  - Three question types: 漢字読み (readings, with ゛ / long-vowel / っ traps), 表記 (the right kanji among look-alikes) and meaning.
  - A question keeps coming back until you get it right twice.
  - If you leave a test, it continues where you stopped.
  - Each test keeps a history: score trend and the items you missed most.
- **Works on phones.** No horizontal scrolling at 360px. Light and dark themes.

## Contents

The home menu has three folders.

### 📚 Self Study

| Page | Content | Languages |
| --- | --- | --- |
| [Past N3 Papers](https://ramazandogna.github.io/nihongo-grammar-n5/past-n3/) | Past JLPT N3 exams, fully explained, with audio | TR |
| [Radicals](https://ramazandogna.github.io/nihongo-grammar-n5/radikaller/) | 43 radicals, 347 N3 kanji, 470 words, in-depth lessons and tests | TR · EN |

### 📁 School Lessons

| Page | Content | Languages |
| --- | --- | --- |
| [Blue Book](https://ramazandogna.github.io/nihongo-grammar-n5/blue-book/) | Reading, grammar, word game, exercises and tests, lesson by lesson | TR |
| [Business Nihongo](https://ramazandogna.github.io/nihongo-grammar-n5/business-nihongo/) | ISI ビジネス日本語 中級Ⅰ: notices, 敬語, business writing | TR |
| [N5 Grammar](https://ramazandogna.github.io/nihongo-grammar-n5/n5/) | N5 grammar, kanji, quizzes | TR |
| [N4 Grammar](https://ramazandogna.github.io/nihongo-grammar-n5/n4/) | All N4 grammar, kanji, vocabulary, quizzes | TR |
| [N4 Grammar 13–15](https://ramazandogna.github.io/nihongo-grammar-n5/n4/13-15/) | Lessons 13・14・15: grammar, dialogues, tests | TR · EN · ZH |
| [N3 Kanji Book](https://ramazandogna.github.io/nihongo-grammar-n5/kanji-n3-book/) | Questions 1–35, reading (問題4・5), listening | TR · EN · ZH |
| [Kanji Book 2](https://ramazandogna.github.io/nihongo-grammar-n5/kanji-book-2/) | 210 kanji in 18 units | TR |

### 💼 Workplace Japanese

| Page | Content | Languages |
| --- | --- | --- |
| [Matsuya](https://ramazandogna.github.io/nihongo-grammar-n5/matsuya/) | Menu, customer dialogues, order slips, online orders | TR |

> The past exam papers and their audio are copyrighted. They are kept out of the repository (`assets/past-n3/` is gitignored), so the public site shows that page without its content.

## Tech stack

- [Vue 3](https://vuejs.org) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [rei-kit](https://github.com/ramazandogna/rei-kit): the UI kit, created and licensed by Ramazan Doğan
- [vite-ssg](https://github.com/antfu-collective/vite-ssg): every page is prerendered to HTML
- GitHub Actions deploys to GitHub Pages on every push to `main`

## Getting started

Requires Node ≥ 22.18 and pnpm.

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # type-check + prerendered site in dist/
pnpm preview
```

To build for a sub-path, as GitHub Pages does: `VITE_BASE=/nihongo-grammar-n5/ pnpm build`.

## Project structure

```
src/
  site.ts                  page registry: path, title, palette, languages, menu folder
  pages/<path>/index.vue   one page per folder; the folder is the URL
                           (pages/n4/13-15 → /n4/13-15/)
  components/              SiteLayout, MasteryQuiz, QuizHistory, ReadingLesson,
                           ListeningLesson, textbook/* (course template)
  lib/                     jlpt.ts (question builder), kanji-similar.ts,
                           quiz-store.ts (resume + history), ruby.ts (furigana notation)
legacy/                    the original single-file HTML pages (data source for n5/n4)
scripts/extract-legacy.ts  legacy/ → data.json
```

### Adding a page

1. Create `src/pages/<folder>/index.vue`, calling `usePage('/<folder>/')` and wrapping its content in `<SiteLayout>`.
2. Add an entry to `PAGES` in `src/site.ts`: title, description, English menu text, palette, languages and menu folder.

The route, menu card, `<head>` and prerendering all come from these two files.

### Content notation

| Syntax | Meaning |
| --- | --- |
| `{漢字\|かんじ}` | kanji with furigana |
| `[[text]]` | highlighted part |
| `[word]` | the word being tested (underlined) |

## License

© 2026 Ramazan Doğan. All rights reserved. See [LICENSE](LICENSE).

This project is proprietary. Copying, sharing or distributing it without written permission is prohibited and is a copyright infringement.
For questions and permission requests: doganrmzn40 [ at ] gmail [ . ] com

Built with [rei-kit](https://github.com/ramazandogna/rei-kit), created and licensed by Ramazan Doğan.
