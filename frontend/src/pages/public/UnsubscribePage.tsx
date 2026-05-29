import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Box, Container, Paper, Typography, Button, CircularProgress } from '@mui/material'
import { CheckCircle as CheckIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material'
import { subscribersApi } from '../../api/subscribers'

export default function UnsubscribePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }
    subscribersApi.unsubscribe(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: 5, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
        {status === 'loading' && (
          <>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Melde dich ab…</Typography>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              Du wurdest abgemeldet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Schade dich gehen zu sehen! Du erhältst keine weiteren Newsletter.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')} disableElevation>
              Zur Startseite
            </Button>
          </>
        )}
        {status === 'error' && (
          <>
            <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              Link ungültig oder bereits genutzt
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')} disableElevation>
              Zur Startseite
            </Button>
          </>
        )}
      </Paper>
    </Container>
  )
}
