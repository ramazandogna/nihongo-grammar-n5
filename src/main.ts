import { ViteSSG } from 'vite-ssg'
import { setThemeStorageKey, useTheme } from 'rei-kit'

import App from './App.vue'
import { routes } from './routes'
import { loadPrefs } from './lib/prefs'
import { installErrorBar, showError } from './lib/error-bar'

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
  ({ app, router, isClient }) => {
    // Errors inside Vue (event handlers, lifecycle hooks) do not reach
    // window.onerror; send both to the on-screen bar.
    if (isClient) {
      installErrorBar()
      app.config.errorHandler = (err) => {
        console.error(err)
        showError(err)
      }
      router.onError((err) => showError(err))
      // After a deploy, an open tab may ask for a chunk that no longer exists:
      // reload once to get the new HTML instead of showing a broken page.
      // Loaded fine: a later deploy may reload again.
      router.isReady().then(() =>
        setTimeout(() => {
          try {
            sessionStorage.removeItem('nihongo-left:reloaded')
          } catch {
            // nothing to clear
          }
        }, 5000),
      )
      window.addEventListener('vite:preloadError', (e) => {
        try {
          if (sessionStorage.getItem('nihongo-left:reloaded') === '1') return
          sessionStorage.setItem('nihongo-left:reloaded', '1')
        } catch {
          return
        }
        e.preventDefault()
        window.location.reload()
      })
    }

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
