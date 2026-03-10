<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { showImagePreview } from 'vant'
import 'vant/es/image-preview/style'
import { getAssetPath } from '@/utils/path'

interface TemplateItem {
  img: string
  big: string
  bottom?: string
}

interface TemplateGroup {
  titleKey: string
  subtitleKey: string
  type: 'h5' | 'pc'
  slidesPerView: number
  items: TemplateItem[]
}

const { t } = useI18n()
const isMobile = ref(false)

onMounted(() => {
  const updateIsMobile = () => {
    isMobile.value = window.innerWidth < 768
  }
  window.addEventListener('resize', updateIsMobile)
  updateIsMobile()
})

// 使用 Vant ImagePreview 取代原有的 Modal 邏輯
const showBig = (group: TemplateGroup, currentIndex: number) => {
  const images = group.items.map((item) => item.big)

  showImagePreview({
    images,
    startPosition: currentIndex,
    closeable: true,
    closeIconPosition: 'top-right',
  })
}

const onSwiperInit = (swiper: any) => {
  if (swiper.params.navigation) {
    swiper.navigation.init()
    swiper.navigation.update()
  }
}

const templateGroups: TemplateGroup[] = [
  {
    titleKey: 'templateDemo.groups.forumH5',
    subtitleKey: 'templateDemo.clickTip',
    type: 'h5',
    slidesPerView: 3,
    items: [
      {
        img: getAssetPath('demo/h5/h5_forum_template1.png'),
        big: getAssetPath('demo/h5/big_h5_forum_template1.png'),
        bottom: getAssetPath('demo/h5/h5_forum_bottom_template1.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_forum_template2.png'),
        big: getAssetPath('demo/h5/big_h5_forum_template2.png'),
        bottom: getAssetPath('demo/h5/h5_forum_bottom_template1.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_forum_template3.png'),
        big: getAssetPath('demo/h5/big_h5_forum_template3.png'),
        bottom: getAssetPath('demo/h5/h5_forum_bottom_template3.png'),
      },
      { img: getAssetPath('demo/h5/h5_forum_template4.png'), big: getAssetPath('demo/h5/big_h5_forum_template4.png') },
      {
        img: getAssetPath('demo/h5/h5_forum_template5.png'),
        big: getAssetPath('demo/h5/big_h5_forum_template5.png'),
        bottom: getAssetPath('demo/h5/h5_forum_bottom_template5.png'),
      },
    ],
  },
  {
    titleKey: 'templateDemo.groups.generalPC',
    subtitleKey: 'templateDemo.clickTip',
    type: 'pc',
    slidesPerView: 3,
    items: Array.from({ length: 9 }, (_, i) => ({
      img: getAssetPath(`demo/pc/pc_template${i + 1}.png`),
      big: getAssetPath(`demo/pc/big_pc_template${i + 1}.png`),
    })),
  },
  {
    titleKey: 'templateDemo.groups.generalH5',
    subtitleKey: 'templateDemo.clickTip',
    type: 'h5',
    slidesPerView: 3,
    items: [
      {
        img: getAssetPath('demo/h5/h5_template1.png'),
        big: getAssetPath('demo/h5/big_h5_template1.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template1.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template2.png'),
        big: getAssetPath('demo/h5/big_h5_template2.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template2.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template18.png'),
        big: getAssetPath('demo/h5/big_h5_template18.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template18.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template3.png'),
        big: getAssetPath('demo/h5/big_h5_template3.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template2.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template4.png'),
        big: getAssetPath('demo/h5/big_h5_template4.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template3.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template16.png'),
        big: getAssetPath('demo/h5/big_h5_template16.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template16.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template5.png'),
        big: getAssetPath('demo/h5/big_h5_template5.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template3.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template17.png'),
        big: getAssetPath('demo/h5/big_h5_template17.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template17.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template7.png'),
        big: getAssetPath('demo/h5/big_h5_template7.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template2.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template8.png'),
        big: getAssetPath('demo/h5/big_h5_template8.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template2.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template9.png'),
        big: getAssetPath('demo/h5/big_h5_template9.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template2.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template10.png'),
        big: getAssetPath('demo/h5/big_h5_template10.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template2.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template11.png'),
        big: getAssetPath('demo/h5/big_h5_template11.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template2.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template12.png'),
        big: getAssetPath('demo/h5/big_h5_template12.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template2.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template13.png'),
        big: getAssetPath('demo/h5/big_h5_template13.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template4.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template14.png'),
        big: getAssetPath('demo/h5/big_h5_template14.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template2.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template15.png'),
        big: getAssetPath('demo/h5/big_h5_template15.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template2.png'),
      },
      {
        img: getAssetPath('demo/h5/h5_template6.png'),
        big: getAssetPath('demo/h5/big_h5_template6.png'),
        bottom: getAssetPath('demo/h5/h5_bottom_template2.png'),
      },
    ],
  },
  {
    titleKey: 'templateDemo.groups.nationalH5',
    subtitleKey: 'templateDemo.clickTip',
    type: 'h5',
    slidesPerView: 3,
    items: Array.from({ length: 10 }, (_, i) => ({
      img: getAssetPath(`demo/h5/h5_national_template${i + 1}.png`),
      big: getAssetPath(`demo/h5/big_h5_national_template${i + 1}.png`),
      bottom: getAssetPath(`demo/h5/h5_national_bottom_template${i + 1}.png`),
    })),
  },
  {
    titleKey: 'templateDemo.groups.nationalPC',
    subtitleKey: 'templateDemo.clickTip',
    type: 'pc',
    slidesPerView: 3,
    items: Array.from({ length: 6 }, (_, i) => ({
      img: getAssetPath(`demo/pc/pc_national_template${i + 1}.png`),
      big: getAssetPath(`demo/pc/big_pc_national_template${i + 1}.png`),
    })),
  },
  {
    titleKey: 'templateDemo.groups.betH5',
    subtitleKey: 'templateDemo.clickTip',
    type: 'h5',
    slidesPerView: 3,
    items: Array.from({ length: 4 }, (_, i) => ({
      img: getAssetPath(`demo/h5/h5_bet_template${i + 1}.png`),
      big: getAssetPath(`demo/h5/h5_bet_template${i + 1}.png`),
    })),
  },
]
</script>

