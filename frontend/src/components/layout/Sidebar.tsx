import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
  Switch,
  FormControlLabel,
  Avatar,
} from '@mui/material'
import {
  Archive as ArchiveIcon,
  Work as WorkIcon,
  Psychology as PsychologyIcon,
  Info as InfoIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import { NavLink, useLocation } from 'react-router-dom'
import { useLayout } from '../../context/LayoutContext'
import { useAuth } from '../../context/AuthContext'

const DRAWER_WIDTH = 260

const navItems = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Archiv', path: '/archiv', icon: <ArchiveIcon /> },
  { label: 'KI-Jobs', path: '/ki-jobs', icon: <WorkIcon /> },
  { label: 'KI-Modelle', path: '/ki-modelle', icon: <PsychologyIcon /> },
]

const secondaryItems = [
  { label: 'About', path: '/about', icon: <InfoIcon /> },
]

export default function Sidebar() {
  const location = useLocation()
  const { mode, toggleMode } = useLayout()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const activeStyle = {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    color: 'primary.main',
    '& .MuiListItemIcon-root': {
      color: 'primary.main',
    },
  }

  return (
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
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: (t) => t.palette.brand.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 18 }}>
            U
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: (t) => t.palette.brand.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          up2daite
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="overline" color="text.secondary" sx={{ px: 1 }}>
          Navigation
        </Typography>
      </Box>

      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                },
                ...(isActive(item.path) ? activeStyle : {}),
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="overline" color="text.secondary" sx={{ px: 1 }}>
          Mehr
        </Typography>
      </Box>

      <List sx={{ px: 1 }}>
        {secondaryItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                },
                ...(isActive(item.path) ? activeStyle : {}),
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: 'action.hover',
          }}
        >
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
            <PersonIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {user ? user.username : 'Gast'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user ? 'Admin' : 'Nicht angemeldet'}
            </Typography>
          </Box>
          {user && (
            <Button
              size="small"
              onClick={logout}
              sx={{ minWidth: 0, p: 0.5, color: 'text.secondary' }}
              title="Abmelden"
            >
              <LogoutIcon fontSize="small" />
            </Button>
          )}
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={mode === 'sidebar'}
              onChange={toggleMode}
              size="small"
            />
          }
          label={
            <Typography variant="caption" color="text.secondary">
              Sidebar Layout
            </Typography>
          }
          sx={{ mt: 2, ml: 0 }}
        />
      </Box>
    </Drawer>
  )
}

export { DRAWER_WIDTH }
