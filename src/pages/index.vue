<script setup lang="ts">
import { RouterLink } from 'vue-router'

import SiteLayout from '@/components/SiteLayout.vue'
import { usePage } from '@/lib/page'
import { PAGES } from '@/site'

const { pick } = usePage('/')

const LEAD = ['Bir bölüm seç', 'Choose a section', '选择一个部分']
</script>

<template>
  <SiteLayout :furigana-switch="false" :hide-switch="false">
    <section class="py-6 text-center">
      <p class="font-jp text-primary text-6xl leading-none" aria-hidden="true">日本語</p>
      <h1 class="mt-4 text-3xl font-bold">Nihongo</h1>
      <p class="text-ink-soft mt-1">{{ pick(LEAD) }}</p>
    </section>
    <nav aria-label="Nihongo">
      <ul class="grid gap-3">
        <li v-for="p in PAGES" :key="p.path">
          <RouterLink
            :to="p.path"
            class="surface focus-ring rounded-card group flex items-center gap-4 p-4 transition-transform hover:-translate-y-0.5"
          >
            <span
              :data-palette="p.palette"
              class="bg-muted text-primary font-jp rounded-control grid size-12 shrink-0 place-items-center text-2xl"
              aria-hidden="true"
              >{{ p.icon }}</span
            >
            <span class="min-w-0 flex-1">
              <span class="block font-bold">{{ p.title }}</span>
              <span class="text-ink-soft block text-sm">{{ p.description }}</span>
            </span>
            <span class="text-ink-soft group-hover:text-primary" aria-hidden="true">→</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </SiteLayout>
</template>
