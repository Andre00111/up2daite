import { Box, Container, Typography, Grid2 as Grid, Chip, Avatar } from '@mui/material'

interface AIModel {
  id: string
  name: string
  company: string
  logo: string
  gradient: string
  accentColor: string
  rank: number
  category: string
  highlights: string[]
  releaseYear: number
}

const models: AIModel[] = [
  {
    id: '1',
    name: 'GPT-4o',
    company: 'OpenAI',
    logo: '✦',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    accentColor: '#10b981',
    rank: 1,
    category: 'Multimodal',
    highlights: ['Echtzeit-Voice', 'Vision', 'Reasoning'],
    releaseYear: 2024,
  },
  {
    id: '2',
    name: 'Claude 4',
    company: 'Anthropic',
    logo: '◈',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    accentColor: '#f97316',
    rank: 2,
    category: 'Reasoning',
    highlights: ['200K Context', 'Coding', 'Sicherheit'],
    releaseYear: 2025,
  },
  {
    id: '3',
    name: 'Gemini Ultra',
    company: 'Google',
    logo: '◆',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    accentColor: '#3b82f6',
    rank: 3,
    category: 'Multimodal',
    highlights: ['1M Context', 'Video', 'Search'],
    releaseYear: 2024,
  },
  {
    id: '4',
    name: 'Llama 3.1',
    company: 'Meta',
    logo: '🦙',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    accentColor: '#8b5cf6',
    rank: 4,
    category: 'Open Source',
    highlights: ['405B Parameter', 'Open Weights', 'Multilingual'],
    releaseYear: 2024,
  },
  {
    id: '5',
    name: 'Mistral Large',
    company: 'Mistral AI',
    logo: '🌀',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    accentColor: '#ec4899',
    rank: 5,
    category: 'Enterprise',
    highlights: ['EU-basiert', 'Multilingual', 'Effizient'],
    releaseYear: 2024,
  },
  {
    id: '6',
    name: 'Grok-2',
    company: 'xAI',
    logo: '⚡',
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    accentColor: '#14b8a6',
    rank: 6,
    category: 'Realtime',
    highlights: ['X-Integration', 'Echtzeit-Daten', 'Unzensiert'],
    releaseYear: 2024,
  },
  {
    id: '7',
    name: 'DALL-E 3',
    company: 'OpenAI',
    logo: '🎨',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    accentColor: '#f43f5e',
    rank: 7,
    category: 'Bildgenerierung',
    highlights: ['Prompt-Treue', 'Text in Bildern', 'ChatGPT-integriert'],
    releaseYear: 2023,
  },
  {
    id: '8',
    name: 'Midjourney v6',
    company: 'Midjourney',
    logo: '🖼️',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    accentColor: '#6366f1',
    rank: 8,
    category: 'Bildgenerierung',
    highlights: ['Fotorealismus', 'Stil-Kontrolle', 'Upscaling'],
    releaseYear: 2024,
  },
  {
    id: '9',
    name: 'Sora',
    company: 'OpenAI',
    logo: '🎬',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    accentColor: '#0ea5e9',
    rank: 9,
    category: 'Video',
    highlights: ['Text-to-Video', '1 Min Clips', 'Physik-Verständnis'],
    releaseYear: 2024,
  },
]

function ModelCard({ model }: { model: AIModel }) {
  const isTop3 = model.rank <= 3

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        background: model.gradient,
        color: 'white',
        p: 3,
        height: '100%',
        minHeight: isTop3 ? 280 : 220,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'default',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: `0 20px 40px ${model.accentColor}40`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.2) 100%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        <Avatar
          sx={{
            bgcolor: 'rgba(255,255,255,0.25)',
            color: 'white',
            fontWeight: 800,
            fontSize: isTop3 ? '1.25rem' : '1rem',
            width: isTop3 ? 48 : 36,
            height: isTop3 ? 48 : 36,
            backdropFilter: 'blur(8px)',
          }}
        >
          #{model.rank}
        </Avatar>
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          sx={{
            fontSize: isTop3 ? '3rem' : '2.5rem',
            lineHeight: 1,
            mb: 1,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          }}
        >
          {model.logo}
        </Typography>

        <Typography
          variant={isTop3 ? 'h4' : 'h5'}
          sx={{ fontWeight: 700, mb: 0.5, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
        >
          {model.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{ opacity: 0.9, mb: 2, fontWeight: 500 }}
        >
          {model.company}
        </Typography>

        <Chip
          label={model.category}
          size="small"
          sx={{
            bgcolor: 'rgba(255,255,255,0.25)',
            color: 'white',
            fontWeight: 600,
            backdropFilter: 'blur(8px)',
            mb: 2,
          }}
        />
      </Box>

      <Box sx={{ mt: 'auto', position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {model.highlights.map((h) => (
            <Chip
              key={h}
              label={h}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: 'white',
                fontSize: '0.7rem',
                height: 24,
              }}
            />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.1)',
          pointerEvents: 'none',
        }}
      />
    </Box>
  )
}

export default function AIModelsPage() {
  const top3 = models.filter((m) => m.rank <= 3)
  const rest = models.filter((m) => m.rank > 3)

  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
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
            background: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
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
                background: 'linear-gradient(90deg, #fff 0%, #c4b5fd 50%, #f9a8d4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Die führenden KI-Modelle
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400, maxWidth: 600, mx: 'auto' }}
            >
              Ein Überblick über die leistungsstärksten AI-Systeme der Welt
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: 2, mb: 3, display: 'block' }}
          >
            Top 3 Modelle
          </Typography>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {top3.map((model) => (
              <Grid key={model.id} size={{ xs: 12, md: 4 }}>
                <ModelCard model={model} />
              </Grid>
            ))}
          </Grid>

          <Typography
            variant="overline"
            sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: 2, mb: 3, display: 'block' }}
          >
            Weitere führende Modelle
          </Typography>
          <Grid container spacing={3}>
            {rest.map((model) => (
              <Grid key={model.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <ModelCard model={model} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Rankings basieren auf Benchmarks, Nutzerfeedback und Industrieadoption.
            Die KI-Landschaft entwickelt sich rasant – Änderungen vorbehalten.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
