import { createTheme } from '@mui/material/styles'

// --- Marken-Tokens (Single Source of Truth = Instagram-Cards, canvasUtils.ts) ---
export const brandColors = {
  indigo: '#6366f1',
  violet: '#8b5cf6',
  gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  inverseBg: '#0a1628',
  inverseSurface: '#0f1f3d',
  inverseBorder: '#1a2744',
  inverseBorderHover: '#2d3f6b',
}

declare module '@mui/material/styles' {
  interface Palette {
    brand: { main: string; gradient: string }
    inverse: { bg: string; surface: string; border: string }
  }
  interface PaletteOptions {
    brand?: { main: string; gradient: string }
    inverse?: { bg: string; surface: string; border: string }
  }
}

const sharedTypography = {
  fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  h1: { fontWeight: 900, letterSpacing: '-0.02em' },
  h2: { fontWeight: 900, letterSpacing: '-0.02em' },
  h3: { fontWeight: 800, letterSpacing: '-0.01em' },
  h4: { fontWeight: 800 },
  h5: { fontWeight: 700 },
  h6: { fontWeight: 700 },
  body1: { lineHeight: 1.7 },
  body2: { lineHeight: 1.6 },
} as const

// ─── ÖFFENTLICHES THEME (dunkel, Instagram-Card-Optik) ───────────────────────
export const publicTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: brandColors.indigo, contrastText: '#ffffff' },
    secondary: { main: brandColors.violet, contrastText: '#ffffff' },
    background: {
      default: brandColors.inverseBg,
      paper: brandColors.inverseSurface,
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#a8b3c7', // leicht heller als #94a3b8 → WCAG-AA für Body auf Navy
    },
    divider: brandColors.inverseBorder,
    brand: { main: brandColors.indigo, gradient: brandColors.gradient },
    inverse: {
      bg: brandColors.inverseBg,
      surface: brandColors.inverseSurface,
      border: brandColors.inverseBorder,
    },
  },
  typography: sharedTypography,
  shape: { borderRadius: 16 },
  components: {
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
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
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.inverseBg,
          color: '#f1f5f9',
          borderBottom: `1px solid ${brandColors.inverseBorder}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
  },
})

// ─── ADMIN-THEME (unverändert hell) ──────────────────────────────────────────
export const adminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0f172a', contrastText: '#ffffff' },
    secondary: { main: '#3b82f6', contrastText: '#ffffff' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#475569' },
    brand: { main: brandColors.indigo, gradient: brandColors.gradient },
    inverse: {
      bg: brandColors.inverseBg,
      surface: brandColors.inverseSurface,
      border: brandColors.inverseBorder,
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiChip: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 12 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },
  },
})

// Rückwärtskompatibler Alias (Altimporte von `theme`)
export const theme = publicTheme
