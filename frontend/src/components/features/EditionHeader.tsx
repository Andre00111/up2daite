import { Box, Typography, Chip } from '@mui/material'
import type { Edition } from '../../types'

interface Props {
  edition: Edition
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function EditionHeader({ edition }: Props) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Chip
          label={`Ausgabe #${edition.number}`}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
        <Typography variant="body2" color="text.secondary">
          {formatDate(edition.publishedAt)}
        </Typography>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        {edition.title}
      </Typography>

      {edition.editorNote && (
        <Box
          sx={{
            mt: 2,
            pl: 2,
            borderLeft: '3px solid',
            borderColor: 'secondary.main',
          }}
        >
          <Typography variant="body1" color="text.secondary" fontStyle="italic">
            {edition.editorNote}
          </Typography>
        </Box>
      )}
    </Box>
  )
}
