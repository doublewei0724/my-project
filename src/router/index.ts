import { RouterView, createRouter, createWebHashHistory } from 'vue-router'
import i18n from '@/i18n'
import LayoutDefault from '@/layouts/Default.vue'
import { useUserStore } from '@/stores/user'
import Cart from '@/views/Cart.vue'
import Chart from '@/views/Chart.vue'
import CurrencyView from '@/views/CurrencyView.vue'
import HomeView from '@/views/HomeView.vue'
import PcPlatform from '@/views/PcPlatform.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import ProductList from '@/views/ProductList.vue'
import ScratchCard from '@/views/ScratchCard.vue'
import TemplateDemo from '@/views/TemplateDemo.vue'
import Wheel from '@/views/Wheel.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const SUPPORTED_LANGS = ['zh-TW', 'zh-CN', 'en', 'ja', 'ko', 'vi']

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/:lang(zh-TW|zh-CN|en|ja|ko|vi)?',
      component: RouterView,
      children: [
        {
          path: '',
          component: LayoutDefault,
          children: [
            { path: '', name: 'home', component: HomeView },
            { path: 'wheel', name: 'wheel', component: Wheel },
            { path: 'scratch', name: 'scratch', component: ScratchCard },
            { path: 'products', name: 'products', component: ProductList },
            { path: 'product/:id', name: 'product-detail', component: ProductDetail },
            { path: 'cart', name: 'cart', component: Cart },
            { path: 'currency', name: 'currency', component: CurrencyView },
            { path: 'chart', name: 'chart', component: Chart },
            { path: 'pcPlatform', name: 'pcPlatform', component: PcPlatform },
            { path: 'templateDemo', name: 'templateDemo', component: TemplateDemo },
          ],
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: () => {
        const nav = navigator.language
        const browserLang = nav.includes('ko')
          ? 'ko'
          : nav.includes('ja')
            ? 'ja'
            : nav.includes('vi')
              ? 'vi'
              : nav.includes('zh-CN') || nav === 'zh'
                ? 'zh-CN'
                : nav.includes('zh')
                  ? 'zh-TW'
                  : 'en'
        return `/${browserLang}`
      },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  const { lang } = to.params

  // 獲取瀏覽器語系，沒有就預設 zh-TW
  if (!lang || !SUPPORTED_LANGS.includes(lang as string)) {
    const nav = navigator.language
    const defaultLang = nav.includes('ko')
      ? 'ko'
      : nav.includes('ja')
        ? 'ja'
        : nav.includes('vi')
          ? 'vi'
          : nav.includes('zh-CN') || nav === 'zh'
            ? 'zh-CN'
            : nav.includes('zh')
              ? 'zh-TW'
              : 'en'

    const cleanPath = to.path
      .split('/')
      .filter((p) => p && !SUPPORTED_LANGS.includes(p))
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
