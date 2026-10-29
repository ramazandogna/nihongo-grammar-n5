<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BaseCard } from 'rei-kit'

import { notation } from '@/lib/ruby'
import { toTop } from '@/lib/scroll'
import TextbookLesson from './TextbookLesson.vue'
import type { Lesson } from './types'

/** A course's list of lessons; picking one opens it with the shared template. */
const { lessons, hero } = defineProps<{ lessons: Lesson[]; hero: string; lead: string }>()
const open = ref<number | null>(null)
watch(open, toTop)
const lesson = computed(() => (open.value === null ? null : lessons[open.value]!))
</script>

<template>
  <template v-if="!lesson">
    <section class="py-6 text-center">
      <p class="font-jp text-primary text-5xl leading-none" aria-hidden="true">{{ hero }}</p>
      <p class="text-ink-soft mt-3">{{ lead }}</p>
    </section>
    <div class="grid gap-3">
      <BaseCard v-for="(l, i) in lessons" :key="l.id" interactive as="button" class="text-start" @click="open = i">
        <p class="jp text-lg font-bold" v-html="notation(l.title)" />
        <p class="text-ink-soft text-sm">{{ l.sub }}</p>
        <p class="text-primary mt-2 text-sm font-semibold">
          Okuma {{ l.readings.length }} · Gramer {{ l.grammar.length }} · {{ l.words.length }} kelime · Test
          {{ l.quiz.length }} →
        </p>
      </BaseCard>
    </div>
  </template>
  <TextbookLesson v-else :key="lesson.id" :lesson="lesson" @back="open = null" />
</template>
