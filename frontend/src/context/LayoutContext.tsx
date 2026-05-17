import { createContext, useContext, useState, ReactNode } from 'react'

type LayoutMode = 'header' | 'sidebar'

interface LayoutContextType {
  mode: LayoutMode
  toggleMode: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<LayoutMode>('sidebar')

  const toggleMode = () => {
    setMode((prev) => (prev === 'header' ? 'sidebar' : 'header'))
  }

  return (
    <LayoutContext.Provider value={{ mode, toggleMode }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
