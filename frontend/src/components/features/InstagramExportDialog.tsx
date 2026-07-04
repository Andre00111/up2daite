import { useEffect, useRef, useCallback, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, TextField, IconButton, Snackbar, Alert,
} from '@mui/material'
import {
  Download as DownloadIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material'
import type { Edition, Story, Topic } from '../../types'
import { CARD_W, CARD_H, ensureFont } from '../../utils/instagramCards/canvasUtils'
import { downloadCardAsPng } from '../../utils/instagramCards/downloadImage'
import { drawEditionCover } from '../../utils/instagramCards/drawEditionCover'
import { drawStoryCard } from '../../utils/instagramCards/drawStoryCard'
import { getISOWeek } from '../../utils/instagramCards/canvasUtils'

interface Props {
  open: boolean
  onClose: () => void
  edition: Edition
  stories: Story[]
  topics: Topic[]
}

const TOPIC_HASHTAGS: Record<string, string> = {
  'ai-research': '#AIResearch',
  'ai-products': '#AIProducts',
  'ai-policy': '#AIPolicy',
  'ai-business': '#AIBusiness',
  'ai-tools': '#AITools',
}

function buildCaption(edition: Edition, stories: Story[]): string {
  const storyLines = stories.map(s => `▸ ${s.title}`).join('\n')

  const allImpact = stories.map(s => s.signalScore.impact)
  const allHype = stories.map(s => s.signalScore.hypeLevel)
  const allQuality = stories.map(s => s.signalScore.sourceQuality)
  const avg = (arr: number[]) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)

  const topicIds = [...new Set(stories.flatMap(s => s.topics))]
  const hashtags = topicIds.map(id => TOPIC_HASHTAGS[id]).filter(Boolean).join(' ')

  const kw = getISOWeek(edition.publishedAt)

  return [
    `📰 up2daite — Edition #${edition.number}: ${edition.title}`,
    `📅 Week ${kw}`,
    '',
    storyLines,
    '',
    `📊 Ø Signal Scores: Impact ${avg(allImpact)}/5 · Hype ${avg(allHype)}/5 · Source ${avg(allQuality)}/5`,
    '',
    `🔗 More at up2daite.com/ausgabe/${edition.slug}`,
    '',
    `#AI #ArtificialIntelligence #AINews #up2daite ${hashtags}`,
  ].join('\n')
}

export default function InstagramExportDialog({ open, onClose, edition, stories, topics }: Props) {
  const coverRef = useRef<HTMLCanvasElement | null>(null)
  const storyRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const [caption, setCaption] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (open) {
      setCaption(buildCaption(edition, stories))
    }
  }, [open, edition, stories])

  const drawAll = useCallback(() => {
    const cover = coverRef.current
    if (cover) {
      const ctx = cover.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, CARD_W, CARD_H)
        drawEditionCover(ctx, edition, stories)
      }
    }

    stories.forEach((story, i) => {
      const canvas = storyRefs.current[i]
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, CARD_W, CARD_H)
      drawStoryCard(ctx, story, topics)
    })
  }, [edition, stories, topics])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    ensureFont().then(() => {
      if (cancelled) return
      requestAnimationFrame(() => {
        if (!cancelled) drawAll()
      })
    }).catch(console.error)
    return () => { cancelled = true }
  }, [open, drawAll])

  const setCoverRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      coverRef.current = node
      if (node && open) {
        ensureFont().then(() => {
          const ctx = node.getContext('2d')
          if (!ctx) return
          ctx.clearRect(0, 0, CARD_W, CARD_H)
          drawEditionCover(ctx, edition, stories)
        }).catch(console.error)
      }
    },
    [open, edition, stories],
  )

  const setStoryRef = useCallback(
    (index: number) => (node: HTMLCanvasElement | null) => {
      storyRefs.current[index] = node
      if (node && open) {
        ensureFont().then(() => {
          const ctx = node.getContext('2d')
          if (!ctx) return
          ctx.clearRect(0, 0, CARD_W, CARD_H)
          drawStoryCard(ctx, stories[index], topics)
        }).catch(console.error)
      }
    },
    [open, stories, topics],
  )

  const handleCopy = async () => {
    await navigator.clipboard.writeText(caption)
    setCopied(true)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ pb: 0 }}>
        <Typography variant="h6" fontWeight={700}>
          Instagram Export — Edition #{edition.number}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {stories.length + 1} images · 1080 × 1350px · 4:5 Portrait · PNG
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {/* Cover */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
              1 / {stories.length + 1} — Cover
            </Typography>
            <Button
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() => coverRef.current && downloadCardAsPng(coverRef.current, `edition-${edition.number}-cover`)}
              sx={{ textTransform: 'none' }}
            >
              Download
            </Button>
          </Box>
          <Box sx={{
            maxWidth: 400,
            mx: 'auto',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 0 40px rgba(99,102,241,0.15), 0 4px 20px rgba(0,0,0,0.3)',
            border: '1px solid',
            borderColor: 'divider',
          }}>
            <canvas
              ref={setCoverRef}
              width={CARD_W}
              height={CARD_H}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>
        </Box>

        {/* Story cards */}
        {stories.map((story, i) => (
          <Box key={story.id} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                {i + 2} / {stories.length + 1} — {story.title}
              </Typography>
              <Button
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  const canvas = storyRefs.current[i]
                  if (canvas) downloadCardAsPng(canvas, `edition-${edition.number}-story-${i + 1}`)
                }}
                sx={{ textTransform: 'none' }}
              >
                Download
              </Button>
            </Box>
            <Box sx={{
              maxWidth: 400,
              mx: 'auto',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 0 40px rgba(99,102,241,0.15), 0 4px 20px rgba(0,0,0,0.3)',
              border: '1px solid',
              borderColor: 'divider',
            }}>
              <canvas
                ref={setStoryRef(i)}
                width={CARD_W}
                height={CARD_H}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Box>
          </Box>
        ))}

        {/* Caption */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
              Instagram Caption
            </Typography>
            <IconButton onClick={handleCopy} size="small" title="Copy caption">
              <CopyIcon fontSize="small" />
            </IconButton>
          </Box>
          <TextField
            multiline
            fullWidth
            minRows={8}
            maxRows={20}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            sx={{
              '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: 13 },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Close</Button>
      </DialogActions>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">Caption copied!</Alert>
      </Snackbar>
    </Dialog>
  )
}
