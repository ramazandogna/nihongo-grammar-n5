<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BaseButton, BaseCard } from 'rei-kit'

import JpText from '@/components/JpText.vue'
import MasteryQuiz, { type Question } from '@/components/MasteryQuiz.vue'
import PagerNav from '@/components/PagerNav.vue'
import RevealText from '@/components/RevealText.vue'
import SiteLayout from '@/components/SiteLayout.vue'
import StudyHeader from '@/components/StudyHeader.vue'
import { usePage } from '@/lib/page'
import { rubyWord } from '@/lib/ruby'
import { toTop } from '@/lib/scroll'
import { shuffle } from '@/lib/shuffle'
import data from './data.json'
import { EXTRA_CATEGORIES, SCENES, SLIPS } from './work'

interface Word {
  w: string
  r: string
  romaji: string
  tr: string
  note: string
  cat: number
}

const { t } = usePage('/matsuya/')

// The extracted vocabulary first, then the work categories written for the site.
const source = [...data, ...EXTRA_CATEGORIES]
const cats = source.map((c) => ({ title: c.title, note: c.note }))
const all: Word[] = source.flatMap((c, cat) => c.words.map((w) => ({ ...w, cat })))
const idsOf = (cat: number) => all.map((w, i) => (w.cat === cat ? i : -1)).filter((i) => i >= 0)

/** `null` is the list; `-1` the test over every word; `-2` dialogues; `-3` order slips. */
const TALK = -2
const SLIP = -3
const cat = ref<number | null>(null)
/** One dialogue / slip per page. */
const page = ref(0)
const view = ref<'learn' | 'test'>('learn')
const tabs = computed(() => [
  { value: 'learn' as const, label: t.value.learn },
  { value: 'test' as const, label: t.value.test },
])
watch([cat, view], () => {
  page.value = 0
  toTop()
})
watch(page, toTop)

function open(c: number, v: 'learn' | 'test' = 'learn') {
  cat.value = c
  view.value = v
}

const pool = computed(() => (cat.value === -1 ? all.map((_, i) => i) : cat.value === null ? [] : idsOf(cat.value)))

/** The word to its meaning, or the meaning to the word — chosen per showing. */
function build(i: number): Question {
  const w = all[i]!
  const toMeaning = Math.random() < 0.5
  const others = shuffle(pool.value.length >= 8 ? pool.value : all.map((_, j) => j)).filter((j) => j !== i)
  const value = (x: Word) => (toMeaning ? x.tr : rubyWord(x.w, x.r))
  const options = [value(w)]
  for (const j of others) {
    const v = value(all[j]!)
    if (!options.includes(v)) options.push(v)
    if (options.length === 4) break
  }
  return toMeaning
    ? { kind: 'Anlamı ne?', prompt: rubyWord(w.w, w.r), size: 'big', options, answer: 0 }
    : { kind: 'Hangi kelime?', prompt: w.tr, size: 'text', options, answer: 0 }
}
</script>

