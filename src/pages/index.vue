<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { BaseSheet } from 'rei-kit'

import HomeDashboard from '@/components/HomeDashboard.vue'
import SiteLayout from '@/components/SiteLayout.vue'
import { usePage } from '@/lib/page'
import { ref } from 'vue'
import { BookOpen, BookOpenText, Brush, ChevronRight, ClipboardCheck, Mail, MessagesSquare, Newspaper, Scale } from 'lucide-vue-next'

import { GROUPS, PAGES, type Group, type MenuGroup, type SitePage } from '@/site'

const { pick, lang } = usePage('/')

/** Title and description in the menu's language. */
const text = (x: { title: string; description: string; en: { title: string; description: string } }) =>
  lang.value === 'en' ? x.en : x

/** Open block, remembered so coming back to the menu lands in the same place. */
const open = ref<Group | null>(null)
function toggle(g: Group) {
  open.value = open.value === g ? null : g
}
/** Each block's icon; the grammar book opens when expanded. */
const groupIcon = (name: MenuGroup['icon'], isOpen: boolean) =>
  ({ grammar: isOpen ? BookOpenText : BookOpen, jlpt: ClipboardCheck, reading: Newspaper, kanji: Brush, phrases: MessagesSquare })[name]
/** A block's pages; hidden ones are reached from inside another page. */
/** Higher level first (N3 → N4 → N5), so the current level sits on top. */
const ORDER = ['/blue-book/', '/n4/', '/n5/', '/past-n3/', '/kanji-n3-book/', '/radikaller/', '/kanji-book-2/']
const rank = (p: SitePage) => (ORDER.indexOf(p.path) + 1 || 99)
const inGroup = (g: Group) =>
  PAGES.filter((p) => !p.hidden && (p.group ?? 'grammar') === g).sort((a, b) => rank(a) - rank(b))

const ABOUT = {
  title: ['Hakkında', 'About'],
  sub: ['Lisans ve iletişim', 'License and contact'],
  what: [
    'Ramazan Doğan’ın Japonca çalışmak için hazırladığı kişisel site: gramer, okuma, kanji, iş yeri ifadeleri ve JLPT hazırlığı.',
    'A personal site Ramazan Doğan made to study Japanese: grammar, reading, kanji, workplace expressions and JLPT preparation.',
  ],
  rights: ['Tüm hakları saklıdır.', 'All rights reserved.'],
  license: [
    'Bu sitenin kodu, metinleri, açıklamaları ve verileri lisanslıdır. Yazılı izin olmadan kopyalanması, paylaşılması, çoğaltılması veya yayılması yasaktır; izinsiz paylaşım ve yayma telif hakkı ihlalidir ve suçtur.',
    'The code, texts, explanations and data of this site are licensed. Copying, sharing, reproducing or distributing them without written permission is prohibited; unauthorized sharing and distribution is copyright infringement and a crime.',
  ],
  kit: [
    'Ramazan Doğan’ın geliştirdiği ve lisansladığı rei-kit arayüz kiti ile yapıldı.',
    'Built with rei-kit, the UI kit created and licensed by Ramazan Doğan.',
  ],
  contact: ['Sorular ve izin talepleri için:', 'For questions and permission requests:'],
}

const LEAD = ['Bugün ne çalışalım?', 'What shall we study today?']
const SECTIONS = ['Bölümler', 'Sections']
/** A greeting by the hour, in the menu's language. */
const hello = (() => {
  const h = new Date().getHours()
  return h < 5
    ? ['İyi geceler', 'Good night']
    : h < 12
      ? ['Günaydın', 'Good morning']
      : h < 18
        ? ['İyi günler', 'Good afternoon']
        : ['İyi akşamlar', 'Good evening']
})()
</script>

