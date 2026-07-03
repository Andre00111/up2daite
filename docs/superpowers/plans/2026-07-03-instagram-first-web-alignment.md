# Instagram-First Web-Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die öffentliche Web-Oberfläche vollflächig an die dunkle Instagram-Card-Optik angleichen, während das Admin-Panel unverändert hell bleibt.

**Architecture:** Das öffentliche MUI-Theme wird auf `mode: 'dark'` mit exakt den Instagram-Card-Tokens umgestellt und global gesetzt. Das Admin-Layout kapselt sein bestehendes Light-Theme in einen eigenen `ThemeProvider`-Scope. Da der Code bereits Theme-Tokens (`text.primary`, `divider`, `background.paper`, `brand.gradient`) statt Hardcodes nutzt, re-skint der Theme-Wechsel den Großteil automatisch; die restlichen Tasks sind gezielter Feinschliff plus Layout-Angleichung von Hero/Feed.

**Tech Stack:** React 18, TypeScript, MUI v6, Vite. Kein Test-Framework vorhanden → Verifikation erfolgt über `npm run build` (führt `tsc -b && vite build` aus = Typecheck + Build) und visuelle Prüfung im Dev-Server (`npm run dev`).

**Referenz-Spec:** `docs/superpowers/specs/2026-07-03-instagram-first-web-alignment-design.md`

**Farb-Tokens (Single Source of Truth = Instagram-Cards):**
| Rolle | Wert |
|---|---|
| Seiten-Hintergrund | `#0a1628` |
| Surface (Karten) | `#0f1f3d` |
| Rahmen / Hover-Rahmen | `#1a2744` / `#2d3f6b` |
| Akzent-Gradient | `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)` |
| Indigo / Violett flach | `#6366f1` / `#8b5cf6` |
| Text primär / sekundär | `#f1f5f9` / `#94a3b8` |
| Score Grün / Track | `#22c55e` / `#1e293b` |

**Working directory für alle Befehle:** `frontend/`

---

## File Structure

- **Modify** `frontend/src/theme/index.ts` — exportiert künftig `publicTheme` (dunkel) und `adminTheme` (bisheriges Light-Theme). `brandColors` bleibt.
- **Modify** `frontend/src/main.tsx` — global `publicTheme` statt `theme`.
- **Modify** `frontend/src/components/layout/AdminLayout.tsx` — kapselt Inhalt in `<ThemeProvider theme={adminTheme}>`.
- **Create** `frontend/src/components/ui/GlowOrbs.tsx` — wiederverwendbare Radial-Glow-Orbs.
- **Modify** `frontend/src/components/ui/DarkSection.tsx` — nutzt `GlowOrbs`, entfällt als eigenes Theme (Global ist bereits dunkel).
- **Modify** `frontend/src/components/ui/TopicTag.tsx` — Card-Chip-Optik (violetter Punkt + Text).
- **Modify** `frontend/src/components/ui/SignalScoreBadge.tsx` — Gradient-Bars mit dunklem Track.
- **Modify** `frontend/src/pages/public/LandingPage.tsx` — Hero wie Edition-Cover, Score-Teaser-Band.
- **Verify/adjust** übrige Public-Komponenten & -Seiten: `Header.tsx`, `Sidebar.tsx`, `Footer.tsx`, `StoryCard.tsx`, `SourceTypeBadge.tsx`, `EditionCard.tsx`, `JobRiskCard.tsx`, `EditionDetailPage.tsx`, `ArchivPage.tsx`, `AIJobsPage.tsx`, `AIModelsPage.tsx`, `AboutPage.tsx`, `ConfirmPage.tsx`, `UnsubscribePage.tsx`, `LoginPage.tsx`.
- **Do NOT touch** alles unter `frontend/src/pages/admin/` und die Instagram-Card-Zeichner unter `frontend/src/utils/instagramCards/`.

---

## Task 1: Theme-Fundament — publicTheme (dunkel) + adminTheme (hell)

**Files:**
- Modify: `frontend/src/theme/index.ts`

- [ ] **Step 1: Theme-Datei umschreiben**

Ersetze den kompletten Inhalt von `frontend/src/theme/index.ts` durch:

```ts
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
```

- [ ] **Step 2: Build/Typecheck**

