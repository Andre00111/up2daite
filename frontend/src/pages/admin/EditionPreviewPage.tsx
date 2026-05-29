import { useState } from 'react'
import {
  Box, Typography, Button, Chip, Alert, Snackbar, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditions } from '../../hooks/useEditions'
import { useStories } from '../../hooks/useStories'
import EditionHeader from '../../components/features/EditionHeader'
import StoryCard from '../../components/features/StoryCard'
import { publishEdition, unpublishEdition, deleteEdition } from '../../api/editions'

export default function EditionPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getEditionById, refresh: refreshEditions } = useEditions()
  const { getStoriesForEdition } = useStories()

  const edition = id ? getEditionById(id) : null
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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

  async function handlePublish() {
    if (!id) return
    setSubmitting(true)
    try {
      await publishEdition(id)
      await refreshEditions()
      setSnack({ msg: 'Ausgabe veröffentlicht.', severity: 'success' })
    } catch (e) {
      setSnack({ msg: e instanceof Error ? e.message : 'Veröffentlichen fehlgeschlagen.', severity: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUnpublish() {
    if (!id) return
    setSubmitting(true)
    try {
      await unpublishEdition(id)
      await refreshEditions()
      setSnack({ msg: 'Ausgabe zurück auf Entwurf gesetzt.', severity: 'success' })
    } catch (e) {
      setSnack({ msg: e instanceof Error ? e.message : 'Aktion fehlgeschlagen.', severity: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!id) return
    setSubmitting(true)
    try {
      await deleteEdition(id)
      await refreshEditions()
      navigate('/admin')
    } catch (e) {
      setSnack({ msg: e instanceof Error ? e.message : 'Löschen fehlgeschlagen.', severity: 'error' })
      setSubmitting(false)
    }
  }

  const isPublished = edition.status === 'published'

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button onClick={() => navigate('/admin')} color="inherit" size="small">
            ← Dashboard
          </Button>
          <Typography variant="h5" fontWeight={700}>Vorschau</Typography>
          <Chip
            label={isPublished ? 'Veröffentlicht' : 'Entwurf'}
            color={isPublished ? 'success' : 'default'}
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={() => navigate(`/admin/edition/${edition.id}/edit`)} color="inherit">
            Bearbeiten
          </Button>
          <Button color="error" onClick={() => setDeleteDialogOpen(true)} disabled={submitting}>
            Löschen
          </Button>
          {isPublished ? (
            <Button onClick={handleUnpublish} variant="outlined" disabled={submitting}>
              Zurück auf Entwurf
            </Button>
          ) : (
            <Button onClick={handlePublish} variant="contained" disableElevation disabled={submitting}>
              Jetzt veröffentlichen
            </Button>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <EditionHeader edition={edition} />

      <Divider sx={{ mb: 4 }} />

      {stories.length === 0 ? (
        <Alert severity="warning">Diese Ausgabe enthält noch keine Stories.</Alert>
      ) : (
        stories.map((story) => <StoryCard key={story.id} story={story} variant="full" />)
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Ausgabe wirklich löschen?</DialogTitle>
        <DialogContent>
          <Typography>
            Stories der Ausgabe werden nicht gelöscht, sondern verlieren ihre Zuordnung.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Abbrechen</Button>
          <Button color="error" onClick={handleDelete} disabled={submitting}>Löschen</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {snack ? <Alert severity={snack.severity}>{snack.msg}</Alert> : undefined}
      </Snackbar>
    </Box>
  )
}
