<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMouseInElement } from '@vueuse/core'
import gsap from 'gsap'

const props = defineProps<{
  project: any
  index: number
}>()

const { t } = useI18n()
const target = ref<HTMLElement | null>(null)

// 取得滑鼠在目前卡片內的相對位置
const { elementX, elementY, isOutside, elementWidth, elementHeight } = useMouseInElement(target)

// 進場動畫邏輯
onMounted(async () => {
  if (!target.value) return
  // 確保 Vue 完成 DOM 更新
  await nextTick()

  // 1. 初始化位置與透明度 (取代 CSS 的 opacity-0)
  gsap.set(target.value, {
    y: 50,
    opacity: 0,
    scale: 0.9,
  })

  // 2. 執行進場動畫
  gsap.to(target.value, {
    y: 0,
    opacity: 1,
    scale: 1,
    duration: 0.8,
    delay: props.index * 0.1, // Stagger 效果
    ease: 'power2.out',
    // 動畫結束後清除 GSAP 屬性，避免鎖死樣式導致 cardStyle 無法發揮作用
    clearProps: 'opacity,transform',
  })
})

const cardStyle = computed(() => {
  // 如果滑鼠在外面，回歸初始狀態
  if (isOutside.value) {
    return {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.5s ease-out', // 離開時平滑回正
    }
  }

  // 計算旋轉角度：控制在 -15 ~ 15 度之間
  const rotateX = (elementY.value / elementHeight.value - 0.5) * -15
  const rotateY = (elementX.value / elementWidth.value - 0.5) * 15

  return {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
    transition: 'transform 0.1s ease-out', // 跟隨時保持靈敏
  }
})
</script>

<template>
  <div
    ref="target"
    :style="cardStyle"
    class="project-card group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1e2230]/60 shadow-2xl backdrop-blur-md"
  >
    <div :class="['flex h-40 items-center justify-center bg-gradient-to-br', project.color]">
      <component
        :is="project.icon"
        class="h-16 w-16 text-white transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
      />
    </div>

    <div class="flex flex-1 flex-col p-6">
      <h2 class="text-xl font-bold text-white transition-colors group-hover:text-indigo-400">
        {{ t(project.titleKey) }}
      </h2>
      <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-400">
        {{ t(project.descriptionKey) }}
      </p>

      <div class="flex-grow"></div>

      <router-link
        :to="{ name: project.name, params: { lang: $route.params.lang || 'zh-TW' } }"
        class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-indigo-600 hover:ring-indigo-500 active:scale-95"
      >
        {{ t('home.viewProject') }}
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  will-change: transform;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
</style>
