import { Box, Card, CardContent, Typography, Divider } from '@mui/material'
import TopicTag from '../ui/TopicTag'
import SourceTypeBadge from '../ui/SourceTypeBadge'
import SignalScoreBadge from '../ui/SignalScoreBadge'
import type { Story } from '../../types'

interface Props {
  story: Story
  variant?: 'full' | 'preview'
}

export default function StoryCard({ story, variant = 'full' }: Props) {
  const isPreview = variant === 'preview'

  // Im Preview-Modus: ersten 2 Sätze des Kommentars zeigen
  const comment = isPreview
    ? story.editorialComment.split('. ').slice(0, 2).join('. ') + '.'
    : story.editorialComment

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        {/* Topics */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
          {story.topics.map((topicId) => (
            <TopicTag key={topicId} topicId={topicId} />
          ))}
        </Box>

        {/* Titel */}
        <Typography
          variant={isPreview ? 'h6' : 'h5'}
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600, lineHeight: 1.3 }}
        >
          {story.title}
        </Typography>

        {/* Redaktioneller Kommentar – das ist das Produkt */}
        <Typography
          variant="body1"
          color="text.primary"
          sx={{ mb: 2, lineHeight: 1.75 }}
        >
          {comment}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Signal-Score + Quelle */}
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          {!isPreview && <SignalScoreBadge score={story.signalScore} />}

          {isPreview && (
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Signal-Score
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Impact <strong>{story.signalScore.impact}/5</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hype <strong>{story.signalScore.hypeLevel}/5</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Quelle <strong>{story.signalScore.sourceQuality}/5</strong>
                </Typography>
              </Box>
            </Box>
          )}

          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Quelle
            </Typography>
            <SourceTypeBadge source={story.source} compact={isPreview} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
