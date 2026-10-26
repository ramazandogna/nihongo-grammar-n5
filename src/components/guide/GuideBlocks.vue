<script setup lang="ts">
import ExampleSentence from '../ExampleSentence.vue'
import type { Block } from './types'

defineOptions({ name: 'GuideBlocks' })
defineProps<{ blocks: Block[] }>()

/** The old pages' five box colours, as the kit's roles. */
const TONE: Record<string, string> = {
  base: 'border-primary',
  gold: 'border-warning',
  orange: 'border-negative',
  sky: 'border-accent',
  matcha: 'border-positive',
  purple: 'border-accent',
}
</script>

<template>
  <template v-for="(b, i) in blocks" :key="i">
    <div v-if="b.t === 'header'" class="mb-4 flex items-start gap-3">
      <span class="bg-muted rounded-control grid size-11 shrink-0 place-items-center text-2xl" aria-hidden="true">{{
        b.icon
      }}</span>
      <div class="min-w-0">
        <h2 class="jp text-2xl leading-snug font-bold" v-html="b.title" />
        <p v-if="b.sub" class="text-ink-soft mt-1 text-[15px]" v-html="b.sub" />
      </div>
    </div>

    <div
      v-else-if="b.t === 'rule'"
      class="bg-muted rounded-control my-3 border-s-4 px-4 py-3 text-[17px] leading-[2.1]"
      :class="TONE[b.tone] ?? TONE.base"
      v-html="b.html"
    />

    <div v-else-if="b.t === 'example'" class="my-2.5">
      <ExampleSentence :jp="b.jp" :romaji="b.romaji" :meaning="b.tr" :tag="b.tag" />
    </div>

    <div v-else-if="b.t === 'card'" :id="b.id" class="surface rounded-card my-4 scroll-mt-36 p-4">
      <h3 v-if="b.title" class="mb-2 text-lg font-bold" v-html="b.title" />
      <GuideBlocks :blocks="b.blocks" />
    </div>

    <div v-else-if="b.t === 'daily'" class="border-positive rounded-card my-4 border-2 border-dashed p-4">
      <p v-if="b.label" class="text-ink-soft mb-1 text-sm font-semibold" v-html="b.label" />
      <GuideBlocks :blocks="b.blocks" />
    </div>

    <div v-else-if="b.t === 'cols'" class="grid gap-x-4 sm:grid-cols-2">
      <GuideBlocks :blocks="b.blocks" />
    </div>

    <div v-else-if="b.t === 'table'" class="my-3 overflow-x-auto" tabindex="0" v-html="b.html" />

    <h3 v-else-if="b.t === 'heading'" class="mt-6 mb-2 text-lg font-bold" v-html="b.html" />

    <div v-else class="my-3" v-html="b.html" />
  </template>
</template>
