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
