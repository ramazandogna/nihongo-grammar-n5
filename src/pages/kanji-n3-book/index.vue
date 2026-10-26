<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BaseButton, BaseCard } from 'rei-kit'

import JpText from '@/components/JpText.vue'
import MasteryQuiz, { type Question } from '@/components/MasteryQuiz.vue'
import RevealText from '@/components/RevealText.vue'
import SiteLayout from '@/components/SiteLayout.vue'
import StudyHeader from '@/components/StudyHeader.vue'
import { usePage } from '@/lib/page'
import { toTop } from '@/lib/scroll'
import data from './data.json'

type Tri = string[]
interface Item {
  m: number
  s: string
  o: string[]
  a: number
  w: string
  r: string
  mean: Tri
  p: [string, string, Tri][]
  tip: Tri
  tr: Tri
}

const { t, pick, lang } = usePage('/kanji-n3-book/')

const items = data.questions as unknown as Item[]
const types = data.types as Record<string, Tri>
const readings = data.readings as Record<string, { t: string; j: string[]; tr: Tri }>
const sections = [1, 2, 3, 4, 5].map((m) => {
  const ids = items.map((d, i) => (d.m === m ? i : -1)).filter((i) => i >= 0)
  return { m, ids, from: ids[0]! + 1, to: ids.at(-1)! + 1 }
})

const L = {
  section: [(k: number) => `Bölüm ${k}`, (k: number) => `Section ${k}`, (k: number) => `第${k}部分`],
  lead: ['35 soru · 5 bölüm · önce öğren, sonra test', '35 questions · 5 sections · learn first, then test', '35 题 · 5 个部分 · 先学习，再测试'],
  all: ['Genel test (1–35)', 'Full test (1–35)', '综合测试（1–35）'],
  nextSec: ['Sonraki bölüm →', 'Next section →', '下一部分 →'],
  words: ['bölümün kelimeleri altı çizili', 'words of this section are underlined', '本部分的词汇带下划线'],
}
const li = computed(() => ['tr', 'en', 'zh'].indexOf(lang.value))
const secName = (k: number) => L.section[li.value]!(k)

type View = 'learn' | 'read' | 'test'
const sec = ref<number | null>(null)
const view = ref<View>('learn')
const fullTest = ref(false)
const tabs = computed(() => [
  { value: 'learn' as const, label: t.value.learn },
  { value: 'read' as const, label: t.value.reading },
  { value: 'test' as const, label: t.value.test },
])
watch([sec, view, fullTest], toTop)

const current = computed(() => (sec.value === null ? null : sections[sec.value]!))
function openSec(k: number, v: View = 'learn') {
  fullTest.value = false
  sec.value = k
  view.value = v
}
function home() {
  sec.value = null
  fullTest.value = false
}

/** The sentence a card teaches from: the answer put back into the question. */
function solved(d: Item): string {
  if (d.m === 5) return d.o[d.a]!
  if (d.m === 4) return `${d.s} → <b>${d.o[d.a]}</b>`
  return d.s.replace('（　）', `<u class="target">${d.o[d.a]}</u>`)
}

const pool = computed(() => (fullTest.value ? items.map((_, i) => i) : (current.value?.ids ?? [])))
function build(i: number): Question {
  const d = items[i]!
  return { kind: `${pick(types[d.m]!)} · #${i + 1}`, prompt: d.s, options: d.o, answer: d.a }
}
</script>