<template>
  <SiteLayout :furigana-switch="false" :hide-switch="false">
    <!-- Compact welcome: the brand mark and one question, so the first screen is the study itself. -->
    <section class="rise-in mb-5 flex items-center gap-4 pt-1">
      <span
        class="bg-primary text-on-primary font-jp rounded-card grid size-16 shrink-0 place-items-center text-3xl shadow-sm"
        aria-hidden="true"
        >日</span
      >
      <div class="min-w-0">
        <p class="text-ink-soft text-sm" data-allow-mismatch="text">
          {{ pick(hello) }} · <span class="font-jp">こんにちは</span>
        </p>
        <h1 class="text-2xl leading-tight font-bold">{{ pick(LEAD) }}</h1>
      </div>
    </section>

    <HomeDashboard class="mb-8" />

    <h2 class="text-ink-soft mb-2 px-1 text-xs font-bold tracking-wider uppercase">{{ pick(SECTIONS) }}</h2>
    <!-- Four square tiles; a tile opens its sections in a sheet, so nothing scrolls away. -->
    <nav aria-label="Nihongo" class="grid grid-cols-2 gap-3">
      <button
        v-for="(g, gi) in GROUPS"
        :key="g.id"
        type="button"
        class="surface rounded-card rise-in focus-ring press lift flex aspect-square min-h-0 flex-col items-start justify-between overflow-hidden p-4 text-start"
        :style="{ '--stagger': gi }"
        :aria-haspopup="'dialog'"
        @click="toggle(g.id)"
      >
        <span class="bg-primary/10 rounded-control grid size-12 place-items-center" aria-hidden="true"
          ><component :is="groupIcon(g.icon, false)" class="text-primary size-7" aria-hidden="true"
        /></span>
        <span class="w-full">
          <span class="flex items-center justify-between gap-2">
            <span class="text-lg font-bold">{{ text(g).title }}</span>
            <span class="bg-muted text-ink-soft rounded-full px-2 py-0.5 text-xs font-bold tabular-nums">{{
              inGroup(g.id).length
            }}</span>
          </span>
          <span class="text-ink-soft line-clamp-2 block text-xs leading-snug">{{ text(g).description }}</span>
        </span>
      </button>
    </nav>
    <BaseSheet
      :model-value="open !== null"
      :title="open ? text(GROUPS.find((x) => x.id === open)!).title : ''"
      :close-label="pick(['Kapat', 'Close'])"
      @update:model-value="(v: boolean) => !v && toggle(open!)"
    >
      <ul v-if="open" class="grid gap-2 pb-2">
        <li v-for="p in inGroup(open)" :key="p.path">
          <RouterLink
            :to="p.path"
            class="bg-muted focus-ring rounded-control press lift group flex items-center gap-3 p-3"
          >
            <span
              :data-palette="p.palette"
              class="bg-surface text-primary font-jp rounded-control grid size-12 shrink-0 place-items-center text-2xl"
              aria-hidden="true"
              >{{ p.icon }}</span
            >
            <span class="min-w-0 flex-1">
              <span class="block font-bold">{{ text(p).title }}</span>
              <span class="text-ink-soft line-clamp-2 block text-sm">{{ text(p).description }}</span>
            </span>
            <ChevronRight class="text-ink-soft group-hover:text-primary size-5 shrink-0" aria-hidden="true" />
          </RouterLink>
        </li>
      </ul>
    </BaseSheet>
    <p class="text-ink-soft mt-4 text-center text-xs">© 2026 Ramazan Doğan · rei-kit</p>

    <!-- About: who made it, the license, and how to get in touch. The address
         is written out, not linked, so it is not harvested by spam bots. -->
    <section id="about" class="mt-10 grid gap-4 scroll-mt-16" aria-labelledby="about-title">
      <div class="flex items-center gap-3">
        <span class="bg-hair h-px flex-1" aria-hidden="true" />
        <h2 id="about-title" class="text-ink-soft text-xs font-bold tracking-wider uppercase">
          {{ pick(ABOUT.title) }}
        </h2>
        <span class="bg-hair h-px flex-1" aria-hidden="true" />
      </div>
      <div class="surface rounded-card grid gap-4 p-5">
        <div class="flex items-center gap-3">
          <span class="font-jp text-primary text-3xl leading-none" aria-hidden="true">日本語</span>
          <div class="min-w-0">
            <p class="font-bold">Nihongo</p>
            <p class="text-ink-soft text-sm">Ramazan Doğan</p>
          </div>
        </div>
        <p class="text-[15px] leading-relaxed">{{ pick(ABOUT.what) }}</p>
        <div class="bg-muted rounded-control grid gap-1.5 p-3 text-sm">
          <p class="flex items-center gap-1.5 font-bold">
            <Scale class="size-4 shrink-0" aria-hidden="true" />© 2026 Ramazan Doğan · {{ pick(ABOUT.rights) }}
          </p>
          <p class="text-ink-soft leading-relaxed">{{ pick(ABOUT.license) }}</p>
        </div>
        <p class="text-ink-soft text-sm">{{ pick(ABOUT.kit) }}</p>
        <p class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <Mail class="text-ink-soft size-4 shrink-0" aria-hidden="true" />
          <span class="text-ink-soft">{{ pick(ABOUT.contact) }}</span>
          <span class="font-mono font-semibold select-all">doganrmzn40 [ at ] gmail [ . ] com</span>
        </p>
      </div>
    </section>
  </SiteLayout>
</template>
