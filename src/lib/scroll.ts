/** Back to the top when a page swaps what it shows without changing route. */
export function toTop() {
  if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
}
