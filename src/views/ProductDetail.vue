<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ChevronLeft, RefreshCcw, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-vue-next'
import { showToast } from 'vant'
import { useCartStore } from '@/stores/cart'
import { usePopupStore } from '@/stores/popup'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const cartStore = useCartStore()
const userStore = useUserStore()
const popupStore = usePopupStore()

const product = ref<any>(null)
const isLoading = ref(true)

const fetchProductDetail = async () => {
  const id = route.params.id
  isLoading.value = true
  try {
    const res = await axios.get(`https://fakestoreapi.com/products/${id}`)
    product.value = res.data
  } catch (error) {
    showToast(t('products.error_load'))
    router.back()
  } finally {
    isLoading.value = false
  }
}

const handleAddToCart = () => {
  if (!userStore.isLogin) {
    popupStore.openPopup('login')
  } else {
    cartStore.addToCart(product.value)
    showToast({
      message: t('products.add_to_cart_success'),
      icon: 'success',
    })
  }
}

onMounted(fetchProductDetail)
</script>

<template>
  <div class="mainContent text-white">
    <div class="flex items-center justify-between py-2">
      <button
        @click="router.back()"
        class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
      >
        <ChevronLeft class="h-6 w-6" />
      </button>
      <div
        class="relative cursor-pointer rounded-full bg-white/5 p-2"
        @click="router.push({ name: 'cart', params: { lang: route.params.lang } })"
      >
        <ShoppingCart class="h-6 w-6" />
        <span
          v-if="cartStore.totalCount > 0"
          class="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#1989fa] px-1 text-[10px] font-bold"
        >
          {{ cartStore.totalCount }}
        </span>
      </div>
    </div>

    <div
      v-if="isLoading"
      class="flex h-[60vh] flex-col items-center justify-center"
    >
      <van-loading
        size="24px"
        vertical
        color="#1989fa"
      >
        {{ t('products.loading') }}
      </van-loading>
    </div>

    <div
      v-else-if="product"
      class="mx-auto mt-6"
    >
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div
          class="group relative overflow-hidden rounded-3xl bg-white p-12 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
        >
          <img
            :src="product.image"
            :alt="product.title"
            class="h-72 w-full object-contain transition-transform duration-500 group-hover:scale-110 sm:h-96"
          />
        </div>

        <div class="flex flex-col">
          <div class="mb-4 flex items-center justify-between">
            <span
              class="rounded-full bg-indigo-500/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400"
            >
              {{ product.category }}
            </span>
            <div class="flex items-center gap-1 text-yellow-400">
              <Star class="h-4 w-4 fill-current" />
              <span class="text-sm font-black text-white">{{ product.rating?.rate }}</span>
              <span class="text-xs text-white/40">({{ product.rating?.count }})</span>
            </div>
          </div>

          <h1 class="mb-4 text-2xl font-black leading-tight sm:text-3xl">{{ product.title }}</h1>

          <div class="mb-6 flex items-baseline gap-2">
            <span class="text-3xl font-black text-[#1989fa]">${{ product.price }}</span>
            <span class="text-xs text-white/30 line-through">${{ (product.price * 1.2).toFixed(2) }}</span>
          </div>

          <p class="mb-8 text-sm leading-relaxed text-white/60 sm:text-base">
            {{ product.description }}
          </p>

          <div class="grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
            <div class="flex flex-col items-center gap-2 text-center">
              <Truck class="h-5 w-5 text-indigo-400" />
              <span class="text-[10px] text-white/50">免運費</span>
            </div>
            <div class="flex flex-col items-center gap-2 text-center">
              <ShieldCheck class="h-5 w-5 text-indigo-400" />
              <span class="text-[10px] text-white/50">正品保證</span>
            </div>
            <div class="flex flex-col items-center gap-2 text-center">
              <RefreshCcw class="h-5 w-5 text-indigo-400" />
              <span class="text-[10px] text-white/50">7天鑑賞期</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="product && !isLoading"
      class="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-[#1a1d29]/80 p-4 backdrop-blur-xl"
    >
      <div class="mx-auto flex max-w-4xl items-center gap-4">
        <div class="hidden flex-col sm:flex">
          <span class="text-[10px] uppercase tracking-widest text-white/40">Price</span>
          <span class="text-xl font-black text-[#1989fa]">${{ product.price }}</span>
        </div>
        <van-button
          block
          round
          type="primary"
          color="#1989fa"
          class="h-14 font-bold shadow-lg shadow-blue-500/20"
          @click="handleAddToCart"
        >
          {{ t('products.add_to_cart') }}
        </van-button>
      </div>
    </div>
  </div>
</template>
