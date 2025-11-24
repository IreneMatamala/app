// Este archivo configura Vite (la herramienta que construye tu frontend)
// Vite es MUY RÁPIDO para desarrollo y construcción


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'src/index.html')  // Buscar en src/
    }
  }
})
