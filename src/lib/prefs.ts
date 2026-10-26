import { ref, watch } from 'vue'

import type { Lang } from '@/site'

/**
 * The reader's three switches, shared by every page.
 *
 * Module-level refs so one choice holds across pages. They start at the
 * prerendered defaults (Turkish, readings on, answers visible) and are read
 * from storage only in the browser, after hydration — otherwise the server's
 * HTML and the first client render would disagree.
 */
export const lang = ref<Lang>('tr')
export const furigana = ref(true)
export const hideAnswers = ref(true)

const KEYS = { lang: 'nihongo-lang', furigana: 'nihongo-furigana', hide: 'nihongo-hide' }

function get(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
function put(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage blocked: the choice lasts for this visit.
  }
}

export function loadPrefs() {
  const l = get(KEYS.lang)
  if (l === 'tr' || l === 'en' || l === 'zh') lang.value = l
  furigana.value = get(KEYS.furigana) !== 'off'
  hideAnswers.value = get(KEYS.hide) !== 'off'

  watch(lang, (v) => put(KEYS.lang, v))
  watch(
    furigana,
    (on) => {
      // A class on <html> rather than a different render: the markup — and the
      // prerendered HTML a search engine reads — keeps its readings either way.
      document.documentElement.classList.toggle('furigana-off', !on)
      put(KEYS.furigana, on ? 'on' : 'off')
    },
    { immediate: true },
  )
  watch(hideAnswers, (on) => put(KEYS.hide, on ? 'on' : 'off'))
}
