<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Megaphone } from 'lucide-vue-next'
import { useDailyStorage } from '@/composables/useDailyStorage'

const { t } = useI18n()
const { setMarkToday } = useDailyStorage()
const emit = defineEmits(['close'])

const dontShowToday = ref(false)
const STORAGE_KEY = 'hide_announcement_today'

onUnmounted(() => {
  if (dontShowToday.value) {
    setMarkToday(STORAGE_KEY)
  }
})

const handleConfirm = () => {
  emit('close')
}
</script>

<template>
  <div class="flex flex-col items-center text-center">
    <div
      class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 ring-4 ring-indigo-500/10"
    >
      <Megaphone
        class="text-indigo-400"
        :size="30"
      />
    </div>

    <h1 class="mb-6 text-3xl font-bold tracking-wide text-white">{{ t('home.title') }}</h1>

    <p class="px-4 text-base leading-relaxed text-white/90">
      {{ t('home.subtitle_1') }}
      <br />
      <span class="font-medium text-indigo-300">{{ t('home.subtitle_2') }}</span>
    </p>

    <div class="m-2 rounded-xl border border-white/5 bg-black/20 p-4">
      <p class="font-mono text-xs leading-relaxed text-indigo-200/70">
        Vite • Vue 3 • TypeScript • Pinia • Tailwind • Vant • Canvas • ECharts • gsap
      </p>
    </div>

    <button
      @click="handleConfirm"
      class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3 font-bold text-white shadow-lg shadow-indigo-900/20 transition-all hover:from-indigo-500 hover:to-blue-500 active:scale-95"
    >
      {{ t('common.confirm') }}
    </button>

    <div class="mt-4 flex w-full justify-end px-1">
      <label
        class="flex cursor-pointer items-center gap-2 text-xs text-indigo-200/50 transition-colors hover:text-indigo-200/80"
      >
        <input
          v-model="dontShowToday"
          type="checkbox"
          class="h-3.5 w-3.5 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-0"
        />
        {{ t('common.dont_show_today') }}
      </label>
    </div>
  </div>
</template>
