import { computed, ref } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter, type RouteLocationRaw } from 'vue-router'

/**
 * Keeps the open test in the URL (`?test=<id>`) so the browser's back button
 * closes the test instead of leaving the page, and asks before any way out of
 * a running test — back button, header link or the page's own back button.
 *
 * The run itself is saved by MasteryQuiz, so leaving loses nothing; the
 * question only stops a stray tap from closing the test.
 */
export function useTestRoute() {
  const route = useRoute()
  const router = useRouter()

  /** Id of the open test, or null. */
  const testId = computed(() => (typeof route.query.test === 'string' ? route.query.test : null))
  /** Where the reader asked to go while a test was open, waiting for “leave?”. */
  const pending = ref<string | null>(null)
  let confirmed = false

  function guard(to: { query: Record<string, unknown>; fullPath: string }) {
    if (!testId.value || confirmed || to.query.test === testId.value) {
      confirmed = false
      return true
    }
    pending.value = to.fullPath
    return false
  }
  onBeforeRouteUpdate(guard)
  onBeforeRouteLeave(guard)

  function openTest(id: string) {
    router.push({ query: { ...route.query, test: id } })
  }
  /** The page's own back button: same question as the browser's. */
  function askClose() {
    const { test: _, ...rest } = route.query
    pending.value = router.resolve({ query: rest }).fullPath
  }
  function leave() {
    const to = pending.value
    pending.value = null
    if (!to) return
    confirmed = true
    // Step back when the test was opened from where we are going, so the
    // history does not keep a stale “test open” entry behind the list.
    if (window.history.state?.back === to) router.back()
    else router.push(to as RouteLocationRaw)
  }
  function stay() {
    pending.value = null
  }

  return { testId, openTest, askClose, asking: computed(() => pending.value !== null), leave, stay }
}
