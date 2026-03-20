<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { ChevronDown, Globe, House, LogIn, LogOut } from 'lucide-vue-next'
import { closeToast, showToast } from 'vant'
import { usePopupStore } from '@/stores/popup'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { t, locale } = useI18n()
const popupStore = usePopupStore()

const isLangOpen = ref(false)
const langRef = ref(null)

onClickOutside(langRef, () => (isLangOpen.value = false))

interface Lang {
  value: string
  label: string
  flag: string
}

const languages: Lang[] = [
  { value: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
  { value: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
]

const currentLang = computed(() => languages.find((l) => l.value === locale.value))

const handleLanguageChange = (value: string) => {
  isLangOpen.value = false
  router.push({
    name: route.name || 'home',
    params: { ...route.params, lang: value },
  })
}

const handleLoginClick = () => {
  popupStore.openPopup('login')
}

const handleLogout = () => {
  closeToast()
  showToast({
    message: t('login.logout_success'),
    type: 'success',
  })
  userStore.logout()
}
</script>

<template>
  <div class="sticky top-0 z-[100] flex h-14 items-center justify-between bg-[#1a1d29] px-2 min-[375px]:px-4">
    <div
      v-if="route.name !== 'home'"
      @click="$router.push({ name: 'home', params: { lang: route.params.lang } })"
      class="flex cursor-pointer items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-white/90 shadow-sm backdrop-blur-md transition-all hover:bg-white/15 hover:text-white active:scale-95"
    >
      <House class="h-5 w-5" />
      <span class="hidden text-sm font-medium lg:inline">{{ t('common.home') }}</span>
    </div>
    <div v-else></div>

    <div class="flex items-center gap-2">
      <button
        v-if="!userStore.isLogin"
        @click="handleLoginClick"
        class="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-white/90 backdrop-blur-md transition-all hover:bg-white/15 active:scale-95"
      >
        <LogIn class="h-4 w-4" />
        <span class="text-sm font-medium">{{ t('common.login') }}</span>
      </button>

      <button
        v-else
        @click="handleLogout"
        class="flex items-center gap-1 rounded-lg border border-red-500/50 bg-red-500/10 px-2 py-1 text-red-400 transition-all hover:bg-red-500/20 active:scale-95"
      >
        <LogOut class="h-4 w-4" />
        <span class="text-sm font-medium">{{ t('common.logout') }}</span>
      </button>

      <div
        ref="langRef"
        class="relative"
      >
        <button
          @click="isLangOpen = !isLangOpen"
          class="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-white/90 shadow-sm backdrop-blur-md transition-all hover:bg-white/15 hover:text-white active:scale-95"
        >
          <Globe class="h-4 w-4 flex-shrink-0" />
          <span class="text-sm font-medium">{{ currentLang?.label }}</span>
          <ChevronDown
            class="h-3.5 w-3.5 opacity-60 transition-transform duration-200"
            :class="{ 'rotate-180': isLangOpen }"
          />
        </button>

        <!-- 下拉選單 -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 scale-95 -translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 -translate-y-1"
        >
          <div
            v-if="isLangOpen"
            class="w-30 absolute right-0 mt-1.5 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-[#1e2132] shadow-xl shadow-black/40 backdrop-blur-xl"
          >
            <button
              v-for="lang in languages"
              :key="lang.value"
              @click="handleLanguageChange(lang.value)"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors"
              :class="
                locale === lang.value ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              "
            >
              <span class="font-medium">{{ lang.label }}</span>
              <svg
                v-if="locale === lang.value"
                class="ml-auto h-3.5 w-3.5 text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