<template>
  <SiteLayout>
    <template v-if="cat === null">
      <section class="py-6 text-center">
        <p class="font-jp text-primary text-6xl leading-none" aria-hidden="true">松屋</p>
        <p class="text-ink-soft mt-3">{{ all.length }} kelime · {{ cats.length }} bölüm · önce öğren, sonra test</p>
      </section>
      <div class="mb-6 grid gap-3 sm:grid-cols-2">
        <BaseCard interactive as="button" class="text-start" @click="open(TALK)">
          <p class="font-bold">💬 Müşteriyle konuşma</p>
          <p class="text-ink-soft text-sm">{{ SCENES.length }} sahne: fiş alma, pilav boyu, numara çağırma, ekstra, özür, müdür talimatı</p>
        </BaseCard>
        <BaseCard interactive as="button" class="text-start" @click="open(SLIP)">
          <p class="font-bold">🧾 Fiş okuma</p>
          <p class="text-ink-soft text-sm">{{ SLIPS.length }} sipariş fişi: ürün, değişiklik, poşete girecek ekstralar</p>
        </BaseCard>
      </div>
      <h2 class="text-ink-soft mb-2 text-sm font-semibold">Kelimeler</h2>
      <div class="grid gap-3">
        <BaseCard v-for="(c, k) in cats" :key="k">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h2 class="font-bold">{{ c.title }}</h2>
            <span class="text-ink-soft text-sm">{{ idsOf(k).length }} kelime</span>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-2">
            <BaseButton variant="secondary" size="sm" @click="open(k)">学 {{ t.learn }}</BaseButton>
            <BaseButton size="sm" @click="open(k, 'test')">試 {{ t.test }}</BaseButton>
          </div>
        </BaseCard>
        <BaseButton variant="secondary" block @click="open(-1, 'test')">総 Genel test ({{ all.length }} kelime)</BaseButton>
      </div>
    </template>

    <!-- Dialogues: one scene per page -->
    <template v-else-if="cat === TALK">
      <StudyHeader title="💬 Müşteriyle konuşma" sub="店 = sen · 客 = müşteri · 長 = müdür" @back="cat = null" />
      <div v-for="(sc, k) in SCENES" v-show="page === k" :key="k" class="grid gap-4">
        <BaseCard>
          <JpText :text="sc.title" as="h2" class="text-xl font-bold" />
          <p class="text-ink-soft mt-1 text-[15px]">{{ sc.setting }}</p>
          <div class="mt-3 grid gap-3">
            <div v-for="(l, j) in sc.lines" :key="j" class="flex gap-3">
              <span
                class="jp mt-1.5 grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold"
                :class="l.who === '客' ? 'bg-muted' : 'bg-primary text-on-primary'"
                >{{ l.who }}</span
              >
              <div class="min-w-0">
                <JpText :text="l.jp" as="p" class="text-[1.25rem] leading-[2.2]" />
                <p class="text-ink-soft text-[15px]"><RevealText :text="l.tr" /></p>
              </div>
            </div>
          </div>
        </BaseCard>
        <BaseCard>
          <p class="mb-2 font-bold">💡 İpuçları</p>
          <ul class="grid gap-1.5 text-[15px]">
            <li v-for="(tip, j) in sc.tips" :key="j" class="border-primary border-s-4 ps-3" v-html="tip" />
          </ul>
        </BaseCard>
        <BaseCard>
          <p class="mb-2 font-bold">🗣️ Sen söyle</p>
          <p class="text-ink-soft mb-2 text-sm">Önce kendin Japonca söylemeyi dene, sonra bulanığa dokun.</p>
          <div v-for="(sy, j) in sc.say" :key="j" class="bg-muted rounded-control mb-2 px-3 py-2">
            <p class="text-[15px] font-semibold">{{ sy[0] }}</p>
            <p class="jp text-xl leading-[2.2]" lang="ja"><RevealText :text="sy[1]" /></p>
          </div>
        </BaseCard>
      </div>
      <PagerNav v-model="page" :count="SCENES.length" />
    </template>

    <!-- Order slips: one per page -->
    <template v-else-if="cat === SLIP">
      <StudyHeader title="🧾 Fiş okuma" sub="Fişi oku, soruları cevapla, sonra bulanığa dokun" @back="cat = null" />
      <div v-for="(sl, k) in SLIPS" v-show="page === k" :key="k" class="grid gap-4">
        <BaseCard>
          <JpText :text="sl.title" as="h2" class="text-xl font-bold" />
          <p class="text-ink-soft mt-1 text-[15px]">{{ sl.setting }}</p>
          <div class="bg-surface border-hair rounded-control mt-3 border-2 border-dashed px-4 py-3">
            <JpText v-for="(ln, j) in sl.lines" :key="j" :text="ln" as="p" class="text-lg leading-[2.1] whitespace-pre" />
          </div>
        </BaseCard>
        <BaseCard>
          <p class="mb-2 font-bold">❓ Sorular</p>
          <div v-for="(q, j) in sl.questions" :key="j" class="bg-muted rounded-control mb-2 px-3 py-2">
            <p class="text-[15px] font-semibold">{{ q[0] }}</p>
            <p class="text-[17px]">→ <RevealText :text="q[1]" /></p>
          </div>
        </BaseCard>
      </div>
      <PagerNav v-model="page" :count="SLIPS.length" />
    </template>

    <template v-else>
      <StudyHeader
        v-if="cat >= 0"
        v-model="view"
        :title="cats[cat]!.title"
        :tabs="tabs"
        @back="cat = null"
      />
      <StudyHeader v-else title="Genel test" @back="cat = null" />

      <div v-if="cat >= 0 && view === 'learn'" class="grid gap-3">
        <p class="bg-muted rounded-control border-primary border-s-4 px-4 py-3 text-[15px]" v-html="cats[cat]!.note" />
        <BaseCard v-for="i in idsOf(cat)" :key="i" padding="sm">
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span class="jp min-w-32 text-2xl leading-[2.1]" lang="ja" v-html="rubyWord(all[i]!.w, all[i]!.r)" />
            <span class="min-w-0 flex-1">
              <span class="block font-semibold"><RevealText :text="all[i]!.tr" /></span>
              <span class="text-ink-soft block text-sm">{{ all[i]!.r }} · {{ all[i]!.romaji }}</span>
              <span v-if="all[i]!.note" class="text-ink-soft block text-sm" v-html="all[i]!.note" />
            </span>
          </div>
        </BaseCard>
        <BaseButton @click="view = 'test'">{{ t.test }} →</BaseButton>
      </div>

      <MasteryQuiz v-else :key="cat" :pool="pool" :build="build">
        <template #feedback="{ item }">
          <p class="mt-2">
            <span class="jp text-xl" lang="ja" v-html="rubyWord(all[item]!.w, all[item]!.r)" /> =
            <b>{{ all[item]!.tr }}</b>
            <span class="text-ink-soft text-sm"> ({{ all[item]!.romaji }})</span>
          </p>
        </template>
        <template #actions>
          <BaseButton v-if="cat >= 0 && cat < cats.length - 1" @click="open(cat + 1)">Sonraki bölüm →</BaseButton>
        </template>
      </MasteryQuiz>
    </template>
  </SiteLayout>
</template>
