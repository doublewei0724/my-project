import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePopupStore = defineStore('popup', () => {
  const isShow = ref(false)
  const currentPopup = ref<string | null>(null)
  const popupProps = ref<any>({})

  const openPopup = (type: string, props = {}) => {
    currentPopup.value = type
    popupProps.value = props
    isShow.value = true
  }

  const closePopup = () => {
    isShow.value = false
    // 延遲清空，確保動畫跑完
    setTimeout(() => {
      currentPopup.value = null
      popupProps.value = {}
    }, 300)
  }

  return { isShow, currentPopup, popupProps, openPopup, closePopup }
})
