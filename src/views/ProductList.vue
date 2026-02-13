<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-vue-next'
import { showToast } from 'vant'
import { useCartStore } from '@/stores/cart'
import { usePopupStore } from '@/stores/popup'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const { t } = useI18n()
const popupStore = usePopupStore()
const route = useRoute()

const products = ref<any[]>([])
const loading = ref(true)
const activeTab = ref('all')
const sortOrder = ref('default')
const currentPage = ref(1)
const pageSize = 10

const categories = [
  { title: 'products.all', key: 'all' },
  { title: 'products.mens', key: "men's clothing" },
  { title: 'products.jewelery', key: 'jewelery' },
  { title: 'products.electronics', key: 'electronics' },
  { title: 'products.womens', key: "women's clothing" },
]

const fetchProducts = async () => {
  loading.value = true
  try {
    const url =
      activeTab.value === 'all'
        ? 'https://fakestoreapi.com/products'
        : `https://fakestoreapi.com/products/category/${activeTab.value}`

    const res = await axios.get(url)
    products.value = res.data
    currentPage.value = 1
  } catch (error) {
    showToast('載入失敗')
  } finally {
    loading.value = false
  }
}

const handleGoToCart = () => {
  if (!userStore.isLogin) {
    popupStore.openPopup('login')
  } else {
    router.push({
      name: 'cart',
      params: {
        lang: route.params.lang || 'zh-TW',
      },
    })
  }
}

const goToDetail = (id: number) => {
  router.push({
    name: 'product-detail',
    params: {
      lang: route.params.lang || 'zh-TW',
      id,
    },
  })
}

const addToCart = (item: any) => {
  if (!userStore.isLogin) {
    popupStore.openPopup('login')
  } else {
    cartStore.addToCart(item)
    showToast({
      message: t('products.add_to_cart_success'),
      icon: 'success',
    })
  }
}

watch(activeTab, fetchProducts)

const processedProducts = computed(() => {
  let list = [...products.value]
  if (sortOrder.value === 'lowToHigh') {
    list.sort((a, b) => a.price - b.price)
  } else if (sortOrder.value === 'highToLow') {
    list.sort((a, b) => b.price - a.price)
  }
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return list.slice(start, end)
})

onMounted(fetchProducts)
</script>

<template>
  <div class="mainContent">
    <div class="flex items-center justify-between bg-[#1a1d29] py-2">
      <div>
        <h1 class="text-xl font-bold text-white">{{ t('products.title') }}</h1>
      </div>

      <div
        class="relative cursor-pointer rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
        @click="handleGoToCart()"
      >
        <ShoppingCart class="h-6 w-6 text-white" />

        <div
          v-if="cartStore.totalCount > 0"
          class="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-[#1a1d29] bg-[#1989fa] px-1 text-[10px] font-bold text-white"
        >
          {{ cartStore.totalCount }}
        </div>
      </div>
    </div>
    <van-tabs
      v-model:active="activeTab"
      :ellipsis="false"
      background="#1a1d29"
      title-active-color="#fff"
      title-inactive-color="#94a3b8"
    >
      <van-tab
        v-for="cat in categories"
        :key="cat.key"
        :title="t(cat.title)"
        :name="cat.key"
      />
    </van-tabs>

    <div class="flex items-center justify-between py-4">
      <div class="text-xs text-slate-400">
        <!-- 顯示第 {start} - {end} 筆 -->
        {{
          t('products.display_range', {
            start: (currentPage - 1) * pageSize + 1,
            end: Math.min(currentPage * pageSize, products.length),
          })
        }}
      </div>

      <div class="flex gap-2">
        <select
          v-model="sortOrder"
          class="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none"
        >
          <option value="default">{{ t('products.default') }}</option>
          <option value="lowToHigh">{{ t('products.lowToHigh') }}</option>
          <option value="highToLow">{{ t('products.highToLow') }}</option>
        </select>
      </div>
    </div>

    <div
      v-if="loading"
      class="flex h-64 items-center justify-center"
    >
      <van-loading vertical>{{ t('products.loading') }}</van-loading>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <div
          v-for="item in processedProducts"
          :key="item.id"
          class="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
        >
          <div
            class="mb-4 flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-white p-6"
            @click="goToDetail(item.id)"
          >
            <img
              :src="item.image"
              class="max-h-full object-contain transition-transform hover:scale-110"
            />
          </div>

          <div class="flex flex-1 flex-col">
            <h3
              class="mb-2 line-clamp-2 h-16 cursor-pointer text-sm font-medium text-white/90 hover:text-[#1989fa]"
              @click="goToDetail(item.id)"
            >
              {{ item.title }}
            </h3>

            <div class="mt-auto flex items-center justify-between">
              <span class="text-xl font-bold text-[#1989fa]">${{ item.price }}</span>
              <van-button
                type="primary"
                size="small"
                round
                icon="plus"
                @click="addToCart(item)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="p-6">
        <van-pagination
          v-model="currentPage"
          :total-items="products.length"
          :items-per-page="pageSize"
          force-ellipses
        >
          <template #prev-text>
            <ChevronLeft class="h-6 w-6" />
          </template>
          <template #next-text>
            <ChevronRight class="h-6 w-6" />
          </template>
        </van-pagination>
      </div>
    </div>
  </div>
  <van-back-top
    bottom="100px"
    right="20px"
    z-index="100"
  ></van-back-top>
</template>

<style scoped>
:deep(.van-pagination) {
  background: transparent;
}
:deep(.van-pagination__item) {
  background: transparent;
  border: none;
  color: #94a3b8;
  min-width: 40px;
  height: 40px;
  flex: none;
  margin: 0 4px;
}
:deep(.van-pagination__items) {
  justify-content: center;
}
:deep(.van-pagination__item--active) {
  background: #1989fa;
  color: white;
  border-radius: 8px;
}
:deep(.van-pagination__prev),
:deep(.van-pagination__next) {
  background: transparent;
  border: none;
  color: white;
  min-width: 40px;
}
:deep(.van-pagination__item::after) {
  border: none;
}
:deep(.van-pagination__item:active) {
  background: rgba(255, 255, 255, 0.1);
}
</style>
