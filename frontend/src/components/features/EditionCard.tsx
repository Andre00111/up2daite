import { Box, Card, CardContent, CardActionArea, Typography, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import TopicTag from '../ui/TopicTag'
import type { Edition, Story } from '../../types'

interface Props {
  edition: Edition
  stories: Story[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function EditionCard({ edition, stories }: Props) {
  const navigate = useNavigate()

  // Eindeutige Topics aus allen Stories dieser Ausgabe
  const allTopics = [...new Set(stories.flatMap((s) => s.topics))]

  return (
    <Card sx={{ mb: 2 }}>
      <CardActionArea onClick={() => navigate(`/ausgabe/${edition.slug}`)}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              label={`#${edition.number}`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Typography variant="body2" color="text.secondary">
              {formatDate(edition.publishedAt)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              · {stories.length} {stories.length === 1 ? 'Story' : 'Stories'}
            </Typography>
          </Box>

          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            {edition.title}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
            {allTopics.map((topicId) => (
              <TopicTag key={topicId} topicId={topicId} />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
