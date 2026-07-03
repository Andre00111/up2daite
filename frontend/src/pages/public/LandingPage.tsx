import { Box, Container, Typography, Button, Divider, Grid2 as Grid, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useEditions } from '../../hooks/useEditions'
import { useStories } from '../../hooks/useStories'
import StoryCard from '../../components/features/StoryCard'
import NewsletterSignupForm from '../../components/features/NewsletterSignupForm'
import DarkSection from '../../components/ui/DarkSection'
import SignalScoreBadge from '../../components/ui/SignalScoreBadge'

export default function LandingPage() {
  const navigate = useNavigate()
  const { publishedEditions } = useEditions()
  const { getStoriesForEdition } = useStories()

  const latestEdition = publishedEditions[0] ?? null
  const previewStories = latestEdition
    ? getStoriesForEdition(latestEdition.storyIds).slice(0, 3)
    : []

  return (
    <Box>
      {/* Hero – dunkle Marken-Fläche (Instagram-Optik) */}
      <DarkSection glow>
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
      </DarkSection>

      {/* Letzte Ausgabe */}
      {latestEdition && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="overline" color="text.secondary">
              Letzte Ausgabe · #{latestEdition.number}
            </Typography>
            <Typography variant="h4" gutterBottom sx={{ mt: 0.5 }}>
              {latestEdition.title}
            </Typography>
            {latestEdition.editorNote && (
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
                {latestEdition.editorNote}
              </Typography>
            )}
          </Box>

          <Grid container spacing={2}>
            {previewStories.map((story) => (
              <Grid key={story.id} size={{ xs: 12, md: 4 }}>
                <StoryCard story={story} variant="preview" />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              onClick={() => navigate(`/ausgabe/${latestEdition.slug}`)}
              variant="outlined"
              color="primary"
              size="large"
            >
              Gesamte Ausgabe lesen →
            </Button>
          </Box>
        </Container>
      )}

      <Divider />

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

      {/* Newsletter-Anmeldung */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}
          >
            <NewsletterSignupForm variant="hero" />
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}
