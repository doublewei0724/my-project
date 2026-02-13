import { RouterView, createRouter, createWebHistory } from 'vue-router'
import i18n from '@/i18n'
import LayoutDefault from '@/layouts/Default.vue'
import { useUserStore } from '@/stores/user'
import HomeView from '@/views/HomeView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
              component: () => import('@/views/Wheel.vue'),
            },
            {
              path: 'lottery',
              name: 'lottery',
              component: () => import('@/views/Lottery.vue'),
            },
            {
              path: 'products',
              name: 'products',
              component: () => import('@/views/ProductList.vue'),
            },
            {
              path: 'product/:id',
              name: 'product-detail',
              component: () => import('@/views/ProductDetail.vue'),
            },
            {
              path: 'cart',
              name: 'cart',
              component: () => import('@/views/Cart.vue'),
            },
            {
              path: 'currency',
              name: 'currency',
              component: () => import('@/views/CurrencyView.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: (_to) => {
        const browserLang =
          navigator.language === 'zh-CN' ? 'zh-CN' : navigator.language.includes('zh') ? 'zh-TW' : 'en'
        return `/${browserLang}`
      },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  const { lang } = to.params
  const supportedLangs = ['zh-TW', 'zh-CN', 'en']

  // 獲取瀏覽器語系,沒有就預設zh-TW
  if (!lang || !supportedLangs.includes(lang as string)) {
    const nav = navigator.language
    const defaultLang = nav === 'zh-CN' ? 'zh-CN' : nav.startsWith('zh') ? 'zh-TW' : 'en'
    const cleanPath = to.path
      .split('/')
      .filter((p) => !supportedLangs.includes(p))
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
