import { useEffect, useState, useCallback } from 'react'
import {
  Box, Container, Typography, Button, Card, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, CircularProgress,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Instagram as InstagramIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { aiJobsApi, type AIJob } from '../../api/aiJobs'
import InstagramPreviewDialog from '../../components/features/InstagramPreviewDialog'
import { drawJobRiskCard } from '../../utils/instagramCards/drawJobRiskCard'

export default function AIJobListPage() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<AIJob[]>([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState<AIJob | null>(null)
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null)
  const [busy, setBusy] = useState(false)
  const [instaPreview, setInstaPreview] = useState<AIJob | null>(null)

  const instaDrawFn = useCallback((ctx: CanvasRenderingContext2D) => {
    if (instaPreview) drawJobRiskCard(ctx, instaPreview)
  }, [instaPreview])

  function load() {
    setLoading(true)
    aiJobsApi.list().then(setJobs).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    if (!confirm) return
    setBusy(true)
    try {
      await aiJobsApi.remove(confirm.id)
      setSnack({ msg: 'Job deleted.', severity: 'success' })
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
          <Typography variant="h4" fontWeight={700}>Endangered Jobs</Typography>
          <Typography color="text.secondary">{jobs.length} jobs</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/endangered-jobs/neu')}
          disableElevation
          sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', textTransform: 'none' }}
        >
          New job
        </Button>
      </Box>

      <Card>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Risk</TableCell>
                <TableCell>Trend</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id} hover>
                  <TableCell><Typography variant="body2" fontWeight={500}>{job.title}</Typography></TableCell>
                  <TableCell><Typography variant="caption">{job.category}</Typography></TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${job.riskScore}%`}
                      size="small"
                      color={job.riskScore >= 70 ? 'error' : job.riskScore >= 40 ? 'warning' : 'success'}
                    />
                  </TableCell>
                  <TableCell><Typography variant="caption">{job.trend}</Typography></TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setInstaPreview(job)} title="Instagram Card">
                      <InstagramIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => navigate(`/admin/endangered-jobs/${job.id}/edit`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setConfirm(job)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {jobs.length === 0 && (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No jobs yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={confirm !== null} onClose={() => setConfirm(null)}>
        <DialogTitle>Delete job?</DialogTitle>
        <DialogContent>"{confirm?.title}" will be deleted.</DialogContent>
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
        title="Job Risk Card"
        filename={`job-risk-${instaPreview?.id ?? ''}`}
        drawFn={instaDrawFn}
      />
    </Container>
  )
}
