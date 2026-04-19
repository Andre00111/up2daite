import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  Slider,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { topics } from '../../data/topics'
import type { SourceType, TopicId } from '../../types'

const sourceTypes: { value: SourceType; label: string }[] = [
  { value: 'primary', label: '🔵 Primärquelle' },
  { value: 'analysis', label: '🟡 Analyse' },
  { value: 'pr-driven', label: '🔴 PR-getrieben' },
]

export default function StoryFormPage() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    title: '',
    editorialComment: '',
    sourceUrl: '',
    sourceName: '',
    sourceType: 'primary' as SourceType,
    selectedTopics: [] as TopicId[],
    impact: 3,
    hypeLevel: 3,
    sourceQuality: 3,
  })

  const handleSave = () => {
    // MVP: kein echtes Speichern – visuelles Feedback
    setSaved(true)
    setTimeout(() => navigate('/admin'), 1500)
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Neue Story
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Hinweis: Im MVP werden Daten nicht dauerhaft gespeichert.
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Titel"
              fullWidth
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <TextField
              label="Redaktioneller Kommentar"
              fullWidth
              required
              multiline
              rows={4}
              value={form.editorialComment}
              onChange={(e) => setForm({ ...form, editorialComment: e.target.value })}
              helperText="2–4 Sätze: warum ist diese Meldung relevant?"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Quellenname"
                required
                value={form.sourceName}
                onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
                sx={{ flex: 1 }}
              />
              <TextField
                label="URL zur Originalquelle"
                required
                value={form.sourceUrl}
                onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                sx={{ flex: 2 }}
              />
            </Box>

            <TextField
              label="Quellentyp"
              select
              required
              value={form.sourceType}
              onChange={(e) => setForm({ ...form, sourceType: e.target.value as SourceType })}
            >
              {sourceTypes.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>

            <FormControl fullWidth>
              <InputLabel>Themen</InputLabel>
              <Select
                multiple
                value={form.selectedTopics}
                onChange={(e) =>
                  setForm({ ...form, selectedTopics: e.target.value as TopicId[] })
                }
                input={<OutlinedInput label="Themen" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((v) => (
                      <Chip
                        key={v}
                        label={topics.find((t) => t.id === v)?.label ?? v}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Signal-Score */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Signal-Score
              </Typography>
              {[
                {
                  key: 'impact' as const,
                  label: 'Impact (1 = gering, 5 = hoch)',
                },
                {
                  key: 'hypeLevel' as const,
                  label: 'Hype-Level (1 = kein Hype = gut, 5 = reiner Hype = schlecht)',
                },
                {
                  key: 'sourceQuality' as const,
                  label: 'Quellenqualität (1 = gering, 5 = Primärquelle)',
                },
              ].map(({ key, label }) => (
                <Box key={key} sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {label}: <strong>{form[key]}</strong>
                  </Typography>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    marks
                    value={form[key]}
                    onChange={(_, v) => setForm({ ...form, [key]: v as number })}
                    valueLabelDisplay="auto"
                  />
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/admin')} color="inherit">
                Abbrechen
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disableElevation
                disabled={!form.title || !form.editorialComment}
              >
                Speichern
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={saved} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success">Story gespeichert (MVP: nicht persistent)</Alert>
      </Snackbar>
    </Box>
  )
}
