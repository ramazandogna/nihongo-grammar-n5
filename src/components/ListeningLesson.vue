<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BaseBadge, BaseButton, BaseCard } from 'rei-kit'

import type { ListeningPart } from '@/pages/kanji-n3-book/listening'
import { notation } from '@/lib/ruby'
import { toTop } from '@/lib/scroll'
import JpText from './JpText.vue'
import PagerNav from './PagerNav.vue'
import RevealText from './RevealText.vue'

/**
 * A listening part taught as reading: how this question type works first,
 * then one question per page in the order the exam gives it — who is talking,
 * the question, what to listen for, the choices, the script — and only after
 * an answer is chosen, the lines that decide it and why.
 *
 * Nothing that gives the answer away is on screen before the pick: the
 * deciding lines are marked only afterwards, and translations sit behind the
 * shared blur.
 */
const { part } = defineProps<{ part: ListeningPart }>()

const page = ref(0)
const picks = ref<Record<number, number>>({})
const shown = ref<Record<number, boolean>>({})
watch(page, toTop)
watch(
  () => part.id,
  () => {
    page.value = 0
    picks.value = {}
    shown.value = {}
  },
)

const item = computed(() => (page.value > 0 ? part.items[page.value - 1]! : null))
const at = computed(() => page.value - 1)
const picked = computed(() => picks.value[at.value])
const solved = computed(() => picked.value !== undefined || shown.value[at.value] === true)
const score = computed(() => part.items.filter((it, i) => picks.value[i] === it.answer).length)

/** The deciding lines are marked with [[…]]; before an answer they read plain. */
const line = (s: string) => (solved.value ? s : s.replace(/\[\[|\]\]/g, ''))
const SPEAKER = { M: '男', F: '女' } as const
</script>

