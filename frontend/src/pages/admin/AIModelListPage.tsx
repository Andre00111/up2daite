import { useEffect, useState, useCallback } from 'react'
import {
  Box, Container, Typography, Button, Card, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, CircularProgress,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Instagram as InstagramIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { aiModelsApi, type AIModel } from '../../api/aiModels'
import InstagramPreviewDialog from '../../components/features/InstagramPreviewDialog'
import { drawModelCard } from '../../utils/instagramCards/drawModelCard'

export default function AIModelListPage() {
  const navigate = useNavigate()
  const [models, setModels] = useState<AIModel[]>([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState<AIModel | null>(null)
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null)
  const [busy, setBusy] = useState(false)
  const [instaPreview, setInstaPreview] = useState<AIModel | null>(null)

  const instaDrawFn = useCallback((ctx: CanvasRenderingContext2D) => {
    if (instaPreview) drawModelCard(ctx, instaPreview)
  }, [instaPreview])

  function load() {
    setLoading(true)
    aiModelsApi.list().then(setModels).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    if (!confirm) return
    setBusy(true)
    try {
      await aiModelsApi.remove(confirm.id)
      setSnack({ msg: 'Model deleted.', severity: 'success' })
      setConfirm(null)
      load()
    } catch (e) {
      setSnack({ msg: e instanceof Error ? e.message : 'Delete failed.', severity: 'error' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>AI Models</Typography>
          <Typography color="text.secondary">{models.length} models</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/ki-modelle/neu')}
          disableElevation
          sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', textTransform: 'none' }}
        >
          New model
        </Button>
      </Box>

      <Card>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Year</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {models.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>#{m.rank}</TableCell>
                  <TableCell><Typography variant="body2" fontWeight={500}>{m.logo} {m.name}</Typography></TableCell>
                  <TableCell>{m.company}</TableCell>
                  <TableCell><Typography variant="caption">{m.category}</Typography></TableCell>
                  <TableCell>{m.releaseYear}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setInstaPreview(m)} title="Instagram Card">
                      <InstagramIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => navigate(`/admin/ki-modelle/${m.id}/edit`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setConfirm(m)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {models.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No models yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={confirm !== null} onClose={() => setConfirm(null)}>
        <DialogTitle>Delete model?</DialogTitle>
        <DialogContent>"{confirm?.name}" will be deleted.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete} disabled={busy}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        {snack ? <Alert severity={snack.severity}>{snack.msg}</Alert> : undefined}
      </Snackbar>

      <InstagramPreviewDialog
        open={instaPreview !== null}
        onClose={() => setInstaPreview(null)}
        title="AI Model Card"
        filename={`model-${instaPreview?.id ?? ''}`}
        drawFn={instaDrawFn}
      />
    </Container>
  )
}
