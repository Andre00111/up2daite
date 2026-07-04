import { useEffect, useState } from 'react'
import { Box, Container, Typography, ToggleButtonGroup, ToggleButton, Grid2 as Grid, CircularProgress, Alert } from '@mui/material'
import JobRiskCard, { type JobRisk } from '../../components/features/JobRiskCard'
import { aiJobsApi, type AIJob } from '../../api/aiJobs'
import { brandColors } from '../../theme'

type SortOption = 'risk-high' | 'risk-low' | 'alpha'

export default function AIJobsPage() {
  const [sortBy, setSortBy] = useState<SortOption>('risk-high')
  const [jobsData, setJobsData] = useState<AIJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    aiJobsApi.list()
      .then(setJobsData)
      .catch(() => setError('AI jobs could not be loaded.'))
      .finally(() => setLoading(false))
  }, [])

  const sortedJobs: JobRisk[] = [...jobsData].sort((a, b) => {
    if (sortBy === 'risk-high') return b.riskScore - a.riskScore
    if (sortBy === 'risk-low') return a.riskScore - b.riskScore
    return a.title.localeCompare(b.title, 'en')
  })

  return (
    <Box>
      <Box
        sx={{
          background: brandColors.inverseBg,
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(99,102,241,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139,92,246,0.25) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="overline"
              sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 3, mb: 1, display: 'block' }}
            >
              As of: May 2025
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3.5rem' },
                background: 'linear-gradient(90deg, #fff 0%, #c4b5fd 50%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              AI Job Risk Monitor
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400, maxWidth: 640, mx: 'auto' }}
            >
              Which jobs are at risk from artificial intelligence? Current assessments based on
              technological developments and market trends.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {jobsData.length} jobs analyzed
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={sortBy}
            exclusive
            onChange={(_, value) => value && setSortBy(value)}
            size="small"
          >
            <ToggleButton value="risk-high">
              Highest risk
            </ToggleButton>
            <ToggleButton value="risk-low">
              Lowest risk
            </ToggleButton>
            <ToggleButton value="alpha">
              A–Z
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#dc2626' }} />
              <Typography variant="caption" color="text.secondary">Critical (70–100%)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f59e0b' }} />
              <Typography variant="caption" color="text.secondary">Medium (40–69%)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#22c55e' }} />
              <Typography variant="caption" color="text.secondary">Low (0–39%)</Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {sortedJobs.map((job) => (
            <Grid key={job.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <JobRiskCard job={job} />
            </Grid>
          ))}
        </Grid>

      </Container>

      <Box
        sx={{
          background: brandColors.inverseBg,
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: 2 }}>
            Methodology note
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
            Risk scores are based on a combination of current AI capabilities, market trends, the degree
            of automation of core tasks, and regulatory factors. These assessments are not forecasts but
            reflect the current state of technology. Individual specializations can significantly affect
            personal risk.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