<template>
  <!-- How this question type works -->
  <div v-show="page === 0" class="grid gap-4">
    <BaseCard>
      <JpText :text="part.name" as="h2" class="text-2xl font-bold" />
      <p v-for="(p, i) in part.intro" :key="i" class="mt-3 text-[17px]" v-html="p" />
    </BaseCard>
    <BaseCard>
      <h3 class="mb-2 text-lg font-bold">🎯 Nasıl çözülür?</h3>
      <ol class="grid list-decimal gap-2 ps-5 text-[17px]">
        <li v-for="(s, i) in part.steps" :key="i" v-html="notation(s)" />
      </ol>
    </BaseCard>
    <BaseCard>
      <h3 class="mb-2 text-lg font-bold">🗣️ Sınavda hep duyacağın cümleler</h3>
      <ul class="grid gap-2">
        <li v-for="(p, i) in part.phrases" :key="i" class="bg-muted rounded-control px-3 py-2">
          <JpText :text="p[0]" as="p" class="text-xl leading-[2.2]" />
          <p class="text-[15px]">{{ p[1] }}</p>
        </li>
      </ul>
    </BaseCard>
    <p class="text-ink-soft text-center text-sm">
      {{ part.items.length }} soru · her soruda önce metni oku, sonra cevabı seç → çözüm açılır.
    </p>
  </div>

  <!-- One question -->
  <div v-if="item" class="grid gap-4">
    <BaseCard>
      <div class="flex items-center justify-between">
        <JpText :text="item.no" class="text-primary text-xl font-bold" />
        <span class="text-ink-soft text-sm">Doğru {{ score }} / {{ part.items.length }}</span>
      </div>
      <p class="text-ink-soft mt-2 text-sm font-semibold">Durum</p>
      <JpText :text="item.setup" as="p" class="text-xl leading-[2.2]" />
      <p class="text-[15px]"><RevealText :text="item.setupTr" /></p>
      <p class="text-ink-soft mt-3 text-sm font-semibold">Soru</p>
      <JpText :text="item.question" as="p" class="border-primary border-s-4 ps-3 text-[1.4rem] leading-[2.3]" />
      <p class="text-[15px]"><RevealText :text="item.questionTr" /></p>
      <p class="bg-muted rounded-control mt-3 px-3 py-2 text-[15px]">🎧 <b>Neye dikkat et:</b> {{ item.focus }}</p>
    </BaseCard>

    <BaseCard v-if="item.pictures">
      <p class="text-ink-soft mb-2 text-sm font-semibold">Resimler</p>
      <ul class="grid gap-1.5">
        <li v-for="p in item.pictures" :key="p.label" class="flex items-center gap-3">
          <span class="jp text-primary w-6 text-xl font-bold">{{ p.label }}</span>
          <JpText :text="p.jp" class="text-lg leading-[2.1]" />
          <span class="text-ink-soft text-sm"><RevealText :text="p.tr" /></span>
        </li>
      </ul>
    </BaseCard>

    <BaseCard>
      <p class="text-ink-soft mb-2 text-sm font-semibold">Şıklar (önce oku)</p>
      <ol class="grid gap-1.5">
        <li v-for="(o, i) in item.options" :key="i" class="flex items-baseline gap-3">
          <span class="text-ink-soft w-4 shrink-0">{{ i + 1 }}</span>
          <span>
            <JpText :text="o.jp" class="text-lg leading-[2.1]" />
            <span class="text-ink-soft block text-sm"><RevealText :text="o.tr" /></span>
          </span>
        </li>
      </ol>
    </BaseCard>

    <BaseCard>
      <p class="text-ink-soft mb-2 text-sm font-semibold">Metin — sesi duyduğunu düşünerek oku</p>
      <div class="grid gap-3">
        <div v-for="(l, j) in item.lines" :key="`${page}-${j}`" class="flex gap-3">
          <BaseBadge :tone="l[0] === 'M' ? 'primary' : 'warning'" class="jp mt-2 h-fit shrink-0">{{
            SPEAKER[l[0]]
          }}</BaseBadge>
          <div class="min-w-0">
            <JpText :text="line(l[1])" as="p" class="text-[1.3rem] leading-[2.2]" />
            <p class="text-ink-soft text-[15px]"><RevealText :text="l[2]" /></p>
          </div>
        </div>
      </div>
      <p class="border-hair mt-4 border-t pt-3 text-sm">
        <span class="text-ink-soft">Ve soru tekrar okunur:</span>
        <JpText :text="item.question" class="text-lg" />
      </p>
    </BaseCard>

    <BaseCard>
      <p class="mb-2 font-bold">Cevabın?</p>
      <div class="grid grid-cols-2 gap-2.5">
        <button
          v-for="(o, i) in item.options"
          :key="i"
          type="button"
          class="control focus-ring rounded-control jp px-3 py-2.5 text-start text-lg leading-loose [--control-border-width:2px]"
          :class="[
            solved && i === item.answer ? 'bg-positive/15 [--surface-border-color:var(--color-positive)]' : '',
            picked === i && i !== item.answer ? 'bg-negative/15 [--surface-border-color:var(--color-negative)]' : '',
          ]"
          :aria-pressed="picked === i"
          :disabled="picked !== undefined"
          @click="picks[at] = i"
        >
          <span class="text-ink-soft me-1 text-sm">{{ i + 1 }}</span>
          <span v-html="notation(o.jp)" />
        </button>
      </div>
      <BaseButton v-if="!solved" variant="ghost" size="sm" class="mt-3" @click="shown[at] = true">
        Bilemedim, çözümü göster
      </BaseButton>
    </BaseCard>

    <BaseCard v-if="solved" :class="picked === item.answer ? 'border-positive' : ''">
      <p class="text-lg font-bold">
        <template v-if="picked === item.answer">✔ Doğru! </template>
        <template v-else-if="picked !== undefined">✘ Doğrusu {{ item.answer + 1 }}: </template>
        <template v-else>Cevap {{ item.answer + 1 }}: </template>
        <JpText :text="item.options[item.answer]!.jp" />
      </p>
      <p class="text-ink-soft mb-2 text-sm">Metinde <mark>işaretli</mark> cümleler cevabı belirleyenler.</p>
      <ul class="grid gap-2 text-[17px]">
        <li v-for="(s, i) in item.solution" :key="i" class="border-primary border-s-4 ps-3" v-html="notation(s)" />
      </ul>
      <h3 class="mt-4 mb-2 font-bold">📒 Kelimeler</h3>
      <ul class="grid gap-1.5">
        <li v-for="w in item.words" :key="w[0]" class="bg-muted rounded-control flex flex-wrap items-center gap-x-3 px-3 py-1.5">
          <JpText :text="w[0]" class="min-w-28 text-lg leading-[2.1]" />
          <span class="text-[15px]">{{ w[1] }}</span>
        </li>
      </ul>
    </BaseCard>
  </div>

  <PagerNav v-model="page" :count="part.items.length + 1" :label="part.title" />
</template>
