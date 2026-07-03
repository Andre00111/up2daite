import { Box, Card, CardContent, Typography, LinearProgress, Chip } from '@mui/material'

export interface JobRisk {
  id: string
  title: string
  category: string
  riskScore: number // 1-100
  trend: 'rising' | 'stable' | 'declining'
  reasoning: string
  affectedTasks: string[]
}

function getRiskLevel(score: number): { label: string; color: 'error' | 'warning' | 'success'; bgColor: string } {
  if (score >= 70) return { label: 'Kritisch', color: 'error', bgColor: 'rgba(239, 68, 68, 0.12)' }
  if (score >= 40) return { label: 'Mittel', color: 'warning', bgColor: 'rgba(245, 158, 11, 0.12)' }
  return { label: 'Niedrig', color: 'success', bgColor: 'rgba(34, 197, 94, 0.12)' }
}

function getTrendIcon(trend: JobRisk['trend']): string {
  if (trend === 'rising') return '↑'
  if (trend === 'declining') return '↓'
  return '→'
}

function getTrendLabel(trend: JobRisk['trend']): string {
  if (trend === 'rising') return 'Steigend'
  if (trend === 'declining') return 'Sinkend'
  return 'Stabil'
}

interface Props {
  job: JobRisk
}

export default function JobRiskCard({ job }: Props) {
  const risk = getRiskLevel(job.riskScore)

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box
        sx={{
          bgcolor: risk.bgColor,
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Chip
            label={job.category}
            size="small"
            sx={{ bgcolor: 'rgba(0,0,0,0.08)', fontWeight: 500 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="caption"
              sx={{
                color: job.trend === 'rising' ? 'error.main' : job.trend === 'declining' ? 'success.main' : 'text.secondary',
                fontWeight: 600,
              }}
            >
              {getTrendIcon(job.trend)} {getTrendLabel(job.trend)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: risk.color === 'error' ? '#dc2626' : risk.color === 'warning' ? '#f59e0b' : '#22c55e',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.25rem',
              flexShrink: 0,
            }}
          >
            {job.riskScore}%
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2, mb: 0.5 }}>
              {job.title}
            </Typography>
            <Chip
              label={risk.label}
              size="small"
              color={risk.color}
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Automatisierungsrisiko
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {job.riskScore}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={job.riskScore}
            color={risk.color}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
          {job.reasoning}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Betroffene Aufgaben
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {job.affectedTasks.map((task) => (
              <Chip
                key={task}
                label={task}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
