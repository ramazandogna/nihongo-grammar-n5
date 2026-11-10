/**
 * Shows any uncaught error as a small bar at the top of the screen.
 *
 * On a phone there is no console to look at, so an error that silently stops
 * a button (a missing browser feature, a bad saved state) is otherwise
 * invisible. The bar names the error so it can be screenshotted and fixed;
 * tapping it dismisses it.
 */
export function showError(err: unknown) {
  if (typeof document === 'undefined') return
  const text = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
  let bar = document.getElementById('error-bar')
  if (!bar) {
    bar = document.createElement('div')
    bar.id = 'error-bar'
    bar.setAttribute('role', 'alert')
    bar.style.cssText =
      'position:fixed;inset:0 0 auto 0;z-index:9999;padding:8px 12px;font:13px/1.4 system-ui,sans-serif;' +
      'background:#b42318;color:#fff;word-break:break-word;cursor:pointer'
    bar.addEventListener('click', () => bar!.remove())
    document.body.appendChild(bar)
  }
  bar.textContent = `Hata / Error: ${text} (kapatmak için dokun)`
}

export function installErrorBar() {
  if (typeof window === 'undefined') return
  window.addEventListener('error', (e) => showError(e.error ?? e.message))
  window.addEventListener('unhandledrejection', (e) => showError(e.reason))
}
