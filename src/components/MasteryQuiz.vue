<script setup lang="ts" generic="K extends string | number">
import { computed, onMounted, ref, watch } from 'vue'
import { BaseButton, BaseCard, ProgressBar } from 'rei-kit'

import { usePageContext } from '@/lib/page'
import { notation, plain } from '@/lib/ruby'
import { shuffle } from '@/lib/shuffle'

export interface Question {
  /** Small line above the question: its type or section. */
  kind?: string
  /** Notation or HTML. */
  prompt: string
  /** `big` for a lone kanji or word; `text` for a Turkish/English prompt. */
  size?: 'big' | 'jp' | 'text'
  options: string[]
  answer: number
  /** Shown after answering, under the verdict. */
  explain?: string
}

/**
 * The one test engine of the site.
 *
 * Every question is asked until it has been answered correctly twice. A wrong
 * answer brings it back two questions later; a first right answer sends it a
 * few places further. Options are shuffled on every showing, so the second
 * time cannot be answered by remembering where the right one was.
 *
 * `build` is called on every showing rather than once, so a page can vary the
 * question type for the same key (kanji → meaning, word → reading …).
 */
const { pool, build } = defineProps<{
  pool: readonly K[]
  build: (key: K) => Question
}>()
defineSlots<{
  feedback?: (p: { item: K; correct: boolean }) => unknown
  actions?: () => unknown
}>()

const { t } = usePageContext()

const queue = ref<K[]>([]) as { value: K[] }
const counts = ref(new Map<K, number>())
const current = ref<K | null>(null) as { value: K | null }
const question = ref<Question | null>(null)
const order = ref<number[]>([])
const picked = ref<number | null>(null)
const tries = ref(0)
const wrong = ref(0)
const finished = ref(false)

function start() {
  queue.value = shuffle(pool)
  counts.value = new Map(pool.map((k) => [k, 0]))
  tries.value = 0
  wrong.value = 0
  finished.value = false
  next()
}
function next() {
  const k = queue.value.shift()
  if (k === undefined) {
    finished.value = true
    current.value = null
    return
  }
  current.value = k
  question.value = build(k)
  order.value = shuffle(question.value.options.map((_, i) => i))
  picked.value = null
}
function pick(i: number) {
  if (picked.value !== null || current.value === null || !question.value) return
  picked.value = i
  tries.value++
  const k = current.value
  if (i === question.value.answer) {
    const c = (counts.value.get(k) ?? 0) + 1
    counts.value.set(k, c)
    if (c < 2) queue.value.splice(Math.min(queue.value.length, 4 + Math.floor(Math.random() * 4)), 0, k)
  } else {
    wrong.value++
    queue.value.splice(Math.min(queue.value.length, 2), 0, k)
  }
}
function proceed() {
  next()
  if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
}

onMounted(start)
watch(() => pool, start)
defineExpose({ start })

const total = computed(() => pool.length)
const done = computed(() => [...counts.value.values()].filter((c) => c >= 2).length)
const count = computed(() => (current.value === null ? 0 : (counts.value.get(current.value) ?? 0)))
const correct = computed(() => picked.value !== null && picked.value === question.value?.answer)
const wide = computed(() => (question.value?.options ?? []).some((o) => plain(o).length > 12))
</script>

<template>
  <div class="flex flex-col gap-4">
    <template v-if="!finished && question">
      <div>
        <ProgressBar :value="done" :max="total" :label="t.progress" size="sm" />
        <div class="text-ink-soft mt-1.5 flex justify-between text-sm">
          <span>{{ t.mastered }} {{ done }}/{{ total }}</span>
          <span>{{ t.mistakes }} {{ wrong }}</span>
        </div>
      </div>

      <BaseCard>
        <div class="text-ink-soft flex items-center gap-2 text-sm">
          <span v-if="question.kind" v-html="notation(question.kind)" />
          <span class="ms-auto flex gap-1" :aria-label="`${count}/2`">
            <span
              v-for="n in 2"
              :key="n"
              class="border-positive size-2.5 rounded-full border-2"
              :class="count >= n ? 'bg-positive' : ''"
            />
          </span>
        </div>
        <div
          class="my-3"
          :class="{
            'jp py-3 text-center text-5xl leading-tight': question.size === 'big',
            'jp text-[1.4rem] leading-[2.3]': (question.size ?? 'jp') === 'jp',
            'py-3 text-center text-xl font-bold': question.size === 'text',
          }"
          :lang="question.size === 'text' ? undefined : 'ja'"
          v-html="notation(question.prompt)"
        />
        <div class="grid gap-2.5" :class="wide ? 'grid-cols-1' : 'grid-cols-2'">
          <button
            v-for="i in order"
            :key="i"
            type="button"
            class="control focus-ring rounded-control jp min-h-14 px-3 py-2.5 text-xl leading-[2] [--control-border-width:2px]"
            :class="[
              wide ? 'text-start' : 'text-center',
              picked !== null && i === question.answer ? 'bg-positive/15 [--surface-border-color:var(--color-positive)]' : '',
              picked !== null && i === picked && i !== question.answer
                ? 'bg-negative/15 [--surface-border-color:var(--color-negative)]'
                : '',
            ]"
            :aria-pressed="picked === i"
            :disabled="picked !== null && i !== picked && i !== question.answer"
            @click="pick(i)"
            v-html="notation(question.options[i]!)"
          />
        </div>
      </BaseCard>

      <div
        v-if="picked !== null"
        class="bg-surface rounded-card border-s-4 p-4"
        :class="correct ? 'border-positive' : 'border-negative'"
        role="status"
      >
        <p class="font-bold">
          <template v-if="correct">{{ count >= 2 ? t.correctDone : t.correctOnce }}</template>
          <template v-else>
            {{ t.wrong }} <span class="jp" v-html="notation(question.options[question.answer]!)" />
            <span class="text-ink-soft block text-sm font-normal">{{ t.wrongBack }}</span>
          </template>
        </p>
        <div v-if="question.explain" class="mt-2 text-[15px]" v-html="notation(question.explain)" />
        <slot v-if="current !== null" name="feedback" :item="current" :correct="correct" />
        <BaseButton block class="mt-4" @click="proceed">{{ t.continue }}</BaseButton>
      </div>
    </template>

    <div v-else-if="finished" class="py-10 text-center">
      <div
        class="font-jp text-negative border-negative mx-auto grid size-28 -rotate-6 place-items-center rounded-full border-4 text-4xl"
        aria-hidden="true"
      >
        合格
      </div>
      <h2 class="mt-6 text-2xl font-bold">{{ t.doneTitle }}</h2>
      <p class="text-ink-soft">{{ t.doneStats(tries, wrong) }}</p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <BaseButton variant="secondary" @click="start">{{ t.again }}</BaseButton>
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
