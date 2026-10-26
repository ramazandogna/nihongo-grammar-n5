<script setup lang="ts">
import SiteLayout from '@/components/SiteLayout.vue'
import GuidePage from '@/components/guide/GuidePage.vue'
import type { GuideData } from '@/components/guide/types'
import { usePage } from '@/lib/page'
import data from './data.json'

usePage('/n5/')
</script>

<template>
  <SiteLayout>
    <GuidePage :data="data as GuideData" />
  </SiteLayout>
</template>
