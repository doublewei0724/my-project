import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { defineStore } from 'pinia'
import router from '@/router'
import { useCartStore } from './cart'

export const useUserStore = defineStore(
  'user',
  () => {
    const cartStore = useCartStore()
    const route = useRoute()
    const token = ref<string | null>(null)

    const isLogin = computed(() => {
      return token.value !== null && token.value !== ''
    })

    const setToken = (newToken: string) => {
      token.value = newToken
    }

    const logout = async () => {
      token.value = null
      cartStore.clearCart()
      await router.push({
        name: 'home',
        params: { lang: route.params.lang || 'zh-TW' },
      })
    }

    return { token, isLogin, setToken, logout }
  },
  {
    persist: true,
  },
)
