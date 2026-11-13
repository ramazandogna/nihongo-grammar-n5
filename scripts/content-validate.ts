/**
 * Checks the committed learning content without changing it.
 *
 * Errors (exit 1): an answer index outside its options, duplicate options,
 * unbalanced {漢字|かな} or [[mark]] notation, script-like HTML, or a page URL
 * that existed before (content/keys.lock.json) and is gone now.
 * Warnings: questions with no answer key.
 *
 * Content formats differ per course (opts/ans, o/a, opts/a …); the walker
 * finds question-shaped objects by their fields instead of forcing one schema.
 *
 * `pnpm content:validate` · `--update-lock` records the current URLs.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const root = new URL('..', import.meta.url).pathname
const errors: string[] = []
const warnings: string[] = []
const stats: Record<string, { questions: number; strings: number }> = {}

const OPT_KEYS = ['opts', 'o', 'options']
const ANS_KEYS = ['ans', 'a', 'answer']
const BAD_HTML = /<script|<iframe|\son\w+\s*=|javascript:/i

function checkString(s: string, where: string, course: string) {
  stats[course]!.strings++
  const open = (s.match(/\{/g) ?? []).length
  const close = (s.match(/\}/g) ?? []).length
  if (open !== close) errors.push(`${where}: unbalanced {…} notation: ${s.slice(0, 60)}`)
  if ((s.match(/\[\[/g) ?? []).length !== (s.match(/\]\]/g) ?? []).length)
    errors.push(`${where}: unbalanced [[…]]: ${s.slice(0, 60)}`)
  if (BAD_HTML.test(s)) errors.push(`${where}: script-like HTML: ${s.slice(0, 60)}`)
}

function walk(v: unknown, where: string, course: string) {
  if (typeof v === 'string') return checkString(v, where, course)
  if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${where}[${i}]`, course))
  if (!v || typeof v !== 'object') return
  const o = v as Record<string, unknown>
  const ok = OPT_KEYS.find((k) => Array.isArray(o[k]) && (o[k] as unknown[]).every((x) => typeof x === 'string'))
  if (ok) {
    const opts = o[ok] as string[]
    const ak = ANS_KEYS.find((k) => k in o)
    if (opts.length >= 2) {
      stats[course]!.questions++
      if (!ak || o[ak] === null || o[ak] === undefined) warnings.push(`${where}: question without an answer key`)
      else if (typeof o[ak] === 'number') {
        const a = o[ak] as number
        if (!Number.isInteger(a) || a < 0 || a >= opts.length) errors.push(`${where}: answer ${a} outside ${opts.length} options`)
      }
      const seen = new Set(opts.map((x) => x.trim()))
      if (seen.size !== opts.length) errors.push(`${where}: duplicate options ${JSON.stringify(opts)}`)
    }
  }
  for (const [k, x] of Object.entries(o)) walk(x, `${where}.${k}`, course)
}

const JSON_COURSES = ['n5', 'n4', 'n4/13-15', 'kanji-n3-book', 'kanji-book-2', 'matsuya', 'radikaller']
const TS_COURSES: [string, string, string][] = [
  ['blue-book', 'src/pages/blue-book/data.ts', 'LESSONS'],
  ['business-nihongo', 'src/pages/business-nihongo/data.ts', 'LESSONS'],
  ['kanji-n3-book/reading', 'src/pages/kanji-n3-book/reading.ts', ''],
  ['matsuya/menu', 'src/pages/matsuya/menu.ts', ''],
  ['matsuya/work', 'src/pages/matsuya/work.ts', ''],
]

for (const c of JSON_COURSES) {
  stats[c] = { questions: 0, strings: 0 }
  walk(JSON.parse(readFileSync(`${root}src/pages/${c}/data.json`, 'utf8')), c, c)
}
for (const [c, file, name] of TS_COURSES) {
  stats[c] = { questions: 0, strings: 0 }
  try {
    const m = (await import(root + file)) as Record<string, unknown>
    walk(name ? m[name] : m, c, c)
  } catch (e) {
    warnings.push(`${c}: could not be loaded by node (${(e as Error).message.split('\n')[0]}); skipped`)
  }
}

// URLs must never disappear: progress and bookmarks point at them.
const site = readFileSync(`${root}src/site.ts`, 'utf8')
const paths = [...site.matchAll(/path: '([^']+)'/g)].map((m) => m[1]!).sort()
const LOCK = `${root}content/keys.lock.json`
if (process.argv.includes('--update-lock') || !existsSync(LOCK)) {
  writeFileSync(LOCK, JSON.stringify({ routes: paths }, null, 2) + '\n')
  console.log('keys.lock.json written')
} else {
  const lock = JSON.parse(readFileSync(LOCK, 'utf8')) as { routes: string[] }
  for (const r of lock.routes) if (!paths.includes(r)) errors.push(`route ${r} is in keys.lock.json but gone from site.ts`)
}

for (const [c, s] of Object.entries(stats)) console.log(`${c.padEnd(24)} ${String(s.questions).padStart(5)} questions  ${s.strings} strings`)
for (const w of warnings) console.warn('warn ', w)
for (const e of errors) console.error('ERROR', e)
console.log(`${errors.length} errors, ${warnings.length} warnings`)
process.exit(errors.length ? 1 : 0)
