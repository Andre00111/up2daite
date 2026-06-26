import type { CanvasRenderingContext2D } from 'canvas'
import type { AIJob } from '../types.js'
import {
  CARD_W, CARD_H, PAD,
  roundRect, drawGlowOrb, wrapTextClamped,
  drawBackground, drawBorder, drawHeader, drawFooter,
} from './canvasUtils.js'

function getTrendLabel(trend: AIJob['trend']): string {
  return trend === 'rising' ? 'RISIKO STEIGEND' : trend === 'declining' ? 'RISIKO SINKEND' : 'RISIKO STABIL'
}

function getTrendIcon(trend: AIJob['trend']): string {
  return trend === 'rising' ? '↑' : trend === 'declining' ? '↓' : '→'
}

function getTrendColor(trend: AIJob['trend']): string {
  return trend === 'rising' ? '#ef4444' : trend === 'declining' ? '#22c55e' : '#f59e0b'
}

function getRiskLabel(score: number): string {
  return score >= 70 ? 'Kritisch' : score >= 40 ? 'Mittel' : 'Niedrig'
}

function getRiskLabelColor(score: number): string {
  return score >= 70 ? '#f87171' : score >= 40 ? '#fbbf24' : '#4ade80'
}

export function drawJobRiskCard(ctx: CanvasRenderingContext2D, job: AIJob) {
  const W = CARD_W, H = CARD_H
  const pct = job.riskScore / 100

  drawBackground(ctx)
  drawGlowOrb(ctx, W - 80, -80, 400, 239, 68, 68, 0.08)
  drawGlowOrb(ctx, 60, H, 300, 239, 68, 68, 0.04)
  drawBorder(ctx, '#2d1a1a')
  drawHeader(ctx)

  // JOBRISIKO pill
  roundRect(ctx, W - PAD - 230, PAD - 6, 230, 48, 24)
  ctx.fillStyle = '#2d1a1a'
  ctx.fill()
  ctx.strokeStyle = '#7f1d1d'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.font = '700 22px Inter'
  ctx.fillStyle = '#f87171'
  ctx.textAlign = 'center'
  ctx.fillText('⚠ JOBRISIKO', W - PAD - 115, PAD + 6)
  ctx.textAlign = 'left'

  // Risk circle
  const cx = PAD + 120, cy = 310, radius = 100

  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 16
  ctx.stroke()

  const startAngle = -Math.PI / 2
  const endAngle = startAngle + (Math.PI * 2 * pct)
  const arcGrad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy)
  arcGrad.addColorStop(0, '#f59e0b')
  arcGrad.addColorStop(1, '#dc2626')
  ctx.beginPath()
  ctx.arc(cx, cy, radius, startAngle, endAngle)
  ctx.strokeStyle = arcGrad
  ctx.lineWidth = 16
  ctx.lineCap = 'round'
  ctx.stroke()
  ctx.lineCap = 'butt'

  ctx.font = '900 56px Inter'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(job.riskScore), cx, cy - 6)
  ctx.font = '500 24px Inter'
  ctx.fillStyle = '#94a3b8'
  ctx.fillText('%', cx, cy + 30)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  // Job title (max 2 lines)
  ctx.font = '900 64px Inter'
  ctx.fillStyle = 'white'
  const titleX = cx + radius + 50
  wrapTextClamped(ctx, job.title, titleX, cy - 60, W - titleX - PAD, 72, 2)

  const trendColor = getTrendColor(job.trend)
  ctx.font = '700 24px Inter'
  ctx.fillStyle = trendColor
  ctx.fillText(`${getTrendIcon(job.trend)} ${getTrendLabel(job.trend)}`, titleX, cy + 10)

  ctx.font = '500 24px Inter'
  ctx.fillStyle = '#64748b'
  ctx.fillText(job.category, titleX, cy + 50)

  // Risk bar section
  const boxY = 480, boxH = 300
  roundRect(ctx, PAD, boxY, W - PAD * 2, boxH, 24)
  ctx.fillStyle = '#0f1f3d'
  ctx.fill()

  ctx.font = '600 20px Inter'
  ctx.fillStyle = '#64748b'
  ctx.fillText('AUTOMATISIERUNGSRISIKO', PAD + 32, boxY + 28)
  ctx.font = '700 26px Inter'
  ctx.fillStyle = getRiskLabelColor(job.riskScore)
  ctx.textAlign = 'right'
  ctx.fillText(getRiskLabel(job.riskScore), W - PAD - 32, boxY + 24)
  ctx.textAlign = 'left'

  const barY = boxY + 70
  const barW = W - PAD * 2 - 64
  roundRect(ctx, PAD + 32, barY, barW, 32, 16)
  ctx.fillStyle = '#1e293b'
  ctx.fill()

  const barGrad = ctx.createLinearGradient(PAD + 32, 0, W - PAD - 32, 0)
  barGrad.addColorStop(0, '#f59e0b')
  barGrad.addColorStop(0.5, '#ef4444')
  barGrad.addColorStop(1, '#dc2626')
  roundRect(ctx, PAD + 32, barY, barW * pct, 32, 16)
  ctx.fillStyle = barGrad
  ctx.fill()

  // Reasoning (max 2 lines)
  ctx.font = '400 26px Inter'
  ctx.fillStyle = '#94a3b8'
  wrapTextClamped(ctx, job.reasoning, PAD + 32, barY + 60, barW, 40, 2)

  // Affected tasks pills
  let tx = PAD + 32
  const tpY = barY + 160
  job.affectedTasks.slice(0, 3).forEach(task => {
    ctx.font = '600 22px Inter'
    const tw = ctx.measureText(task).width
    const pw = tw + 32, ph = 40
    if (tx + pw > W - PAD - 32) return
    roundRect(ctx, tx, tpY, pw, ph, 8)
    ctx.fillStyle = '#1e293b'
    ctx.fill()
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = '#64748b'
    ctx.textBaseline = 'middle'
    ctx.fillText(task, tx + 16, tpY + ph / 2)
    ctx.textBaseline = 'top'
    tx += pw + 16
  })

  drawFooter(ctx, 'KI-Jobs · 2026')
}
