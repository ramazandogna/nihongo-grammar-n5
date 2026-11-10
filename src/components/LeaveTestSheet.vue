<script setup lang="ts">
import { computed } from 'vue'
import { BaseButton, BaseSheet } from 'rei-kit'

import { usePageContext } from '@/lib/page'

/** “Leave the test?” — shown by pages that use `useTestRoute`. */
const { open } = defineProps<{ open: boolean }>()
const emit = defineEmits<{ leave: []; stay: [] }>()
const { t } = usePageContext()

const model = computed({
  get: () => open,
  set: (v: boolean) => {
    if (!v) emit('stay')
  },
})
</script>

<template>
  <BaseSheet v-model="model" :title="t.leaveTitle" :close-label="t.close">
    <p class="text-ink-soft text-[15px]">{{ t.leaveText }}</p>
    <div class="mt-4 grid grid-cols-2 gap-3 pb-2">
      <BaseButton variant="secondary" @click="emit('leave')">{{ t.leave }}</BaseButton>
      <BaseButton @click="emit('stay')">{{ t.stay }}</BaseButton>
    </div>
  </BaseSheet>
</template>
