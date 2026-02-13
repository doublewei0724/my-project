<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <div class="flex flex-1 flex-col p-4">
    <RouterView />
  </div>
  <AppFooter />
</template>
