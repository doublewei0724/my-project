<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { ArrowRightLeft, Info, RefreshCw } from 'lucide-vue-next'

const { t } = useI18n()

const API_KEY = '65ff15e80a19222c11f4adda'
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`

const amount = ref<number>(1)
const fromCurrency = ref('TWD')
const toCurrency = ref('USD')
const exchangeRate = ref<number>(0)
const lastUpdate = ref('')
const isLoading = ref(false)

const currencyCodes = [
  'TWD', // 台灣
  'NZD', // 紐西蘭
  'USD', // 美國
  'JPY', // 日本
  'EUR', // 歐盟
  'GBP', // 英國
  'KRW', // 韓國
  'HKD', // 香港
  'CNY', // 中國
  'SGD', // 新加坡
]

// 取得匯率邏輯
const fetchRate = async () => {
  if (fromCurrency.value === toCurrency.value) {
    exchangeRate.value = 1
    return
  }

  isLoading.value = true
  try {
    const res = await axios.get(`${BASE_URL}/latest/${fromCurrency.value}`)

    // 檢查 API 回傳狀態
    if (res.data.result === 'success') {
      exchangeRate.value = res.data.conversion_rates[toCurrency.value]
      lastUpdate.value = res.data.time_last_update_utc.substring(0, 16)
    }
  } catch (error) {
    console.error('API Error:', error)
  } finally {
    isLoading.value = false
  }
}

// 監聽幣別切換自動更新
watch([fromCurrency, toCurrency], () => fetchRate())

// 金額格式化
const formatCurrencyValue = (val: number, currencyCode: string) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: currencyCode,
    // minimumFractionDigits: 2,
    maximumFractionDigits: 20,
  }).format(val)
}

// 切換幣別
const swapCurrencies = () => {
  const temp = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = temp
}

onMounted(() => fetchRate())
</script>

<template>
  <div class="mainContent">
    <div class="overflow-hidden rounded-3xl border border-white/10 bg-[#1e2230]/60 shadow-2xl backdrop-blur-md">
      <div class="border-b border-white/5 bg-gradient-to-r from-indigo-600/40 to-purple-700/40 p-6 text-white">
        <h1 class="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
          {{ t('currency.title') }}
        </h1>
        <p class="mt-2 text-sm text-indigo-100/60 opacity-80">{{ t('currency.desc') }}</p>
      </div>

      <div class="space-y-4 p-6 sm:p-8">
        <div class="flex items-center gap-2">
          <label class="whitespace-nowrap text-sm font-medium uppercase tracking-wider text-gray-400">
            {{ t('currency.amount') }}
          </label>
          <input
            v-model.number="amount"
            type="number"
            min="0"
            placeholder="0.00"
            class="w-full border-b-2 border-white/10 bg-transparent px-0 font-bold text-white outline-none transition-colors focus:border-indigo-500"
          />
        </div>

        <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
          <div class="flex items-center gap-2">
            <label class="whitespace-nowrap text-sm font-medium text-gray-400">{{ t('currency.from') }}</label>
            <select
              v-model="fromCurrency"
              class="w-full cursor-pointer rounded-xl border-none bg-white/5 p-3 text-sm font-bold text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option
                v-for="code in currencyCodes"
                :key="code"
                :value="code"
                class="bg-[#1e2230] text-white"
              >
                {{ code }} ({{ t(`currencies.${code}`) }})
              </option>
            </select>
          </div>

          <button
            @click="swapCurrencies"
            class="group mx-auto flex h-14 w-14 transform items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-sm transition-all hover:bg-indigo-600 hover:text-white active:scale-95"
          >
            <ArrowRightLeft class="h-6 w-6 transition-transform duration-500 group-hover:rotate-180" />
          </button>

          <div class="flex items-center gap-2">
            <label class="whitespace-nowrap text-sm font-medium text-gray-400">{{ t('currency.to') }}</label>
            <select
              v-model="toCurrency"
              class="w-full cursor-pointer rounded-xl border-none bg-white/5 p-3 text-sm font-bold text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option
                v-for="code in currencyCodes"
                :key="code"
                :value="code"
                class="bg-[#1e2230] text-white"
              >
                {{ code }} ({{ t(`currencies.${code}`) }})
              </option>
            </select>
          </div>
        </div>

        <div class="relative mt-10 overflow-hidden rounded-3xl border border-white/5 bg-black/20 p-8 text-center">
          <div class="relative z-10">
            <p class="mb-2 text-sm font-medium text-indigo-400">{{ t('currency.result') }}</p>
            <div class="break-all text-2xl font-black text-white sm:text-4xl">
              <span v-if="!isLoading && exchangeRate > 0">
                {{ formatCurrencyValue(amount * exchangeRate, toCurrency) }}
              </span>
              <span
                v-else
                class="animate-pulse text-gray-600"
              >
                ...
              </span>
            </div>

            <div class="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Info class="h-3 w-3 text-indigo-400" />
              <span>1 {{ fromCurrency }} = {{ exchangeRate }} {{ toCurrency }}</span>
            </div>
          </div>

          <div class="absolute -bottom-4 -right-4 select-none text-8xl font-black italic text-white/[0.03]">
            {{ toCurrency }}
          </div>
        </div>

        <div class="flex flex-col items-center justify-between gap-2 px-2 text-[10px] text-gray-500 sm:flex-row">
          <div class="flex items-center gap-1">
            <RefreshCw
              class="h-3 w-3"
              :class="{ 'animate-spin': isLoading }"
            />
            <span>{{ t('currency.updateTime') }}: {{ lastUpdate }}</span>
          </div>
          <a
            href="https://www.exchangerate-api.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-indigo-400/60 transition-colors hover:text-indigo-400 hover:underline"
          >
            Data via ExchangeRate-API
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
select {
  transition: all 0.2s ease-in-out;
}
</style>
