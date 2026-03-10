<script setup lang="ts">
import type { Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { ExternalLink, Monitor, ShieldCheck, Zap } from 'lucide-vue-next'
import { getAssetPath } from '@/utils/path'

const { t } = useI18n()

interface DemoItem {
  id: string
  title: string
  url: string
  icon: Component
  activeClass: string
  btnClass: string
  iconClass: string
}

const demoItems: DemoItem[] = [
  {
    id: 'pc01',
    title: 'DEMO 1',
    url: getAssetPath('pc01/index.html'),
    icon: ShieldCheck,
    activeClass: 'hover:border-blue-500/50',
    btnClass: 'bg-blue-600 hover:bg-blue-500',
    iconClass: 'text-blue-500',
  },
  {
    id: 'pc02',
    title: 'DEMO 2',
    url: getAssetPath('pc02/index.html'),
    icon: Zap,
    activeClass: 'hover:border-emerald-500/50',
    btnClass: 'bg-emerald-600 hover:bg-emerald-500',
    iconClass: 'text-emerald-500',
  },
]
</script>

<template>
  <div class="mainContent">
    <div class="mx-auto max-w-4xl">
      <div class="mb-16 text-center">
        <h2 class="mb-4 flex items-center justify-center gap-3 text-4xl font-bold">
          <Monitor class="h-8 w-8 text-blue-500" />
          {{ t('pcPlatform.title') }}
        </h2>
        <!-- <p class="mx-auto max-w-lg text-gray-400">
          {{ t('pcPlatform.desc') }}
        </p> -->
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div
          v-for="item in demoItems"
          :key="item.id"
          class="group relative rounded-2xl border border-white/10 bg-[#1a1a1a] p-8 shadow-2xl transition-all duration-300 hover:-translate-y-2"
          :class="item.activeClass"
        >
          <div class="mb-4 flex justify-center">
            <component
              :is="item.icon"
              class="h-10 w-10 opacity-80"
              :class="item.iconClass"
            />
          </div>

          <h3 class="mb-6 text-center text-2xl font-bold tracking-tight">{{ item.title }}</h3>

          <a
            :href="item.url"
            target="_blank"
            class="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium text-white shadow-lg transition-all"
            :class="item.btnClass"
          >
            {{ t('pcPlatform.openBtn') }}
            <ExternalLink class="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </a>
        </div>
      </div>

      <div class="mt-20 text-center opacity-30">
        <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
      </div>
    </div>
  </div>
</template>
