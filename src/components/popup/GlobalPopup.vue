<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePopupStore } from '@/stores/popup'
import Announcement from './Announcement.vue'
import LoginForm from './LoginForm.vue'
import ScratchRecords from './ScratchRecords.vue'
import WheelRecords from './WheelRecords.vue'

const popupStore = usePopupStore()
const { isShow, currentPopup, popupProps } = storeToRefs(popupStore)

const activeComponent = computed(() => {
  switch (currentPopup.value) {
    case 'announcement':
      return Announcement
    case 'login':
      return LoginForm
    case 'wheelRecords':
      return WheelRecords
    case 'scratchRecords':
      return ScratchRecords
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
      @close="popupStore.closePopup"
    />
  </van-popup>
</template>