<template>
  <div class="mainContent mx-auto min-h-screen overflow-hidden text-white">
    <header class="py-12 text-center">
      <h1 class="mb-3 text-4xl font-black uppercase tracking-[10px] text-white md:text-5xl">
        {{ t('templateDemo.mainTitle') }}
      </h1>
      <div class="flex items-center justify-center gap-4">
        <span class="h-[1px] w-12 bg-blue-500/50"></span>
        <p class="text-xl font-bold uppercase tracking-widest text-blue-400">
          {{ t('templateDemo.mainSubtitle') }}
        </p>
        <span class="h-[1px] w-12 bg-blue-500/50"></span>
      </div>
    </header>

    <main class="space-y-24 bg-transparent px-4 py-16">
      <section
        v-for="(group, gIndex) in templateGroups"
        :key="gIndex"
        class="group/section"
      >
        <div class="mb-10 flex flex-col justify-between gap-4 px-4 md:flex-row md:items-end">
          <div>
            <h2 class="flex items-center gap-3 text-2xl font-bold text-gray-100">
              <span class="h-8 w-1.5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></span>
              {{ t(group.titleKey) }}
            </h2>
            <p class="mt-2 text-sm font-medium text-emerald-400 opacity-80">
              {{ t(group.subtitleKey) }}
            </p>
          </div>
        </div>

        <div class="relative px-2 md:px-4">
          <swiper
            @swiper="onSwiperInit"
            :slides-per-view="isMobile ? 1.2 : group.slidesPerView"
            :space-between="25"
            class="!overflow-visible"
          >
            <swiper-slide
              v-for="(item, i) in group.items"
              :key="i"
            >
              <div
                @click="showBig(group, i)"
                class="template-card group/card relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#121212] transition-all duration-500 hover:border-blue-500/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              >
                <div
                  :class="group.type === 'h5' ? 'h-[500px]' : 'h-[320px]'"
                  class="scrollbar-hide overflow-y-auto bg-black"
                >
                  <img
                    :src="item.img"
                    class="w-full transition-all duration-500 group-hover/card:opacity-60"
                    loading="lazy"
                  />
                </div>
                <div
                  v-if="item.bottom"
                  class="border-t border-white/5 bg-[#1a1a1a]"
                >
                  <img
                    :src="item.bottom"
                    class="w-full opacity-80"
                  />
                </div>
                <div
                  class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                >
                  <span
                    class="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                  >
                    {{ t('templateDemo.viewBig') }}
                  </span>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
:deep(.swiper) {
  overflow: visible !important;
}
.template-card {
  will-change: transform;
}
</style>
