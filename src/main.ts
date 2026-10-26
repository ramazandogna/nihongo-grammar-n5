import { ViteSSG } from 'vite-ssg'
import { setThemeStorageKey } from 'rei-kit'

import App from './App.vue'
import { routes } from './routes'
import { loadPrefs } from './lib/prefs'

import './assets/main.css'

// Before anything reads a preference: two rei-kit apps on one origin would
// otherwise share a theme setting.
setThemeStorageKey('nihongo-theme')

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    scrollBehavior(to, _from, saved) {
      if (saved) return saved
      if (to.hash) return { el: to.hash, behavior: 'smooth', top: 130 }
      return { top: 0 }
    },
  },
  ({ router, isClient }) => {
    // After hydration, so the first client render matches the prerendered HTML.
    if (isClient) router.isReady().then(() => setTimeout(loadPrefs))
  },
)
