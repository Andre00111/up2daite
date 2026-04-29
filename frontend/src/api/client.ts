import axios from 'axios'

// Basis-URL aus Umgebungsvariable — wird in vite.config.ts als Proxy konfiguriert
// Im Dev-Modus (npm run dev): Vite proxied /api → http://localhost:8080
// Im Docker/k8s: VITE_API_URL zeigt direkt auf das Backend
const baseURL = import.meta.env.VITE_API_URL ?? ''

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})
