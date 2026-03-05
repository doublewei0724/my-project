<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
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

const prizes = computed<Prize[]>(() => [
  { name: `100 USDT`, color: '#FF6B6B' },
  { name: t('wheel.betterLuck'), color: '#4ECDC4' },
  { name: `50 USDT`, color: '#FFE66D' },
  { name: t('wheel.betterLuck'), color: '#1A535C' },
  { name: `20 USDT`, color: '#F7FFF7' },
  { name: t('wheel.betterLuck'), color: '#FF9F1C' },
  { name: `10 USDT`, color: '#7067CF' },
  { name: t('wheel.betterLuck'), color: '#FF9F1C' },
])

const numSectors = computed(() => prizes.value.length)
const arc = computed(() => (2 * Math.PI) / numSectors.value)

// 初始角度
let currentRotation = -Math.PI / 2 - (2 * Math.PI) / 8 / 2

const updateCanvasSize = () => {
  const padding = 60
  const screenWidth = window.innerWidth - padding
  canvasSize.value = Math.min(screenWidth, 500)
  setTimeout(() => drawWheel(), 0)
}

onMounted(async () => {
  updateCanvasSize()
  window.addEventListener('resize', updateCanvasSize)
  await document.fonts.ready
  drawWheel()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasSize)
})

const drawWheel = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const cw = canvas.width
  const ch = canvas.height
  const rad = cw / 2

  ctx.clearRect(0, 0, cw, ch)

  const colorThemes: [string, string][] = [
    ['#e62e4d', '#7a1425'],
    ['#ffffff', '#d9c9a3'],
  ]

  prizes.value.forEach((prize, i) => {
    const startAngle = currentRotation + i * arc.value
    const endAngle = startAngle + arc.value
    const centerAngle = startAngle + arc.value / 2

    // 1. 繪製背景扇區
    ctx.save()
    const theme = colorThemes[i % 2]!
    const gradient = ctx.createRadialGradient(rad, rad, rad * 0.1, rad, rad, rad)
    gradient.addColorStop(0, theme[0])
    gradient.addColorStop(1, theme[1])
    ctx.beginPath()
    ctx.fillStyle = gradient
    ctx.moveTo(rad, rad)
    ctx.arc(rad, rad, rad, startAngle, endAngle)
    ctx.lineTo(rad, rad)
    ctx.fill()
    ctx.strokeStyle = '#785323'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.restore()

    // 2. 繪製多行文字
    ctx.save()
    ctx.translate(rad, rad)
    ctx.rotate(centerAngle)
    ctx.rotate(Math.PI / 2) // 旋轉 90 度

    const fontSize = Math.max(10, canvasSize.value / 25)
    ctx.font = `900 ${fontSize}px 'Inter', 'Noto Sans TC', sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#961e31'

    // 設定換行寬度限制 (扇區寬度的 80%)
    const maxWidth = arc.value * rad * 0.8
    const words = prize.name.split(' ')
    let lines = []
    let currentLine = words[0]

    // 英文斷行邏輯
    if (words.length > 1) {
      for (let n = 1; n < words.length; n++) {
        const testLine = currentLine + ' ' + words[n]
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && n > 0) {
          lines.push(currentLine)
          currentLine = words[n]
        } else {
          currentLine = testLine
        }
      }
      lines.push(currentLine)
    } else {
      // 中文或單詞太長，直接給值
      lines = [prize.name]
    }

    // 計算文字位置
    const textOffset = rad * 0.75
    const lineHeight = fontSize * 1.1 // 行高

    lines.forEach((line, index) => {
      if (line !== undefined) {
        // 雙重保證解決 TS 報錯
        const yPos = -textOffset + (index - (lines.length - 1) / 2) * lineHeight
        ctx.fillText(line, 0, yPos)
      }
    })

    ctx.restore()
  })
}

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

      const pointerAngle = -Math.PI / 2
      const actualRotation = currentRotation % (2 * Math.PI)
      let relativeAngle = pointerAngle - actualRotation

      while (relativeAngle < 0) relativeAngle += 2 * Math.PI
      const prizeIndex = Math.floor(relativeAngle / arc.value) % numSectors.value

      const winningPrizeObj = prizes.value[prizeIndex]

      if (winningPrizeObj) {
        showDialog({
          // title: t('wheel.congrats'),
          message: winningPrizeObj.name,
          theme: 'round-button',
          confirmButtonColor: '#4f46e5',
        })
      }
    }
  }
  requestAnimationFrame(animate)
}

watch(
  prizes,
  () => {
    drawWheel()
  },
  { deep: true },
)
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
