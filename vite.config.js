import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = process.cwd().replace(/\\/g, '/');

export default defineConfig({
  root: 'frontend',
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  resolve: {
    alias: [
      { find: '@', replacement: `${rootDir}/frontend/src` }
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
});
