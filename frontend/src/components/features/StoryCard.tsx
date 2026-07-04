import { Box, Card, CardContent, Typography, Divider } from '@mui/material'
import TopicTag from '../ui/TopicTag'
import SourceTypeBadge from '../ui/SourceTypeBadge'
import SignalScoreBadge from '../ui/SignalScoreBadge'
import GlowOrbs from '../ui/GlowOrbs'
import { cardStyle } from '../../theme/cardStyle'
import type { Story } from '../../types'

interface Props {
  story: Story
  variant?: 'full' | 'preview'
}

export default function StoryCard({ story, variant = 'full' }: Props) {
  const isPreview = variant === 'preview'

  // In preview mode: show only the first 2 sentences of the comment
  const comment = isPreview
    ? story.editorialComment.split('. ').slice(0, 2).join('. ') + '.'
    : story.editorialComment

  return (
    <Card
      sx={{
        mb: 2,
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GlowOrbs />
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Header row: topics + AI NEWS pill */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
              mb: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {story.topics.map((topicId) => (
                <TopicTag key={topicId} topicId={topicId} />
              ))}
            </Box>

            <Box
              sx={{
                flexShrink: 0,
                background: cardStyle.brandGradient,
                color: '#fff',
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '.5px',
                px: 1.5,
                py: 0.6,
                borderRadius: '8px',
              }}
            >
              AI NEWS
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant={isPreview ? 'h6' : 'h5'}
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 800,
              lineHeight: 1.3,
              ...(isPreview && {
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.6em',
              }),
            }}
          >
            {story.title}
          </Typography>

          {/* Editorial comment – this is the product */}
          <Typography
            variant={isPreview ? 'body2' : 'body1'}
            color="text.secondary"
            sx={{
              mb: 2,
              lineHeight: 1.7,
              ...(isPreview && {
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }),
            }}
          >
            {comment}
          </Typography>

          <Divider sx={{ mt: isPreview ? 'auto' : 2, mb: 2, borderColor: cardStyle.border }} />

          {/* Signal Score + Source */}
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
                  Signal Score
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Impact <strong>{story.signalScore.impact}/5</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hype <strong>{story.signalScore.hypeLevel}/5</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Source <strong>{story.signalScore.sourceQuality}/5</strong>
                  </Typography>
                </Box>
              </Box>
            )}

            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Source
              </Typography>
              <SourceTypeBadge source={story.source} compact={isPreview} />
            </Box>
          </Box>
        </CardContent>
      </Box>
    </Card>
  )
}
