import { useEffect, useRef, useCallback } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography,
} from '@mui/material'
import { Download as DownloadIcon } from '@mui/icons-material'
import { CARD_W, CARD_H, ensureFont } from '../../utils/instagramCards/canvasUtils'
import { downloadCardAsPng } from '../../utils/instagramCards/downloadImage'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  filename: string
  drawFn: (ctx: CanvasRenderingContext2D) => void
}

export default function InstagramPreviewDialog({ open, onClose, title, filename, drawFn }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, CARD_W, CARD_H)
    drawFn(ctx)
  }, [drawFn])

  useEffect(() => {
    if (!open) return

    let cancelled = false

    ensureFont().then(() => {
      if (cancelled) return
      // requestAnimationFrame ensures the Dialog's Portal has fully mounted the canvas
      requestAnimationFrame(() => {
        if (!cancelled) draw()
      })
    }).catch(console.error)

    return () => { cancelled = true }
  }, [open, draw])

  // Fallback: also draw when the canvas ref is first attached via callback ref
  const setCanvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current = node
      if (node && open) {
        ensureFont().then(() => {
          const ctx = node.getContext('2d')
          if (!ctx) return
          ctx.clearRect(0, 0, CARD_W, CARD_H)
          drawFn(ctx)
        }).catch(console.error)
      }
    },
    [open, drawFn],
  )

  const handleDownload = () => {
    if (!canvasRef.current) return
    downloadCardAsPng(canvasRef.current, filename)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 0 }}>
        <Typography variant="h6" fontWeight={700}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          1080 × 1350px · 4:5 Portrait · PNG
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 0 40px rgba(99,102,241,0.15), 0 4px 20px rgba(0,0,0,0.3)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <canvas
            ref={setCanvasRef}
            width={CARD_W}
            height={CARD_H}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Schließen</Button>
        <Button
          onClick={handleDownload}
          variant="contained"
          startIcon={<DownloadIcon />}
          disableElevation
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' },
          }}
        >
          Download PNG
        </Button>
      </DialogActions>
    </Dialog>
  )
}
