<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import GlobalPopup from '@/components/popup/GlobalPopup.vue'

const cursorRef = ref<HTMLElement | null>(null)

const updateMouse = (e: MouseEvent) => {
  if (cursorRef.value) {
    gsap.to(cursorRef.value, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.3,
      ease: 'power2.out',
    })
  }
}

onMounted(() => {
  window.addEventListener('mousemove', updateMouse)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMouse)
})
</script>

<template>
  <div class="relative min-h-screen text-white selection:bg-indigo-500/30">
    <div
      ref="cursorRef"
      class="pointer-events-none fixed left-0 top-0 z-[9999] -ml-4 -mt-4 hidden h-8 w-8 rounded-full border border-indigo-400/40 md:block"
    ></div>

    <div class="relative z-10 flex min-h-screen flex-col">
      <router-view />
    </div>

    <GlobalPopup />
  </div>
</template>
