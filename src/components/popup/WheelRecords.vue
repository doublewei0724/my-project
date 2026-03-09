<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useWheelStore } from '@/stores/wheel'

const { t } = useI18n()
const wheelStore = useWheelStore()
const { records } = storeToRefs(wheelStore)
</script>

<template>
  <div class="lucky-record-container w-full text-white">
    <div class="mb-6 text-center">
      <h3
        class="bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-2xl font-black italic tracking-widest text-transparent"
      >
        {{ t('wheel.historyTitle') }}
      </h3>
      <div class="mx-auto mt-1 h-[2px] w-16 rounded-full bg-gray-300 shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
    </div>

    <div
      v-if="records.length > 0"
      class="record-list custom-scrollbar max-h-[400px] overflow-y-auto px-1"
    >
      <div
        v-for="item in records"
        :key="item.id"
        class="record-item group relative mb-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10"
      >
        <div class="flex flex-col gap-1">
          <span
            class="text-lg font-bold tracking-wide transition-colors"
            :class="item.isWin ? 'text-green-400' : 'text-gray-400'"
          >
            {{ item.prizeName }}
          </span>
          <span class="font-mono text-[10px] uppercase tracking-tighter text-gray-500">
            {{ item.time }}
          </span>
        </div>

        <div class="flex flex-col items-end">
          <span
            v-if="item.isWin"
            class="font-bold text-green-400"
          >
            {{ t('wheel.statusSuccess') }}
          </span>
          <span
            v-else
            class="font-bold text-gray-400"
          >
            {{ t('wheel.statusMissed') }}
          </span>
        </div>

        <div
          class="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-r-full bg-yellow-500 opacity-0 transition-opacity group-hover:opacity-100"
        ></div>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center py-16 opacity-40"
    >
      <p class="text-sm font-medium uppercase italic tracking-widest">{{ t('wheel.noRecords') }}</p>
    </div>

    <button
      @click="$emit('close')"
      class="mt-6 w-full rounded-lg border border-white/20 bg-white/10 py-3 font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md transition-all hover:bg-white/20 active:scale-[0.98]"
    >
      {{ t('common.confirm') }}
    </button>
  </div>
</template>

<style scoped>
.record-item {
  box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.02);
}

/* 自定義滾動條 */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #525151;
  border-radius: 10px;
}

/* 列表進入動畫 */
.record-list > div {
  animation: slideIn 0.4s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 讓列表項依次延遲顯示 */
.record-list > div:nth-child(1) {
  animation-delay: 0.1s;
}
.record-list > div:nth-child(2) {
  animation-delay: 0.2s;
}
.record-list > div:nth-child(3) {
  animation-delay: 0.3s;
}
</style>
