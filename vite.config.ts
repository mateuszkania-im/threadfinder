import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
// `base` is set for any build so assets resolve under the GitHub Pages
// project path (mateuszkania-im.github.io/threadfinder/). Dev stays at '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/threadfinder/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
