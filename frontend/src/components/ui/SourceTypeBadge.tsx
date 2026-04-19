import { Box, Link, Tooltip, Typography } from '@mui/material'
import type { Source } from '../../types'

const config = {
  primary: {
    icon: '🔵',
    label: 'Primärquelle',
    tooltip: 'Direkter Output der Quelle – Blogpost, Paper oder offizielle Ankündigung',
  },
  analysis: {
    icon: '🟡',
    label: 'Analyse',
    tooltip: 'Einordnung durch Dritte – Journalist, Analyst oder Researcher',
  },
  'pr-driven': {
    icon: '🔴',
    label: 'PR-getrieben',
    tooltip: 'Pressemitteilung, Paid Content oder stark spekulativ',
  },
}

interface Props {
  source: Source
  compact?: boolean
}

export default function SourceTypeBadge({ source, compact = false }: Props) {
  const { icon, label, tooltip } = config[source.type]

  return (
    <Tooltip title={tooltip} placement="top" arrow>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          cursor: 'default',
        }}
      >
        <Typography component="span" fontSize="0.9rem" lineHeight={1}>
          {icon}
        </Typography>
        {compact ? (
          <Typography variant="caption" color="text.secondary">
            {source.name}
          </Typography>
        ) : (
          <Typography variant="caption" color="text.secondary">
            {label} ·{' '}
            <Link
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="text.secondary"
            >
              {source.name}
            </Link>
          </Typography>
        )}
      </Box>
    </Tooltip>
  )
}
