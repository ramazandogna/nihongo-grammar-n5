<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { usePageContext } from '@/lib/page'
import { hideAnswers } from '@/lib/prefs'
import { notation } from '@/lib/ruby'
import { useRevealAll } from '@/lib/reveal'

/**
 * An answer kept behind a blur until it is tapped, so the reader can guess
 * first. Follows the header's "hide answers" switch; switching it again
 * covers everything that was opened.
 */
const { text } = defineProps<{ text: string }>()
const { t } = usePageContext()

const opened = ref(false)
watch(hideAnswers, () => (opened.value = false))
const all = useRevealAll()
const veiled = computed(() => hideAnswers.value && !opened.value && !all?.value)
</script>

<template>
  <!-- One element in both states, so the blur fades away instead of swapping
       nodes; while veiled the text is hidden from screen readers, which hear
       the "tap to reveal" button instead of the answer. -->
  <span
    class="veil rounded-cell"
    :class="veiled ? 'veiled focus-ring' : opened || all ? 'is-open' : ''"
    :role="veiled ? 'button' : undefined"
    :tabindex="veiled ? 0 : undefined"
    :aria-label="veiled ? t.reveal : undefined"
    @click.stop="opened = true"
    @keydown.enter.prevent.stop="opened = true"
    @keydown.space.prevent="opened = true"
    ><span :aria-hidden="veiled ? 'true' : undefined" v-html="notation(text)"
  /></span>
</template>
