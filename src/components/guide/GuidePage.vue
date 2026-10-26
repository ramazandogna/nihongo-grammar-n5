<script setup lang="ts">
import { computed, ref } from 'vue'
import { BaseButton, BaseCard } from 'rei-kit'

import { usePageContext } from '@/lib/page'
import { usePaged } from '@/lib/paged'
import PagerNav from '../PagerNav.vue'
import MasteryQuiz, { type Question } from '../MasteryQuiz.vue'
import GuideBlocks from './GuideBlocks.vue'
import type { GuideData } from './types'

/** The body of a grammar guide: contents, every section, and its quizzes. */
const { data } = defineProps<{ data: GuideData }>()
const { t } = usePageContext()

// One topic per screen: the contents, each section, then the quizzes.
const sections = data.sections.filter((s) => !s.hub)
const ids = ['contents', ...sections.map((s) => s.id), 'quizzes']
// Links in the contents that point inside a section (a card), or at the old
// quiz hubs, land on the page that now holds them.
const alias: Record<string, number> = { quizhub: ids.length - 1 }
data.sections.filter((s) => s.hub).forEach((s) => (alias[s.id] = ids.length - 1))
sections.forEach((s, i) => {
  const walk = (bs: typeof s.blocks) =>
    bs.forEach((b) => {
      if (b.t === 'card' && b.id) alias[b.id] = i + 1
      if ('blocks' in b) walk(b.blocks)
    })
  walk(s.blocks)
})
const page = usePaged(() => ids, () => alias)

const active = ref<number | null>(null)
const quiz = computed(() => data.quizzes.find((q) => q.n === active.value))
const pool = computed(() => (quiz.value ? quiz.value.items.map((_, i) => i) : []))
function build(i: number): Question {
  const q = quiz.value!.items[i]!
  return { kind: quiz.value!.title, prompt: q.q, options: q.opts, answer: q.ans, explain: q.exp }
}
function open(n: number | null) {
  active.value = n
  window.scrollTo({ top: 0 })
}
</script>

<template>
  <section v-show="page === 0" class="py-4 text-center">
    <h1 class="text-3xl font-bold" v-html="data.hero.title" />
    <p v-if="data.hero.lead" class="text-ink-soft mx-auto mt-2 max-w-prose" v-html="data.hero.lead" />
  </section>

  <nav v-show="page === 0" :aria-label="t.contents" class="surface rounded-card my-4 p-4">
    <h2 class="mb-2 text-lg font-bold">{{ t.contents }}</h2>
    <div v-for="g in data.toc" :key="g.label" class="mb-3">
      <p v-if="g.label" class="text-ink-soft mb-1 text-sm font-semibold">{{ g.label }}</p>
      <ul class="grid gap-1 sm:grid-cols-2">
        <li v-for="l in g.links" :key="l.id">
          <a
            :href="`#${l.id}`"
            class="focus-ring rounded-control hover:bg-muted flex gap-2 px-2 py-1 text-[15px]"
          >
            <span aria-hidden="true">{{ l.emoji }}</span><span class="jp">{{ l.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>

  <a v-show="page > 0" href="#contents" class="text-primary focus-ring rounded-cell mb-2 inline-block text-sm font-semibold"
    >☰ {{ t.contents }}</a
  >
  <section v-for="(s, i) in sections" v-show="page === i + 1" :key="s.id" class="lesson py-2">
    <GuideBlocks :blocks="s.blocks" />
  </section>

  <section v-show="page === ids.length - 1" class="py-2">
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

  <PagerNav v-model="page" :count="ids.length" :label="t.contents" />
</template>
