<script setup lang="ts">
import { onMounted } from 'vue'
import GlobalPopup from '@/components/popup/GlobalPopup.vue'
import { useDailyStorage } from '@/composables/useDailyStorage'
import { usePopupStore } from '@/stores/popup'

const popupStore = usePopupStore()
const { isMarkedToday } = useDailyStorage()

onMounted(() => {
  const STORAGE_KEY = 'hide_announcement_today'
  if (!isMarkedToday(STORAGE_KEY)) {
    popupStore.openPopup('announcement')
  }
})
</script>

<template>
  <router-view />
  <GlobalPopup />
</template>
