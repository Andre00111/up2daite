import { useEffect, useState } from 'react'
import { Box, Container, Typography, ToggleButtonGroup, ToggleButton, Grid2 as Grid, CircularProgress, Alert } from '@mui/material'
import JobRiskCard, { type JobRisk } from '../../components/features/JobRiskCard'
import { aiJobsApi, type AIJob } from '../../api/aiJobs'

type SortOption = 'risk-high' | 'risk-low' | 'alpha'

export default function AIJobsPage() {
  const [sortBy, setSortBy] = useState<SortOption>('risk-high')
  const [jobsData, setJobsData] = useState<AIJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    aiJobsApi.list()
      .then(setJobsData)
      .catch(() => setError('KI-Jobs konnten nicht geladen werden.'))
      .finally(() => setLoading(false))
  }, [])

  const sortedJobs: JobRisk[] = [...jobsData].sort((a, b) => {
    if (sortBy === 'risk-high') return b.riskScore - a.riskScore
    if (sortBy === 'risk-low') return a.riskScore - b.riskScore
    return a.title.localeCompare(b.title, 'de')
  })

  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0d47a1 100%)',
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
            background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(14, 165, 233, 0.3) 0%, transparent 50%)',
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
              Stand: Mai 2025
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3.5rem' },
                background: 'linear-gradient(90deg, #fff 0%, #93c5fd 50%, #38bdf8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              AI Job-Risiko-Monitor
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400, maxWidth: 640, mx: 'auto' }}
            >
              Welche Berufe sind durch künstliche Intelligenz gefährdet?
              Aktuelle Einschätzungen basierend auf technologischen Entwicklungen und Markttrends.
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
              {jobsData.length} Berufe analysiert
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={sortBy}
            exclusive
            onChange={(_, value) => value && setSortBy(value)}
            size="small"
          >
            <ToggleButton value="risk-high">
              Höchstes Risiko
            </ToggleButton>
            <ToggleButton value="risk-low">
              Niedrigstes Risiko
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
              <Typography variant="caption" color="text.secondary">Kritisch (70–100%)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f59e0b' }} />
              <Typography variant="caption" color="text.secondary">Mittel (40–69%)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#22c55e' }} />
              <Typography variant="caption" color="text.secondary">Niedrig (0–39%)</Typography>
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: 2 }}>
            Hinweis zur Methodik
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
            Die Risiko-Scores basieren auf einer Kombination aus aktuellen AI-Fähigkeiten, Markttrends,
            Automatisierungsgrad der Kernaufgaben und regulatorischen Faktoren. Die Einschätzungen sind
            keine Prognosen, sondern spiegeln den aktuellen Stand der Technologie wider.
            Individuelle Spezialisierungen können das persönliche Risiko erheblich beeinflussen.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
