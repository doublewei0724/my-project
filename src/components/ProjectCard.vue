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

const { elementX, elementY, isOutside, elementWidth, elementHeight } = useMouseInElement(target)

// 進場動畫邏輯
onMounted(async () => {
  if (!target.value) return
  await nextTick()

  gsap.set(target.value, {
    y: 50,
    opacity: 0,
    scale: 0.9,
  })

  gsap.to(target.value, {
    y: 0,
    opacity: 1,
    scale: 1,
    duration: 0.8,
    delay: props.index * 0.1,
    ease: 'power2.out',
    clearProps: 'opacity,transform',
  })
})

const cardStyle = computed(() => {
  if (isOutside.value) {
    return {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.5s ease-out',
    }
  }

  const rotateX = (elementY.value / elementHeight.value - 0.5) * -15
  const rotateY = (elementX.value / elementWidth.value - 0.5) * 15

  return {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
    transition: 'transform 0.1s ease-out',
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