Run: `npm run build`
Expected: PASS (kein TS-Fehler; `theme`-Alias hält Altimporte gültig).

- [ ] **Step 3: Commit**

```bash
git add src/theme/index.ts
git commit -m "feat(theme): dunkles publicTheme + isoliertes adminTheme (Instagram-Tokens)"
```

---

## Task 2: Theme-Provider verdrahten (Public global dunkel, Admin isoliert hell)

**Files:**
- Modify: `frontend/src/main.tsx`
- Modify: `frontend/src/components/layout/AdminLayout.tsx`

- [ ] **Step 1: main.tsx auf publicTheme umstellen**

In `frontend/src/main.tsx` den Import und den Provider ändern:

Ersetze
```ts
import { theme } from './theme'
```
durch
```ts
import { publicTheme } from './theme'
```

Ersetze
```tsx
      <ThemeProvider theme={theme}>
```
durch
```tsx
      <ThemeProvider theme={publicTheme}>
```

- [ ] **Step 2: AdminLayout in adminTheme kapseln**

In `frontend/src/components/layout/AdminLayout.tsx`:

Ergänze die Imports oben (nach den `@mui/material`-Icons/Komponenten):
```tsx
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { adminTheme } from '../../theme'
```

Umschließe den gesamten zurückgegebenen `<Box sx={{ display: 'flex' }}>…</Box>`-Baum mit dem Admin-Provider. Der `return` wird zu:
```tsx
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {/* … bestehender AdminLayout-Inhalt unverändert … */}
      </Box>
    </ThemeProvider>
  )
```
(Nur Wrapper hinzufügen — der innere Inhalt von `<Box sx={{ display: 'flex' }}>` bleibt exakt wie bisher.)

- [ ] **Step 3: Build/Typecheck**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Visuelle Prüfung**

Run: `npm run dev`
Prüfe:
- `http://localhost:5173/` → dunkler Navy-Hintergrund, heller Text.
- `http://localhost:5173/admin` (nach Login) → weiterhin **hell**, unverändert.
Expected: Public dunkel, Admin hell.

- [ ] **Step 5: Commit**

```bash
git add src/main.tsx src/components/layout/AdminLayout.tsx
git commit -m "feat(theme): Public global dunkel, Admin per ThemeProvider isoliert hell"
```

---

## Task 3: Wiederverwendbare GlowOrbs + DarkSection vereinfachen

**Files:**
- Create: `frontend/src/components/ui/GlowOrbs.tsx`
- Modify: `frontend/src/components/ui/DarkSection.tsx`

- [ ] **Step 1: GlowOrbs-Komponente erstellen**

Erstelle `frontend/src/components/ui/GlowOrbs.tsx`:

```tsx
import { Box } from '@mui/material'

/**
 * Radiale Indigo/Violett-Glows wie auf den Instagram-Cards.
 * Absolut positioniert — Eltern-Container braucht position:relative + overflow:hidden.
 */
export default function GlowOrbs() {
  return (
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
  )
}
```

- [ ] **Step 2: DarkSection auf globales Theme + GlowOrbs umstellen**

Ersetze den kompletten Inhalt von `frontend/src/components/ui/DarkSection.tsx` durch:

```tsx
import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { brandColors } from '../../theme'
import GlowOrbs from './GlowOrbs'

interface DarkSectionProps {
  children: ReactNode
  /** Radial-Glow-Orbs wie auf den Instagram-Cards */
  glow?: boolean
  /** vertikales Padding-Preset */
  py?: number | { xs: number; md: number }
  sx?: SxProps<Theme>
}

/**
 * Marken-Band im Instagram-Card-Look. Da das öffentliche Theme global dunkel
 * ist, setzt diese Komponente nur noch die Navy-Fläche + optionale Glows.
 */
export default function DarkSection({
  children,
  glow = false,
  py = { xs: 8, md: 12 },
  sx,
}: DarkSectionProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: brandColors.inverseBg,
        color: 'text.primary',
        py,
        ...sx,
      }}
    >
      {glow && <GlowOrbs />}
      <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
    </Box>
  )
}
```

- [ ] **Step 3: Build/Typecheck**

