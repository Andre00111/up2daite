import { useState } from 'react'
import { Box, Typography, Button, Chip, Alert, Snackbar, Divider } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditions } from '../../hooks/useEditions'
import { useStories } from '../../hooks/useStories'
import EditionHeader from '../../components/features/EditionHeader'
import StoryCard from '../../components/features/StoryCard'
import type { EditionStatus } from '../../types'

export default function EditionPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getEditionById } = useEditions()
  const { getStoriesForEdition } = useStories()

  const edition = id ? getEditionById(id) : null
  const [status, setStatus] = useState<EditionStatus>(edition?.status ?? 'draft')
  const [published, setPublished] = useState(false)

  if (!edition) {
    return (
      <Box>
        <Alert severity="error">Ausgabe nicht gefunden.</Alert>
        <Button onClick={() => navigate('/admin')} sx={{ mt: 2 }}>
          ← Zurück
        </Button>
      </Box>
    )
  }

  const stories = getStoriesForEdition(edition.storyIds)

  const handlePublish = () => {
    setStatus('published')
    setPublished(true)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button onClick={() => navigate('/admin')} color="inherit" size="small">
            ← Dashboard
          </Button>
          <Typography variant="h5" fontWeight={700}>
            Vorschau
          </Typography>
          <Chip
            label={status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
            color={status === 'published' ? 'success' : 'default'}
            size="small"
          />
        </Box>
        <Button
          onClick={handlePublish}
          variant="contained"
          disableElevation
          disabled={status === 'published'}
        >
          {status === 'published' ? 'Bereits veröffentlicht' : 'Jetzt veröffentlichen'}
        </Button>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <EditionHeader edition={{ ...edition, status }} />

      <Divider sx={{ mb: 4 }} />

      {stories.length === 0 ? (
        <Alert severity="warning">Diese Ausgabe enthält noch keine Stories.</Alert>
      ) : (
        stories.map((story) => <StoryCard key={story.id} story={story} variant="full" />)
      )}

      <Snackbar
        open={published}
        autoHideDuration={3000}
        onClose={() => setPublished(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success">
          Ausgabe veröffentlicht (MVP: nicht persistent – nach Reload zurück auf Entwurf)
        </Alert>
      </Snackbar>
    </Box>
  )
}
