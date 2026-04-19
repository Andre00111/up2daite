import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useStories } from '../../hooks/useStories'

export default function EditionFormPage() {
  const navigate = useNavigate()
  const { stories } = useStories()
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    title: '',
    editorNote: '',
    selectedStoryIds: [] as string[],
  })

  const toggleStory = (id: string) => {
    setForm((prev) => ({
      ...prev,
      selectedStoryIds: prev.selectedStoryIds.includes(id)
        ? prev.selectedStoryIds.filter((s) => s !== id)
        : [...prev.selectedStoryIds, id],
    }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => navigate('/admin'), 1500)
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Neue Ausgabe
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Hinweis: Im MVP werden Daten nicht dauerhaft gespeichert.
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Titel der Ausgabe"
              fullWidth
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <TextField
              label="Editor-Note (optional)"
              fullWidth
              multiline
              rows={3}
              value={form.editorNote}
              onChange={(e) => setForm({ ...form, editorNote: e.target.value })}
              helperText="Kurze redaktionelle Einleitung zur Ausgabe"
            />

            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Stories auswählen ({form.selectedStoryIds.length} ausgewählt)
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Empfohlen: 5–7 Stories pro Ausgabe
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {stories.map((story) => (
                <FormControlLabel
                  key={story.id}
                  control={
                    <Checkbox
                      checked={form.selectedStoryIds.includes(story.id)}
                      onChange={() => toggleStory(story.id)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {story.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {story.source.name} · {story.editionId ? `In ${story.editionId}` : 'nicht zugeordnet'}
                      </Typography>
                    </Box>
                  }
                  sx={{ display: 'flex', mb: 1, alignItems: 'flex-start' }}
                />
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
                disabled={!form.title || form.selectedStoryIds.length === 0}
              >
                Als Entwurf speichern
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={saved} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success">Ausgabe gespeichert (MVP: nicht persistent)</Alert>
      </Snackbar>
    </Box>
  )
}
