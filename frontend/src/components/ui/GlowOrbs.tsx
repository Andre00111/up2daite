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
