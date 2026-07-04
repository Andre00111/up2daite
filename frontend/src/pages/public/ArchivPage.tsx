import { Container, Typography, Alert } from '@mui/material'
import { useEditions } from '../../hooks/useEditions'
import { useStories } from '../../hooks/useStories'
import EditionCard from '../../components/features/EditionCard'

export default function ArchivPage() {
  const { publishedEditions } = useEditions()
  const { getStoriesForEdition } = useStories()

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Archive
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        All published editions – curated, commented, put in context.
      </Typography>

      {publishedEditions.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No published editions yet.
        </Alert>
      ) : (
        publishedEditions.map((edition) => (
          <EditionCard
            key={edition.id}
            edition={edition}
            stories={getStoriesForEdition(edition.storyIds)}
          />
        ))
      )}
    </Container>
  )
}
