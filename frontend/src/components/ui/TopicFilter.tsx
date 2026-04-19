import { Box, Chip, Typography } from '@mui/material'
import { topics } from '../../data/topics'
import type { TopicId } from '../../types'

interface Props {
  active: TopicId | null
  onChange: (topic: TopicId | null) => void
}

export default function TopicFilter({ active, onChange }: Props) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Nach Thema filtern
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label="Alle"
          onClick={() => onChange(null)}
          variant={active === null ? 'filled' : 'outlined'}
          color={active === null ? 'primary' : 'default'}
          sx={{ fontWeight: active === null ? 600 : 400 }}
        />
        {topics.map((topic) => (
          <Chip
            key={topic.id}
            label={topic.label}
            onClick={() => onChange(topic.id)}
            variant={active === topic.id ? 'filled' : 'outlined'}
            color={active === topic.id ? 'primary' : 'default'}
            sx={{ fontWeight: active === topic.id ? 600 : 400 }}
          />
        ))}
      </Box>
    </Box>
  )
}
