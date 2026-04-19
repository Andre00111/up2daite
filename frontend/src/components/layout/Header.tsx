import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          component={Link}
          to="/"
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            textDecoration: 'none',
            letterSpacing: '-0.03em',
          }}
        >
          up2daite
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            component={NavLink}
            to="/archiv"
            color="inherit"
            sx={{ fontWeight: 500, color: 'text.primary' }}
          >
            Archiv
          </Button>
          <Button
            href="mailto:hello@up2daite.com"
            variant="contained"
            color="secondary"
            size="small"
            disableElevation
          >
            Newsletter abonnieren
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
