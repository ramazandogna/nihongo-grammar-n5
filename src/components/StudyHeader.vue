<script setup lang="ts" generic="V extends string">
import { BaseButton, SegmentedControl } from 'rei-kit'

import { usePageContext } from '@/lib/page'

/**
 * The bar above one section of a study page: back to the list, the section's
 * name, and the switch between its learn / read / test views.
 */
defineProps<{ title: string; sub?: string; tabs?: readonly { value: V; label: string }[] }>()
const view = defineModel<V>()
const emit = defineEmits<{ back: [] }>()
const { t } = usePageContext()
</script>

<template>
  <div class="mb-5 flex flex-col gap-3">
    <div class="flex items-center gap-3">
      <BaseButton variant="ghost" size="sm" @click="emit('back')">{{ t.back }}</BaseButton>
      <div class="min-w-0">
        <h1 class="jp truncate text-xl font-bold" v-html="title" />
        <p v-if="sub" class="text-ink-soft text-sm">{{ sub }}</p>
      </div>
    </div>
    <SegmentedControl v-if="tabs && view !== undefined" v-model="view" :options="tabs" />
  </div>
</template>
