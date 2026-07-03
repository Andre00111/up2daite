import { Box, Typography } from '@mui/material'
import { topics } from '../../data/topics'
import { brandColors } from '../../theme'
import type { TopicId } from '../../types'

interface Props {
  topicId: TopicId
  size?: 'small' | 'medium'
}

export default function TopicTag({ topicId, size = 'small' }: Props) {
  const topic = topics.find((t) => t.id === topicId)
  if (!topic) return null

  const dot = size === 'medium' ? 9 : 7
  const fontSize = size === 'medium' ? '0.8rem' : '0.7rem'

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        bgcolor: brandColors.inverseBorder,
        border: `1px solid ${brandColors.inverseBorderHover}`,
        borderRadius: 2,
        px: 1.25,
        py: 0.4,
      }}
    >
      <Box sx={{ width: dot, height: dot, borderRadius: '50%', bgcolor: brandColors.violet }} />
      <Typography
        component="span"
        sx={{
          color: brandColors.violet,
          fontWeight: 700,
          fontSize,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        {topic.label}
      </Typography>
    </Box>
  )
}
