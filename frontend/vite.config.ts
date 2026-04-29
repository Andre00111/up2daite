import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Im Dev-Modus (npm run dev) werden /api-Requests an das lokale Backend weitergeleitet.
      // Damit muss im Frontend keine absolute URL konfiguriert werden.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
