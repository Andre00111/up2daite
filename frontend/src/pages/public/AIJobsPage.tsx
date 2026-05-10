import { useState } from 'react'
import { Box, Container, Typography, ToggleButtonGroup, ToggleButton, Grid2 as Grid } from '@mui/material'
import JobRiskCard, { type JobRisk } from '../../components/features/JobRiskCard'

const jobsData: JobRisk[] = [
  {
    id: '1',
    title: 'Telefonischer Kundenservice',
    category: 'Kundenservice',
    riskScore: 85,
    trend: 'rising',
    reasoning: 'LLM-basierte Chatbots und Voice-AI übernehmen zunehmend First-Level-Support. Unternehmen wie Klarna haben bereits 700 Support-Stellen durch AI ersetzt.',
    affectedTasks: ['Anfragen beantworten', 'Beschwerden aufnehmen', 'Termine vereinbaren'],
  },
  {
    id: '2',
    title: 'Datenerfassung & -eingabe',
    category: 'Administration',
    riskScore: 92,
    trend: 'rising',
    reasoning: 'OCR, Dokumenten-AI und automatisierte Workflows machen manuelle Dateneingabe obsolet. Die meisten repetitiven Aufgaben sind bereits automatisierbar.',
    affectedTasks: ['Formulare digitalisieren', 'Daten übertragen', 'Rechnungen erfassen'],
  },
  {
    id: '3',
    title: 'Übersetzer:in',
    category: 'Sprache & Medien',
    riskScore: 78,
    trend: 'rising',
    reasoning: 'DeepL, GPT-4 und spezialisierte Übersetzungs-KI erreichen nahezu menschliche Qualität. Für Standardtexte ist professionelle Übersetzung oft nicht mehr nötig.',
    affectedTasks: ['Dokumente übersetzen', 'Lokalisierung', 'Untertitel erstellen'],
  },
  {
    id: '4',
    title: 'Buchhalter:in',
    category: 'Finanzen',
    riskScore: 65,
    trend: 'stable',
    reasoning: 'Automatisierte Buchhaltungssoftware übernimmt Routineaufgaben. Strategische Beratung und komplexe Fälle bleiben vorerst menschlich.',
    affectedTasks: ['Belege buchen', 'Kontenabstimmung', 'Standardreports'],
  },
  {
    id: '5',
    title: 'LKW-Fahrer:in',
    category: 'Transport & Logistik',
    riskScore: 45,
    trend: 'stable',
    reasoning: 'Autonomes Fahren macht Fortschritte, aber regulatorische und technische Hürden verzögern den breiten Einsatz. Langstrecke wird früher betroffen sein.',
    affectedTasks: ['Langstreckentransport', 'Highway-Fahrten', 'Routenplanung'],
  },
  {
    id: '6',
    title: 'Softwareentwickler:in',
    category: 'IT & Technik',
    riskScore: 35,
    trend: 'rising',
    reasoning: 'AI-Coding-Assistenten steigern Produktivität enorm. Komplexe Architektur und kreative Problemlösung bleiben menschlich, aber Junior-Positionen werden weniger.',
    affectedTasks: ['Boilerplate-Code', 'Bug-Fixes', 'Code-Reviews'],
  },
  {
    id: '7',
    title: 'Radiolog:in',
    category: 'Gesundheit',
    riskScore: 55,
    trend: 'rising',
    reasoning: 'AI-Diagnostik erkennt Muster in Bildgebung oft präziser als Menschen. Die Rolle verschiebt sich zur Qualitätskontrolle und Patientenkommunikation.',
    affectedTasks: ['Bildanalyse', 'Mustererkennung', 'Screening'],
  },
  {
    id: '8',
    title: 'Lehrer:in',
    category: 'Bildung',
    riskScore: 25,
    trend: 'stable',
    reasoning: 'AI unterstützt bei Wissensvermittlung und Korrektur. Soziale, erzieherische und motivationale Aspekte bleiben fundamental menschlich.',
    affectedTasks: ['Wissensabfrage', 'Korrektur', 'Lernmaterial erstellen'],
  },
  {
    id: '9',
    title: 'Grafikdesigner:in',
    category: 'Kreativ',
    riskScore: 60,
    trend: 'rising',
    reasoning: 'Midjourney, DALL-E und Adobe Firefly automatisieren viele visuelle Aufgaben. Konzeption und Markenarbeit bleiben wertvoll, aber Volumen sinkt.',
    affectedTasks: ['Stock-Grafiken', 'Social-Media-Assets', 'Banner erstellen'],
  },
]

type SortOption = 'risk-high' | 'risk-low' | 'alpha'

export default function AIJobsPage() {
  const [sortBy, setSortBy] = useState<SortOption>('risk-high')

  const sortedJobs = [...jobsData].sort((a, b) => {
    if (sortBy === 'risk-high') return b.riskScore - a.riskScore
    if (sortBy === 'risk-low') return a.riskScore - b.riskScore
    return a.title.localeCompare(b.title, 'de')
  })

  return (
    <Box>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            AI Job-Risiko-Monitor
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400, maxWidth: 640 }}
          >
            Welche Berufe sind durch künstliche Intelligenz gefährdet?
            Aktuelle Einschätzungen basierend auf technologischen Entwicklungen und Markttrends.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
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

        <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Typography variant="overline" color="text.secondary">
            Hinweis zur Methodik
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Die Risiko-Scores basieren auf einer Kombination aus aktuellen AI-Fähigkeiten, Markttrends,
            Automatisierungsgrad der Kernaufgaben und regulatorischen Faktoren. Die Einschätzungen sind
            keine Prognosen, sondern spiegeln den aktuellen Stand der Technologie wider.
            Individuelle Spezialisierungen können das persönliche Risiko erheblich beeinflussen.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
