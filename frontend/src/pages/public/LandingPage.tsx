import { Box, Container, Typography, Button, Divider, Grid2 as Grid, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useEditions } from '../../hooks/useEditions'
import { useStories } from '../../hooks/useStories'
import StoryCard from '../../components/features/StoryCard'
import NewsletterSignupForm from '../../components/features/NewsletterSignupForm'
import DarkSection from '../../components/ui/DarkSection'

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
            sx={{ color: 'brand.main', fontWeight: 700, letterSpacing: '0.08em' }}
          >
            KI-NEWS · 3× PRO WOCHE
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: '2.25rem', md: '3.25rem' }, mt: 1 }}
          >
            AI-Signal. Kein Rauschen.
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, color: 'text.secondary', fontWeight: 400, maxWidth: 560 }}
          >
            Kuratierte AI-News mit redaktionellem Urteil – 3× pro Woche.
            Wir erklären, warum etwas relevant ist. Und warum nicht.
          </Typography>
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

      {/* Signal-Score Teaser */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="overline" color="text.secondary">
            Unser Ansatz
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 0.5 }}>
            Jede Meldung wird manuell bewertet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            Wir beurteilen drei Dimensionen: <strong>Impact</strong> (wie relevant ist das?),{' '}
            <strong>Hype-Level</strong> (wie viel davon ist PR?) und{' '}
            <strong>Quellenqualität</strong> (wie verlässlich ist die Quelle?).
            Der Score ist immer erklärt – keine Black Box.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            {[
              { icon: '🔵', label: 'Primärquelle', desc: 'Direkter Output' },
              { icon: '🟡', label: 'Analyse', desc: 'Einordnung durch Dritte' },
              { icon: '🔴', label: 'PR-getrieben', desc: 'Pressemitteilung / spekulativ' },
            ].map((item) => (
              <Box key={item.label} sx={{ textAlign: 'center' }}>
                <Typography fontSize="1.8rem">{item.icon}</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {item.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

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
