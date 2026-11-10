<script setup lang="ts">
import { RouterLink } from 'vue-router'

import SiteLayout from '@/components/SiteLayout.vue'
import { usePage } from '@/lib/page'
import { LANG_FLAG, LANG_LABEL } from '@/lib/i18n'
import { ref } from 'vue'

import { GROUPS, PAGES, type Group, type SitePage } from '@/site'

const { pick } = usePage('/')

/** “Türkçe · English · 中文” for a card’s flags. */
const langNames = (p: SitePage, sep: string) => p.langs.map((x) => LANG_LABEL[x]).join(sep)

/** Open folder, remembered so coming back to the menu lands in the same place. */
const open = ref<Group | null>(null)
try {
  open.value = (sessionStorage.getItem('nihongo-folder') as Group | null) ?? null
} catch {}
function toggle(g: Group) {
  open.value = open.value === g ? null : g
  try {
    sessionStorage.setItem('nihongo-folder', open.value ?? '')
  } catch {}
}
const inGroup = (g: Group) => PAGES.filter((p) => (p.group ?? 'self') === g)

const LEAD = ['Bir bölüm seç', 'Choose a section', '选择一个部分']
</script>

<template>
  <SiteLayout :furigana-switch="false" :hide-switch="false">
    <section class="py-6 text-center">
      <p class="font-jp text-primary text-6xl leading-none" aria-hidden="true">日本語</p>
      <h1 class="mt-4 text-3xl font-bold">Nihongo</h1>
      <p class="text-ink-soft mt-1">{{ pick(LEAD) }}</p>
    </section>
    <nav aria-label="Nihongo" class="grid gap-3">
      <section v-for="g in GROUPS" :key="g.id" class="surface rounded-card overflow-hidden">
        <button
          type="button"
          class="focus-ring flex w-full items-center gap-4 p-4 text-start"
          :aria-expanded="open === g.id"
          @click="toggle(g.id)"
        >
          <span class="bg-muted rounded-control grid size-12 shrink-0 place-items-center text-2xl" aria-hidden="true">{{
            open === g.id && g.id === 'school' ? '📂' : g.icon
          }}</span>
          <span class="min-w-0 flex-1">
            <span class="block font-bold">{{ g.title }}</span>
            <span class="text-ink-soft block text-sm">{{ g.description }} · {{ inGroup(g.id).length }}</span>
          </span>
          <span class="text-ink-soft transition-transform" :class="open === g.id ? 'rotate-90' : ''" aria-hidden="true">›</span>
        </button>
        <ul v-if="open === g.id" class="border-hair grid gap-2 border-t p-3">
          <li v-for="p in inGroup(g.id)" :key="p.path">
            <RouterLink
              :to="p.path"
              class="bg-muted focus-ring rounded-control group flex items-center gap-3 p-3 transition-transform hover:-translate-y-0.5"
            >
              <span
                :data-palette="p.palette"
                class="bg-surface text-primary font-jp rounded-control grid size-10 shrink-0 place-items-center text-xl"
                aria-hidden="true"
                >{{ p.icon }}</span
              >
              <span class="min-w-0 flex-1">
                <span class="flex items-start justify-between gap-2">
                  <span class="font-bold">{{ p.title }}</span>
                  <span
                    class="flex shrink-0 gap-0.5 text-base leading-none"
                    :title="langNames(p, ' · ')"
                    :aria-label="langNames(p, ', ')"
                    ><span v-for="x in p.langs" :key="x" aria-hidden="true">{{ LANG_FLAG[x] }}</span></span
                  >
                </span>
                <span class="text-ink-soft block text-sm">{{ p.description }}</span>
              </span>
              <span class="text-ink-soft group-hover:text-primary" aria-hidden="true">→</span>
            </RouterLink>
          </li>
        </ul>
      </section>
    </nav>
  </SiteLayout>
</template>
