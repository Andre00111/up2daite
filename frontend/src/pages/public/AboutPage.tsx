import { Box, Container, Typography, Paper } from '@mui/material'
import { Info as InfoIcon } from '@mui/icons-material'

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <InfoIcon sx={{ color: 'white' }} />
          </Box>
          <Typography variant="h4" fontWeight={700}>
            About up2daite
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          up2daite is your weekly newsletter for the most important
          developments in artificial intelligence. We curate the most
          relevant news, job opportunities, and new AI models for you.
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          Our goal is to give you a quick and well-founded overview so you
          always stay up to date — without having to spend hours researching.
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          Contact
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Questions, feedback, or partnership inquiries?
          <br />
          Write to us at{' '}
          <Box
            component="a"
            href="mailto:hello@up2daite.com"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            hello@up2daite.com
          </Box>
        </Typography>
      </Paper>
    </Container>
  )
}
