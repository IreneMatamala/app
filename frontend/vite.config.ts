import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno basado en el mode
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true
        }
      }
    },
    // Inyectar variables de entorno en el build
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'process.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME)
    },
    test: {
      globals: true,
      environment: 'jsdom'
    }
  }
})
