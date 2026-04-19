import { useState } from 'react'
import { Box, Container, Typography, Alert } from '@mui/material'
import { useEditions } from '../../hooks/useEditions'
import { useStories } from '../../hooks/useStories'
import TopicFilter from '../../components/ui/TopicFilter'
import EditionCard from '../../components/features/EditionCard'
import type { TopicId } from '../../types'

export default function ArchivPage() {
  const [activeTopic, setActiveTopic] = useState<TopicId | null>(null)
  const { getFilteredEditions } = useEditions()
  const { getStoriesForEdition } = useStories()

  const filteredEditions = getFilteredEditions(activeTopic)

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Archiv
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Alle veröffentlichten Ausgaben – kuratiert, kommentiert, eingeordnet.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TopicFilter active={activeTopic} onChange={setActiveTopic} />
      </Box>

      {filteredEditions.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Keine Ausgaben zu diesem Thema gefunden.
        </Alert>
      ) : (
        filteredEditions.map((edition) => (
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
