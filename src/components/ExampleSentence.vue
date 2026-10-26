<script setup lang="ts">
import { BaseBadge } from 'rei-kit'

import JpText from './JpText.vue'
import RevealText from './RevealText.vue'

/**
 * One example sentence, the same everywhere on the site: the Japanese with
 * its readings, romaji under it, and the meaning behind the blur so it can be
 * guessed first.
 */
defineProps<{ jp: string; meaning: string; romaji?: string; tag?: string }>()
</script>

<template>
  <div class="border-hair rounded-control border-s-4 border-s-primary bg-surface border px-4 py-2.5">
    <JpText :text="jp" as="p" class="text-lg leading-[2.2]" />
    <p v-if="romaji" class="text-ink-soft text-sm italic" v-html="romaji" />
    <p class="text-[15px]"><RevealText :text="meaning" /></p>
    <BaseBadge v-if="tag" tone="primary" class="mt-1.5"><span v-html="tag" /></BaseBadge>
  </div>
</template>
