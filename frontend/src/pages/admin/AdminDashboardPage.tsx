import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useEditions } from '../../hooks/useEditions'
import { useStories } from '../../hooks/useStories'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { editions } = useEditions()
  const { stories } = useStories()

  const publishedCount = editions.filter((e) => e.status === 'published').length
  const draftCount = editions.filter((e) => e.status === 'draft').length
  const unassignedCount = stories.filter((s) => s.editionId === null).length

  const stats = [
    { label: 'Stories gesamt', value: stories.length },
    { label: 'Nicht zugeordnet', value: unassignedCount },
    { label: 'Ausgaben veröffentlicht', value: publishedCount },
    { label: 'Ausgaben als Entwurf', value: draftCount },
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/story/neu')}
          >
            + Neue Story
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={() => navigate('/admin/edition/neu')}
          >
            + Neue Ausgabe
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h4" fontWeight={700} color="primary">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Ausgaben-Tabelle */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Ausgaben
      </Typography>
      <Card sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Titel</TableCell>
              <TableCell>Datum</TableCell>
              <TableCell>Stories</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editions.map((edition) => (
              <TableRow key={edition.id} hover>
                <TableCell>{edition.number}</TableCell>
                <TableCell>{edition.title}</TableCell>
                <TableCell>{new Date(edition.publishedAt).toLocaleDateString('de-DE')}</TableCell>
                <TableCell>{edition.storyIds.length}</TableCell>
                <TableCell>
                  <Chip
                    label={edition.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                    color={edition.status === 'published' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/admin/edition/${edition.id}`)}
                  >
                    Ansehen
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Stories-Tabelle */}
      <Typography variant="h6" gutterBottom>
        Letzte Stories
      </Typography>
      <Card>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Titel</TableCell>
              <TableCell>Quelle</TableCell>
              <TableCell>Datum</TableCell>
              <TableCell>Ausgabe</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stories.slice(0, 8).map((story) => (
              <TableRow key={story.id} hover>
                <TableCell sx={{ maxWidth: 280 }}>
                  <Typography variant="body2" noWrap>
                    {story.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">{story.source.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {new Date(story.publishedAt).toLocaleDateString('de-DE')}
                  </Typography>
                </TableCell>
                <TableCell>
                  {story.editionId ? (
                    <Chip label={story.editionId} size="small" variant="outlined" />
                  ) : (
                    <Typography variant="caption" color="text.disabled">
                      nicht zugeordnet
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  )
}
