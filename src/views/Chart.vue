<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import VChart from 'vue-echarts'
import axios from 'axios'
import { BarChart, LineChart } from 'echarts/charts'
import { DataZoomComponent, GridComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart3 as BarIcon, LineChart as LineIcon } from 'lucide-vue-next'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, DataZoomComponent])

const selectedCoin = ref('bitcoin')
const chartType = ref<'line' | 'bar'>('line')
const chartOptions = ref<any>(null)
const loading = ref(false)

interface Coin {
  name: string
  id: string
  color: string
  symbol: string
}

const coinList: Coin[] = [
  { name: 'Bitcoin', id: 'bitcoin', color: '#f7931a', symbol: 'BTC' },
  { name: 'Ethereum', id: 'ethereum', color: '#627eea', symbol: 'ETH' },
  { name: 'Solana', id: 'solana', color: '#14f195', symbol: 'SOL' },
  { name: 'BNB', id: 'binancecoin', color: '#F3BA2F', symbol: 'BNB' },
  { name: 'Dogecoin', id: 'dogecoin', color: '#C2A633', symbol: 'DOGE' },
  { name: 'Tether', id: 'tether', color: '#26a17b', symbol: 'USDT' },
]

const fetchCryptoData = async () => {
  loading.value = true
  try {
    const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${selectedCoin.value}/market_chart`, {
      params: { vs_currency: 'usd', days: '7' },
    })

    const prices = data.prices
    const activeCoin = coinList.find((c) => c.id === selectedCoin.value)
    const themeColor = activeCoin?.color || '#6366f1'

    chartOptions.value = {
      backgroundColor: 'transparent',
      textStyle: { color: 'rgba(255, 255, 255, 0.7)' },

      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(30, 34, 48, 0.9)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        padding: [10, 15],
        textStyle: { color: '#fff' },
        formatter: (params: any) => {
          const price = Number(params[0].value).toLocaleString('en-US', { minimumFractionDigits: 2 })
          return `<div class="text-[10px] opacity-50 mb-1">${params[0].name}</div>
                  <div class="font-bold flex items-center gap-2">
                    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${themeColor}"></span>
                    $${price}
                  </div>`
        },
      },
      grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
      dataZoom: [
        { type: 'inside', start: 60, end: 100 },
        {
          type: 'slider',
          height: 20,
          bottom: 5,
          borderColor: 'transparent',
          fillerColor: 'rgba(99, 102, 241, 0.1)',
          dataBackground: {
            lineStyle: { color: themeColor, opacity: 0.2 },
            areaStyle: { color: themeColor, opacity: 0.1 },
          },
          handleStyle: { color: themeColor },
        },
      ],
      xAxis: {
        type: 'category',
        data: prices.map((p: any) => {
          const d = new Date(p[0])
          return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:00`
        }),
        axisLabel: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
        axisLabel: { color: 'rgba(255, 255, 255, 0.5)', formatter: (value: number) => `$${value.toLocaleString()}` },
      },
      series: [
        {
          data: prices.map((p: any) => p[1].toFixed(2)),
          type: chartType.value,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 3, color: themeColor, shadowBlur: 10, shadowColor: themeColor },
          itemStyle: {
            color: themeColor,
            borderRadius: [4, 4, 0, 0],
          },
          areaStyle:
            chartType.value === 'line'
              ? {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: themeColor },
                      { offset: 1, color: 'transparent' },
                    ],
                  },
                  opacity: 0.2,
                }
              : null,
        },
      ],
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

watch([selectedCoin, chartType], () => fetchCryptoData())
onMounted(() => fetchCryptoData())
</script>

<template>
  <div class="mainContent py-8">
    <div
      class="overflow-hidden rounded-xl border border-white/10 bg-[#1e2230]/60 p-4 shadow-2xl backdrop-blur-xl sm:p-8"
    >
      <div class="mb-6 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h2 class="text-2xl font-black tracking-tight text-white sm:text-3xl">{{ $t('crypto.title') }}</h2>
          <div class="mt-1 flex items-center gap-2">
            <span class="flex h-2 w-2 items-center justify-center">
              <span class="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
            </span>
            <p class="text-xs font-medium uppercase tracking-widest text-gray-500">{{ $t('crypto.subtitle') }}</p>
          </div>
        </div>

        <div class="flex w-full justify-between gap-2 sm:w-auto">
          <div class="flex rounded-2xl border border-white/5 bg-black/30 p-1.5">
            <button
              @click="chartType = 'line'"
              :class="[
                chartType === 'line' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300',
              ]"
              class="flex items-center justify-center rounded-xl p-2 transition-all duration-300"
            >
              <LineIcon :size="18" />
            </button>
            <button
              @click="chartType = 'bar'"
              :class="[
                chartType === 'bar' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300',
              ]"
              class="flex items-center justify-center rounded-xl p-2 transition-all duration-300"
            >
              <BarIcon :size="18" />
            </button>
          </div>

          <div class="flex w-auto gap-4">
            <div class="relative inline-grid">
              <span class="invisible col-start-1 row-start-1 px-8 py-2 text-sm font-bold">
                {{ coinList.find((c) => c.id === selectedCoin)?.name }} ({{
                  coinList.find((c) => c.id === selectedCoin)?.symbol
                }})
              </span>

              <select
                v-model="selectedCoin"
                class="col-start-1 row-start-1 w-full appearance-none rounded-lg border border-white/5 bg-black/30 p-2 text-sm font-bold text-gray-300 outline-none transition-all focus:ring-2 focus:ring-indigo-500"
              >
                <option
                  v-for="coin in coinList"
                  :key="coin.id"
                  :value="coin.id"
                  class="bg-[#1e2230]"
                >
                  {{ coin.name }} ({{ coin.symbol }})
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="relative h-[400px] w-full rounded-3xl border border-white/5 bg-black/20">
        <div
          v-if="loading"
          class="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-[#1e2230]/40 backdrop-blur-md"
        >
          <div
            class="h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          ></div>
        </div>

        <v-chart
          :option="chartOptions"
          autoresize
          class="h-full w-full"
        />
      </div>

      <!-- <p class="mt-6 text-center text-[10px] uppercase tracking-widest text-gray-600">
        Real-time market data powered by Coingecko API
      </p> -->
    </div>
  </div>
</template>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
}
</style>
