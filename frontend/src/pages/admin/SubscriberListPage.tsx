import { useEffect, useState } from 'react'
import {
  Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel,
  Alert, CircularProgress, Chip,
} from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'
import { subscribersApi, SubscriberAdminDto, SendResult } from '../../api/subscribers'
import { useEditions } from '../../hooks/useEditions'

export default function SubscriberListPage() {
  const [subscribers, setSubscribers] = useState<SubscriberAdminDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sendOpen, setSendOpen] = useState(false)

  useEffect(() => {
    subscribersApi.listAll()
      .then(setSubscribers)
      .catch(() => setError('Subscribers could not be loaded.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Newsletter Subscribers</Typography>
          <Typography color="text.secondary">
            {loading ? 'Loading…' : `${subscribers.length} confirmed subscribers`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={() => setSendOpen(true)}
          disabled={subscribers.length === 0}
          disableElevation
          sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', textTransform: 'none' }}
        >
          Send edition
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Subscribed</TableCell>
                <TableCell>Confirmed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscribers.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{new Date(s.subscribedAt).toLocaleString('en-US')}</TableCell>
                  <TableCell>{s.confirmedAt ? new Date(s.confirmedAt).toLocaleString('en-US') : '—'}</TableCell>
                </TableRow>
              ))}
              {subscribers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                    No confirmed subscribers yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <SendEditionDialog
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        subscriberCount={subscribers.length}
      />
    </Container>
  )
}

function SendEditionDialog({
  open, onClose, subscriberCount,
}: { open: boolean; onClose: () => void; subscriberCount: number }) {
  const { publishedEditions } = useEditions()
  const [editionId, setEditionId] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSend() {
    if (!editionId) return
    setSending(true)
    setError(null)
    try {
      const r = await subscribersApi.sendEdition(editionId)
      setResult(r)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sending failed')
    } finally {
      setSending(false)
    }
  }

  function handleClose() {
    setEditionId('')
    setResult(null)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Send edition</DialogTitle>
      <DialogContent>
        {result ? (
          <Alert severity={result.failed === 0 ? 'success' : 'warning'}>
            {result.sent} of {result.total} emails sent
            {result.failed > 0 && ` (${result.failed} failed)`}.
          </Alert>
        ) : (
          <>
            <Typography sx={{ mb: 2 }}>
              This edition will be sent to <Chip label={`${subscriberCount} subscribers`} size="small" />.
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Edition</InputLabel>
              <Select value={editionId} label="Edition" onChange={(e) => setEditionId(e.target.value)}>
                {publishedEditions.map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    #{e.number} – {e.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        {!result && (
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={!editionId || sending}
            disableElevation
            sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', textTransform: 'none' }}
          >
            {sending ? 'Sending…' : 'Send'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
