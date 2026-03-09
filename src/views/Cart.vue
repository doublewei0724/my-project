<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-vue-next'
import { showConfirmDialog, showToast } from 'vant'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const confirmRemove = (id: number) => {
  showConfirmDialog({
    title: t('products.remove_confirm_title'),
    message: t('products.remove_confirm_msg'),
  })
    .then(() => {
      cartStore.removeFromCart(id)
    })
    .catch(() => {})
}

const handleCheckout = () => {
  showToast({
    message: t('products.checkout_success'),
    icon: 'success',
  })
  cartStore.clearCart()
  setTimeout(() => {
    router.push({ name: 'products', params: { lang: route.params.lang } })
  }, 1500)
}
</script>

<template>
  <div class="mainContent text-white">
    <div class="sticky top-14 z-[90] flex items-center justify-between bg-[#1a1d29]/80 py-4 backdrop-blur-md">
      <button
        @click="router.back()"
        class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5"
      >
        <ChevronLeft class="h-6 w-6" />
      </button>
      <h1 class="text-lg font-bold">{{ t('products.cart') }} ({{ cartStore.totalCount }})</h1>
      <div class="w-10"></div>
    </div>

    <div
      v-if="cartStore.items.length === 0"
      class="flex flex-col items-center justify-center pt-20"
    >
      <div class="mb-6 rounded-full bg-white/5 p-8">
        <ShoppingBag class="h-20 w-20 text-white/20" />
      </div>
      <p class="mb-8 text-white/40">{{ t('products.empty') }}</p>
      <van-button
        type="primary"
        round
        class="px-10"
        @click="router.push({ name: 'products', params: { lang: route.params.lang } })"
      >
        {{ t('products.go_shopping') }}
      </van-button>
    </div>

    <div
      v-else
      class="space-y-4 py-4"
    >
      <div
        v-for="item in cartStore.items"
        :key="item.id"
        class="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3"
      >
        <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-white p-2">
          <img
            :src="item.image"
            class="h-full w-full object-contain"
          />
        </div>

        <div class="flex flex-1 flex-col justify-between">
          <div class="flex items-start justify-between">
            <h3 class="line-clamp-1 text-sm font-medium text-white/90">{{ item.title }}</h3>
            <button
              @click="confirmRemove(item.id)"
              class="ml-2 text-white/30 hover:text-red-400"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-2 flex items-center justify-between">
            <span class="font-bold text-[#1989fa]">${{ (item.price * item.quantity).toFixed(2) }}</span>

            <div class="flex items-center gap-3 rounded-lg bg-white/5 p-1">
              <button
                @click="cartStore.updateQuantity(item.id, -1)"
                class="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 active:scale-90"
              >
                <Minus class="h-3 w-3" />
              </button>
              <span class="min-w-[20px] text-center text-sm font-bold">{{ item.quantity }}</span>
              <button
                @click="cartStore.updateQuantity(item.id, 1)"
                class="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 active:scale-90"
              >
                <Plus class="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="cartStore.items.length > 0"
      class="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-[#1a1d29]/90 p-4 backdrop-blur-xl"
    >
      <div class="mx-auto flex max-w-4xl items-center justify-between">
        <div>
          <p class="text-xs text-white/40">{{ t('products.total_amount') }}</p>
          <p class="text-2xl font-black text-[#1989fa]">${{ cartStore.totalAmount.toFixed(2) }}</p>
        </div>
        <van-button
          type="primary"
          round
          class="h-12 px-12 font-bold shadow-lg shadow-blue-500/20"
          @click="handleCheckout"
        >
          {{ t('products.checkout') }}
        </van-button>
      </div>
    </div>
  </div>
</template>
