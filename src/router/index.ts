import { RouterView, createRouter, createWebHashHistory } from 'vue-router'
import i18n from '@/i18n'
import LayoutDefault from '@/layouts/Default.vue'
import { useUserStore } from '@/stores/user'
import Cart from '@/views/Cart.vue'
import Chart from '@/views/Chart.vue'
import CurrencyView from '@/views/CurrencyView.vue'
import HomeView from '@/views/HomeView.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import ProductList from '@/views/ProductList.vue'
import Wheel from '@/views/Wheel.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior(_to, _from, _savedPosition) {
    return { top: 0 }
  },
  routes: [
    {
      path: '/:lang(zh-TW|zh-CN|en)?',
      component: RouterView,
      children: [
        {
          path: '',
          component: LayoutDefault,
          children: [
            {
              path: '',
              name: 'home',
              component: HomeView,
            },
            {
              path: 'wheel',
              name: 'wheel',
              component: Wheel,
            },
            {
              path: 'products',
              name: 'products',
              component: ProductList,
            },
            {
              path: 'product/:id',
              name: 'product-detail',
              component: ProductDetail,
            },
            {
              path: 'cart',
              name: 'cart',
              component: Cart,
            },
            {
              path: 'currency',
              name: 'currency',
              component: CurrencyView,
            },
            {
              path: 'chart',
              name: 'chart',
              component: Chart,
            },
          ],
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: (_to) => {
        const nav = navigator.language
        const browserLang = nav === 'zh-CN' ? 'zh-CN' : nav.includes('zh') ? 'zh-TW' : 'en'
        return `/${browserLang}`
      },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  const { lang } = to.params
  const supportedLangs = ['zh-TW', 'zh-CN', 'en', 'ja']

  // 獲取瀏覽器語系,沒有就預設zh-TW
  if (!lang || !supportedLangs.includes(lang as string)) {
    const nav = navigator.language
    const defaultLang = nav === 'zh-CN' ? 'zh-CN' : nav.startsWith('zh') ? 'zh-TW' : 'en'

    // 修正路徑處理，避免產生多餘斜線
    const cleanPath = to.path
      .split('/')
      .filter((p) => p && !supportedLangs.includes(p))
      .join('/')

    const targetPath = `/${defaultLang}/${cleanPath}`.replace(/\/+/g, '/')

    return next({ path: targetPath, query: to.query, replace: true })
  }

  // 同步語系
  const globalI18n = i18n.global as any
  globalI18n.locale.value = lang

  // 登入檢查
  if (to.meta.requiresAuth && !userStore.isLogin) {
    return next({ name: 'home', params: { lang } })
  }

  next()
})

export default router
