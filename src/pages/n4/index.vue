<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'

import SiteLayout from '@/components/SiteLayout.vue'
import GuidePage from '@/components/guide/GuidePage.vue'
import type { GuideData } from '@/components/guide/types'
import { usePage } from '@/lib/page'
import data from './data.json'

usePage('/n4/')
</script>

<template>
  <SiteLayout>
    <GuidePage :data="data as GuideData" />

    <!-- Lessons 13–15 are part of the same N4 source; they keep their own
         page (and their saved tests, `1315:test*`) at /n4/13-15/. -->
    <section aria-labelledby="n4-1315" class="mt-8">
      <h2 id="n4-1315" class="text-ink-soft mb-2 px-1 text-xs font-bold tracking-wider uppercase">
        Ders kitabı · 13–15. üniteler
      </h2>
      <RouterLink
        to="/n4/13-15/"
        class="surface rounded-card focus-ring press lift group flex items-center gap-3 p-4"
      >
        <span
          class="bg-primary/10 text-primary font-jp rounded-control grid size-11 shrink-0 place-items-center text-xl"
          aria-hidden="true"
          >課</span
        >
        <span class="min-w-0 flex-1">
          <span class="block font-bold">N4 Gramer · 13・14・15課</span>
          <span class="text-ink-soft block text-sm">Ünite gramer konuları, diyaloglar ve iki test</span>
        </span>
        <ChevronRight class="text-ink-soft group-hover:text-primary size-5 shrink-0" aria-hidden="true" />
      </RouterLink>
    </section>
  </SiteLayout>
</template>
