<script setup lang="ts">
import { RouterLink } from 'vue-router'

import SiteLayout from '@/components/SiteLayout.vue'
import { usePage } from '@/lib/page'
import { LANG_FLAG, LANG_LABEL } from '@/lib/i18n'
import { ref } from 'vue'
import { BriefcaseBusiness, Folder, FolderOpen, Info, Library } from 'lucide-vue-next'

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

const aboutOpen = ref(false)
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

const LEAD = ['Bir bölüm seç', 'Choose a section']
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
          <span class="bg-muted rounded-control grid size-12 shrink-0 place-items-center text-2xl" aria-hidden="true"
            ><component :is="groupIcon(g.icon, open === g.id)" class="text-primary size-6" aria-hidden="true"
          /></span>
          <span class="min-w-0 flex-1">
            <span class="block font-bold">{{ text(g).title }}</span>
            <span class="text-ink-soft block text-sm">{{ text(g).description }} · {{ inGroup(g.id).length }}</span>
          </span>
          <span class="text-ink-soft transition-transform" :class="open === g.id ? 'rotate-90' : ''" aria-hidden="true"
            >›</span
          >
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
                  <span class="font-bold">{{ text(p).title }}</span>
                  <span
                    class="flex shrink-0 gap-0.5 text-base leading-none"
                    :title="langNames(p, ' · ')"
                    :aria-label="langNames(p, ', ')"
                    ><span v-for="x in p.langs" :key="x" aria-hidden="true">{{ LANG_FLAG[x] }}</span></span
                  >
                </span>
                <span class="text-ink-soft block text-sm">{{ text(p).description }}</span>
              </span>
              <span class="text-ink-soft group-hover:text-primary" aria-hidden="true">→</span>
            </RouterLink>
          </li>
        </ul>
      </section>
    </nav>

    <!-- About: who made it, the license, and how to get in touch. The address
         is written out, not linked, so it is not harvested by spam bots. -->
    <section class="surface rounded-card mt-3 overflow-hidden">
      <button
        type="button"
        class="focus-ring flex w-full items-center gap-4 p-4 text-start"
        :aria-expanded="aboutOpen"
        @click="aboutOpen = !aboutOpen"
      >
        <span class="bg-muted rounded-control grid size-12 shrink-0 place-items-center text-2xl" aria-hidden="true"
          ><Info class="text-primary size-6"
        /></span>
        <span class="min-w-0 flex-1">
          <span class="block font-bold">{{ pick(ABOUT.title) }}</span>
          <span class="text-ink-soft block text-sm">{{ pick(ABOUT.sub) }}</span>
        </span>
        <span class="text-ink-soft transition-transform" :class="aboutOpen ? 'rotate-90' : ''" aria-hidden="true"
          >›</span
        >
      </button>
      <div v-if="aboutOpen" class="border-hair grid gap-3 border-t p-4 text-[15px]">
        <p>{{ pick(ABOUT.what) }}</p>
        <div class="border-warning bg-muted rounded-control border-s-4 px-3 py-2">
          <p class="font-bold">© 2026 Ramazan Doğan · {{ pick(ABOUT.rights) }}</p>
          <p class="mt-1">{{ pick(ABOUT.license) }}</p>
        </div>
        <p>{{ pick(ABOUT.kit) }}</p>
        <p>
          {{ pick(ABOUT.contact) }}
          <span class="font-mono font-semibold whitespace-nowrap select-all">doganrmzn40 [ at ] gmail [ . ] com</span>
        </p>
      </div>
    </section>
  </SiteLayout>
</template>
