/**
 * Turns the old single-file pages in `legacy/` into the JSON the Vue pages read.
 *
 * Run once per change to a legacy file: `pnpm extract`. The JSON it writes is
 * committed, so the app never parses HTML at runtime and the build stays offline.
 *
 * Two kinds of source:
 * - n5 / n4 are hand-written HTML. Their sections are walked into typed blocks
 *   (header, rule, example, card, daily, table) and anything else is kept as
 *   cleaned HTML, so no content is lost.
 * - The other apps keep their data in a script. That script is evaluated in a
 *   sandbox up to the point where it starts touching the DOM.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import vm from 'node:vm'
import { parseHTML } from 'linkedom'

const root = new URL('..', import.meta.url).pathname
const read = (p: string) => readFileSync(root + p, 'utf8')
function write(p: string, data: unknown) {
  mkdirSync(dirname(root + p), { recursive: true })
  writeFileSync(root + p, JSON.stringify(data, null, 1) + '\n')
  console.log('wrote', p)
}

/** The inline script of a page, cut where the data ends. */
function script(html: string, until?: string): string {
  const s = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'))
  return until ? s.slice(0, s.indexOf(until)) : s
}

function run(code: string, names: string[]): Record<string, any> {
  const ctx: Record<string, any> = {}
  vm.createContext(ctx)
  vm.runInContext(`${code}\n;globalThis.__out={${names.join(',')}}`, ctx)
  return JSON.parse(JSON.stringify(ctx.__out))
}

/* ───────── n5 / n4 ───────── */

type Block =
  | { t: 'header'; icon: string; title: string; sub: string }
  | { t: 'rule'; tone: string; html: string }
  | { t: 'example'; jp: string; romaji: string; tr: string; tag: string }
  | { t: 'card'; title: string; id?: string; blocks: Block[] }
  | { t: 'daily'; label: string; blocks: Block[] }
  | { t: 'table'; html: string }
  | { t: 'heading'; html: string }
  | { t: 'cols'; blocks: Block[] }
  | { t: 'html'; html: string }

