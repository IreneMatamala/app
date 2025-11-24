// Este archivo configura Vite (la herramienta que construye tu frontend)
// Vite es MUY RÁPIDO para desarrollo y construcción
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Tu backend local
        changeOrigin: true
      }
    }
  }
})
