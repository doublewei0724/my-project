<script setup lang="ts">
import { FerrisWheel, LineChart as LineIcon, RefreshCw, ShoppingCart } from 'lucide-vue-next'
import ProjectCard from '@/components/ProjectCard.vue'

const projects = [
  {
    titleKey: 'products.title',
    descriptionKey: 'products.desc',
    name: 'products',
    icon: ShoppingCart,
    color: 'from-blue-500/20 to-indigo-500/20',
  },
  {
    titleKey: 'currency.title',
    descriptionKey: 'currency.desc',
    name: 'currency',
    icon: RefreshCw,
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    titleKey: 'wheel.title',
    descriptionKey: 'wheel.desc',
    name: 'wheel',
    icon: FerrisWheel,
    color: 'from-orange-500/20 to-red-500/20',
  },
  {
    titleKey: 'crypto.title',
    descriptionKey: 'crypto.desc',
    name: 'chart',
    icon: LineIcon,
    color: 'from-purple-500/20 to-pink-500/20',
  },
]
</script>

<template>
  <div class="mainContent px-6 py-12">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <ProjectCard
        v-for="(project, index) in projects"
        :key="project.name"
        :project="project"
        :index="index"
      />
    </div>
  </div>
</template>
