// @/stores/wheel.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface WheelRecord {
  id: number
  prizeName: string
  time: string
  isWin: boolean
}

export const useWheelStore = defineStore(
  'wheel',
  () => {
    const records = ref<WheelRecord[]>([])

    // 新增紀錄
    const addRecord = (prizeName: string, isWin: boolean) => {
      records.value.unshift({
        id: Date.now(),
        prizeName,
        isWin,
        time: new Date().toLocaleString(),
      })
    }

    // 清空紀錄
    const clearRecords = () => {
      records.value = []
    }

    return { records, addRecord, clearRecords }
  },
  {
    persist: {
      key: 'lucky-wheel-history',
      storage: localStorage,
      pick: ['records'],
    },
  },
)
