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

const coinList = [
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

    chartOptions.value = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: 0,
        textStyle: { color: '#333' },
        formatter: (params: any) => {
          const price = Number(params[0].value).toLocaleString('en-US', { minimumFractionDigits: 2 })
          return `<div class="text-xs text-gray-500">${params[0].name}</div>
                  <div class="font-bold text-gray-800">$${price}</div>`
        },
      },
      grid: { left: '2%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
      dataZoom: [
        { type: 'inside', start: 70, end: 100 },
        { type: 'slider', height: 18, bottom: 5 },
      ],
      xAxis: {
        type: 'category',
        data: prices.map((p: any) => {
          const d = new Date(p[0])
          return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:00`
        }),
        axisLabel: { color: '#9ca3af', fontSize: 10, rotate: 30 },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        axisLabel: { color: '#9ca3af', formatter: (value: number) => value.toLocaleString() },
      },
      series: [
        {
          data: prices.map((p: any) => p[1].toFixed(2)),
          type: chartType.value,
          smooth: chartType.value === 'line',
          showSymbol: false,
          itemStyle: {
            color: activeCoin?.color || '#3b82f6',
            borderRadius: chartType.value === 'bar' ? [4, 4, 0, 0] : [0, 0, 0, 0],
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
                      { offset: 0, color: activeCoin?.color },
                      { offset: 1, color: 'rgba(255, 255, 255, 0)' },
                    ],
                  },
                  opacity: 0.15,
                }
              : null,
        },
      ],
    }
  } catch (error) {
    console.error('Fetch error:', error)
  } finally {
    loading.value = false
  }
}

watch([selectedCoin, chartType], () => fetchCryptoData())
onMounted(() => fetchCryptoData())
</script>

<template>
  <div class="min-h-[400px] bg-gray-50 p-4 font-sans md:p-8">
    <div class="mx-auto rounded-3xl shadow-sm">
      <div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 class="text-xl font-bold text-gray-800">{{ $t('crypto.title') }}</h2>
          <p class="text-sm text-gray-500">{{ $t('crypto.subtitle') }}</p>
        </div>

        <div class="flex w-full items-center gap-4 sm:w-auto">
          <div class="flex rounded-xl bg-gray-100 p-1.5">
            <button
              @click="chartType = 'line'"
              :class="[chartType === 'line' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600']"
              class="flex items-center justify-center rounded-lg p-2 transition-all"
              title="Line Chart"
            >
              <LineIcon :size="20" />
            </button>
            <button
              @click="chartType = 'bar'"
              :class="[chartType === 'bar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600']"
              class="flex items-center justify-center rounded-lg p-2 transition-all"
              title="Bar Chart"
            >
              <BarIcon :size="20" />
            </button>
          </div>

          <select
            v-model="selectedCoin"
            class="flex-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 outline-none transition-all focus:ring-2 focus:ring-blue-100 sm:flex-none"
          >
            <option
              v-for="coin in coinList"
              :key="coin.id"
              :value="coin.id"
            >
              {{ coin.name }}({{ coin.symbol }})
            </option>
          </select>
        </div>
      </div>

      <div class="relative h-[350px] w-full rounded-2xl bg-gray-50/30">
        <div
          v-if="loading"
          class="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm"
        >
          <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
        <v-chart
          :option="chartOptions"
          autoresize
          class="h-full w-full"
        />
      </div>
    </div>
  </div>
</template>
