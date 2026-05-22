import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: 'frontend',
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  resolve: {
    alias: [
      { find: '@', replacement: '/frontend/src' }
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
})
