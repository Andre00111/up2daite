import { Box, Container, Typography, Paper } from '@mui/material'

export default function PrivacyPage() {
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
          Datenschutzerklärung
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Privacy Policy (English below)
        </Typography>

        {/* Deutsch */}
        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          1. Verantwortlicher
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          André Butkevich
          <br />
          hello@up2daite.com
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          2. Datenverarbeitung
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Diese Website verarbeitet <strong>keine persönlichen Daten von Besuchern</strong>.
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          <strong>Server-Logs:</strong>
          <br />
          Der Webserver (nginx) erstellt automatisch Zugriffsprotokolle, die folgende
          Informationen enthalten:
        </Typography>
        <Box component="ul" sx={{ color: 'text.secondary', pl: 2 }}>
          <Typography component="li" variant="body1">
            IP-Adresse des Zugreifenden
          </Typography>
          <Typography component="li" variant="body1">
            Zugriffszeitpunkt
          </Typography>
          <Typography component="li" variant="body1">
            Anfragepfad und HTTP-Status
          </Typography>
          <Typography component="li" variant="body1">
            User-Agent (Browser/Gerät)
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph sx={{ mt: 2 }}>
          <strong>Speicherdauer:</strong> max. 30 Tage
          <br />
          <strong>Zweck:</strong> Sicherheit, Fehleranalyse, Betriebssicherheit
          <br />
          <strong>Rechtsgrundlage:</strong> Berechtigtes Interesse (Art. 6 Abs. 1 DSGVO)
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          3. Cookies
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Diese Website setzt <strong>keine funktionalen oder Tracking-Cookies</strong>.
          Es werden keine Daten zu Besuchern gesammelt oder analysiert.
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          4. Externe Dienstleister
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Diese Website nutzt derzeit keine externen Tracking-, Analytics- oder
          Datenverarbeitungsdienste.
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          5. Ihre Rechte
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Nach der Datenschutz-Grundverordnung (DSGVO) haben Sie folgende Rechte:
        </Typography>
        <Box component="ul" sx={{ color: 'text.secondary', pl: 2 }}>
          <Typography component="li" variant="body1">
            <strong>Auskunftsrecht:</strong> Welche Daten haben wir über Sie?
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Recht auf Berichtigung:</strong> Korrektur falscher Daten
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Recht auf Löschung:</strong> Anfrage jederzeit möglich
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Recht auf Einschränkung:</strong> Verarbeitung limitieren
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Recht auf Datenportabilität:</strong> Daten in strukturierter Form
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph sx={{ mt: 2 }}>
          Anfragen richten Sie bitte an: <strong>hello@up2daite.com</strong>
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          6. Beschwerde
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Sie haben das Recht, bei der zuständigen Datenschutzbehörde Beschwerde
          einzureichen, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer
          persönlichen Daten gegen die DSGVO verstößt.
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          7. Änderungen
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Diese Datenschutzerklärung kann jederzeit geändert werden. Die aktuelle
          Fassung ist immer unter{' '}
          <Box
            component="a"
            href="/privacy"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            up2daite.com/privacy
          </Box>{' '}
          abrufbar.
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 4, display: 'block' }}>
          Letzte Aktualisierung: Juli 2026
        </Typography>
      </Paper>
    </Container>
  )
}
