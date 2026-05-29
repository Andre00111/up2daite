// Basis-URL aus Umgebungsvariable — wird in vite.config.ts als Proxy konfiguriert
// Im Dev-Modus (npm run dev): Vite proxied /api → http://localhost:8080
// Im Docker/k8s: VITE_API_URL zeigt direkt auf das Backend
const baseURL = import.meta.env.VITE_API_URL ?? ''

type RequestOptions = {
  params?: Record<string, string | boolean | undefined>
}

// Eigene Fehlerklasse, damit wir 401 (unauthorized) gezielt im UI abfangen können.
export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(method: string, path: string, options?: RequestOptions & { body?: unknown }): Promise<T> {
  let url = `${baseURL}${path}`

  if (options?.params) {
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    }
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  const response = await fetch(url, {
    method,
    credentials: 'include', // HttpOnly Auth-Cookie mitschicken
    headers: {
      'Content-Type': 'application/json',
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`)
  }

  // Robust gegen Empty-Body-Responses (204 No Content, 202 Accepted, ...).
  // text() statt json() — falls leer, geben wir undefined zurück.
  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const apiClient = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('GET', path, options)
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('POST', path, { body })
  },

  put<T>(path: string, body: unknown): Promise<T> {
    return request<T>('PUT', path, { body })
  },

  delete<T>(path: string): Promise<T> {
    return request<T>('DELETE', path)
  },
}
