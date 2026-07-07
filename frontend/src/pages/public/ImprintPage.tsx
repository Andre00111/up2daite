import { Box, Container, Typography, Paper } from '@mui/material'

export default function ImprintPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Impressum
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          Verantwortlicher
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          André Butkevich
          <br />
          hello@up2daite.com
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          Haftungsausschluss
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt.
          Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
          übernehmen wir jedoch keine Haftung. Als Diensteanbieter sind wir gemäß
          TMG § 7 Abs. 1 für eigene Inhalte auf diesen Seiten nach den allgemeinen
          Gesetzen verantwortlich. Nach §§ 8–10 des TMG sind wir als
          Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte
          fremde Informationen zu überwachen oder nach Umständen zu forschen, die
          auf eine rechtswidrige Tätigkeit hinweisen.
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          Haftung für Links
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Unser Angebot enthält Links zu externen Websites. Für die Inhalte der
          verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          Wir haben keinen Einfluss auf die Gestaltung und die Inhalte der
          verlinkten Seiten. Das Setzen von Links bedeutet nicht, dass wir uns die
          hinter dem Link liegenden Inhalte zu eigen machen.
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          Urheberrecht
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Die Inhalte und Werke auf dieser Website sind urheberrechtlich geschützt.
          Jede Art der Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
          Verwertung außerhalb der Grenzen des Urheberrechtes bedarf der
          schriftlichen Zustimmung des Autors oder Creators.
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          Datenschutz
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Informationen zur Verarbeitung personenbezogener Daten findest du in
          unserer{' '}
          <Box
            component="a"
            href="/privacy"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Datenschutzerklärung
          </Box>
          .
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 4, display: 'block' }}>
          Letzte Aktualisierung: Juli 2026
        </Typography>
      </Paper>
    </Container>
  )
}
