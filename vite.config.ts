import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import { URL, fileURLToPath } from 'node:url'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/my-project/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      // 將 @ 指向 src 目錄
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  build: {
    rollupOptions: {
      output: {
        sanitizeFileName(name) {
          return name.replace(/^_/, '')
        },
      },
    },
  },
}))
