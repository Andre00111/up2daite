import { useState, useCallback } from 'react'
import {
  Box, Typography, Grid2 as Grid, Card, CardContent, Button,
  Table, TableBody, TableCell, TableHead, TableRow, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Instagram as InstagramIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useEditions } from '../../hooks/useEditions'
import { useStories } from '../../hooks/useStories'
import { deleteStory } from '../../api/stories'
import { deleteEdition } from '../../api/editions'
import { topics } from '../../data/topics'
import type { Story, Edition } from '../../types'
import InstagramPreviewDialog from '../../components/features/InstagramPreviewDialog'
import { drawStoryCard } from '../../utils/instagramCards/drawStoryCard'
import { drawEditionCover } from '../../utils/instagramCards/drawEditionCover'

type ConfirmTarget =
  | { type: 'story'; id: string; title: string }
  | { type: 'edition'; id: string; title: string }
  | null

type InstaPreview =
  | { type: 'story'; data: Story }
  | { type: 'edition'; data: Edition }
  | null

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { editions, refresh: refreshEditions } = useEditions()
  const { stories, refresh: refreshStories, getStoriesForEdition } = useStories()

  const [confirm, setConfirm] = useState<ConfirmTarget>(null)
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null)
  const [busy, setBusy] = useState(false)
  const [instaPreview, setInstaPreview] = useState<InstaPreview>(null)

  const instaDrawFn = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!instaPreview) return
    if (instaPreview.type === 'story') {
      drawStoryCard(ctx, instaPreview.data, topics)
    } else {
      const editionStories = getStoriesForEdition(instaPreview.data.storyIds)
      drawEditionCover(ctx, instaPreview.data, editionStories)
    }
  }, [instaPreview, getStoriesForEdition])

  const publishedCount = editions.filter((e) => e.status === 'published').length
  const draftCount = editions.filter((e) => e.status === 'draft').length
  const unassignedCount = stories.filter((s) => s.editionId === null).length

  const stats = [
    { label: 'Total stories', value: stories.length },
    { label: 'Unassigned', value: unassignedCount },
    { label: 'Editions published', value: publishedCount },
    { label: 'Editions in draft', value: draftCount },
  ]

  async function handleConfirmDelete() {
    if (!confirm) return
    setBusy(true)
    try {
      if (confirm.type === 'story') {
        await deleteStory(confirm.id)
        await Promise.all([refreshStories(), refreshEditions()])
        setSnack({ msg: 'Story deleted.', severity: 'success' })
      } else {
        await deleteEdition(confirm.id)
        await Promise.all([refreshStories(), refreshEditions()])
        setSnack({ msg: 'Edition deleted (stories are kept).', severity: 'success' })
      }
      setConfirm(null)
    } catch (e) {
      setSnack({ msg: e instanceof Error ? e.message : 'Delete failed.', severity: 'error' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={() => navigate('/admin/subscribers')}>
            Subscribers
          </Button>
          <Button variant="outlined" onClick={() => navigate('/admin/endangered-jobs')}>
            Endangered Jobs
          </Button>
          <Button variant="outlined" onClick={() => navigate('/admin/ki-modelle')}>
            AI Models
          </Button>
          <Button variant="outlined" onClick={() => navigate('/admin/story/neu')}>
            + New story
          </Button>
          <Button variant="contained" disableElevation onClick={() => navigate('/admin/edition/neu')}>
            + New edition
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h4" fontWeight={700} color="primary">{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Editions table */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Editions</Typography>
      <Card sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Stories</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editions.map((edition) => (
              <TableRow key={edition.id} hover>
                <TableCell>{edition.number}</TableCell>
                <TableCell>{edition.title}</TableCell>
                <TableCell>{new Date(edition.publishedAt).toLocaleDateString('en-US')}</TableCell>
                <TableCell>{edition.storyIds.length}</TableCell>
                <TableCell>
                  <Chip
                    label={edition.status === 'published' ? 'Published' : 'Draft'}
                    color={edition.status === 'published' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setInstaPreview({ type: 'edition', data: edition })} title="Instagram Card">
                    <InstagramIcon fontSize="small" />
                  </IconButton>
                  <Button size="small" onClick={() => navigate(`/admin/edition/${edition.id}`)}>
                    Preview
                  </Button>
                  <IconButton size="small" onClick={() => navigate(`/admin/edition/${edition.id}/edit`)} title="Edit">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setConfirm({ type: 'edition', id: edition.id, title: edition.title })}
                    title="Delete"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Stories table */}
      <Typography variant="h6" gutterBottom>Recent stories</Typography>
      <Card>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Edition</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stories.slice(0, 12).map((story) => (
              <TableRow key={story.id} hover>
                <TableCell sx={{ maxWidth: 280 }}>
                  <Typography variant="body2" noWrap>{story.title}</Typography>
                </TableCell>
                <TableCell><Typography variant="caption">{story.source.name}</Typography></TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {new Date(story.publishedAt).toLocaleDateString('en-US')}
                  </Typography>
                </TableCell>
                <TableCell>
                  {story.editionId ? (
                    <Chip label={story.editionId} size="small" variant="outlined" />
                  ) : (
                    <Typography variant="caption" color="text.disabled">unassigned</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setInstaPreview({ type: 'story', data: story })} title="Instagram Card">
                    <InstagramIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => navigate(`/admin/story/${story.id}/edit`)} title="Edit">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setConfirm({ type: 'story', id: story.id, title: story.title })}
                    title="Delete"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={confirm !== null} onClose={() => setConfirm(null)}>
        <DialogTitle>
          {confirm?.type === 'story' ? 'Delete story?' : 'Delete edition?'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            "{confirm?.title}" will be deleted.
            {confirm?.type === 'edition'
              ? ' Stories in this edition will not be deleted, only unassigned.'
              : ' The story will be permanently removed.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(null)}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete} disabled={busy}>Delete</Button>
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

      <InstagramPreviewDialog
        open={instaPreview !== null}
        onClose={() => setInstaPreview(null)}
        title={instaPreview?.type === 'story' ? 'Story Card' : 'Edition Cover'}
        filename={
          instaPreview?.type === 'story'
            ? `story-${(instaPreview.data as Story).id}`
            : `edition-${(instaPreview?.data as Edition)?.number ?? ''}`
        }
        drawFn={instaDrawFn}
      />
    </Box>
  )
}
