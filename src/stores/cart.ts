import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

export const useCartStore = defineStore(
  'cart',
  () => {
    const items = ref<CartItem[]>([])
    // 計算總金額
    const totalAmount = computed(() => {
      return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
    })
    // 計算購物車商品總件數 (Badge 顯示用)
    const totalCount = computed(() => {
      return items.value.reduce((total, item) => total + item.quantity, 0)
    })
    // 加入購物車
    const addToCart = (product: any) => {
      const existingItem = items.value.find((item) => item.id === product.id)

      if (existingItem) {
        // 如果商品已存在，增加數量
        existingItem.quantity++
      } else {
        // 如果是新商品，推入陣列，並加上 quantity 屬性
        items.value.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        })
      }
    }
    // 更改數量 (給購物車頁面使用)
    const updateQuantity = (id: number, change: number) => {
      const item = items.value.find((i) => i.id === id)
      if (item) {
        const newQty = item.quantity + change
        // 確保數量最少為 1
        if (newQty > 0) {
          item.quantity = newQty
        }
      }
    }
    // 移除單一商品
    const removeFromCart = (id: number) => {
      items.value = items.value.filter((item) => item.id !== id)
    }
    // 清空購物車 (結帳成功後使用)
    const clearCart = () => {
      items.value = []
    }

    return {
      items,
      totalAmount,
      totalCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }
  },
  {
    persist: {
      key: 'user-shopping-cart',
      storage: localStorage,
      pick: ['items'],
    },
  },
)