/** Strip what only made sense in the old page: inline styles, handlers, empty rubies. */
function clean(el: Element): string {
  el.querySelectorAll('*').forEach((n: Element) => {
    n.removeAttribute('style')
    for (const a of [...n.attributes]) if (a.name.startsWith('on')) n.removeAttribute(a.name)
  })
  el.removeAttribute?.('style')
  return el.innerHTML
    .replace(/<rt><\/rt>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
const outer = (el: Element) => {
  const wrap = el.ownerDocument.createElement('div')
  wrap.appendChild(el.cloneNode(true))
  return clean(wrap)
}

function blocks(parent: Element): Block[] {
  const out: Block[] = []
  for (const el of [...parent.children]) {
    const c = el.classList
    if (c.contains('section-header')) {
      out.push({
        t: 'header',
        icon: el.querySelector('.section-icon')?.textContent?.trim() ?? '',
        title: clean(el.querySelector('h2')!),
        sub: el.querySelector('.subtitle') ? clean(el.querySelector('.subtitle')!) : '',
      })
    } else if (c.contains('rule-box')) {
      const tone = [...c].find((x) => x !== 'rule-box') ?? 'base'
      out.push({ t: 'rule', tone, html: clean(el) })
    } else if (c.contains('example')) {
      const part = (s: string) => (el.querySelector(s) ? clean(el.querySelector(s)!) : '')
      out.push({ t: 'example', jp: part('.jp-sentence'), romaji: part('.romaji'), tr: part('.tr'), tag: part('.usage-tag') })
    } else if (c.contains('two-col')) {
      out.push({ t: 'cols', blocks: blocks(el) })
    } else if (c.contains('card')) {
      const title = el.querySelector(':scope > .card-title')
      title?.remove()
      const card: Block = { t: 'card', title: title ? clean(title) : '', blocks: blocks(el) }
      if (el.id) card.id = el.id
      out.push(card)
    } else if (c.contains('daily-box')) {
      const label = el.querySelector(':scope > .daily-label')
      label?.remove()
      out.push({ t: 'daily', label: label ? clean(label) : '', blocks: blocks(el) })
    } else if (c.contains('table-scroll') || el.tagName === 'TABLE') {
      out.push({ t: 'table', html: el.tagName === 'TABLE' ? outer(el) : clean(el) })
    } else if (el.tagName === 'H3') {
      out.push({ t: 'heading', html: clean(el) })
    } else if (c.contains('quizhub-wrap')) {
      // The old hub's buttons jumped to anchors; keep them as plain links.
      el.querySelectorAll('.quizhub-card').forEach((card: Element) => {
        const target = card.querySelector('button')?.getAttribute('onclick')?.match(/goTo\('([^']+)'\)/)?.[1]
        card.querySelector('button')?.remove()
        if (target) card.setAttribute('data-href', '#' + target)
      })
      out.push({ t: 'html', html: outer(el) })
    } else {
      out.push({ t: 'html', html: outer(el) })
    }
  }
  return out
}

function guide(path: string) {
  const html = read(path)
  const { document } = parseHTML(html)
  const hero = document.querySelector('.hero')!
  const groups: { label: string; links: { id: string; emoji: string; label: string }[] }[] = []
  for (const el of [...document.querySelector('#menuModal .modal-body')!.children]) {
    if (el.classList.contains('modal-section-label')) groups.push({ label: el.textContent!.trim(), links: [] })
    else if (el.classList.contains('modal-link')) {
      if (!groups.length) groups.push({ label: '', links: [] })
      groups.at(-1)!.links.push({
        id: el.getAttribute('onclick')!.match(/goTo\('([^']+)'\)/)![1]!,
        emoji: el.querySelector('.emoji')?.textContent?.trim() ?? '',
        label: el.querySelector('.label')?.textContent?.trim() ?? '',
      })
    }
  }
  const sections = [...document.querySelectorAll('section.section')]
    .filter((s) => s.id !== 'quizhub')
    .map((s) => {
      const isHub = s.id === 'exam-center' && !s.querySelector('.card')
      return { id: s.id, hub: isHub || undefined, blocks: isHub ? [] : blocks(s) }
    })
  // Quiz data: everything before the hub's state, plus the hub's own table.
  const code = script(html, 'let curQuiz')
  const { QUIZZES } = run(code, ['QUIZZES'])
  const quizzes = Object.entries(QUIZZES).map(([n, q]: [string, any]) => ({
    n: Number(n),
    title: q.title,
    sub: q.sub,
    items: q.data,
  }))
  return {
    hero: {
      title: clean(hero.querySelector('h1')!),
      lead: hero.querySelector('p') ? clean(hero.querySelector('p')!) : '',
      badge: hero.querySelector('.hero-badge') ? clean(hero.querySelector('.hero-badge')!) : '',
    },
    toc: groups,
    sections,
    quizzes,
  }
}

write('src/pages/n5/data.json', guide('legacy/n5/index.html'))
write('src/pages/n4/data.json', guide('legacy/n4/index.html'))

/* ───────── n4 / 13-15 ───────── */
{
  const code = script(read('legacy/n4/13-15/index.html'), '/* motor */')
  const { P, QS } = run(code, ['P', 'QS'])
  write('src/pages/n4/13-15/data.json', {
    pages: P.filter((p: any) => p.t !== 't'),
    questions: QS,
  })
}

/* ───────── kanji-n3-book ───────── */
{
  const code = script(read('legacy/kanji-n3-book/index.html'), 'let S={view:')
  const { D, RD, EN, ZH, RDT, XT, UI } = run(code.replace(/^const \$=.*$/m, ''), ['D', 'RD', 'EN', 'ZH', 'RDT', 'XT', 'UI'])
  const types = Object.fromEntries(Object.keys(UI.tr.MT).map((m) => [m, [UI.tr.MT[m], UI.en.MT[m], UI.zh.MT[m]]]))
  write('src/pages/kanji-n3-book/data.json', {
    types,
    questions: D.map((d: any, i: number) => ({
      ...d,
      mean: [d.mean, EN[i][0], ZH[i][0]],
      tr: [d.tr, EN[i][1], ZH[i][1]],
      tip: [d.tip, XT.en[i][1], XT.zh[i][1]],
      p: d.p.map((p: string[], j: number) => [p[0], p[1], [p[2], XT.en[i][0][j] ?? p[2], XT.zh[i][0][j] ?? p[2]]]),
    })),
    readings: Object.fromEntries(Object.entries(RD).map(([m, r]: [string, any]) => [m, { t: r.t, j: r.j, tr: [r.tr, RDT.en[m], RDT.zh[m]] }])),
  })
}

/* ───────── kanji-book-2 ───────── */
{
  const { RAW } = run(script(read('legacy/kanji-book-2/index.html'), 'const K=['), ['RAW'])
  write(
    'src/pages/kanji-book-2/data.json',
    RAW.map(([title, tr, body]: string[]) => ({
      title,
      tr,
      kanji: body
        .trim()
        .split('\n')
        .map((l) => {
          const [k, on, kun, m, ws] = l.split('|')
          return { k, on, kun, m, w: ws!.split(',').map((x) => { const [w, r, mm] = x.split(':'); return { w, r, m: mm } }) }
        }),
    })),
  )
}

/* ───────── matsuya ───────── */
{
  const { S } = run(script(read('legacy/matsuya/index.html'), 'const keys='), ['S'])
  write(
    'src/pages/matsuya/data.json',
    Object.entries(S).map(([id, s]: [string, any]) => ({
      id,
      title: s.t,
      note: s.note,
      words: s.c.map(([w, r, romaji, tr, note]: string[]) => ({ w, r, romaji, tr, note })),
    })),
  )
}
