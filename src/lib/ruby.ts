/**
 * The compact notation the data files use, turned into HTML.
 *
 *   {漢字|かんじ}  → <ruby>漢字<rt>かんじ</rt></ruby>
 *   [[強調]]       → <mark>強調</mark>
 *   [語]           → the word a question is about, underlined
 *
 * Text that is already HTML passes through untouched, so both the old
 * hand-written pages and the notation can go through the same component.
 */
export function notation(s: string): string {
  return s
    .replace(/\{([^|}]+)\|([^}]+)\}/g, '<ruby>$1<rt>$2</rt></ruby>')
    .replace(/\[\[(.+?)\]\]/g, '<mark>$1</mark>')
    .replace(/\[([^\]]+)\]/g, '<u class="target">$1</u>')
}

/** A whole word with its reading above it — kana needs no reading. */
export function rubyWord(word: string, reading: string): string {
  return word === reading || !/[㐀-鿿々]/.test(word) ? word : `<ruby>${word}<rt>${reading}</rt></ruby>`
}

/** Plain text of a notation or HTML string, for comparing and for labels. */
export function plain(s: string): string {
  return s
    .replace(/\{([^|}]+)\|[^}]+\}/g, '$1')
    .replace(/<rt>.*?<\/rt>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\[\[?|\]\]?/g, '')
}
