<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { BaseButton, BaseCard } from 'rei-kit'

import { usePageContext } from '@/lib/page'
import MasteryQuiz, { type Question } from '../MasteryQuiz.vue'
import GuideBlocks from './GuideBlocks.vue'
import type { GuideData } from './types'

/** The body of a grammar guide: contents, every section, and its quizzes. */
const { data } = defineProps<{ data: GuideData }>()
const { t } = usePageContext()

// The old quiz hubs became the quiz list at the end of the page.
const hubIds = new Set(['quizhub', ...data.sections.filter((s) => s.hub).map((s) => s.id)])

const active = ref<number | null>(null)
const quiz = computed(() => data.quizzes.find((q) => q.n === active.value))
const pool = computed(() => (quiz.value ? quiz.value.items.map((_, i) => i) : []))
function build(i: number): Question {
  const q = quiz.value!.items[i]!
  return { kind: quiz.value!.title, prompt: q.q, options: q.opts, answer: q.ans, explain: q.exp }
}
async function open(n: number | null) {
  active.value = n
  await nextTick()
  document.getElementById('quizzes')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="py-4 text-center">
    <h1 class="text-3xl font-bold" v-html="data.hero.title" />
    <p v-if="data.hero.lead" class="text-ink-soft mx-auto mt-2 max-w-prose" v-html="data.hero.lead" />
  </section>

  <nav :aria-label="t.contents" class="surface rounded-card my-4 p-4">
    <h2 class="mb-2 text-lg font-bold">{{ t.contents }}</h2>
    <div v-for="g in data.toc" :key="g.label" class="mb-3">
      <p v-if="g.label" class="text-ink-soft mb-1 text-sm font-semibold">{{ g.label }}</p>
      <ul class="grid gap-1 sm:grid-cols-2">
        <li v-for="l in g.links" :key="l.id">
          <a
            :href="hubIds.has(l.id) ? '#quizzes' : `#${l.id}`"
            class="focus-ring rounded-control hover:bg-muted flex gap-2 px-2 py-1 text-[15px]"
          >
            <span aria-hidden="true">{{ l.emoji }}</span><span class="jp">{{ l.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>

  <template v-for="s in data.sections" :key="s.id">
    <section v-if="!s.hub" :id="s.id" class="lesson border-hair scroll-mt-36 border-t py-6">
      <GuideBlocks :blocks="s.blocks" />
    </section>
  </template>

  <section id="quizzes" class="border-hair scroll-mt-36 border-t py-6">
    <h2 class="mb-1 text-2xl font-bold">🏁 {{ t.quizzes }}</h2>
    <p class="text-ink-soft mb-4 text-[15px]">{{ t.rule }}</p>
    <template v-if="quiz">
      <BaseButton variant="ghost" size="sm" class="mb-3" @click="open(null)">{{ t.back }}</BaseButton>
      <MasteryQuiz :key="quiz.n" :pool="pool" :build="build">
        <template #actions>
          <BaseButton @click="open(null)">{{ t.quizzes }}</BaseButton>
        </template>
      </MasteryQuiz>
    </template>
    <div v-else class="grid gap-3 sm:grid-cols-2">
      <BaseCard v-for="q in data.quizzes" :key="q.n" interactive as="button" class="text-start" @click="open(q.n)">
        <p class="font-bold">{{ q.title }}</p>
        <p class="text-ink-soft jp text-sm">{{ q.sub }}</p>
        <p class="text-primary mt-2 text-sm font-semibold">{{ t.questions(q.items.length) }} · {{ t.start }} →</p>
      </BaseCard>
    </div>
  </section>
</template>
