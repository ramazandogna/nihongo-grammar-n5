<script setup lang="ts">
import { RouterLink } from 'vue-router'

import HomeDashboard from '@/components/HomeDashboard.vue'
import SiteLayout from '@/components/SiteLayout.vue'
import { usePage } from '@/lib/page'
import { LANG_FLAG, LANG_LABEL } from '@/lib/i18n'
import { ref } from 'vue'
import { BriefcaseBusiness, ChevronRight, Folder, FolderOpen, Library, Mail, Scale } from 'lucide-vue-next'

import { GROUPS, PAGES, type Group, type SitePage } from '@/site'

const { pick, lang } = usePage('/')

/** Title and description in the menu's language. */
const text = (x: { title: string; description: string; en: { title: string; description: string } }) =>
  lang.value === 'en' ? x.en : x

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
/** Each folder's icon; the school folder opens when expanded. */
const groupIcon = (name: 'library' | 'folder' | 'briefcase', isOpen: boolean) =>
  name === 'folder' ? (isOpen ? FolderOpen : Folder) : name === 'library' ? Library : BriefcaseBusiness
const inGroup = (g: Group) => PAGES.filter((p) => (p.group ?? 'self') === g)

const ABOUT = {
  title: ['Hakkında', 'About'],
  sub: ['Lisans ve iletişim', 'License and contact'],
  what: [
    'Ramazan Doğan’ın Japonca çalışmak için hazırladığı kişisel site: okul dersleri, iş yeri Japoncası ve JLPT hazırlığı.',
    'A personal site Ramazan Doğan made to study Japanese: school lessons, workplace Japanese and JLPT preparation.',
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
    <nav aria-label="Nihongo" class="grid gap-3">
      <section
        v-for="(g, gi) in GROUPS"
        :key="g.id"
        class="surface rounded-card rise-in overflow-hidden"
        :style="{ '--stagger': gi }"
      >
        <button
          type="button"
          class="focus-ring press flex min-h-16 w-full items-center gap-4 p-4 text-start"
          :aria-expanded="open === g.id"
          @click="toggle(g.id)"
        >
          <span class="bg-primary/10 rounded-control grid size-12 shrink-0 place-items-center" aria-hidden="true"
            ><component :is="groupIcon(g.icon, open === g.id)" class="text-primary size-6" aria-hidden="true"
          /></span>
          <span class="min-w-0 flex-1">
            <span class="block font-bold">{{ text(g).title }}</span>
            <span class="text-ink-soft block text-sm">{{ text(g).description }}</span>
          </span>
          <span class="bg-muted text-ink-soft rounded-full px-2 py-0.5 text-xs font-bold tabular-nums">{{
            inGroup(g.id).length
          }}</span>
          <ChevronRight
            class="text-ink-soft size-5 shrink-0 transition-transform duration-300"
            :class="open === g.id ? 'rotate-90' : ''"
            aria-hidden="true"
          />
        </button>
        <Transition name="fade-up">
          <ul v-if="open === g.id" class="border-hair grid gap-2 border-t p-3">
            <li v-for="p in inGroup(g.id)" :key="p.path">
              <RouterLink
                :to="p.path"
                class="bg-muted focus-ring rounded-control press lift group flex items-center gap-3 p-3"
              >
                <span
                  :data-palette="p.palette"
                  class="bg-surface text-primary font-jp rounded-control grid size-11 shrink-0 place-items-center text-xl"
                  aria-hidden="true"
                  >{{ p.icon }}</span
                >
                <span class="min-w-0 flex-1">
                  <span class="block font-bold">{{ text(p).title }}</span>
                  <span class="text-ink-soft line-clamp-2 block text-sm">{{ text(p).description }}</span>
                  <span
                    class="mt-1.5 flex gap-1"
                    role="img"
                    :aria-label="langNames(p, ', ')"
                    :title="langNames(p, ' · ')"
                    ><span
                      v-for="x in p.langs"
                      :key="x"
                      class="bg-surface text-ink-soft rounded-cell px-1.5 py-0.5 text-[11px] font-bold"
                      aria-hidden="true"
                      >{{ LANG_FLAG[x] }}</span
                    ></span
                  >
                </span>
                <ChevronRight class="text-ink-soft group-hover:text-primary size-5 shrink-0" aria-hidden="true" />
              </RouterLink>
            </li>
          </ul>
        </Transition>
      </section>
    </nav>

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
