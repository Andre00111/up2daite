import { Box, Card, Typography, Chip } from '@mui/material'
import { cardStyle, getRiskLevel, getTrendIcon, getTrendLabel, getTrendColor } from '../../theme/cardStyle'

export interface JobRisk {
  id: string
  title: string
  category: string
  riskScore: number // 1-100
  trend: 'rising' | 'stable' | 'declining'
  reasoning: string
  affectedTasks: string[]
}

interface Props {
  job: JobRisk
}

const chipSx = {
  bgcolor: 'rgba(255,255,255,0.06)',
  color: cardStyle.textMuted,
  fontWeight: 500,
  border: 'none',
}

export default function JobRiskCard({ job }: Props) {
  const risk = getRiskLevel(job.riskScore)
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - job.riskScore / 100)
  const gradientId = `job-risk-arc-${job.id}`

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: -120,
          right: -70,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${risk.glowColor} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Chip label={job.category} size="small" sx={chipSx} />
          <Box
            sx={{
              bgcolor: risk.pill.bg,
              border: `1px solid ${risk.pill.border}`,
              color: risk.pill.text,
              fontWeight: 700,
              fontSize: '0.7rem',
              borderRadius: '8px',
              px: 1.25,
              py: 0.5,
              lineHeight: 1.4,
              letterSpacing: 0.3,
            }}
          >
            ⚠ JOB RISK
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: '18px', alignItems: 'center', mb: 2 }}>
          <Box sx={{ position: 'relative', width: 112, height: 112, flexShrink: 0 }}>
            <svg width="112" height="112" viewBox="0 0 112 112">
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={risk.arc[0]} />
                  <stop offset="100%" stopColor={risk.arc[1]} />
                </linearGradient>
              </defs>
              <circle cx={56} cy={56} r={radius} stroke={cardStyle.track} strokeWidth={12} fill="none" />
              <circle
                cx={56}
                cy={56}
                r={radius}
                stroke={`url(#${gradientId})`}
                strokeWidth={12}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 56 56)"
              />
            </svg>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                {job.riskScore}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: cardStyle.textMuted, fontWeight: 600 }}>%</Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, color: '#fff', mb: 0.5 }}>
              {job.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: getTrendColor(job.trend), fontWeight: 700, display: 'block', mb: 0.5 }}
            >
              {getTrendIcon(job.trend)} {getTrendLabel(job.trend).toUpperCase()}
            </Typography>
            <Typography variant="caption" sx={{ color: cardStyle.textMuted }}>
              {job.category}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: cardStyle.surfaceDeeper,
            border: `1px solid ${cardStyle.border}`,
            borderRadius: '12px',
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="overline" sx={{ color: cardStyle.textMuted, lineHeight: 1 }}>
              AUTOMATION RISK
            </Typography>
            <Typography sx={{ color: risk.color, fontWeight: 700, fontSize: '0.8rem' }}>
              {risk.label}
            </Typography>
          </Box>
          <Box sx={{ height: 8, borderRadius: '4px', bgcolor: cardStyle.track, overflow: 'hidden' }}>
            <Box
              sx={{
                width: `${job.riskScore}%`,
                height: '100%',
                borderRadius: '4px',
                background: risk.bar,
              }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: cardStyle.textMuted,
              mt: 1.5,
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {job.reasoning}
          </Typography>
        </Box>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Typography variant="overline" sx={{ color: cardStyle.textMuted, display: 'block', mb: 0.75 }}>
            Affected Tasks
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {job.affectedTasks.map((task) => (
              <Chip key={task} label={task} size="small" sx={{ ...chipSx, fontSize: '0.7rem' }} />
            ))}
          </Box>
        </Box>
      </Box>
    </Card>
  )
}
