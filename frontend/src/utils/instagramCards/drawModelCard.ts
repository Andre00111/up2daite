import type { AIModel } from '../../api/aiModels'
import {
  CARD_W, CARD_H, PAD,
  roundRect, drawGlowOrb, wrapText,
  drawBackground, drawBorder, drawHeader, drawFooter,
} from './canvasUtils'

function parseGradientColors(gradient: string): [string, string] {
  const match = gradient.match(/#[0-9a-fA-F]{6}/g)
  if (match && match.length >= 2) return [match[0], match[1]]
  return ['#8b5cf6', '#6366f1']
}

export function drawModelCard(ctx: CanvasRenderingContext2D, model: AIModel) {
  const W = CARD_W, H = CARD_H

  drawBackground(ctx)
  drawGlowOrb(ctx, 100, 200, 400, 139, 92, 246, 0.08)
  drawGlowOrb(ctx, W - 150, H - 200, 350, 16, 185, 129, 0.06)
  drawBorder(ctx)
  drawHeader(ctx)

  // KI-MODELL pill
  const pillText = `✦ KI-MODELL #${model.rank}`
  ctx.font = '700 22px Inter'
  const pillTextW = ctx.measureText(pillText).width
  const pillW = pillTextW + 48
  roundRect(ctx, W - PAD - pillW, PAD - 6, pillW, 48, 24)
  ctx.fillStyle = '#1a2744'
  ctx.fill()
  ctx.strokeStyle = '#2d3f6b'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = '#8b5cf6'
  ctx.textAlign = 'center'
  ctx.fillText(pillText, W - PAD - pillW / 2, PAD + 7)
  ctx.textAlign = 'left'

  // Logo box
  const logoY = 180
  const [g1, g2] = parseGradientColors(model.gradient)
  const logoGrad = ctx.createLinearGradient(PAD, logoY, PAD + 160, logoY + 160)
  logoGrad.addColorStop(0, model.accentColor || g1)
  logoGrad.addColorStop(1, g2)
  roundRect(ctx, PAD, logoY, 160, 160, 32)
  ctx.fillStyle = logoGrad
  ctx.fill()

  ctx.shadowColor = `${model.accentColor || g1}4d`
  ctx.shadowBlur = 40
  roundRect(ctx, PAD, logoY, 160, 160, 32)
  ctx.fillStyle = logoGrad
  ctx.fill()
  ctx.shadowBlur = 0

  ctx.font = '72px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'white'
  ctx.fillText(model.logo || '✦', PAD + 80, logoY + 84)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  // Model name
  ctx.font = '900 64px Inter'
  ctx.fillStyle = 'white'
  const nameX = PAD + 190
  wrapText(ctx, model.name, nameX, logoY + 10, W - nameX - PAD, 72)

  // Company + year
  ctx.font = '500 28px Inter'
  ctx.fillStyle = '#94a3b8'
  ctx.fillText(`${model.company} · ${model.releaseYear}`, nameX, logoY + 85)

  // Category tags
  const tags = [model.category, 'LLM'].filter(Boolean)
  let tagX = nameX
  const tagTY = logoY + 130
  tags.forEach(tag => {
    ctx.font = '700 20px Inter'
    const tw = ctx.measureText(tag).width
    const pw = tw + 28
    roundRect(ctx, tagX, tagTY, pw, 36, 8)
    ctx.fillStyle = '#1a2744'
    ctx.fill()
    ctx.strokeStyle = '#2d3f6b'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = '#8b5cf6'
    ctx.textBaseline = 'middle'
    ctx.fillText(tag, tagX + 14, tagTY + 18)
    ctx.textBaseline = 'top'
    tagX += pw + 12
  })

  // Highlights box
  const hlY = 420
  const hlItemH = 68
  const hlH = 70 + model.highlights.length * hlItemH
  roundRect(ctx, PAD, hlY, W - PAD * 2, hlH, 24)
  ctx.fillStyle = '#0f1f3d'
  ctx.fill()

  ctx.font = '700 18px Inter'
  ctx.fillStyle = '#475569'
  ctx.fillText('HIGHLIGHTS', PAD + 32, hlY + 28)

  model.highlights.forEach((hl, i) => {
    const hy = hlY + 70 + i * hlItemH

    ctx.beginPath()
    ctx.arc(PAD + 48, hy + 10, 8, 0, Math.PI * 2)
    ctx.fillStyle = '#8b5cf6'
    ctx.fill()

    ctx.font = '500 28px Inter'
    ctx.fillStyle = '#cbd5e1'
    ctx.fillText(hl, PAD + 72, hy - 4)
  })

  // Benchmark section
  const benchY = hlY + hlH + 40
  const benchH = 320
  if (benchY + benchH < H - 100) {
    roundRect(ctx, PAD, benchY, W - PAD * 2, benchH, 24)
    ctx.fillStyle = '#111c36'
    ctx.fill()
    ctx.strokeStyle = '#1a2744'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.font = '700 18px Inter'
    ctx.fillStyle = '#475569'
    ctx.fillText('DETAILS', PAD + 32, benchY + 28)

    ctx.font = '500 26px Inter'
    ctx.fillStyle = '#cbd5e1'
    wrapText(
      ctx,
      `${model.name} von ${model.company} — Kategorie: ${model.category}. Veröffentlicht ${model.releaseYear}.`,
      PAD + 32, benchY + 65, W - PAD * 2 - 64, 40,
    )
  }

  drawFooter(ctx, `KI-Modelle · ${model.releaseYear}`)
}
