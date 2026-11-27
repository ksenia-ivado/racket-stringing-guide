import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site from /<repo-name>/; the deploy workflow sets BASE_PATH.
  base: process.env.BASE_PATH ?? '/',
  build: {
    // Two pages: the stringing guide and the live tennis page.
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('index.html', import.meta.url)),
        tennis: fileURLToPath(new URL('tennis.html', import.meta.url)),
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Forward API calls to the FastAPI backend during development.
      '/api': 'http://localhost:8000',
    },
  },
})
