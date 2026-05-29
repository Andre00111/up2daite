import { useState } from 'react'
import {
  Box, Typography, Grid2 as Grid, Card, CardContent, Button,
  Table, TableBody, TableCell, TableHead, TableRow, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useEditions } from '../../hooks/useEditions'
import { useStories } from '../../hooks/useStories'
import { deleteStory } from '../../api/stories'
import { deleteEdition } from '../../api/editions'

type ConfirmTarget =
  | { type: 'story'; id: string; title: string }
  | { type: 'edition'; id: string; title: string }
  | null

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { editions, refresh: refreshEditions } = useEditions()
  const { stories, refresh: refreshStories } = useStories()

  const [confirm, setConfirm] = useState<ConfirmTarget>(null)
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null)
  const [busy, setBusy] = useState(false)

  const publishedCount = editions.filter((e) => e.status === 'published').length
  const draftCount = editions.filter((e) => e.status === 'draft').length
  const unassignedCount = stories.filter((s) => s.editionId === null).length

  const stats = [
    { label: 'Stories gesamt', value: stories.length },
    { label: 'Nicht zugeordnet', value: unassignedCount },
    { label: 'Ausgaben veröffentlicht', value: publishedCount },
    { label: 'Ausgaben als Entwurf', value: draftCount },
  ]

  async function handleConfirmDelete() {
    if (!confirm) return
    setBusy(true)
    try {
      if (confirm.type === 'story') {
        await deleteStory(confirm.id)
        await Promise.all([refreshStories(), refreshEditions()])
        setSnack({ msg: 'Story gelöscht.', severity: 'success' })
      } else {
        await deleteEdition(confirm.id)
        await Promise.all([refreshStories(), refreshEditions()])
        setSnack({ msg: 'Ausgabe gelöscht (Stories sind erhalten).', severity: 'success' })
      }
      setConfirm(null)
    } catch (e) {
      setSnack({ msg: e instanceof Error ? e.message : 'Löschen fehlgeschlagen.', severity: 'error' })
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
            Subscriber
          </Button>
          <Button variant="outlined" onClick={() => navigate('/admin/ki-jobs')}>
            KI-Jobs
          </Button>
          <Button variant="outlined" onClick={() => navigate('/admin/ki-modelle')}>
            KI-Modelle
          </Button>
          <Button variant="outlined" onClick={() => navigate('/admin/story/neu')}>
            + Neue Story
          </Button>
          <Button variant="contained" disableElevation onClick={() => navigate('/admin/edition/neu')}>
            + Neue Ausgabe
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

      {/* Ausgaben-Tabelle */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Ausgaben</Typography>
      <Card sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Titel</TableCell>
              <TableCell>Datum</TableCell>
              <TableCell>Stories</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editions.map((edition) => (
              <TableRow key={edition.id} hover>
                <TableCell>{edition.number}</TableCell>
                <TableCell>{edition.title}</TableCell>
                <TableCell>{new Date(edition.publishedAt).toLocaleDateString('de-DE')}</TableCell>
                <TableCell>{edition.storyIds.length}</TableCell>
                <TableCell>
                  <Chip
                    label={edition.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                    color={edition.status === 'published' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => navigate(`/admin/edition/${edition.id}`)}>
                    Vorschau
                  </Button>
                  <IconButton size="small" onClick={() => navigate(`/admin/edition/${edition.id}/edit`)} title="Bearbeiten">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setConfirm({ type: 'edition', id: edition.id, title: edition.title })}
                    title="Löschen"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Stories-Tabelle */}
      <Typography variant="h6" gutterBottom>Letzte Stories</Typography>
      <Card>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Titel</TableCell>
              <TableCell>Quelle</TableCell>
              <TableCell>Datum</TableCell>
              <TableCell>Ausgabe</TableCell>
              <TableCell align="right">Aktionen</TableCell>
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
                    {new Date(story.publishedAt).toLocaleDateString('de-DE')}
                  </Typography>
                </TableCell>
                <TableCell>
                  {story.editionId ? (
                    <Chip label={story.editionId} size="small" variant="outlined" />
                  ) : (
                    <Typography variant="caption" color="text.disabled">nicht zugeordnet</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => navigate(`/admin/story/${story.id}/edit`)} title="Bearbeiten">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setConfirm({ type: 'story', id: story.id, title: story.title })}
                    title="Löschen"
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
          {confirm?.type === 'story' ? 'Story löschen?' : 'Ausgabe löschen?'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            "{confirm?.title}" wird gelöscht.
            {confirm?.type === 'edition'
              ? ' Stories der Ausgabe werden nicht gelöscht, sondern verlieren nur ihre Zuordnung.'
              : ' Die Story wird permanent entfernt.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(null)}>Abbrechen</Button>
          <Button color="error" onClick={handleConfirmDelete} disabled={busy}>Löschen</Button>
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
