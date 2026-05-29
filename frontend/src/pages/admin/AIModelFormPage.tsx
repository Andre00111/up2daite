import { useEffect, useState } from 'react'
import {
  Box, Container, Typography, Card, CardContent, TextField, Button, Alert, Snackbar, Chip, CircularProgress,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { aiModelsApi, type AIModelWritePayload } from '../../api/aiModels'

export default function AIModelFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState<AIModelWritePayload>({
    name: '',
    company: '',
    logo: '✦',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    accentColor: '#6366f1',
    rank: 1,
    category: '',
    highlights: [],
    releaseYear: new Date().getFullYear(),
  })
  const [highlightInput, setHighlightInput] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEdit || !id) return
    aiModelsApi.list().then((all) => {
      const m = all.find((x) => x.id === id)
      if (m) {
        setForm({
          name: m.name,
          company: m.company,
          logo: m.logo,
          gradient: m.gradient,
          accentColor: m.accentColor,
          rank: m.rank,
          category: m.category,
          highlights: m.highlights,
          releaseYear: m.releaseYear,
        })
      }
    }).finally(() => setLoading(false))
  }, [isEdit, id])

  function addHighlight() {
    if (!highlightInput.trim()) return
    setForm((f) => ({ ...f, highlights: [...f.highlights, highlightInput.trim()] }))
    setHighlightInput('')
  }

  function removeHighlight(idx: number) {
    setForm((f) => ({ ...f, highlights: f.highlights.filter((_, i) => i !== idx) }))
  }

  async function handleSave() {
    setSubmitting(true)
    setError(null)
    try {
      if (isEdit && id) {
        await aiModelsApi.update(id, form)
      } else {
        await aiModelsApi.create(form)
      }
      setSaved(true)
      setTimeout(() => navigate('/admin/ki-modelle'), 800)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Speichern fehlgeschlagen')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {isEdit ? 'Modell bearbeiten' : 'Neues Modell'}
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} sx={{ flex: 2 }} />
              <TextField label="Logo (Emoji)" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} sx={{ flex: 1 }} />
            </Box>

            <TextField label="Hersteller" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} fullWidth />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Rang"
                type="number"
                required
                value={form.rank}
                onChange={(e) => setForm({ ...form, rank: parseInt(e.target.value, 10) || 1 })}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Veröffentlichungsjahr"
                type="number"
                value={form.releaseYear ?? ''}
                onChange={(e) => setForm({ ...form, releaseYear: parseInt(e.target.value, 10) || undefined })}
                sx={{ flex: 1 }}
              />
            </Box>

            <TextField label="Kategorie" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth />

            <TextField
              label="Akzentfarbe (Hex)"
              value={form.accentColor}
              onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
              placeholder="#10b981"
              fullWidth
            />

            <TextField
              label="Gradient (CSS)"
              value={form.gradient}
              onChange={(e) => setForm({ ...form, gradient: e.target.value })}
              placeholder="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              fullWidth
              helperText="CSS-Gradient für die Card-Hintergrundfarbe"
            />

            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Highlights</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight() } }}
                  placeholder="z.B. Multimodal"
                />
                <Button onClick={addHighlight} variant="outlined">+</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {form.highlights.map((h, i) => (
                  <Chip key={i} label={h} onDelete={() => removeHighlight(i)} size="small" />
                ))}
              </Box>
            </Box>

            {/* Live-Preview der Card-Farbe */}
            {form.gradient && (
              <Box
                sx={{
                  height: 80,
                  borderRadius: 2,
                  background: form.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                {form.logo} {form.name || 'Vorschau'}
              </Box>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/admin/ki-modelle')} color="inherit">Abbrechen</Button>
              <Button onClick={handleSave} variant="contained" disableElevation disabled={!form.name || !form.company || submitting}>
                {submitting ? 'Speichern…' : isEdit ? 'Aktualisieren' : 'Anlegen'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={saved} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success">Modell gespeichert</Alert>
      </Snackbar>
    </Container>
  )
}
