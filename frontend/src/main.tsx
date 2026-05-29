import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './theme'
import { LayoutProvider } from './context/LayoutContext'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import PinLock from './components/PinLock'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PinLock>
          <AuthProvider>
            <LayoutProvider>
              <App />
            </LayoutProvider>
          </AuthProvider>
        </PinLock>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
