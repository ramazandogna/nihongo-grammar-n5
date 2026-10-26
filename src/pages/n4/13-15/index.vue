<script setup lang="ts">
import { computed, ref } from 'vue'
import { BaseButton, BaseCard } from 'rei-kit'

import ExampleSentence from '@/components/ExampleSentence.vue'
import PagerNav from '@/components/PagerNav.vue'
import JpText from '@/components/JpText.vue'
import MasteryQuiz, { type Question } from '@/components/MasteryQuiz.vue'
import SiteLayout from '@/components/SiteLayout.vue'
import { usePage } from '@/lib/page'
import { usePaged } from '@/lib/paged'
import { notation } from '@/lib/ruby'
import data from './data.json'

type Tri = [string, string, string]
interface Grammar {
  t: 'g'
  sec: string
  name: Tri
  pattern: string
  exp: Tri
  form: string
  ex: [string, Tri][]
}
interface Dialogue {
  t: 'r'
  sec: 'read'
  title: string
  lines: [string, string][]
}
interface Q {
  q: string
  hint: Tri | null
  opts: string[]
  a: number
  why: Tri
  tn: 1 | 2
}

const { t, pick, lang } = usePage('/n4/13-15/')

const grammar = data.pages.filter((p) => p.t === 'g') as unknown as Grammar[]
const dialogues = data.pages.filter((p) => p.t === 'r') as unknown as Dialogue[]
const questions = data.questions as unknown as Q[]
const units = [...new Set(grammar.map((g) => g.sec))]

// One topic per screen: contents, each grammar point, each dialogue, the tests.
const ids = ['contents', ...grammar.map((_, i) => `g${i}`), ...dialogues.map((_, i) => `d${i}`), 'tests']
const page = usePaged(() => ids, () => ({ dialogues: grammar.length + 1 }))
const pageOf = (id: string) => ids.indexOf(id)

const L = {
  unit: [(n: string) => `${parseInt(n)}. Ünite`, (n: string) => `Lesson ${parseInt(n)}`, (n: string) => `第${parseInt(n)}课`],
  dialogues: ['Diyaloglar', 'Dialogues', '对话'],
  tests: ['Testler', 'Tests', '测试'],
  test: [(n: number) => `Test ${n}`, (n: number) => `Test ${n}`, (n: number) => `测试 ${n}`],
}
const idx = computed(() => ['tr', 'en', 'zh'].indexOf(lang.value))
const unitName = (u: string) => L.unit[idx.value]!(u)
const testName = (n: number) => L.test[idx.value]!(n)

const active = ref<1 | 2 | null>(null)
const pool = computed(() => questions.map((q, i) => (q.tn === active.value ? i : -1)).filter((i) => i >= 0))
function build(i: number): Question {
  const q = questions[i]!
  return {
    kind: testName(q.tn),
    prompt: q.q + (q.hint ? ` <span class="text-ink-soft text-base">（${pick(q.hint)}）</span>` : ''),
    options: q.opts,
    answer: q.a,
    explain: pick(q.why),
  }
}
function open(n: 1 | 2 | null) {
  active.value = n
  window.scrollTo({ top: 0 })
}
</script>

<template>
  <SiteLayout>
    <a v-show="page > 0" href="#contents" class="text-primary focus-ring rounded-cell mb-2 inline-block text-sm font-semibold"
      >☰ {{ t.contents }}</a
    >

    <div v-show="page === 0">
      <section class="py-4 text-center">
        <h1 class="jp text-3xl font-bold">13・14・15課</h1>
      </section>
      <nav :aria-label="t.contents" class="surface rounded-card my-4 p-4">
        <h2 class="mb-2 text-lg font-bold">{{ t.contents }}</h2>
        <div v-for="u in units" :key="u" class="mb-3">
          <p class="text-ink-soft mb-1 text-sm font-semibold">{{ unitName(u) }}</p>
          <ul class="grid gap-1 sm:grid-cols-2">
            <li v-for="(g, i) in grammar" v-show="g.sec === u" :key="i">
              <a :href="`#g${i}`" class="focus-ring rounded-control hover:bg-muted block px-2 py-1 text-[15px]">
                {{ pick(g.name) }}
              </a>
            </li>
          </ul>
        </div>
        <p class="text-ink-soft mb-1 text-sm font-semibold">{{ pick(L.dialogues) }}</p>
        <ul class="grid gap-1 sm:grid-cols-2">
          <li v-for="(d, i) in dialogues" :key="i">
            <a :href="`#d${i}`" class="jp focus-ring rounded-control hover:bg-muted block px-2 py-1 text-[15px]">{{ d.title }}</a>
          </li>
        </ul>
        <p class="mt-3">
          <a href="#tests" class="text-primary focus-ring rounded-cell font-semibold">{{ pick(L.tests) }} →</a>
        </p>
      </nav>
    </div>

    <article v-for="(g, i) in grammar" v-show="page === pageOf(`g${i}`)" :key="`g${i}`" class="surface rounded-card p-4">
      <p class="text-ink-soft text-sm font-semibold">{{ unitName(g.sec) }} · {{ pick(g.name) }}</p>
      <JpText
        :text="g.pattern"
        as="h2"
        class="text-primary border-negative my-2 border-s-4 ps-3 text-2xl leading-[1.9] font-bold"
      />
      <p class="text-[17px]" v-html="notation(pick(g.exp))" />
      <JpText :text="g.form" as="div" class="bg-muted rounded-control my-3 block px-3 py-2 text-lg leading-[2.1]" />
      <div class="grid gap-2.5">
        <ExampleSentence v-for="(e, j) in g.ex" :key="j" :jp="e[0]" :meaning="pick(e[1])" />
      </div>
    </article>

    <article v-for="(d, i) in dialogues" v-show="page === pageOf(`d${i}`)" :key="`d${i}`" class="surface rounded-card p-4">
      <p class="text-ink-soft text-sm font-semibold">{{ pick(L.dialogues) }}</p>
      <h2 class="jp mb-2 text-xl font-bold">{{ d.title }}</h2>
      <div v-for="(l, j) in d.lines" :key="j" class="flex gap-3 text-[1.4rem] leading-[2.3]">
        <span class="jp text-primary w-16 shrink-0 text-lg">{{ l[0] }}</span>
        <JpText :text="l[1]" />
      </div>
    </article>

    <section v-show="page === ids.length - 1">
      <h2 class="mb-1 text-2xl font-bold">{{ pick(L.tests) }}</h2>
      <p class="text-ink-soft mb-4 text-[15px]">{{ t.rule }}</p>
      <template v-if="active">
        <BaseButton variant="ghost" size="sm" class="mb-3" @click="open(null)">{{ t.back }}</BaseButton>
        <MasteryQuiz :key="active" :pool="pool" :build="build">
          <template #actions>
            <BaseButton v-if="active === 1" @click="open(2)">{{ testName(2) }} →</BaseButton>
          </template>
        </MasteryQuiz>
      </template>
      <div v-else class="grid gap-3 sm:grid-cols-2">
        <BaseCard v-for="n in [1, 2] as const" :key="n" interactive as="button" class="text-start" @click="open(n)">
          <p class="font-bold">{{ testName(n) }}</p>
          <p class="text-primary mt-2 text-sm font-semibold">
            {{ t.questions(questions.filter((q) => q.tn === n).length) }} · {{ t.start }} →
          </p>
        </BaseCard>
      </div>
    </section>

    <PagerNav v-model="page" :count="ids.length" />
  </SiteLayout>
</template>
