<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- Pages rise in on navigation (main.css .page-*); nothing on the first, prerendered paint. -->
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" :appear="false">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>
