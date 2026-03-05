<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { FerrisWheel, RefreshCw, ShoppingCart } from 'lucide-vue-next'

const { t } = useI18n()

interface Project {
  titleKey: string
  name: string
  icon: any
}

const projects: Project[] = [
  {
    titleKey: 'products.title',
    name: 'products',
    icon: ShoppingCart,
  },
  {
    titleKey: 'currency.title',
    name: 'currency',
    icon: RefreshCw,
  },
  {
    titleKey: 'wheel.title',
    name: 'wheel',
    icon: FerrisWheel,
  },
]
</script>

<template>
  <div class="mainContent">
    <header class="mx-auto mb-12 max-w-6xl text-center">
      <h1 class="mb-4 text-4xl font-bold text-white">{{ t('home.title') }}</h1>
      <p class="text-white opacity-90">{{ t('home.subtitle_1') }},{{ t('home.subtitle_2') }}</p>
      <p class="text-indigo-200/60">Vite, Vue 3, TypeScript, Pinia, Tailwind CSS, Vant</p>
    </header>

    <div class="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
      <div
        v-for="project in projects"
        :key="project.name"
        class="group overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      >
        <div class="flex h-48 items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500">
          <component
            :is="project.icon"
            class="h-20 w-20 text-white transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div class="flex h-[150px] flex-col gap-2 p-6">
          <h2 class="text-xl font-bold text-gray-800">{{ t(project.titleKey) }}</h2>
          <div class="flex-grow"></div>
          <router-link
            :to="{
              name: project.name,
              params: { lang: $route.params.lang || 'zh-TW' },
            }"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-indigo-700"
          >
            {{ t('home.viewProject') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
