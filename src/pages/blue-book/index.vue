<script setup lang="ts">
import SiteLayout from '@/components/SiteLayout.vue'
import CoursePage from '@/components/textbook/CoursePage.vue'
import { usePage } from '@/lib/page'
import { LESSONS } from './data'

usePage('/blue-book/')
</script>

<template>
  <SiteLayout>
    <CoursePage :lessons="LESSONS" hero="青い本" lead="Okuldaki mavi kitap · ders ders okuma, gramer, kelime ve test" />
  </SiteLayout>
</template>
