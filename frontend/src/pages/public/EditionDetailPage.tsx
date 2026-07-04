import { Box, Container, Typography, Button, Alert, Divider } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditions } from '../../hooks/useEditions'
import { useStories } from '../../hooks/useStories'
import EditionHeader from '../../components/features/EditionHeader'
import StoryCard from '../../components/features/StoryCard'

export default function EditionDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { getEditionBySlug, getPrevNext } = useEditions()
  const { getStoriesForEdition } = useStories()

  const edition = slug ? getEditionBySlug(slug) : null

  if (!edition) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Edition not found.
        </Alert>
        <Button onClick={() => navigate('/archiv')}>← Back to archive</Button>
      </Container>
    )
  }

  const stories = getStoriesForEdition(edition.storyIds)
  const { prev, next } = getPrevNext(edition.slug)

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button
        onClick={() => navigate('/archiv')}
        color="inherit"
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        ← Back to archive
      </Button>

      <EditionHeader edition={edition} />

      <Divider sx={{ mb: 4 }} />

      {stories.length === 0 ? (
        <Alert severity="info">This edition doesn't contain any stories yet.</Alert>
      ) : (
        stories.map((story) => <StoryCard key={story.id} story={story} variant="full" />)
      )}

      {/* Edition navigation */}
      <Divider sx={{ my: 4 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          {prev && (
            <Button
              onClick={() => navigate(`/ausgabe/${prev.slug}`)}
              variant="outlined"
              color="inherit"
            >
              ← #{prev.number}: {prev.title.slice(0, 40)}…
            </Button>
          )}
        </Box>
        <Box>
          {next && (
            <Button
              onClick={() => navigate(`/ausgabe/${next.slug}`)}
              variant="outlined"
              color="inherit"
            >
              #{next.number}: {next.title.slice(0, 40)}… →
            </Button>
          )}
        </Box>
      </Box>

      {/* Newsletter CTA */}
      <Box
        sx={{
          mt: 6,
          p: 4,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Enjoyed this edition?
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
          3× a week straight to your inbox – curated, commented, no bullshit.
        </Typography>
        <Button
          href="mailto:hello@up2daite.com"
          variant="contained"
          color="secondary"
          disableElevation
        >
          Subscribe to newsletter
        </Button>
      </Box>
    </Container>
  )
}