Run: `npm run build`
Expected: PASS (der nun ungenutzte `createTheme`/`ThemeProvider`-Import ist entfernt → kein TS6133).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/GlowOrbs.tsx src/components/ui/DarkSection.tsx
git commit -m "refactor(ui): GlowOrbs extrahiert, DarkSection nutzt globales Dark-Theme"
```

---

## Task 4: TopicTag — Card-Chip-Optik (violetter Punkt + Text)

**Files:**
- Modify: `frontend/src/components/ui/TopicTag.tsx`

- [ ] **Step 1: TopicTag umschreiben**

Ersetze den kompletten Inhalt von `frontend/src/components/ui/TopicTag.tsx` durch:

```tsx
import { Box, Typography } from '@mui/material'
import { topics } from '../../data/topics'
import { brandColors } from '../../theme'
import type { TopicId } from '../../types'

interface Props {
  topicId: TopicId
  size?: 'small' | 'medium'
}

export default function TopicTag({ topicId, size = 'small' }: Props) {
  const topic = topics.find((t) => t.id === topicId)
  if (!topic) return null

  const dot = size === 'medium' ? 9 : 7
  const fontSize = size === 'medium' ? '0.8rem' : '0.7rem'

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        bgcolor: brandColors.inverseBorder,
        border: `1px solid ${brandColors.inverseBorderHover}`,
        borderRadius: 2,
        px: 1.25,
        py: 0.4,
      }}
    >
      <Box sx={{ width: dot, height: dot, borderRadius: '50%', bgcolor: brandColors.violet }} />
      <Typography
        component="span"
        sx={{
          color: brandColors.violet,
          fontWeight: 700,
          fontSize,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        {topic.label}
      </Typography>
    </Box>
  )
}
```

- [ ] **Step 2: Build/Typecheck**

Run: `npm run build`
Expected: PASS. (Der bisherige `ChipColor`/`topicColors`-Code entfällt bewusst — nicht mehr referenziert.)

- [ ] **Step 3: Visuelle Prüfung**

Run: `npm run dev` → Landing/Story-Feed. Erwartung: dunkle Tags mit violettem Punkt + violettem Uppercase-Label, exakt wie auf den Instagram-Cards.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/TopicTag.tsx
git commit -m "feat(ui): TopicTag im Instagram-Card-Stil (violetter Punkt + Uppercase)"
```

---

## Task 5: SignalScoreBadge — Gradient-Bars mit dunklem Track

**Files:**
- Modify: `frontend/src/components/ui/SignalScoreBadge.tsx`

- [ ] **Step 1: Bar-Styling an die Card angleichen**

In `frontend/src/components/ui/SignalScoreBadge.tsx` die `<LinearProgress>`-Instanz (aktuell Zeilen 45-50) ersetzen durch eine Variante mit dunklem Track, Gradient-Füllung und höherer Bar:

```tsx
        <LinearProgress
          variant="determinate"
          value={normalizedValue}
          color={color}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: '#1e293b',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundImage:
                color === 'success'
                  ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                  : color === 'warning'
                  ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                  : 'linear-gradient(90deg, #ef4444, #dc2626)',
            },
          }}
        />
```

- [ ] **Step 2: Build/Typecheck**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Visuelle Prüfung**

Run: `npm run dev` → Story-Detail/Edition. Erwartung: Score-Bars mit dunklem Track `#1e293b` und Farb-Gradient — Optik wie die Card-Bars.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/SignalScoreBadge.tsx
git commit -m "feat(ui): SignalScore-Bars mit dunklem Track + Gradient (Card-Optik)"
```

---

## Task 6: Header, Sidebar, Footer, SourceTypeBadge — Dark-Verifikation & Feinschliff

Diese Komponenten sind bereits token-getrieben und sollten durch das dunkle Theme automatisch korrekt sein. Diese Task verifiziert und korrigiert nur verbleibende Hardcodes.

**Files:**
- Verify: `frontend/src/components/layout/Header.tsx`
- Verify: `frontend/src/components/layout/Sidebar.tsx`
- Verify: `frontend/src/components/layout/Footer.tsx`
- Verify: `frontend/src/components/ui/SourceTypeBadge.tsx`

- [ ] **Step 1: Hardcode-Scan**

Run:
```bash
grep -nE "#fff|#ffffff|#000|white(?!-space)|grey\.|#f8fafc|#e2e8f0" \
  src/components/layout/Header.tsx \
  src/components/layout/Sidebar.tsx \
  src/components/layout/Footer.tsx \
  src/components/ui/SourceTypeBadge.tsx
