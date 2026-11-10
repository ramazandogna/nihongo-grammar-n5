<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { BaseCard } from 'rei-kit'

import type { ExamGroup } from '@/pages/past-n3/types'
import { toTop } from '@/lib/scroll'
import JpText from './JpText.vue'
import PagerNav from './PagerNav.vue'
import RevealText from './RevealText.vue'

/**
 * Reading passages, one per page: the text line by line with its meaning
 * behind the blur, then the questions — pick an option, see why. The
 * [[marks]] showing where the answer sits appear only after answering.
 */
const { groups, how } = defineProps<{ groups: ExamGroup[]; how?: (g: ExamGroup) => string | undefined }>()
const page = ref(0)
watch(page, toTop)
const chosen = reactive<Record<number, number>>({})
const answered = (g: ExamGroup) => g.items.every((q) => chosen[q.no] !== undefined)
const unmark = (s: string) => s.replace(/\[\[([^\]]+)\]\]/g, '$1')
</script>

<template>
  <template v-for="(g, i) in groups" :key="i">
    <div v-if="page === i" class="grid gap-4">
      <BaseCard v-if="how?.(g)" class="border-warning border-s-4">
        <p class="text-[15px]">💡 {{ how(g) }}</p>
      </BaseCard>
      <BaseCard>
        <JpText v-if="g.title" :text="g.title" as="h2" class="mb-3 text-xl font-bold" />
        <div class="grid gap-3">
          <div v-for="(l, j) in g.passage" :key="j">
            <JpText :text="answered(g) ? l.jp : unmark(l.jp)" as="p" class="text-[1.25rem] leading-[2.2]" />
            <p class="text-ink-soft text-[15px]"><RevealText :text="l.tr" /></p>
          </div>
        </div>
      </BaseCard>
      <BaseCard v-for="q in g.items" :key="q.no">
        <p class="text-ink-soft text-sm">問 {{ q.no }}</p>
        <JpText :text="q.q" as="p" class="mb-3 text-lg leading-[2.1] font-semibold" />
        <div class="grid gap-2">
          <button
            v-for="(o, k) in q.opts"
            :key="k"
            type="button"
            class="control rounded-control focus-ring px-3 py-2 text-start"
            :class="
              chosen[q.no] === undefined
                ? ''
                : k === q.a
                  ? '[--surface-border-color:var(--color-positive)] text-positive'
                  : k === chosen[q.no]
                    ? '[--surface-border-color:var(--color-negative)] text-negative'
                    : 'opacity-60'
            "
            :disabled="chosen[q.no] !== undefined"
            @click="chosen[q.no] = k"
          >
            <JpText :text="`${k + 1}. ${o}`" class="text-[1.05rem] leading-[2]" />
          </button>
        </div>
        <p v-if="chosen[q.no] !== undefined" class="bg-muted rounded-control mt-3 px-3 py-2 text-[15px]">
          {{ chosen[q.no] === q.a ? '✅ Doğru.' : `❌ Doğrusu ${q.a + 1}.` }} {{ q.why }}
        </p>
      </BaseCard>
    </div>
  </template>
  <PagerNav v-if="groups.length > 1" v-model="page" :count="groups.length" />
</template>
