import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'

/**
 * A group of hidden answers that can be opened together — every translation
 * of one passage at once, for a reader who is stuck, without tapping each line.
 */
const KEY: InjectionKey<Ref<boolean>> = Symbol('reveal-all')

export function provideRevealAll(): Ref<boolean> {
  const all = ref(false)
  provide(KEY, all)
  return all
}
export const useRevealAll = () => inject(KEY, null)