```
Expected: Nur unkritische Treffer (z.B. `color: 'white'` auf Gradient-Flächen wie dem Sidebar-Logo-Kästchen und Avatar-Icons — die bleiben korrekt). Kein Treffer, der eine helle Fläche/Text erzwingt.

- [ ] **Step 2: Visuelle Prüfung**

Run: `npm run dev`. Prüfe Header (Navy-Bar, Gradient-Logo lesbar), mobiles Drawer, Sidebar-Layout (per Profil-Menü „Sidebar Layout" umschalten), Footer (dunkel, Border oben `divider`). Aktive Nav-Items: Indigo-Akzent auf `rgba(99,102,241,0.1)` — auf dunklem Grund sichtbar.

- [ ] **Step 3: Falls ein Element unlesbar ist — fixen**

Nur wenn Step 1/2 ein echtes Problem zeigen: hardcodierte Farbe durch Token ersetzen (`background.paper`, `text.primary`, `text.secondary`, `divider`). Keine spekulativen Änderungen.

- [ ] **Step 4: Build + Commit**

Run: `npm run build` (Expected: PASS), dann:
```bash
git add src/components/layout src/components/ui/SourceTypeBadge.tsx
git commit -m "fix(ui): Header/Sidebar/Footer/SourceBadge für dunkles Theme verifiziert"
```
(Falls in Step 3 nichts geändert wurde: nur committen, was tatsächlich modifiziert ist; sonst diesen Commit überspringen.)

---

## Task 7: LandingPage — Hero wie Edition-Cover + Score-Teaser-Band

**Files:**
- Modify: `frontend/src/pages/public/LandingPage.tsx`

- [ ] **Step 1: Hero um „DIESE WOCHE"-Label, Gradient-Trennlinie und Card-CTA ergänzen**

Im Hero-`<DarkSection glow>` in `frontend/src/pages/public/LandingPage.tsx` den `<Container maxWidth="md">`-Inhalt ersetzen durch:

```tsx
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{ color: 'secondary.main', fontWeight: 700, letterSpacing: '0.08em' }}
          >
            DIESE WOCHE · KI-NEWS 3× PRO WOCHE
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: '2.25rem', md: '3.25rem' }, mt: 1, fontWeight: 900 }}
          >
            AI-Signal. Kein Rauschen.
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 3, color: 'text.secondary', fontWeight: 400, maxWidth: 560 }}
          >
            Kuratierte AI-News mit redaktionellem Urteil – 3× pro Woche.
            Wir erklären, warum etwas relevant ist. Und warum nicht.
          </Typography>
          {/* Gradient-Trennlinie wie auf dem Edition-Cover */}
          <Box
            sx={{
              height: 2,
              width: '100%',
              maxWidth: 560,
              mb: 4,
              background:
                'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, transparent 100%)',
            }}
          />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              href="mailto:hello@up2daite.com"
              variant="contained"
              size="large"
              disableElevation
              sx={{
                background: (t) => t.palette.brand.gradient,
                px: 3,
                '&:hover': {
                  background: (t) => t.palette.brand.gradient,
                  filter: 'brightness(1.08)',
                },
              }}
            >
              Newsletter abonnieren
            </Button>
            <Button
              onClick={() => navigate('/archiv')}
              variant="outlined"
              size="large"
              color="inherit"
              sx={{ borderColor: 'divider' }}
            >
              Archiv ansehen
            </Button>
          </Box>
        </Container>
```

- [ ] **Step 2: Signal-Score-Teaser als dunkles Band mit echten Bars**

Ersetze den Block `{/* Signal-Score Teaser */}` (aktuell `<Box sx={{ bgcolor: 'background.paper', py: 8 }}>…</Box>`) durch ein `DarkSection`-Band mit einer Live-`SignalScoreBadge`-Demo statt der Emoji-Reihe:

```tsx
      {/* Signal-Score Teaser — dunkles Band mit Live-Bars */}
      <DarkSection py={{ xs: 6, md: 8 }} sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: 'secondary.main' }}>
            Unser Ansatz
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 0.5 }}>
            Jede Meldung wird manuell bewertet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 520, mx: 'auto' }}>
            Drei Dimensionen: <strong>Impact</strong> (wie relevant?),{' '}
            <strong>Hype-Level</strong> (wie viel PR?) und{' '}
            <strong>Quellenqualität</strong> (wie verlässlich?). Der Score ist immer
            erklärt – keine Black Box.
          </Typography>
          <Box sx={{ maxWidth: 360, mx: 'auto', textAlign: 'left' }}>
            <SignalScoreBadge score={{ impact: 5, hypeLevel: 2, sourceQuality: 4 }} />
          </Box>
        </Container>
      </DarkSection>
