import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authApi, UserInfo } from '../api/auth'

type AuthState = {
  user: UserInfo | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  // Beim App-Start: prüfen ob ein gültiges Cookie existiert (via /me)
  useEffect(() => {
    let active = true
    authApi.me()
      .then((u) => { if (active) setUser(u) })
      .catch(() => { if (active) setUser(null) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function login(username: string, password: string) {
    const u = await authApi.login(username, password)
    setUser(u)
  }

  async function logout() {
    await authApi.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth muss innerhalb von <AuthProvider> verwendet werden')
  return ctx
}
