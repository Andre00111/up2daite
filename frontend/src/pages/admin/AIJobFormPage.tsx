import { useEffect, useState } from 'react'
import {
  Box, Container, Typography, Card, CardContent, TextField, Button, MenuItem,
  Slider, Alert, Snackbar, Chip, CircularProgress,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { aiJobsApi, type AIJobWritePayload } from '../../api/aiJobs'

const trends = [
  { value: 'rising', label: 'Steigend' },
  { value: 'stable', label: 'Stabil' },
  { value: 'declining', label: 'Sinkend' },
]

export default function AIJobFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState<AIJobWritePayload>({
    title: '',
    category: '',
    riskScore: 50,
    trend: 'rising',
    reasoning: '',
    affectedTasks: [],
  })
  const [taskInput, setTaskInput] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEdit || !id) return
    aiJobsApi.list().then((all) => {
      const job = all.find((j) => j.id === id)
      if (job) {
        setForm({
          title: job.title,
          category: job.category,
          riskScore: job.riskScore,
          trend: job.trend,
          reasoning: job.reasoning,
          affectedTasks: job.affectedTasks,
          sortOrder: job.sortOrder,
        })
      }
    }).finally(() => setLoading(false))
  }, [isEdit, id])

  function addTask() {
    if (!taskInput.trim()) return
    setForm((f) => ({ ...f, affectedTasks: [...f.affectedTasks, taskInput.trim()] }))
    setTaskInput('')
  }

  function removeTask(idx: number) {
    setForm((f) => ({ ...f, affectedTasks: f.affectedTasks.filter((_, i) => i !== idx) }))
  }

  async function handleSave() {
    setSubmitting(true)
    setError(null)
    try {
      if (isEdit && id) {
        await aiJobsApi.update(id, form)
      } else {
        await aiJobsApi.create(form)
      }
      setSaved(true)
      setTimeout(() => navigate('/admin/ki-jobs'), 800)
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
        {isEdit ? 'KI-Job bearbeiten' : 'Neuer KI-Job'}
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField label="Titel" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} fullWidth />
            <TextField label="Kategorie" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth />

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Risiko-Score: <strong>{form.riskScore}%</strong>
              </Typography>
              <Slider
                value={form.riskScore}
                min={0}
                max={100}
                step={5}
                marks
                onChange={(_, v) => setForm({ ...form, riskScore: v as number })}
                valueLabelDisplay="auto"
              />
            </Box>

            <TextField select label="Trend" required value={form.trend} onChange={(e) => setForm({ ...form, trend: e.target.value as AIJobWritePayload['trend'] })}>
              {trends.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
            </TextField>

            <TextField label="Begründung" required multiline rows={4} value={form.reasoning} onChange={(e) => setForm({ ...form, reasoning: e.target.value })} fullWidth />

            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Betroffene Tätigkeiten</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTask() } }}
                  placeholder="z.B. Termine vereinbaren"
                />
                <Button onClick={addTask} variant="outlined">+</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {form.affectedTasks.map((t, i) => (
                  <Chip key={i} label={t} onDelete={() => removeTask(i)} size="small" />
                ))}
              </Box>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/admin/ki-jobs')} color="inherit">Abbrechen</Button>
              <Button onClick={handleSave} variant="contained" disableElevation disabled={!form.title || !form.category || submitting}>
                {submitting ? 'Speichern…' : isEdit ? 'Aktualisieren' : 'Anlegen'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={saved} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success">Job gespeichert</Alert>
      </Snackbar>
    </Container>
  )
}
