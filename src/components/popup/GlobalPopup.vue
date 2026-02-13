<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { usePopupStore } from '@/stores/popup'

const popupStore = usePopupStore()
const { isShow, currentPopup, popupProps } = storeToRefs(popupStore)

const activeComponent = computed(() => {
  switch (currentPopup.value) {
    case 'login':
      return defineAsyncComponent(() => import('./LoginForm.vue'))
    case 'user':
      return defineAsyncComponent(() => import('./UserInfo.vue'))
    default:
      return null
  }
})
</script>

<template>
  <van-popup
    v-model:show="isShow"
    position="center"
    round
    class="p-6"
    :style="{
      backgroundColor: '#1a1d29',
      width: '90%',
      maxWidth: '500px',
    }"
    @closed="popupStore.closePopup"
  >
    <component
      :is="activeComponent"
      v-if="activeComponent"
      v-bind="popupProps"
    />
  </van-popup>
</template>
