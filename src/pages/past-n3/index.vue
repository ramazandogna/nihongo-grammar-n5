<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Check, Headphones, Target } from 'lucide-vue-next'
import { BaseButton, BaseCard, SegmentedControl } from 'rei-kit'

import JlptExam from '@/components/JlptExam.vue'
import JpText from '@/components/JpText.vue'
import MasteryQuiz, { type Question } from '@/components/MasteryQuiz.vue'
import PagerNav from '@/components/PagerNav.vue'
import RevealText from '@/components/RevealText.vue'
import SiteLayout from '@/components/SiteLayout.vue'
import StudyHeader from '@/components/StudyHeader.vue'
import { usePage } from '@/lib/page'
import { notation } from '@/lib/ruby'
import { toTop } from '@/lib/scroll'
import type { Exam, ExamGroup, ExamQuestion, ExamSection } from './types'

/**
 * Past N3 papers, one question at a time, each with its reasoning.
 *
 * The papers are copyrighted and gitignored, so both the data and the audio
 * are picked up only if they exist on this machine; the public build shows
 * the page with a notice instead.
 */
const examFiles = import.meta.glob<{ default: Exam }>('/assets/past-n3/app/????-??.ts', { eager: true })
// Only the chosen papers' audio, copied beside their data — globbing the whole
// archive would put every year's MP3 into the build.
const audioFiles = import.meta.glob<string>('/assets/past-n3/app/audio/*.mp3', {
  eager: true,
  query: '?url',
  import: 'default',
})
const exams = Object.values(examFiles)
  .map((m) => m.default)
  .sort((a, b) => b.id.localeCompare(a.id))
const audioOf = (e: Exam) => (e.audio ? audioFiles[`/assets/past-n3/app/audio/${e.audio}`] : undefined)

usePage('/past-n3/')

const PARTS = ['文字・語彙', '文法', '読解', '聴解'] as const
type Part = (typeof PARTS)[number]
const PART_TR: Record<Part, string> = { '文字・語彙': 'Kelime', 文法: 'Gramer', 読解: 'Okuma', 聴解: 'Dinleme' }

const exam = ref<Exam | null>(null)
const part = ref<Part>('文字・語彙')
const section = ref<ExamSection | null>(null)
const mode = ref<'learn' | 'test' | 'exam'>('learn')
const page = ref(0)
/** Picks per question number, per section: `${section.id}:${no}`. */
const picks = ref<Record<string, number>>({})
const shown = ref<Record<string, boolean>>({})
const scriptOpen = ref<Record<string, boolean>>({})

watch([exam, part, section, mode], () => {
  page.value = 0
  toTop()
})
watch(page, toTop)

const sections = computed(() => exam.value?.sections.filter((s) => s.part === part.value) ?? [])
const partTabs = PARTS.map((p) => ({ value: p, label: PART_TR[p] }))
const modeTabs = computed(() => [
  { value: 'learn' as const, label: 'Öğren' },
  ...(testable.value ? [{ value: 'test' as const, label: 'Test' }] : []),
  { value: 'exam' as const, label: 'Sınav' },
])
/**
 * A rough time for a sitting: about the real paper's pace per question.
 * Listening has none — the recording sets the pace.
 */
const examMinutes = computed(() => {
  const s = section.value
  if (!s || s.part === '聴解') return null
  const n = s.groups.reduce((m, g) => m + g.items.length, 0)
  const per = s.part === '読解' ? 3 : s.part === '文法' ? 1.5 : 1
  return Math.max(5, Math.ceil(n * per))
})

const key = (q: ExamQuestion) => `${section.value!.id}:${q.no}`
function pick(q: ExamQuestion, i: number) {
  if (picks.value[key(q)] === undefined) picks.value[key(q)] = i
}
const solved = (q: ExamQuestion) => picks.value[key(q)] !== undefined || !!shown.value[key(q)]
/**
 * One focus per page: a passage or a listening script with its questions, or
 * — for the vocabulary and grammar sets, which have neither — one question.
 */
const pages = computed<{ g: ExamGroup; items: ExamQuestion[] }[]>(() =>
  (section.value?.groups ?? []).flatMap((g) =>
    g.passage || g.script ? [{ g, items: g.items }] : g.items.map((q) => ({ g, items: [q] })),
  ),
)
/** The lines that decide the answers are marked; they stay plain until every question on the page is done. */
const groupSolved = computed(() => {
  const pg = pages.value[page.value]
  return !!pg && pg.items.every(solved)
})
/** The engine drills single questions; reading and listening need their text, so they stay in learn mode. */
const testable = computed(() => !!section.value && section.value.groups.every((g) => !g.passage && !g.script))
const show = (s: string) => (groupSolved.value ? s : s.replace(/\[\[|\]\]/g, ''))
const sectionScore = (s: ExamSection) => {
  const items = s.groups.flatMap((g) => g.items)
  return `${items.filter((q) => picks.value[`${s.id}:${q.no}`] === q.a).length}/${items.length}`
}

