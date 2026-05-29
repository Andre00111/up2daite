import { apiClient, ApiError } from './client'

export type UserInfo = { username: string }

export const authApi = {
  async login(username: string, password: string): Promise<UserInfo> {
    return apiClient.post<UserInfo>('/api/auth/login', { username, password })
  },

  async logout(): Promise<void> {
    await apiClient.post<void>('/api/auth/logout')
  },

  /** Liefert UserInfo wenn eingeloggt, sonst null (bei 401). */
  async me(): Promise<UserInfo | null> {
    try {
      return await apiClient.get<UserInfo>('/api/auth/me')
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return null
      throw e
    }
  },
}
