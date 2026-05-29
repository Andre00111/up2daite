import { useState } from 'react'
import { Box, Button, TextField, Typography, Alert } from '@mui/material'
import { subscribersApi } from '../../api/subscribers'

type Variant = 'inline' | 'hero'

export default function NewsletterSignupForm({ variant = 'inline' }: { variant?: Variant }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg(null)
    try {
      await subscribersApi.subscribe(email)
      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Anmeldung fehlgeschlagen')
    }
  }

  if (status === 'success') {
    return (
      <Alert severity="success" sx={{ borderRadius: 2 }}>
        Fast geschafft! Wir haben dir eine E-Mail zur Bestätigung geschickt.
      </Alert>
    )
  }

  return (
    <Box>
      {variant === 'hero' && (
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          Newsletter abonnieren
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        AI-Signal. Kein Rauschen. 3× pro Woche.
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <TextField
          type="email"
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
        />
        <Button
          type="submit"
          variant="contained"
          disableElevation
          disabled={status === 'submitting'}
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {status === 'submitting' ? 'Senden…' : 'Abonnieren'}
        </Button>
      </Box>
      {status === 'error' && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMsg}
        </Alert>
      )}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Mit der Anmeldung stimmst du der Speicherung deiner E-Mail zu. Du kannst dich jederzeit abmelden.
      </Typography>
    </Box>
  )
}
