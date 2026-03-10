<script setup lang="ts">
import type { Component } from 'vue'
import { FerrisWheel, Layers3, LineChart as LineIcon, Monitor, RefreshCw, ShoppingCart } from 'lucide-vue-next'
import ProjectCard from '@/components/ProjectCard.vue'

interface Project {
  titleKey: string
  descriptionKey: string
  name: string
  icon: Component
  color: string
}

const projects: Project[] = [
  {
    titleKey: 'products.title',
    descriptionKey: 'products.desc',
    name: 'products',
    icon: ShoppingCart,
    color: 'from-blue-600/20 to-blue-400/20',
  },
  {
    titleKey: 'currency.title',
    descriptionKey: 'currency.desc',
    name: 'currency',
    icon: RefreshCw,
    color: 'from-emerald-600/20 to-emerald-400/20',
  },
  {
    titleKey: 'crypto.title',
    descriptionKey: 'crypto.desc',
    name: 'chart',
    icon: LineIcon,
    color: 'from-purple-600/20 to-purple-400/20',
  },
  {
    titleKey: 'wheel.title',
    descriptionKey: 'wheel.desc',
    name: 'wheel',
    icon: FerrisWheel,
    color: 'from-red-600/20 to-red-400/20',
  },
  {
    titleKey: 'templateDemo.title',
    descriptionKey: 'templateDemo.desc',
    name: 'templateDemo',
    icon: Layers3,
    color: 'from-cyan-600/20 to-cyan-400/20',
  },
  {
    titleKey: 'pcPlatform.title',
    descriptionKey: 'pcPlatform.desc',
    name: 'pcPlatform',
    icon: Monitor,
    color: 'from-orange-600/20 to-amber-400/20',
  },
]
</script>

<template>
  <div class="mainContent px-6 py-12">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
      <ProjectCard
        v-for="(project, index) in projects"
        :key="project.name"
        :project="project"
        :index="index"
      />
    </div>
  </div>
</template>