/** The section's player; each conversation and question can jump it to where it starts. */
const player = ref<HTMLAudioElement | null>(null)
function playFrom(t: number) {
  const a = player.value
  if (!a) return
  a.currentTime = t
  void a.play()
}
const clock = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`

/* Test mode: the section's questions through the shared engine. */
const testItems = computed(() => section.value?.groups.flatMap((g) => g.items) ?? [])
const testPool = computed(() => testItems.value.map((_, i) => i))
function build(i: number): Question {
  const q = testItems.value[i]!
  return { kind: `${section.value!.title} · ${q.no}`, prompt: q.q, options: q.opts, answer: q.a, explain: q.why }
}
/** Back to the exam's section list. */
function closeSection() {
  section.value = null
  mode.value = 'learn'
}
</script>

<template>
  <SiteLayout>
    <!-- No data on this machine -->
    <BaseCard v-if="!exams.length" class="my-8 text-center">
      <p class="font-jp text-primary text-5xl" aria-hidden="true">過去問</p>
      <p class="mt-3 font-bold">Sınav verisi bu cihazda yok.</p>
      <p class="text-ink-soft mt-1 text-[15px]">
        Geçmiş sınavlar telif hakkı nedeniyle depoya konmuyor. Verileri <code>assets/past-n3/app/</code> klasörüne
        koyunca burada açılır.
      </p>
    </BaseCard>

    <!-- Exam list -->
    <template v-else-if="!exam">
      <section class="py-6 text-center">
        <p class="font-jp text-primary text-6xl leading-none" aria-hidden="true">過去問</p>
        <p class="text-ink-soft mt-3">Çıkmış N3 sınavları · her soru çözümüyle · dinleme sesli</p>
      </section>
      <div class="grid gap-3">
        <BaseCard v-for="e in exams" :key="e.id" interactive as="button" class="text-start" @click="exam = e">
          <p class="jp text-lg font-bold">{{ e.title }}</p>
          <p class="text-ink-soft text-sm">
            {{ e.sections.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.items.length, 0), 0) }} soru ·
            <template v-if="audioOf(e)"
              ><Headphones
                class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle"
                aria-hidden="true"
              />ses var</template
            ><template v-else>ses yok</template>
          </p>
        </BaseCard>
      </div>
    </template>

    <!-- One exam: parts and their sections -->
    <template v-else-if="!section">
      <StudyHeader :title="exam.title" sub="Bir bölüm seç" @back="exam = null" />
      <SegmentedControl v-model="part" :options="partTabs" class="mb-4" />
      <BaseCard v-if="part === '聴解' && audioOf(exam)" class="mb-4">
        <p class="mb-2 text-sm font-semibold">
          <Headphones
            class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle"
            aria-hidden="true"
          />Dinleme sesi (bütün bölüm)
        </p>
        <audio :src="audioOf(exam)" controls preload="none" class="w-full" />
      </BaseCard>
      <div class="grid gap-3">
        <BaseCard v-for="s in sections" :key="s.id" interactive as="button" class="text-start" @click="section = s">
          <p class="jp font-bold">{{ s.title }}</p>
          <p class="text-ink-soft text-sm">
            {{ s.groups.reduce((m, g) => m + g.items.length, 0) }} soru · doğru {{ sectionScore(s) }}
          </p>
        </BaseCard>
      </div>
    </template>

    <!-- One section -->
    <template v-else>
      <StudyHeader v-model="mode" :title="section.title" :sub="exam.title" :tabs="modeTabs" @back="closeSection" />

      <JlptExam
        v-if="mode === 'exam'"
        :key="`${exam.id}:${section.id}`"
        :exam-id="exam.id"
        :section="section"
        :audio="audioOf(exam)"
        :minutes="examMinutes"
      />
      <template v-else-if="mode === 'learn' || !testable">
        <BaseCard v-if="page === 0" class="mb-4">
          <p class="mb-1 text-sm font-semibold">
            <Target class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle" aria-hidden="true" />Bu soru
            tipi nasıl çözülür?
          </p>
          <p class="text-[15px]">{{ section.how }}</p>
        </BaseCard>
        <BaseCard v-if="section.part === '聴解' && audioOf(exam)" class="mb-4">
          <p class="text-ink-soft mb-1 text-sm">
            <Headphones class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle" aria-hidden="true" />Ses
            · her sorunun “▶” düğmesi sesi o soruya götürür
          </p>
          <audio ref="player" :src="audioOf(exam)" controls preload="metadata" class="w-full" />
        </BaseCard>

        <div v-for="({ g, items }, gi) in pages" v-show="page === gi" :key="gi" class="grid gap-4">
          <!-- Reading passage -->
          <BaseCard v-if="g.passage">
            <JpText v-if="g.title" :text="g.title" as="h2" class="mb-2 text-xl font-bold" />
            <div v-for="(p, pi) in g.passage" :key="pi" class="mb-3">
              <JpText :text="show(p.jp)" as="p" class="text-[1.2rem] leading-[2.2]" />
              <p class="text-ink-soft text-[15px]"><RevealText :text="p.tr" /></p>
            </div>
          </BaseCard>

          <!-- Listening script: hidden until asked for, so the ear goes first -->
          <BaseCard v-if="g.script">
            <div class="flex items-center justify-between gap-3">
              <JpText :text="g.title ?? 'Dinleme'" as="h2" class="text-lg font-bold" />
              <BaseButton
                v-if="g.start !== undefined && audioOf(exam)"
                size="sm"
                class="ms-auto"
                @click="playFrom(g.start)"
              >
                ▶ {{ clock(g.start) }}
              </BaseButton>
              <BaseButton
                size="sm"
                variant="secondary"
                @click="scriptOpen[`${section.id}:${gi}`] = !scriptOpen[`${section.id}:${gi}`]"
              >
                {{ scriptOpen[`${section.id}:${gi}`] ? 'Metni gizle' : 'Metni göster' }}
              </BaseButton>
            </div>
            <p v-if="!scriptOpen[`${section.id}:${gi}`]" class="text-ink-soft mt-2 text-sm">
              Önce sesi dinleyip cevapla; anlamadıysan metni aç.
            </p>
            <div v-else class="mt-3 grid gap-3">
              <div v-for="(l, li) in g.script" :key="li" class="flex gap-3">
                <span v-if="l.who" class="jp text-primary w-10 shrink-0 pt-1.5 font-bold">{{ l.who }}</span>
                <div class="min-w-0">
                  <JpText :text="show(l.jp)" as="p" class="text-[1.15rem] leading-[2.2]" />
                  <p class="text-ink-soft text-[15px]"><RevealText :text="l.tr" /></p>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Questions -->
          <BaseCard v-for="q in items" :key="q.no">
            <div class="flex items-center justify-between">
              <p class="text-ink-soft text-sm">Soru {{ q.no }}</p>
              <BaseButton v-if="q.start !== undefined && audioOf(exam)" size="sm" @click="playFrom(q.start)">
                ▶ Bu sorudan dinle · {{ clock(q.start) }}
              </BaseButton>
            </div>
            <JpText :text="q.q" as="p" class="text-[1.25rem] leading-[2.2]" />
            <div class="mt-3 grid gap-2">
              <button
                v-for="(o, oi) in q.opts"
                :key="oi"
                type="button"
                class="control focus-ring rounded-control press jp px-3 py-2 text-start text-lg leading-loose [--control-border-width:2px]"
                :class="[
                  solved(q) && oi === q.a ? 'bg-positive/15 [--surface-border-color:var(--color-positive)]' : '',
                  picks[key(q)] === oi && oi !== q.a
                    ? 'bg-negative/15 [--surface-border-color:var(--color-negative)]'
                    : '',
                ]"
                :disabled="picks[key(q)] !== undefined"
                :aria-pressed="picks[key(q)] === oi"
                @click="pick(q, oi)"
              >
                <span class="text-ink-soft me-2 text-sm">{{ oi + 1 }}</span><span v-html="notation(o)" />
              </button>
            </div>
            <BaseButton v-if="!solved(q)" variant="ghost" size="sm" class="mt-2" @click="shown[key(q)] = true">
              Bilemedim, çözümü göster
            </BaseButton>
            <div
              v-else
              class="bg-surface rounded-control mt-3 border-s-4 px-3 py-2 text-[15px]"
              :class="picks[key(q)] === q.a ? 'border-positive' : 'border-negative'"
            >
              <p class="font-bold">
                <template v-if="picks[key(q)] === q.a"
                  ><Check
                    class="me-1 inline size-[1.1em] shrink-0 -translate-y-px align-middle"
                    aria-hidden="true"
                  />Doğru!</template
                ><template v-else>Doğrusu {{ q.a + 1 }}</template>
              </p>
              <p v-html="notation(q.why)" />
            </div>
          </BaseCard>
        </div>
        <PagerNav v-if="pages.length > 1" v-model="page" :count="pages.length" />
      </template>

      <MasteryQuiz
        v-else
        :key="section.id"
        :pool="testPool"
        :build="build"
        :storage-key="`past-n3:${exam.id}:${section.id}`"
        :label="(i: number) => `${testItems[i]!.no}. ${testItems[i]!.q}`"
      />
    </template>
  </SiteLayout>
</template>
