import { computed, inject, provide, type ComputedRef, type InjectionKey } from 'vue'
import { useHead } from '@unhead/vue'

import { HOME, PAGES, type Lang, type SitePage } from '@/site'
import { DICT } from './i18n'
import { lang } from './prefs'

interface PageContext {
  page: SitePage
  /** The language this page is shown in: the reader's, if the page has it. */
  lang: ComputedRef<Lang>
  t: ComputedRef<(typeof DICT)['tr']>
  /** Pick from a `[tr, en, zh]` triple; a single string passes through. */
  pick: (v: string | readonly string[]) => string
}

const KEY: InjectionKey<PageContext> = Symbol('page')

/**
 * Called once at the top of a page: claims the page's entry in `site.ts`,
 * writes its <head> (title, description, palette, language) and hands the
 * shared parts below it the language they should speak.
 */
export function usePage(path: string): PageContext {
  const page = [HOME, ...PAGES].find((p) => p.path === path)
  if (!page) throw new Error(`No entry in site.ts for ${path}`)

  const shown = computed<Lang>(() => (page.langs.includes(lang.value) ? lang.value : page.langs[0]!))
  const idx = computed(() => (['tr', 'en', 'zh'] as const).indexOf(shown.value))
  const ctx: PageContext = {
    page,
    lang: shown,
    t: computed(() => DICT[shown.value]),
    pick: (v) => (typeof v === 'string' ? v : (v[idx.value] ?? v[0] ?? '')),
  }

  useHead({
    title: page.path === '/' ? `${page.title} — Japonca çalışma` : `${page.title} · Nihongo`,
    meta: [{ name: 'description', content: page.description }],
    htmlAttrs: {
      lang: computed(() => (shown.value === 'zh' ? 'zh-CN' : shown.value)),
      'data-palette': page.palette,
    },
  })

  provide(KEY, ctx)
  return ctx
}

export function usePageContext(): PageContext {
  const ctx = inject(KEY)
  if (!ctx) throw new Error('usePageContext() outside a page')
  return ctx
}
