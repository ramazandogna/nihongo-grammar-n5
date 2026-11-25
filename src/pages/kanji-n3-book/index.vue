<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BaseCard } from 'rei-kit'

import JpText from '@/components/JpText.vue'
import ListeningLesson from '@/components/ListeningLesson.vue'
import ReadingLesson from '@/components/ReadingLesson.vue'
import SiteLayout from '@/components/SiteLayout.vue'
import StudyHeader from '@/components/StudyHeader.vue'
import { usePage } from '@/lib/page'
import { toTop } from '@/lib/scroll'
import { LISTENING } from './listening'
import { READING, READING_HOW } from './reading'

/**
 * N3 reading (読解 問題4・5) and listening (聴解) from the N3 Kanji Book.
 *
 * The book's kanji/vocabulary questions now live in Radikaller, so this page
 * keeps only its reading and listening parts. The route stays
 * `/kanji-n3-book/` so saved progress (`kanji-n3:*`) is untouched.
 */
usePage('/kanji-n3-book/')

/** Which listening part is open (聴解 問題1 / 問題2), if any. */
const listen = ref<number | null>(null)
/** Which reading part is open (問題4 / 問題5), if any. */
const readPart = ref<4 | 5 | null>(null)
const readHow = () => (readPart.value ? READING_HOW[readPart.value] : undefined)
const readGroups = computed(() => READING.filter((g) => g.mondai === readPart.value))
watch([listen, readPart], toTop)

function home() {
  listen.value = null
  readPart.value = null
}
</script>

<template>
  <SiteLayout>
    <!-- Part list -->
    <template v-if="listen === null && readPart === null">
      <section class="py-6 text-center">
        <p class="font-jp text-primary text-6xl leading-none" aria-hidden="true">読解</p>
        <h1 class="mt-3 text-2xl font-bold">N3 Okuma · Dinleme</h1>
        <p class="text-ink-soft mt-1">Okuma metinleri (問題4・5) ve dinleme dersleri · adım adım</p>
      </section>

      <h2 class="text-ink-soft mb-2 text-sm font-semibold">読解 · Okuma</h2>
      <div class="grid gap-3">
        <BaseCard
          v-for="m in [4, 5] as const"
          :key="m"
          interactive
          as="button"
          class="text-start"
          @click="readPart = m"
        >
          <p class="font-bold">読 問題{{ m }} · {{ m === 4 ? 'Kısa metinler' : 'Orta metinler' }}</p>
          <p class="text-ink-soft text-sm">
            {{ READING.filter((g) => g.mondai === m).length }} metin ·
            {{ READING.filter((g) => g.mondai === m).reduce((n, g) => n + g.items.length, 0) }} soru
          </p>
          <p class="text-primary mt-2 text-sm font-semibold">Oku, cevapla, nedenini gör →</p>
        </BaseCard>
      </div>

      <h2 class="text-ink-soft mt-8 mb-2 text-sm font-semibold">聴解 · Dinleme</h2>
      <div class="grid gap-3">
        <BaseCard
          v-for="(lp, k) in LISTENING"
          :key="lp.id"
          interactive
          as="button"
          class="text-start"
          @click="listen = k"
        >
          <p class="font-bold">聴 {{ lp.title }}</p>
          <JpText :text="lp.name" class="text-ink-soft text-sm" />
          <p class="text-primary mt-2 text-sm font-semibold">{{ lp.items.length }} soru · anlatımlı, adım adım →</p>
        </BaseCard>
      </div>
    </template>

    <!-- Reading -->
    <template v-else-if="readPart !== null">
      <StudyHeader
        :title="'読解 問題' + readPart"
        :sub="readPart === 4 ? 'Kısa metinler' : 'Orta metinler'"
        @back="home"
      />
      <ReadingLesson :groups="readGroups" :how="readHow" />
    </template>

    <!-- Listening -->
    <template v-else-if="listen !== null">
      <StudyHeader :title="LISTENING[listen]!.title" :sub="'問題' + (listen + 1)" @back="home" />
      <ListeningLesson :part="LISTENING[listen]!" />
    </template>
  </SiteLayout>
</template>