```

Ergänze oben den Import (Komponente liegt unter `components/ui/`):
```tsx
import SignalScoreBadge from '../../components/ui/SignalScoreBadge'
```
Der `SignalScore`-Typ verlangt exakt die Felder `impact`, `hypeLevel`, `sourceQuality` (siehe `src/types`).

- [ ] **Step 3: Build/Typecheck**

Run: `npm run build`
Expected: PASS. Falls TS über das Score-Literal meckert, Typ prüfen und Feldnamen exakt übernehmen.

- [ ] **Step 4: Visuelle Prüfung**

Run: `npm run dev` → `/`. Erwartung: Hero mit violettem „DIESE WOCHE"-Label, großem 900er-Titel, Gradient-Linie, Gradient-CTA; darunter Feed-Grid; Score-Band mit echten Bars.

- [ ] **Step 5: Commit**

```bash
git add src/pages/public/LandingPage.tsx
git commit -m "feat(landing): Hero wie Edition-Cover + Score-Teaser-Band mit Live-Bars"
```

---

## Task 8: Übrige Public-Seiten & -Karten — Audit und Dark-Angleichung

Systematischer Durchgang durch die restlichen öffentlichen Seiten/Karten. Da sie überwiegend Tokens nutzen, geht es v.a. um das Aufspüren und Ersetzen harter Light-Farben.

**Files (jeweils prüfen & bei Bedarf anpassen):**
- `frontend/src/components/features/StoryCard.tsx`
- `frontend/src/components/features/EditionCard.tsx`
- `frontend/src/components/features/JobRiskCard.tsx`
- `frontend/src/components/features/EditionHeader.tsx`
- `frontend/src/pages/public/EditionDetailPage.tsx`
- `frontend/src/pages/public/ArchivPage.tsx`
- `frontend/src/pages/public/AIJobsPage.tsx`
- `frontend/src/pages/public/AIModelsPage.tsx`
- `frontend/src/pages/public/AboutPage.tsx`
- `frontend/src/pages/public/ConfirmPage.tsx`
- `frontend/src/pages/public/UnsubscribePage.tsx`
- `frontend/src/pages/LoginPage.tsx`
- `frontend/src/components/ui/StoryFilterBar.tsx`
- `frontend/src/components/ui/TopicFilter.tsx`

- [ ] **Step 1: Hardcode-Scan über alle Public-Flächen**

Run:
```bash
grep -rnE "#fff|#ffffff|#f8fafc|#f1f5f9|#e2e8f0|#0f172a|#1e293b|grey\.|bgcolor: 'white'|backgroundColor: 'white'" \
  src/pages/public src/pages/LoginPage.tsx \
  src/components/features src/components/ui/StoryFilterBar.tsx src/components/ui/TopicFilter.tsx \
  | grep -v instagramCards
```
Notiere jeden Treffer. Regeln für die Ersetzung:
- Helle Flächen (`#fff`, `#ffffff`, `background.paper` als Karte) → Token `background.paper` (ist jetzt dunkel) oder `brandColors.inverseSurface`.
- Helle Seiten-Hintergründe (`#f8fafc`) → entfernen oder `background.default`.
- Dunkle Textfarben (`#0f172a`) auf jetzt-dunklem Grund → `text.primary`.
- Rahmen (`#e2e8f0`) → `divider`.
- `grey.*`-Referenzen → passendes `text.*`/`divider`-Token.
- Gradient-/Weiß-auf-Akzent (Buttons, Logos) bleiben unverändert.

- [ ] **Step 2: Treffer beheben**

