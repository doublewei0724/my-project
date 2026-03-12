import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import path from 'path'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'

export default defineConfig(() => ({
  base: './',
  plugins: [vue()],
  build: {
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
    assetsDir: 'assets',
  },
  resolve: {
    alias: {
      // 將 @ 指向 src 目錄
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
}))
