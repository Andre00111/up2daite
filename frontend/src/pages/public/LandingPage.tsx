import { Box, Container, Typography, Button, Divider, Grid2 as Grid /*, Paper */ } from '@mui/material' // Paper: newsletter deaktiviert
import { useNavigate } from 'react-router-dom'
import { useEditions } from '../../hooks/useEditions'
import { useStories } from '../../hooks/useStories'
import StoryCard from '../../components/features/StoryCard'
// import NewsletterSignupForm from '../../components/features/NewsletterSignupForm' // newsletter deaktiviert
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
      {/* Hero – dark brand surface (Instagram look) */}
      <DarkSection glow>
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{ color: 'secondary.main', fontWeight: 700, letterSpacing: '0.08em' }}
          >
            THIS WEEK · AI NEWS 3× A WEEK
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: '2.25rem', md: '3.25rem' }, mt: 1, fontWeight: 900 }}
          >
            AI signal. No noise.
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 3, color: 'text.secondary', fontWeight: 400, maxWidth: 560 }}
          >
            Curated AI news with editorial judgment – 3× a week.
            We explain why something matters. And why it doesn't.
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
            {/* Newsletter deaktiviert
            <Button
              href="#newsletter"
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
              Subscribe to newsletter
            </Button>
            */}
            <Button
              onClick={() => navigate('/archiv')}
              variant="outlined"
              size="large"
              color="inherit"
              sx={{ borderColor: 'divider' }}
            >
              View archive
            </Button>
          </Box>
        </Container>
      </DarkSection>

      {/* Latest edition */}
      {latestEdition && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="overline" color="text.secondary">
              Latest edition · #{latestEdition.number}
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
              Read full edition →
            </Button>
          </Box>
        </Container>
      )}

      <Divider />

      {/* Signal score teaser — dark band with live bars */}
      <DarkSection py={{ xs: 6, md: 8 }} sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: 'secondary.main' }}>
            Our approach
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 0.5 }}>
            Every story is manually scored
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 520, mx: 'auto' }}>
            Three dimensions: <strong>Impact</strong> (how relevant?),{' '}
            <strong>Hype level</strong> (how much PR?) and{' '}
            <strong>Source quality</strong> (how reliable?). The score is always
            explained – no black box.
          </Typography>
          <Box sx={{ maxWidth: 360, mx: 'auto', textAlign: 'left' }}>
            <SignalScoreBadge score={{ impact: 5, hypeLevel: 2, sourceQuality: 4 }} />
          </Box>
        </Container>
      </DarkSection>

      {/* Newsletter signup — deaktiviert
      <Box id="newsletter" sx={{ py: 8 }}>
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}
          >
            <NewsletterSignupForm variant="hero" />
          </Paper>
        </Container>
      </Box>
      */}
    </Box>
  )
}
