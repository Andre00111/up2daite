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
        Archiv
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Alle veröffentlichten Ausgaben – kuratiert, kommentiert, eingeordnet.
      </Typography>

      {publishedEditions.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Noch keine veröffentlichten Ausgaben.
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
