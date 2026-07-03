import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import { brandColors } from '../../theme'

/**
 * Dunkles, genestetes Theme für Marken-Flächen (Hero/CTA/Footer-Bänder).
 * Spiegelt die Instagram-Card-Optik: Navy-Flächen, Indigo als Akzent,
 * gedämpftes Weiß für Text (kein reines #fff → weniger Halation).
 */
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: brandColors.indigo, contrastText: '#ffffff' },
    secondary: { main: brandColors.violet, contrastText: '#ffffff' },
    background: {
      default: brandColors.inverseBg,
      paper: brandColors.inverseSurface,
    },
    text: {
      primary: '#f1f5f9', // slate-100
      secondary: '#94a3b8', // slate-400
    },
    divider: brandColors.inverseBorder,
    brand: { main: brandColors.indigo, gradient: brandColors.gradient },
    inverse: {
      bg: brandColors.inverseBg,
      surface: brandColors.inverseSurface,
      border: brandColors.inverseBorder,
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 900, letterSpacing: '-0.02em' },
    h2: { fontWeight: 900, letterSpacing: '-0.02em' },
    h3: { fontWeight: 800, letterSpacing: '-0.01em' },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 12 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.inverseSurface,
          border: `1px solid ${brandColors.inverseBorder}`,
          boxShadow: 'none',
        },
      },
    },
  },
})

interface DarkSectionProps {
  children: ReactNode
  /** Radial-Glow-Orbs wie auf den Instagram-Cards */
  glow?: boolean
  /** vertikales Padding-Preset */
  py?: number | { xs: number; md: number }
  sx?: SxProps<Theme>
}

export default function DarkSection({
  children,
  glow = false,
  py = { xs: 8, md: 12 },
  sx,
}: DarkSectionProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'background.default',
          color: 'text.primary',
          py,
          ...sx,
        }}
      >
        {glow && (
          <>
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                top: -160,
                right: -80,
                width: 520,
                height: 520,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                bottom: -200,
                left: -120,
                width: 500,
                height: 500,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          </>
        )}
        <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
      </Box>
    </ThemeProvider>
  )
}
