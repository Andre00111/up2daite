import { Box, Container, Typography } from '@mui/material'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ py: 4, mt: 8, borderTop: '1px solid', borderColor: 'divider' }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary">
          © 2026 up2daite.com – AI-Signal. Kein Rauschen.
        </Typography>
      </Container>
    </Box>
  )
}
