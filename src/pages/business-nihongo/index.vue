<script setup lang="ts">
import SiteLayout from '@/components/SiteLayout.vue'
import CoursePage from '@/components/textbook/CoursePage.vue'
import { usePage } from '@/lib/page'
import { LESSONS } from './data'

usePage('/business-nihongo/')
</script>

<template>
  <SiteLayout>
    <CoursePage :lessons="LESSONS" hero="ビジネス日本語" lead="ISI · 中級Ⅰ · iş Japoncası: duyuru okuma, 敬語, davet" />
  </SiteLayout>
</template>