<template>
  <SiteLayout>
    <!-- Section list -->
    <template v-if="sec === null && !fullTest">
      <section class="py-6 text-center">
        <p class="font-jp text-primary text-6xl leading-none" aria-hidden="true">漢字</p>
        <p class="text-ink-soft mt-3">{{ pick(L.lead) }}</p>
      </section>
      <div class="grid gap-3">
        <BaseCard v-for="(x, k) in sections" :key="x.m">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h2 class="font-bold">{{ secName(k + 1) }} · {{ x.from }}–{{ x.to }}</h2>
            <span class="text-ink-soft text-sm">{{ pick(types[x.m]!) }} · {{ t.questions(x.ids.length) }}</span>
          </div>
          <div class="mt-3 grid grid-cols-3 gap-2">
            <BaseButton variant="secondary" size="sm" @click="openSec(k, 'learn')">学 {{ t.learn }}</BaseButton>
            <BaseButton variant="secondary" size="sm" @click="openSec(k, 'read')">読 {{ t.reading }}</BaseButton>
            <BaseButton size="sm" @click="openSec(k, 'test')">試 {{ t.test }}</BaseButton>
          </div>
        </BaseCard>
        <BaseButton variant="secondary" block @click="fullTest = true">総 {{ pick(L.all) }}</BaseButton>
      </div>
    </template>

    <!-- Full test -->
    <template v-else-if="fullTest">
      <StudyHeader :title="pick(L.all)" @back="home" />
      <MasteryQuiz :pool="pool" :build="build">
        <template #feedback="{ item }">
          <p class="mt-2"><JpText :text="items[item]!.w" class="text-xl" /> {{ items[item]!.r }} = <b>{{ pick(items[item]!.mean) }}</b></p>
          <p class="border-negative mt-2 border-s-4 ps-3 text-[15px]">{{ pick(items[item]!.tip) }}</p>
        </template>
      </MasteryQuiz>
    </template>

    <!-- One section -->
    <template v-else-if="current">
      <StudyHeader
        v-model="view"
        :title="`${secName(sec! + 1)} · ${current.from}–${current.to}`"
        :sub="pick(types[current.m]!)"
        :tabs="tabs"
        @back="home"
      />

      <div v-if="view === 'learn'" class="grid gap-4">
        <BaseCard v-for="i in current.ids" :key="i">
          <p class="text-ink-soft text-sm">#{{ i + 1 }}</p>
          <div class="flex flex-wrap items-baseline gap-x-4">
            <span class="jp text-5xl leading-tight">{{ items[i]!.w }}</span>
            <span class="jp text-primary text-xl">{{ items[i]!.r }}</span>
          </div>
          <p class="mt-1 text-lg font-bold"><RevealText :text="pick(items[i]!.mean)" /></p>
          <div v-if="items[i]!.p.length" class="my-3 grid gap-1.5">
            <div v-for="p in items[i]!.p" :key="p[0]" class="bg-muted rounded-control flex items-center gap-3 px-3 py-2">
              <span class="jp w-9 text-center text-3xl">{{ p[0] }}</span>
              <span class="text-[15px]"><b class="jp">{{ p[1] }}</b><br />{{ pick(p[2]) }}</span>
            </div>
          </div>
          <p class="border-negative my-3 border-s-4 ps-3 text-[15px]">{{ pick(items[i]!.tip) }}</p>
          <JpText :text="solved(items[i]!)" as="p" class="text-lg leading-[2.2]" />
          <p class="text-ink-soft text-[15px]"><RevealText :text="pick(items[i]!.tr)" /></p>
        </BaseCard>
      </div>

      <BaseCard v-else-if="view === 'read'">
        <p class="text-ink-soft text-sm">{{ current.from }}–{{ current.to }} · {{ pick(L.words) }}</p>
        <JpText :text="readings[current.m]!.t" as="h2" class="my-2 text-2xl font-bold" />
        <JpText
          v-for="(line, j) in readings[current.m]!.j"
          :key="j"
          :text="line"
          as="p"
          class="text-lg leading-[2.3]"
        />
        <p class="border-primary mt-4 border-s-4 ps-3 text-[15px]"><RevealText :text="pick(readings[current.m]!.tr)" /></p>
      </BaseCard>

      <MasteryQuiz v-else :key="current.m" :pool="pool" :build="build">
        <template #feedback="{ item }">
          <p class="mt-2"><JpText :text="items[item]!.w" class="text-xl" /> {{ items[item]!.r }} = <b>{{ pick(items[item]!.mean) }}</b></p>
          <p class="border-negative mt-2 border-s-4 ps-3 text-[15px]">{{ pick(items[item]!.tip) }}</p>
          <p class="text-ink-soft mt-1 text-[15px]">{{ pick(items[item]!.tr) }}</p>
        </template>
        <template #actions>
          <BaseButton v-if="sec! < sections.length - 1" @click="openSec(sec! + 1)">{{ pick(L.nextSec) }}</BaseButton>
        </template>
      </MasteryQuiz>

      <div v-if="view !== 'test'" class="mt-6 flex flex-wrap gap-3">
        <BaseButton v-if="view === 'learn'" variant="secondary" @click="view = 'read'">{{ t.reading }} →</BaseButton>
        <BaseButton @click="view = 'test'">{{ t.test }} →</BaseButton>
        <BaseButton v-if="sec! < sections.length - 1" variant="ghost" @click="openSec(sec! + 1)">{{
          pick(L.nextSec)
        }}</BaseButton>
      </div>
    </template>
  </SiteLayout>
</template>
