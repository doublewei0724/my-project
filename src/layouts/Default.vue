<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="flex flex-1 flex-col">
    <AppHeader />

    <RouterView />
  </div>
  <AppFooter />
</template>
