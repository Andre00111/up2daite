import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  AppBar,
  Button,
  Divider,
} from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { adminTheme } from '../../theme'

const DRAWER_WIDTH = 220

const navItems = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'New story', to: '/admin/story/neu' },
  { label: 'New edition', to: '/admin/edition/neu' },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (to: string) => {
    if (to === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(to)
  }

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            up2daite · Admin
          </Typography>
          <Button
            onClick={() => navigate('/')}
            color="inherit"
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            ← Back to website
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List dense>
          {navItems.map((item) => (
            <ListItem key={item.to} disablePadding>
              <ListItemButton
                selected={isActive(item.to)}
                onClick={() => navigate(item.to)}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: isActive(item.to) ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
        <Toolbar />
        <Outlet />
      </Box>
      </Box>
    </ThemeProvider>
  )
}
