import type { CanvasRenderingContext2D } from 'canvas'
import type { Story, Topic } from '../types.js'
import {
  CARD_W, CARD_H, PAD,
  roundRect, drawGlowOrb, wrapText, wrapTextClamped,
  drawBackground, drawBorder, drawHeader, drawFooter,
  getISOWeek,
} from './canvasUtils.js'

export function drawStoryCard(
  ctx: CanvasRenderingContext2D,
  story: Story,
  topics: Topic[],
) {
  const W = CARD_W, H = CARD_H

  drawBackground(ctx)
  drawGlowOrb(ctx, W - 60, -60, 400, 99, 102, 241, 0.12)
  drawGlowOrb(ctx, 100, H, 350, 139, 92, 246, 0.06)
  drawBorder(ctx)
  drawHeader(ctx)

  // KI-NEWS pill
  const pillGrad = ctx.createLinearGradient(W - 220, 0, W - 60, 0)
  pillGrad.addColorStop(0, '#6366f1')
  pillGrad.addColorStop(1, '#8b5cf6')
  roundRect(ctx, W - PAD - 180, PAD - 4, 180, 44, 22)
  ctx.fillStyle = pillGrad
  ctx.fill()
  ctx.font = '700 20px Inter'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.fillText('KI-NEWS', W - PAD - 90, PAD + 9)
  ctx.textAlign = 'left'

  // Topic tag
  const topicLabel = story.topics
    .map(tid => topics.find(t => t.id === tid)?.label ?? tid)
    .join(' · ')
    .toUpperCase()

  const tagY = 170
  ctx.font = '700 20px Inter'
  const tagTextW = ctx.measureText(topicLabel).width
  const tagW = Math.max(tagTextW + 56, 200)
  roundRect(ctx, PAD, tagY, tagW, 48, 10)
  ctx.fillStyle = '#1a2744'
  ctx.fill()
  ctx.strokeStyle = '#2d3f6b'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(PAD + 20, tagY + 24, 8, 0, Math.PI * 2)
  ctx.fillStyle = '#8b5cf6'
  ctx.fill()

  ctx.font = '700 20px Inter'
  ctx.fillStyle = '#8b5cf6'
  ctx.fillText(topicLabel, PAD + 40, tagY + 14)

  // Title
  ctx.font = '800 52px Inter'
  ctx.fillStyle = 'white'
  ctx.textBaseline = 'top'
  const titleLastY = wrapText(ctx, story.title, PAD, 260, W - PAD * 2, 66)

  // Editorial comment (max 2 lines)
  ctx.font = '400 28px Inter'
  ctx.fillStyle = '#94a3b8'
  wrapTextClamped(ctx, story.editorialComment, PAD, titleLastY + 80, W - PAD * 2, 42, 4)

  // Signal score box
  const ssY = 820
  const ssH = 340
  roundRect(ctx, PAD, ssY, W - PAD * 2, ssH, 24)
  ctx.fillStyle = '#0f1f3d'
  ctx.fill()

  ctx.font = '700 18px Inter'
  ctx.fillStyle = '#475569'
  ctx.fillText('SIGNAL SCORE', PAD + 32, ssY + 28)

  const bars = [
    { label: 'Impact', value: story.signalScore.impact / 5, score: story.signalScore.impact.toFixed(1), color1: '#22c55e', color2: '#16a34a', scoreColor: '#22c55e' },
    { label: 'Hype ↓', value: story.signalScore.hypeLevel / 5, score: story.signalScore.hypeLevel.toFixed(1), color1: '#22c55e', color2: '#16a34a', scoreColor: '#22c55e' },
    { label: 'Quelle', value: story.signalScore.sourceQuality / 5, score: story.signalScore.sourceQuality.toFixed(1), color1: '#6366f1', color2: '#8b5cf6', scoreColor: '#6366f1' },
  ]

  bars.forEach((bar, i) => {
    const by = ssY + 70 + i * 85
    const barX = PAD + 180
    const barW = W - PAD * 2 - 280

    ctx.font = '500 24px Inter'
    ctx.fillStyle = '#64748b'
    ctx.textBaseline = 'middle'
    ctx.fillText(bar.label, PAD + 32, by + 14)

    roundRect(ctx, barX, by, barW, 28, 14)
    ctx.fillStyle = '#1e293b'
    ctx.fill()

    const grad = ctx.createLinearGradient(barX, 0, barX + barW * bar.value, 0)
    grad.addColorStop(0, bar.color1)
    grad.addColorStop(1, bar.color2)
    roundRect(ctx, barX, by, barW * bar.value, 28, 14)
    ctx.fillStyle = grad
    ctx.fill()

    ctx.font = '700 28px Inter'
    ctx.fillStyle = bar.scoreColor
    ctx.textAlign = 'right'
    ctx.fillText(bar.score, W - PAD - 32, by + 14)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
  })

  // Footer
  const kw = getISOWeek(story.publishedAt)
  const pubDate = new Date(story.publishedAt)
  drawFooter(ctx, `KW ${kw} · ${pubDate.getFullYear()}`)
}
