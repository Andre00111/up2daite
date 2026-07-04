import { useEffect, useState } from 'react'
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
  CircularProgress,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { topics } from '../../data/topics'
import type { ScoreValue, SourceType, TopicId } from '../../types'
import { createStory, updateStory, StoryWritePayload } from '../../api/stories'
import { useStories } from '../../hooks/useStories'
import { useEditions } from '../../hooks/useEditions'

const sourceTypes: { value: SourceType; label: string }[] = [
  { value: 'primary', label: '🔵 Primary source' },
  { value: 'analysis', label: '🟡 Analysis' },
  { value: 'pr-driven', label: '🔴 PR-driven' },
]

export default function StoryFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { getStoryById, loading: storiesLoading } = useStories()
  const { editions } = useEditions()

  const [form, setForm] = useState({
    title: '',
    editorialComment: '',
    sourceUrl: '',
    sourceName: '',
    sourceType: 'primary' as SourceType,
    selectedTopics: [] as TopicId[],
    buzzwords: [] as string[],
    impact: 3 as ScoreValue,
    hypeLevel: 3 as ScoreValue,
    sourceQuality: 3 as ScoreValue,
    editionId: '' as string,
  })
  const [buzzwordInput, setBuzzwordInput] = useState('')

  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // When editing: populate form from the existing story
  useEffect(() => {
    if (!isEdit) return
    const story = getStoryById(id!)
    if (story) {
      setForm({
        title: story.title,
        editorialComment: story.editorialComment,
        sourceUrl: story.source.url,
        sourceName: story.source.name,
        sourceType: story.source.type,
        selectedTopics: story.topics,
        buzzwords: story.buzzwords ?? [],
        impact: story.signalScore.impact,
        hypeLevel: story.signalScore.hypeLevel,
        sourceQuality: story.signalScore.sourceQuality,
        editionId: story.editionId ?? '',
      })
    }
  }, [isEdit, id, getStoryById])

  async function handleSave() {
    setSubmitting(true)
    setError(null)
    const payload: StoryWritePayload = {
      title: form.title,
      editorialComment: form.editorialComment,
      source: { name: form.sourceName, url: form.sourceUrl, type: form.sourceType },
      signalScore: {
        impact: form.impact,
        hypeLevel: form.hypeLevel,
        sourceQuality: form.sourceQuality,
      },
      topicIds: form.selectedTopics,
      buzzwords: form.buzzwords,
      publishedAt: new Date().toISOString().slice(0, 10),
      editionId: form.editionId === '' ? null : form.editionId,
    }
    try {
      if (isEdit && id) {
        await updateStory(id, payload)
      } else {
        await createStory(payload)
      }
      setSaved(true)
      setTimeout(() => navigate('/admin'), 1000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (isEdit && storiesLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {isEdit ? 'Edit Story' : 'New Story'}
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Title"
              fullWidth
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <TextField
              label="Editorial comment"
              fullWidth
              required
              multiline
              rows={4}
              value={form.editorialComment}
              onChange={(e) => setForm({ ...form, editorialComment: e.target.value })}
              helperText="2–4 sentences: why is this story relevant?"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Source name"
                required
                value={form.sourceName}
                onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
                sx={{ flex: 1 }}
              />
              <TextField
                label="URL to original source"
                required
                value={form.sourceUrl}
                onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                sx={{ flex: 2 }}
              />
            </Box>

            <TextField
              label="Source type"
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
              <InputLabel>Topics</InputLabel>
              <Select
                multiple
                value={form.selectedTopics}
                onChange={(e) => setForm({ ...form, selectedTopics: e.target.value as TopicId[] })}
                input={<OutlinedInput label="Topics" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((v) => (
                      <Chip key={v} label={topics.find((t) => t.id === v)?.label ?? v} size="small" />
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

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Buzzwords / Keywords
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  placeholder="e.g. AGI, Regulation, Open Source"
                  value={buzzwordInput}
                  onChange={(e) => setBuzzwordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const val = buzzwordInput.trim()
                      if (val && !form.buzzwords.includes(val)) {
                        setForm({ ...form, buzzwords: [...form.buzzwords, val] })
                      }
                      setBuzzwordInput('')
                    }
                  }}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    const val = buzzwordInput.trim()
                    if (val && !form.buzzwords.includes(val)) {
                      setForm({ ...form, buzzwords: [...form.buzzwords, val] })
                    }
                    setBuzzwordInput('')
                  }}
                >
                  +
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {form.buzzwords.map((bw) => (
                  <Chip
                    key={bw}
                    label={bw}
                    size="small"
                    onDelete={() => setForm({ ...form, buzzwords: form.buzzwords.filter((b) => b !== bw) })}
                  />
                ))}
              </Box>
            </Box>

            <TextField
              label="Edition (optional)"
              select
              value={form.editionId}
              onChange={(e) => setForm({ ...form, editionId: e.target.value })}
              helperText="Empty = unassigned"
            >
              <MenuItem value="">— none —</MenuItem>
              {editions.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  #{e.number} – {e.title}
                </MenuItem>
              ))}
            </TextField>

            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Signal score
              </Typography>
              {[
                { key: 'impact' as const, label: 'Impact (1 = low, 5 = high)' },
                { key: 'hypeLevel' as const, label: 'Hype level (1 = no hype = good, 5 = pure hype = bad)' },
                { key: 'sourceQuality' as const, label: 'Source quality (1 = low, 5 = primary source)' },
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
                    onChange={(_, v) => setForm({ ...form, [key]: v as ScoreValue })}
                    valueLabelDisplay="auto"
                  />
                </Box>
              ))}
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/admin')} color="inherit">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disableElevation
                disabled={!form.title || !form.editorialComment || submitting}
              >
                {submitting ? 'Saving…' : isEdit ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={saved} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success">Story saved</Alert>
      </Snackbar>
    </Box>
  )
}
