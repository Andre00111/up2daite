import { Chip } from '@mui/material'
import { topics } from '../../data/topics'
import type { TopicId } from '../../types'

type ChipColor = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'

const topicColors: Record<TopicId, ChipColor> = {
  'ai-research': 'info',
  'ai-products': 'primary',
  'ai-policy': 'warning',
  'ai-business': 'success',
  'ai-tools': 'secondary',
}

interface Props {
  topicId: TopicId
  size?: 'small' | 'medium'
}

export default function TopicTag({ topicId, size = 'small' }: Props) {
  const topic = topics.find((t) => t.id === topicId)
  if (!topic) return null
  return (
    <Chip
      label={topic.label}
      color={topicColors[topicId]}
      size={size}
      variant="outlined"
    />
  )
}
