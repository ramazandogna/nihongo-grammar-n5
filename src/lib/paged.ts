import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { toTop } from './scroll'

/**
 * One topic on screen at a time, with the address remembering which.
 *
 * Every page stays in the prerendered HTML (the caller hides the others with
 * `v-show`), so a search engine still reads the whole guide; the reader only
 * sees one. The hash is the page's id, so a refresh, a bookmark or a link from
 * the contents lands on the same topic. `alias` maps an id inside a page — a
 * card the contents links to — to the page that holds it.
 */
export function usePaged(ids: () => string[], alias: () => Record<string, number> = () => ({})) {
  const index = ref(0)

  function fromHash() {
    const id = decodeURIComponent(location.hash.slice(1))
    if (!id) return
    const i = ids().indexOf(id)
    const j = i >= 0 ? i : alias()[id]
    if (j !== undefined && j >= 0) index.value = j
  }

  onMounted(() => {
    fromHash()
    window.addEventListener('hashchange', fromHash)
  })
  onBeforeUnmount(() => window.removeEventListener('hashchange', fromHash))

  watch(index, (i) => {
    const id = ids()[i]
    if (id) history.replaceState(history.state, '', `#${id}`)
    toTop()
  })

  return index
}
