<script setup lang="ts">
import { requestSync } from '@/lib/sync'
import { computed, onMounted, ref, watch } from 'vue'
import { CircleHelp, Lightbulb, MessageCircle, MessagesSquare, ReceiptText } from 'lucide-vue-next'
import { BaseButton, BaseCard, CircularProgress } from 'rei-kit'

import StampToggle from '@/components/StampToggle.vue'
import { accuracy, loadHistory } from '@/lib/quiz-store'
import { band } from '@/lib/radikal-sets'

import JpText from '@/components/JpText.vue'
import MasteryQuiz, { type Question } from '@/components/MasteryQuiz.vue'
import PagerNav from '@/components/PagerNav.vue'
import RevealText from '@/components/RevealText.vue'
import SiteLayout from '@/components/SiteLayout.vue'
import StudyHeader from '@/components/StudyHeader.vue'
import { usePage } from '@/lib/page'
import { rubyWord } from '@/lib/ruby'
import { toTop } from '@/lib/scroll'
import { jlptQuestion, KIND_LABEL, type Vocab } from '@/lib/jlpt'
import { similarKanji } from '@/lib/kanji-similar'
import { shuffle } from '@/lib/shuffle'
import data from './data.json'
import { MENU_CATEGORIES, ONLINE_SLIPS } from './menu'
import { EXTRA_CATEGORIES, SCENES, SLIPS as BASE_SLIPS } from './work'

const SLIPS = [...ONLINE_SLIPS, ...BASE_SLIPS]

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
const source = [...MENU_CATEGORIES, ...data, ...EXTRA_CATEGORIES]
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

/* ── Learned words and test scores, the same way as the radicals page ── */
const LEARNED = 'nihongo-matsuya:learned'
const learned = ref(new Set<string>())
const scores = ref(new Map<number, number>())
function readScores() {
  const m = new Map<number, number>()
  for (let k = -1; k < cats.length; k++) {
    const h = loadHistory(`matsuya:${k}`)
    if (h.length) m.set(k, accuracy(h[h.length - 1]!))
  }
  scores.value = m
}
onMounted(() => {
  try {
    const raw = localStorage.getItem(LEARNED)
    if (raw) learned.value = new Set((JSON.parse(raw) as unknown[]).filter((x): x is string => typeof x === 'string'))
  } catch {
    // No storage: start empty.
  }
  readScores()
})
watch(cat, (c) => {
  if (c === null) readScores()
})
const wordKey = (w: Word) => `${w.w}|${w.r}`
function toggleLearned(i: number) {
  const k = wordKey(all[i]!)
  const s = new Set(learned.value)
  if (s.has(k)) s.delete(k)
  else s.add(k)
  learned.value = s
  try {
    localStorage.setItem(LEARNED, JSON.stringify([...s]))
    requestSync()
  } catch {
    // No storage: kept for this visit only.
  }
}
const learnedIn = (c: number) => idsOf(c).filter((i) => learned.value.has(wordKey(all[i]!))).length
const tone = (p: number) => {
  const b = band(p)
  return b === 'fail' ? 'var(--color-negative)' : b === 'pass' ? 'var(--color-warning)' : 'var(--color-positive)'
}
const badge = (p: number) =>
  band(p) === 'strong'
    ? { color: 'var(--color-canvas)', background: tone(p) }
    : { color: tone(p), background: `color-mix(in oklab, ${tone(p)} 14%, transparent)` }

const pool = computed(() => (cat.value === -1 ? all.map((_, i) => i) : cat.value === null ? [] : idsOf(cat.value)))

const allVocab: Vocab[] = all.map((w) => ({ word: w.w, reading: w.r, meaning: w.tr }))
const similar = (c: string) =>
  similarKanji(c, [...new Set(all.flatMap((w) => [...w.w]).filter((x) => /[\u3400-\u9fff]/.test(x)))].slice(0, 40))

/**
 * JLPT-style where the word allows it (reading / spelling with look-alike
 * kanji); otherwise the meaning, or — for whole phrases — which phrase fits
 * the situation, the way the counter actually asks it.
 */
