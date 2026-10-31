import { ViteSSG } from 'vite-ssg'
import { setThemeStorageKey, useTheme } from 'rei-kit'

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
    // The theme controller's watcher belongs to whichever scope first calls
    // useTheme(). Called from a page's layout, it died with that page on the
    // first navigation: the button kept changing the preference but nothing
    // wrote `.dark` to <html> any more, until a reload. Created here, outside
    // every component, it lives as long as the app.
    if (isClient) useTheme()

    // After hydration, so the first client render matches the prerendered HTML.
    if (isClient) router.isReady().then(() => setTimeout(loadPrefs))
  },
)
