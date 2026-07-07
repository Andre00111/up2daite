import { useState, useEffect } from 'react'
import { Box, Button, Typography, Paper } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

export default function CookieBanner() {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    // Check if user has dismissed the banner before
    const stored = localStorage.getItem('cookie-banner-dismissed')
    setDismissed(stored === 'true')
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('cookie-banner-dismissed', 'true')
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        borderRadius: 0,
      }}
    >
      <Box
        sx={{
          maxWidth: '100%',
          mx: 'auto',
          px: { xs: 2, md: 4 },
          py: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary">
            Diese Website nutzt <strong>keine Cookies oder Tracking</strong>. Wir
            verarbeiten keine persönlichen Daten von Besuchern. Mehr Informationen
            findest du in unserer{' '}
            <Box
              component="a"
              href="/privacy"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Datenschutzerklärung
            </Box>
            .
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={handleDismiss}
          disableElevation
          sx={{
            background: (t) => t.palette.brand.gradient,
            textTransform: 'none',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          Verstanden
        </Button>
      </Box>
    </Paper>
  )
}
