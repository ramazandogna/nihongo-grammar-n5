<script setup lang="ts">
import { computed } from 'vue'

import { notation } from '@/lib/ruby'

/**
 * Japanese with its readings: the data's `{漢字|かんじ}` notation or the old
 * pages' own `<ruby>` HTML. All of it is the site's own content, never input.
 */
const { text, as = 'span' } = defineProps<{ text: string; as?: string }>()
const html = computed(() => notation(text))
</script>

<template>
  <component :is="as" class="jp" lang="ja" v-html="html" />
</template>
