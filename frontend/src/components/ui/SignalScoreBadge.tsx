import { Box, Typography, Tooltip, LinearProgress } from '@mui/material'
import type { SignalScore } from '../../types'

type BarColor = 'success' | 'warning' | 'error' | 'info'

interface DimensionProps {
  label: string
  value: number
  tooltip: string
  inverted?: boolean
}

function ScoreDimension({ label, value, tooltip, inverted = false }: DimensionProps) {
  const normalizedValue = (value / 5) * 100

  let color: BarColor
  if (inverted) {
    // hypeLevel: 1 = green (no hype = good), 5 = red (pure hype = bad)
    if (value <= 2) color = 'success'
    else if (value === 3) color = 'warning'
    else color = 'error'
  } else {
    // impact, sourceQuality: 5 = green (high = good), 1 = red (low = bad)
    if (value >= 4) color = 'success'
    else if (value === 3) color = 'warning'
    else color = 'error'
  }

  return (
    <Tooltip title={tooltip} placement="top" arrow>
      <Box sx={{ mb: 1, cursor: 'default' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {label}
            {inverted && (
              <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 0.5 }}>
                (lower = better)
              </Typography>
            )}
          </Typography>
          <Typography variant="caption" fontWeight={600}>
            {value}/5
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={normalizedValue}
          color={color}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: '#1e293b',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundImage:
                color === 'success'
                  ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                  : color === 'warning'
                  ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                  : 'linear-gradient(90deg, #ef4444, #dc2626)',
            },
          }}
        />
      </Box>
    </Tooltip>
  )
}

interface Props {
  score: SignalScore
}

export default function SignalScoreBadge({ score }: Props) {
  return (
    <Box sx={{ minWidth: 220 }}>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        Signal Score
      </Typography>
      <ScoreDimension
        label="Impact"
        value={score.impact}
        tooltip="Relevance for the AI industry and professionals – 5 = high impact"
      />
      <ScoreDimension
        label="Hype"
        value={score.hypeLevel}
        tooltip="PR and hype share – 1 = no hype (good), 5 = pure hype (bad)"
        inverted
      />
      <ScoreDimension
        label="Source quality"
        value={score.sourceQuality}
        tooltip="5 = primary source or tier-1 publication, 1 = aggregated noise"
      />
    </Box>
  )
}