Ersetze jeden in Step 1 gefundenen problematischen Hardcode gemäß den Regeln durch das passende Theme-Token. Beispiel-Muster:
```tsx
// vorher
<Paper sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0' }}>
// nachher
<Paper sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
```
StoryCard/EditionCard/JobRiskCard erben Surface+Border bereits über das globale `MuiCard`-Override — dort nur explizit gesetzte Hardcodes anfassen.

- [ ] **Step 3: Emoji-/Farb-Badges prüfen**

`SourceTypeBadge` (🔵🟡🔴) und Emoji-Icons bleiben — sie funktionieren auf dunklem Grund. Kein Zwang zur Änderung.

- [ ] **Step 4: Build/Typecheck**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Visuelle Prüfung jeder Seite**

Run: `npm run dev` und öffne der Reihe nach:
`/`, `/archiv`, `/ausgabe/<slug>` (aus Archiv), `/ki-jobs`, `/ki-modelle`, `/about`, `/login`, `/confirm`, `/unsubscribe`.
Prüfe je Seite: kein weißer Kasten/Balken, Text lesbar, Karten im Navy-Surface-Look, Fließtext auf Detailseiten gut lesbar.

- [ ] **Step 6: Commit**

```bash
git add src/pages/public src/pages/LoginPage.tsx src/components/features src/components/ui/StoryFilterBar.tsx src/components/ui/TopicFilter.tsx
git commit -m "feat(public): alle öffentlichen Seiten & Karten auf dunkles Card-Theme angeglichen"
```

---

## Task 9: Barrierefreiheit-Kontrastpass + finale QA

**Files:**
- Ggf. Modify: `frontend/src/theme/index.ts` (Text-Sekundär-Ton)

- [ ] **Step 1: Kontrast prüfen**

Prüfe im Dev-Server die kritischen Text-auf-Hintergrund-Kombinationen (Body sekundär `#a8b3c7` auf `#0a1628` und auf Surface `#0f1f3d`). Nutze DevTools-Kontrast-Anzeige oder ein Kontrast-Tool. Ziel: Body-Text ≥ 4.5:1, große Headings ≥ 3:1.
- Falls `text.secondary` (#a8b3c7) unter 4.5:1 auf `#0f1f3d` liegt: in `publicTheme` auf `#b4becf` anheben.

- [ ] **Step 2: Fokus-Sichtbarkeit**

Mit Tastatur (Tab) durch Header-Links, Buttons und Formularfelder auf `/` und `/login` navigieren. Fokus-Ring muss auf dunklem Grund sichtbar sein. Falls nicht sichtbar, in `publicTheme` unter `components.MuiButton`/global einen Fokus-Outline ergänzen:
```tsx
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&:focus-visible': { outline: '2px solid #6366f1', outlineOffset: 2 },
        },
      },
    },
```

- [ ] **Step 3: Admin-Regression bestätigen**

`/admin` (eingeloggt): Dashboard, „Neue Story"-Formular, „Neue Ausgabe" öffnen. Erwartung: vollständig hell/unverändert, keine dunklen Flächen eingeblutet.

- [ ] **Step 4: Finaler Build**

Run: `npm run build`
Expected: PASS, keine TS-/Lint-Fehler.

- [ ] **Step 5: Commit (falls Kontrast-/Fokus-Anpassung nötig war)**

```bash
git add src/theme/index.ts
git commit -m "fix(a11y): Kontrast & Fokus-Sichtbarkeit für dunkles Public-Theme"
```

---

## Self-Review-Ergebnis (Spec-Abdeckung)

- Fundament/Tokens + Theme-Isolation → Task 1, 2 ✅
- Glow-Orbs wiederverwendbar → Task 3 ✅
- Header/Sidebar → Task 6 ✅
- StoryCard/TopicTag/SignalScoreBadge/SourceTypeBadge → Task 4, 5, 6, 8 ✅
- Buttons (Gradient) → global via Theme + Hero (Task 1, 7) ✅
- EditionCard/JobRiskCard → Task 8 ✅
- Layout-Feinschliff Hero + Score-Teaser → Task 7 ✅
- Story-Feed als Grid → bereits in LandingPage vorhanden, erbt Card-Optik (Task 7/8) ✅
- Alle Public-Seiten → Task 8 ✅
- Barrierefreiheit → Task 9 ✅
- Admin unangetastet → Task 2 (Isolation) + Task 9 (Regression) ✅
```
