import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface ScratchRecord {
  id: number
  prizes: string[]
  winCount: number
  time: string
}

export const useScratchStore = defineStore(
  'scratch',
  () => {
    const records = ref<ScratchRecord[]>([])

    const addRecord = (prizes: string[], winCount: number) => {
      records.value.unshift({
        id: Date.now(),
        prizes,
        winCount,
        time: new Date().toLocaleString(),
      })
    }

    const clearRecords = () => {
      records.value = []
    }

    return { records, addRecord, clearRecords }
  },
  {
    persist: {
      key: 'scratch-card-history',
      storage: localStorage,
      pick: ['records'],
    },
  },
)
