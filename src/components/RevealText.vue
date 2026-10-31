<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { usePageContext } from '@/lib/page'
import { hideAnswers } from '@/lib/prefs'
import { notation } from '@/lib/ruby'

/**
 * An answer kept behind a blur until it is tapped, so the reader can guess
 * first. Follows the header's "hide answers" switch; switching it again
 * covers everything that was opened.
 */
const { text } = defineProps<{ text: string }>()
const { t } = usePageContext()

const opened = ref(false)
watch(hideAnswers, () => (opened.value = false))
const veiled = computed(() => hideAnswers.value && !opened.value)
</script>

<template>
  <span
    v-if="veiled"
    class="veil veiled focus-ring rounded-cell"
    role="button"
    tabindex="0"
    :aria-label="t.reveal"
    @click.stop="opened = true"
    @keydown.enter.prevent.stop="opened = true"
    @keydown.space.prevent="opened = true"
    v-html="notation(text)"
  />
  <span v-else class="veil" v-html="notation(text)" />
</template>
