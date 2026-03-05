<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { showDialog } from 'vant'

interface Prize {
  name: string
  color: string
}

const { t } = useI18n()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isSpinning = ref(false)
const canvasSize = ref(300)

// 獎項資料
const prizes: Prize[] = [
  { name: '100 點數', color: '#FF6B6B' },
  { name: '再接再厲', color: '#4ECDC4' },
  { name: '50 點數', color: '#FFE66D' },
  { name: '免費咖啡', color: '#1A535C' },
  { name: '10 點數', color: '#F7FFF7' },
  { name: '200 點數', color: '#FF9F1C' },
  { name: '神秘小禮', color: '#7067CF' },
  { name: '神秘小禮', color: '#FF9F1C' },
]

const numSectors = prizes.length
const arc = (2 * Math.PI) / numSectors

// --- 關鍵設定：初始角度讓第一格中心對準 12 點鐘 ---
let currentRotation = -Math.PI / 2 - arc / 2

// 響應式尺寸計算
const updateCanvasSize = () => {
  const padding = 60 // 預留邊框空間
  const screenWidth = window.innerWidth - padding
  canvasSize.value = Math.min(screenWidth, 500)
  // 尺寸改變後需要重新繪製
  setTimeout(() => drawWheel(), 0)
}

onMounted(() => {
  updateCanvasSize()
  window.addEventListener('resize', updateCanvasSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasSize)
})

// --- 繪圖邏輯 ---
const drawWheel = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const cw = canvas.width
  const ch = canvas.height
  const rad = cw / 2

  ctx.clearRect(0, 0, cw, ch)

  // --- 優化後的配色：拉大對比度 ---
  const colorThemes: [string, string][] = [
    ['#e62e4d', '#7a1425'],
    ['#ffffff', '#d9c9a3'],
  ]

  prizes.forEach((prize, i) => {
    const angle = currentRotation + i * arc
    ctx.save()

    const theme = colorThemes[i % 2]!
    const colorStart = theme[0]
    const colorEnd = theme[1]

    // 使用徑向漸層 (Radial Gradient) ---
    // 參數：中心X, 中心Y, 起始半徑, 結束X, 結束Y, 結束半徑
    // 讓顏色從圓心向外擴散，會比線性漸層明顯非常多
    const gradient = ctx.createRadialGradient(rad, rad, rad * 0.1, rad, rad, rad)
    gradient.addColorStop(0, colorStart) // 中心較亮
    gradient.addColorStop(1, colorEnd) // 邊緣較深

    ctx.beginPath()
    ctx.fillStyle = gradient
    ctx.moveTo(rad, rad)
    ctx.arc(rad, rad, rad, angle, angle + arc)
    ctx.lineTo(rad, rad)
    ctx.fill()

    // 繪製分隔線
    ctx.strokeStyle = '#785323'
    ctx.lineWidth = 1
    ctx.stroke()

    // 繪製文字
    ctx.save()
    ctx.translate(rad, rad)
    ctx.rotate(angle + arc / 2)
    ctx.textAlign = 'right'

    // 文字顏色優化
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#961e31'

    const fontSize = Math.max(12, canvasSize.value / 22)
    ctx.font = `900 ${fontSize}px sans-serif`

    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 3
    ctx.fillText(prize.name, rad - canvasSize.value * 0.08, 10)

    ctx.restore()
    ctx.restore()
  })
}

// --- 旋轉邏輯 ---
const spin = () => {
  if (isSpinning.value) return
  isSpinning.value = true

  const extraDegree = Math.random() * 2 * Math.PI
  const totalRotation = 10 * 2 * Math.PI + extraDegree
  const startRotation = currentRotation
  const duration = 4000
  const startTime = performance.now()

  const animate = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    currentRotation = startRotation + totalRotation * easeOut

    drawWheel()

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      isSpinning.value = false

      // --- 12 點鐘位置判定校準 ---
      const pointerAngle = -Math.PI / 2
      const actualRotation = currentRotation % (2 * Math.PI)
      let relativeAngle = pointerAngle - actualRotation

      while (relativeAngle < 0) relativeAngle += 2 * Math.PI
      const prizeIndex = Math.floor(relativeAngle / arc) % numSectors

      const winningPrizeObj = prizes[prizeIndex]

      // 檢查物件是否存在 (解決 TS undefined 報錯)
      if (winningPrizeObj) {
        showDialog({
          title: t('wheel.congrats'),
          message: winningPrizeObj.name,
          theme: 'round-button',
          confirmButtonColor: '#4f46e5',
        })
      }
    }
  }
  requestAnimationFrame(animate)
}
</script>

<template>
  <div class="mainContent flex min-h-screen flex-col items-center py-10">
    <div class="mb-8 text-center">
      <img
        src="@/assets/images/luckySpin/luck_spin.png"
        class="max-w-[300px] md:max-w-[500px]"
        alt="Lucky Spin"
      />
    </div>

    <div
      class="wheel-golden-frame relative flex items-center justify-center rounded-full"
      :class="{ 'is-spinning-active': isSpinning }"
    >
      <img
        src="@/assets/images/luckySpin/pointer_center.png"
        class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer drop-shadow-xl transition-transform hover:scale-110 active:scale-95"
        :style="{ width: canvasSize * 0.22 + 'px' }"
        @click="spin"
        alt="spin"
      />

      <canvas
        ref="canvasRef"
        :width="canvasSize"
        :height="canvasSize"
        class="relative z-0 overflow-hidden rounded-full transition-all duration-300"
      ></canvas>
    </div>
  </div>
</template>

<style scoped>
.wheel-golden-frame {
  padding: 15px;
  background: linear-gradient(135deg, #fff9c4 0%, #fdd835 25%, #fbc02d 50%, #fdd835 75%, #fff9c4 100%);
  box-shadow:
    0 0 25px rgba(253, 216, 53, 0.4),
    0 10px 25px rgba(0, 0, 0, 0.6),
    inset 0 0 12px rgba(255, 255, 255, 0.8),
    inset 0 0 18px rgba(0, 0, 0, 0.4);
  border: 2px solid #fff176;
  animation: shine-pulse 1.5s infinite ease-in-out;
}
@media (max-width: 500px) {
  .wheel-golden-frame {
    padding: 10px;
  }
}
@keyframes shine-pulse {
  0%,
  100% {
    box-shadow:
      0 0 20px rgba(253, 216, 53, 0.4),
      0 10px 20px rgba(0, 0, 0, 0.6),
      inset 0 0 12px rgba(255, 255, 255, 0.7);
    transform: scale(1);
  }
  50% {
    box-shadow:
      0 0 45px rgba(253, 216, 53, 0.8),
      0 15px 30px rgba(0, 0, 0, 0.4),
      inset 0 0 18px rgba(255, 255, 255, 1);
    transform: scale(1.005);
  }
}
</style>
