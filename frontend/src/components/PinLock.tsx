import { useState, useRef, useEffect } from 'react'
import { Box, Typography, TextField, Button, Paper } from '@mui/material'
import { Lock as LockIcon } from '@mui/icons-material'

const PIN = '2017'
const STORAGE_KEY = 'up2daite-unlocked'

export default function PinLock({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(STORAGE_KEY) === 'true')
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!unlocked) inputRef.current?.focus()
  }, [unlocked])

  if (unlocked) return <>{children}</>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === PIN) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setUnlocked(true)
    } else {
      setError(true)
      setPin('')
      inputRef.current?.focus()
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 4,
          textAlign: 'center',
          maxWidth: 360,
          width: '100%',
          mx: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <LockIcon sx={{ color: 'white', fontSize: 32 }} />
        </Box>

        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          up2daite
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Bitte PIN eingeben, um fortzufahren.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            inputRef={inputRef}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value)
              setError(false)
            }}
            type="password"
            inputProps={{ maxLength: 4, inputMode: 'numeric', pattern: '[0-9]*' }}
            placeholder="••••"
            error={error}
            helperText={error ? 'Falscher PIN' : ' '}
            fullWidth
            sx={{
              mb: 2,
              '& input': { textAlign: 'center', fontSize: '1.5rem', letterSpacing: 8 },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disableElevation
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Entsperren
          </Button>
        </form>
      </Paper>
    </Box>
  )
}
