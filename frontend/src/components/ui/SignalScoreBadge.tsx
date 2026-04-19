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
    // hypeLevel: 1 = grün (kein Hype = gut), 5 = rot (reiner Hype = schlecht)
    if (value <= 2) color = 'success'
    else if (value === 3) color = 'warning'
    else color = 'error'
  } else {
    // impact, sourceQuality: 5 = grün (hoch = gut), 1 = rot (niedrig = schlecht)
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
                (niedrig = besser)
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
          sx={{ height: 6, borderRadius: 3 }}
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
        Signal-Score
      </Typography>
      <ScoreDimension
        label="Impact"
        value={score.impact}
        tooltip="Relevanz für AI-Industrie und Professionals – 5 = hohe Konsequenz"
      />
      <ScoreDimension
        label="Hype-Level"
        value={score.hypeLevel}
        tooltip="PR- und Hype-Anteil – 1 = kein Hype (gut), 5 = reiner Hype (schlecht)"
        inverted
      />
      <ScoreDimension
        label="Quellenqualität"
        value={score.sourceQuality}
        tooltip="5 = Primärquelle oder Tier-1-Publikation, 1 = aggregiertes Rauschen"
      />
    </Box>
  )
}