function build(i: number): Question {
  const w = all[i]!
  const sameCat = all.filter((x) => x.cat === w.cat)
  if ([...w.w].length > 8 && Math.random() < 0.5) {
    const options = [
      rubyWord(w.w, w.r),
      ...shuffle(sameCat.filter((x) => x !== w))
        .slice(0, 3)
        .map((x) => rubyWord(x.w, x.r)),
    ]
    return { kind: 'Bu durumda ne dersin?', prompt: w.tr, size: 'text', options, answer: 0 }
  }
  const q = jlptQuestion(
    { word: w.w, reading: w.r, meaning: w.tr },
    sameCat.length >= 6 ? sameCat.map((x) => ({ word: x.w, reading: x.r, meaning: x.tr })) : allVocab,
    similar,
  )
  return q.kind === KIND_LABEL.imi ? { ...q, prompt: rubyWord(w.w, w.r) } : q
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
          <p class="font-bold">
            <MessageCircle
              class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle"
              aria-hidden="true"
            />Müşteriyle konuşma
          </p>
          <p class="text-ink-soft text-sm">
            {{ SCENES.length }} sahne: fiş alma, pilav boyu, numara çağırma, ekstra, özür, müdür talimatı
          </p>
        </BaseCard>
        <BaseCard interactive as="button" class="text-start" @click="open(SLIP)">
          <p class="font-bold">
            <ReceiptText class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle" aria-hidden="true" />Fiş
            okuma
          </p>
          <p class="text-ink-soft text-sm">
            {{ SLIPS.length }} sipariş fişi: ürün, değişiklik, poşete girecek ekstralar
          </p>
        </BaseCard>
      </div>
      <h2 class="text-ink-soft mb-2 text-sm font-semibold">Kelimeler</h2>
      <div class="grid gap-3">
        <BaseCard v-for="(c, k) in cats" :key="k">
          <div class="flex items-center gap-3">
            <CircularProgress
              size="md"
              tone="positive"
              class="shrink-0"
              :value="learnedIn(k)"
              :max="idsOf(k).length"
              :label="`${learnedIn(k)}/${idsOf(k).length} öğrenildi`"
              ><span class="text-xs font-bold tabular-nums">{{ learnedIn(k) }}</span></CircularProgress
            >
            <div class="min-w-0 flex-1">
              <h2 class="font-bold">{{ c.title }}</h2>
              <span class="text-ink-soft text-sm">{{ learnedIn(k) }}/{{ idsOf(k).length }} kelime öğrenildi</span>
            </div>
            <span
              v-if="scores.has(k)"
              class="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums"
              :style="badge(scores.get(k)!)"
              >Test %{{ scores.get(k) }}<template v-if="scores.get(k)! < 75"> · kaldı</template></span
            >
          </div>
          <div class="mt-3 grid grid-cols-2 gap-2">
            <BaseButton variant="secondary" size="sm" @click="open(k)">学 {{ t.learn }}</BaseButton>
            <BaseButton size="sm" @click="open(k, 'test')">試 {{ t.test }}</BaseButton>
          </div>
        </BaseCard>
        <BaseButton variant="secondary" block @click="open(-1, 'test')"
          >総 Genel test ({{ all.length }} kelime)</BaseButton
        >
      </div>
    </template>

    <!-- Dialogues: one scene per page -->
    <template v-else-if="cat === TALK">
      <StudyHeader title="Müşteriyle konuşma" sub="店 = sen · 客 = müşteri · 長 = müdür" @back="cat = null" />
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
          <p class="mb-2 font-bold">
            <Lightbulb
              class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle"
              aria-hidden="true"
            />İpuçları
          </p>
          <ul class="grid gap-1.5 text-[15px]">
            <li v-for="(tip, j) in sc.tips" :key="j" class="border-primary border-s-4 ps-3" v-html="tip" />
          </ul>
        </BaseCard>
        <BaseCard>
          <p class="mb-2 font-bold">
            <MessagesSquare
              class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle"
              aria-hidden="true"
            />Sen söyle
          </p>
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
      <StudyHeader title="Fiş okuma" sub="Fişi oku, soruları cevapla, sonra bulanığa dokun" @back="cat = null" />
      <div v-for="(sl, k) in SLIPS" v-show="page === k" :key="k" class="grid gap-4">
        <BaseCard>
          <JpText :text="sl.title" as="h2" class="text-xl font-bold" />
          <p class="text-ink-soft mt-1 text-[15px]">{{ sl.setting }}</p>
          <div class="bg-surface border-hair rounded-control mt-3 border-2 border-dashed px-4 py-3">
            <JpText
              v-for="(ln, j) in sl.lines"
              :key="j"
              :text="ln"
              as="p"
              class="text-lg leading-[2.1] whitespace-pre"
            />
          </div>
        </BaseCard>
        <BaseCard>
          <p class="mb-2 font-bold">
            <CircleHelp
              class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle"
              aria-hidden="true"
            />Sorular
          </p>
          <div v-for="(q, j) in sl.questions" :key="j" class="bg-muted rounded-control mb-2 px-3 py-2">
            <p class="text-[15px] font-semibold">{{ q[0] }}</p>
            <p class="text-[17px]">→ <RevealText :text="q[1]" /></p>
          </div>
        </BaseCard>
      </div>
      <PagerNav v-model="page" :count="SLIPS.length" />
    </template>

    <template v-else>
      <StudyHeader v-if="cat >= 0" v-model="view" :title="cats[cat]!.title" :tabs="tabs" @back="cat = null" />
      <StudyHeader v-else title="Genel test" @back="cat = null" />

      <div v-if="cat >= 0 && view === 'learn'" class="grid gap-3">
        <p class="bg-muted rounded-control border-primary border-s-4 px-4 py-3 text-[15px]" v-html="cats[cat]!.note" />
        <BaseCard
          v-for="i in idsOf(cat)"
          :key="i"
          padding="sm"
          class="kanji-card"
          :class="learned.has(wordKey(all[i]!)) ? 'kanji-learned' : ''"
        >
          <div class="flex items-start gap-3">
            <div class="grid min-w-0 flex-1 gap-0.5">
              <span class="jp text-2xl leading-[2.1]" lang="ja" v-html="rubyWord(all[i]!.w, all[i]!.r)" />
              <span class="min-w-0 flex-1">
                <span class="block font-semibold"><RevealText :text="all[i]!.tr" /></span>
                <span class="text-ink-soft block text-sm">{{ all[i]!.r }} · {{ all[i]!.romaji }}</span>
                <span v-if="all[i]!.note" class="text-ink-soft block text-sm" v-html="all[i]!.note" />
              </span>
            </div>
            <StampToggle
              class="shrink-0"
              layout="stack"
              size="sm"
              :checked="learned.has(wordKey(all[i]!))"
              label="öğrendim"
              @toggle="toggleLearned(i)"
            />
          </div>
        </BaseCard>
        <BaseButton @click="view = 'test'"
          >{{ t.test }} →<template v-if="scores.has(cat)"> · son %{{ scores.get(cat) }}</template></BaseButton
        >
      </div>

      <MasteryQuiz
        v-else
        :key="cat"
        :pool="pool"
        :build="build"
        :storage-key="`matsuya:${cat}`"
        :label="(i: number) => `${rubyWord(all[i]!.w, all[i]!.r)} · ${all[i]!.tr}`"
      >
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
