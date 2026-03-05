<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePopupStore } from '@/stores/popup'
import LoginForm from './LoginForm.vue'
import UserInfo from './UserInfo.vue'

const popupStore = usePopupStore()
const { isShow, currentPopup, popupProps } = storeToRefs(popupStore)

const activeComponent = computed(() => {
  switch (currentPopup.value) {
    case 'login':
      return LoginForm
    case 'user':
      return UserInfo
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
