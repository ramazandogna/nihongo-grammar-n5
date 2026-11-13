<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'

import { usePageContext } from '@/lib/page'
import { hideAnswers } from '@/lib/prefs'
import { provideRevealAll } from '@/lib/reveal'

/**
 * Wraps a passage: one button opens (or closes again) every hidden
 * translation inside it. Shown only while answers are hidden at all.
 */
const all = provideRevealAll()
const { lang } = usePageContext()
const L = () =>
  lang.value === 'tr'
    ? { show: 'Tüm çevirileri göster', hide: 'Çevirileri gizle' }
    : { show: 'Show all translations', hide: 'Hide translations' }
</script>

<template>
  <div>
    <div v-if="hideAnswers" class="mb-2 flex justify-end">
      <button
        type="button"
        class="focus-ring press text-primary hover:bg-primary/10 rounded-control inline-flex min-h-11 items-center gap-1.5 px-3 text-sm font-semibold"
        :aria-pressed="all"
        @click="all = !all"
      >
        <component :is="all ? EyeOff : Eye" class="size-4" aria-hidden="true" />{{ all ? L().hide : L().show }}
      </button>
    </div>
    <slot />
  </div>
</template>
