// Shared card palette + gradients — single source of truth for the dark-tech
// card look. Mirrors the Instagram export cards (see utils/instagramCards).
// Web cards import from here so web + canvas can't visually drift.

export const cardStyle = {
  // Surfaces
  surface: '#0f1f3d',
  surfaceDeeper: '#111c36',
  border: '#1a2744',
  borderStrong: '#2d3f6b',
  track: '#1e293b',

  // Brand
  indigo: '#6366f1',
  violet: '#8b5cf6',
  brandGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',

  // Muted text ramp
  textMuted: '#94a3b8',
  textMuted2: '#64748b',
  textMuted3: '#475569',

  // Gradients
  riskArc: ['#f59e0b', '#dc2626'] as const,
  riskBar: 'linear-gradient(90deg, #f59e0b, #ef4444, #dc2626)',
  signalGreen: 'linear-gradient(90deg, #22c55e, #16a34a)',
} as const

export type Trend = 'rising' | 'stable' | 'declining'

// Risk level from a 0–100 score.
export function getRiskLevel(score: number): {
  label: string
  color: string
  glow: 'red' | 'amber' | 'green'
  /** SVG ring arc gradient stops (start → end) */
  arc: readonly [string, string]
  /** CSS gradient for the horizontal risk bar */
  bar: string
  /** rgba() radial-glow-orb color for this level */
  glowColor: string
  /** pill background / border / text colors */
  pill: { bg: string; border: string; text: string }
} {
  if (score >= 70)
    return {
      label: 'Critical',
      color: '#f87171',
      glow: 'red',
      arc: ['#f59e0b', '#dc2626'],
      bar: 'linear-gradient(90deg, #f59e0b, #ef4444, #dc2626)',
      glowColor: 'rgba(239,68,68,0.16)',
      pill: { bg: '#2d1a1a', border: '#7f1d1d', text: '#f87171' },
    }
  if (score >= 40)
    return {
      label: 'Medium',
      color: '#fbbf24',
      glow: 'amber',
      arc: ['#fbbf24', '#f59e0b'],
      bar: 'linear-gradient(90deg, #fcd34d, #fbbf24, #f59e0b)',
      glowColor: 'rgba(245,158,11,0.16)',
      pill: { bg: '#2a2410', border: '#854d0e', text: '#fbbf24' },
    }
  return {
    label: 'Low',
    color: '#4ade80',
    glow: 'green',
    arc: ['#4ade80', '#16a34a'],
    bar: 'linear-gradient(90deg, #4ade80, #22c55e, #16a34a)',
    glowColor: 'rgba(34,197,94,0.16)',
    pill: { bg: '#0f2417', border: '#166534', text: '#4ade80' },
  }
}

export function getTrendIcon(trend: Trend): string {
  if (trend === 'rising') return '↑'
  if (trend === 'declining') return '↓'
  return '→'
}

export function getTrendLabel(trend: Trend): string {
  if (trend === 'rising') return 'Rising'
  if (trend === 'declining') return 'Declining'
  return 'Stable'
}

export function getTrendColor(trend: Trend): string {
  if (trend === 'rising') return '#ef4444'
  if (trend === 'declining') return '#22c55e'
  return '#f59e0b'
}
