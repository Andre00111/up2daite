import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Checkbox,
  Snackbar,
  Alert,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material'
import { DragIndicator as DragIcon } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useStories } from '../../hooks/useStories'
import { useEditions } from '../../hooks/useEditions'
import { createEdition, updateEdition, EditionWritePayload } from '../../api/editions'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Story } from '../../types'

export default function EditionFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { stories, loading: storiesLoading } = useStories()
  const { getEditionById, loading: editionsLoading } = useEditions()

  const [form, setForm] = useState({
    title: '',
    editorNote: '',
    // Geordnete Liste aller ausgewählten Story-IDs (per Drag-Drop sortierbar)
    selectedStoryIds: [] as string[],
  })
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Beim Edit: Form aus existierender Edition füllen
  useEffect(() => {
    if (!isEdit) return
    const edition = getEditionById(id!)
    if (edition) {
      setForm({
        title: edition.title,
        editorNote: edition.editorNote ?? '',
        selectedStoryIds: [...edition.storyIds],
      })
    }
  }, [isEdit, id, getEditionById])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function toggleStory(storyId: string) {
    setForm((prev) => ({
      ...prev,
      selectedStoryIds: prev.selectedStoryIds.includes(storyId)
        ? prev.selectedStoryIds.filter((s) => s !== storyId)
        : [...prev.selectedStoryIds, storyId],
    }))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setForm((prev) => {
      const oldIndex = prev.selectedStoryIds.indexOf(String(active.id))
      const newIndex = prev.selectedStoryIds.indexOf(String(over.id))
      return { ...prev, selectedStoryIds: arrayMove(prev.selectedStoryIds, oldIndex, newIndex) }
    })
  }

  async function handleSave() {
    setSubmitting(true)
    setError(null)
    const payload: EditionWritePayload = {
      title: form.title,
      editorNote: form.editorNote || undefined,
      storyIds: form.selectedStoryIds,
    }
    try {
      if (isEdit && id) {
        await updateEdition(id, payload)
      } else {
        await createEdition(payload)
      }
      setSaved(true)
      setTimeout(() => navigate('/admin'), 1000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Speichern fehlgeschlagen')
    } finally {
      setSubmitting(false)
    }
  }

  if (isEdit && editionsLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  }

  const selectedStories = form.selectedStoryIds
    .map((sid) => stories.find((s) => s.id === sid))
    .filter((s): s is Story => s !== undefined)

  const unselectedStories = stories.filter((s) => !form.selectedStoryIds.includes(s.id))

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {isEdit ? 'Ausgabe bearbeiten' : 'Neue Ausgabe'}
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

            {/* Ausgewählte Stories – sortierbar per Drag-Drop */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Ausgewählte Stories ({selectedStories.length}) – ziehen zum Sortieren
              </Typography>
              {selectedStories.length === 0 ? (
                <Alert severity="info">Noch keine Stories ausgewählt.</Alert>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={form.selectedStoryIds} strategy={verticalListSortingStrategy}>
                    {selectedStories.map((story) => (
                      <SortableStoryRow
                        key={story.id}
                        story={story}
                        onRemove={() => toggleStory(story.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </Box>

            <Divider />

            {/* Verfügbare Stories zum Hinzufügen */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Verfügbare Stories ({unselectedStories.length})
              </Typography>
              {storiesLoading ? (
                <CircularProgress />
              ) : unselectedStories.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Keine weiteren Stories verfügbar.</Typography>
              ) : (
                unselectedStories.map((story) => (
                  <Box key={story.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Checkbox checked={false} onChange={() => toggleStory(story.id)} />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{story.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {story.source.name} · {story.editionId ? `In Ausgabe ${story.editionId}` : 'nicht zugeordnet'}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/admin')} color="inherit">
                Abbrechen
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disableElevation
                disabled={!form.title || submitting}
              >
                {submitting ? 'Speichern…' : isEdit ? 'Aktualisieren' : 'Anlegen'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={saved} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success">Ausgabe gespeichert</Alert>
      </Snackbar>
    </Box>
  )
}

function SortableStoryRow({ story, onRemove }: { story: Story; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: story.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1.5,
        mb: 1,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <IconButton {...attributes} {...listeners} size="small" sx={{ cursor: 'grab' }}>
        <DragIcon />
      </IconButton>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight={500}>{story.title}</Typography>
        <Typography variant="caption" color="text.secondary">{story.source.name}</Typography>
      </Box>
      <Button size="small" color="inherit" onClick={onRemove}>
        Entfernen
      </Button>
    </Box>
  )
}
