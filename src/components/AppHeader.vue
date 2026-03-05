<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ChevronDown, Globe, House, LogIn, LogOut } from 'lucide-vue-next'
import { showToast } from 'vant'
import { usePopupStore } from '@/stores/popup'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { t, locale } = useI18n()
const popupStore = usePopupStore()

const handleLanguageChange = (event: Event) => {
  const newLang = (event.target as HTMLSelectElement).value
  router.push({
    name: route.name || 'home',
    params: { ...route.params, lang: newLang },
  })
}

const handleLoginClick = () => {
  popupStore.openPopup('login')
}

const handleLogout = () => {
  showToast({
    message: t('login.logout_success'),
    type: 'success',
    duration: 1500,
  })
  setTimeout(() => {
    userStore.logout()
  }, 1500)
}
</script>

<template>
  <div class="sticky top-0 z-[100] flex h-14 items-center justify-between bg-[#1a1d29] px-4">
    <div
      v-if="route.name !== 'home'"
      @click="$router.push({ name: 'home', params: { lang: route.params.lang } })"
      class="flex cursor-pointer items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-white/90 shadow-sm backdrop-blur-md transition-all hover:bg-white/15 hover:text-white active:scale-95"
    >
      <House class="h-4 w-4" />
      <span class="text-sm font-medium">{{ t('header.home') }}</span>
    </div>
    <div v-else></div>

    <div class="flex items-center gap-4">
      <div class="flex gap-1">
        <button
          v-if="!userStore.isLogin"
          @click="handleLoginClick"
          class="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-white/90 backdrop-blur-md hover:bg-white/20"
        >
          <LogIn class="h-4 w-4" />
          <span class="text-sm font-medium">{{ t('header.login') }}</span>
        </button>

        <div
          v-else
          class="flex items-center gap-1"
        >
          <!-- <div class="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-white/90">
            <User class="h-4 w-4" />
            <span class="text-sm">{{ t('header.user') }}</span>
          </div> -->

          <button
            @click="handleLogout"
            class="flex items-center gap-1 rounded-lg border border-red-500/50 bg-red-500/10 px-2 py-1 text-red-400 hover:bg-red-500/20"
          >
            <LogOut class="h-4 w-4" />
            <span class="text-sm font-medium">{{ t('header.logout') }}</span>
          </button>
        </div>
      </div>

      <div
        class="relative flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-white/90 shadow-sm backdrop-blur-md transition-all hover:bg-white/15"
      >
        <Globe class="h-4 w-4 flex-shrink-0" />
        <select
          :value="locale"
          @change="handleLanguageChange"
          class="cursor-pointer border-none bg-transparent pr-4 text-sm text-white outline-none focus:outline-none"
        >
          <option value="zh-TW">繁體中文</option>
          <option value="zh-CN">简体中文</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
        </select>
        <ChevronDown class="pointer-events-none absolute right-2 h-4 w-4 opacity-70" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
