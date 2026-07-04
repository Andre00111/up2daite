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
      setErrorMsg(err instanceof Error ? err.message : 'Sign-up failed')
    }
  }

  if (status === 'success') {
    return (
      <Alert severity="success" sx={{ borderRadius: 2 }}>
        Almost there! We've sent you a confirmation email.
      </Alert>
    )
  }

  return (
    <Box>
      {variant === 'hero' && (
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          Subscribe to newsletter
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        AI signal. No noise. 3× per week.
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <TextField
          type="email"
          placeholder="you@email.com"
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
          {status === 'submitting' ? 'Sending…' : 'Subscribe'}
        </Button>
      </Box>
      {status === 'error' && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMsg}
        </Alert>
      )}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        By signing up you agree to us storing your email. You can unsubscribe at any time.
      </Typography>
    </Box>
  )
}
