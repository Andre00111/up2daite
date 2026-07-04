import { useState } from 'react'
import {
  Box, Typography, Button, Chip, Alert, Snackbar, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material'
import { Instagram as InstagramIcon } from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditions } from '../../hooks/useEditions'
import { useStories } from '../../hooks/useStories'
import EditionHeader from '../../components/features/EditionHeader'
import StoryCard from '../../components/features/StoryCard'
import { publishEdition, unpublishEdition, deleteEdition } from '../../api/editions'
import InstagramExportDialog from '../../components/features/InstagramExportDialog'
import { topics } from '../../data/topics'

export default function EditionPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getEditionById, refresh: refreshEditions } = useEditions()
  const { getStoriesForEdition } = useStories()

  const edition = id ? getEditionById(id) : null
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [instaOpen, setInstaOpen] = useState(false)

  if (!edition) {
    return (
      <Box>
        <Alert severity="error">Edition not found.</Alert>
        <Button onClick={() => navigate('/admin')} sx={{ mt: 2 }}>
          ← Back
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
      setSnack({ msg: 'Edition published.', severity: 'success' })
    } catch (e) {
      setSnack({ msg: e instanceof Error ? e.message : 'Publishing failed.', severity: 'error' })
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
      setSnack({ msg: 'Edition reverted to draft.', severity: 'success' })
    } catch (e) {
      setSnack({ msg: e instanceof Error ? e.message : 'Action failed.', severity: 'error' })
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
      setSnack({ msg: e instanceof Error ? e.message : 'Delete failed.', severity: 'error' })
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
          <Typography variant="h5" fontWeight={700}>Preview</Typography>
          <Chip
            label={isPublished ? 'Published' : 'Draft'}
            color={isPublished ? 'success' : 'default'}
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={() => setInstaOpen(true)} color="inherit" startIcon={<InstagramIcon />}>
            Instagram
          </Button>
          <Button onClick={() => navigate(`/admin/edition/${edition.id}/edit`)} color="inherit">
            Edit
          </Button>
          <Button color="error" onClick={() => setDeleteDialogOpen(true)} disabled={submitting}>
            Delete
          </Button>
          {isPublished ? (
            <Button onClick={handleUnpublish} variant="outlined" disabled={submitting}>
              Revert to draft
            </Button>
          ) : (
            <Button onClick={handlePublish} variant="contained" disableElevation disabled={submitting}>
              Publish now
            </Button>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <EditionHeader edition={edition} />

      <Divider sx={{ mb: 4 }} />

      {stories.length === 0 ? (
        <Alert severity="warning">This edition doesn't contain any stories yet.</Alert>
      ) : (
        stories.map((story) => <StoryCard key={story.id} story={story} variant="full" />)
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Really delete this edition?</DialogTitle>
        <DialogContent>
          <Typography>
            Stories in this edition will not be deleted, but will lose their assignment.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete} disabled={submitting}>Delete</Button>
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

      <InstagramExportDialog
        open={instaOpen}
        onClose={() => setInstaOpen(false)}
        edition={edition}
        stories={stories}
        topics={topics}
      />
    </Box>
  )
}
