import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Archive as ArchiveIcon,
  Work as WorkIcon,
  Psychology as PsychologyIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLayout } from '../../context/LayoutContext'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { label: 'Archiv', path: '/archiv', icon: <ArchiveIcon /> },
  { label: 'KI-Jobs', path: '/ki-jobs', icon: <WorkIcon /> },
  { label: 'KI-Modelle', path: '/ki-modelle', icon: <PsychologyIcon /> },
]

export default function Header() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()
  const { mode, toggleMode } = useLayout()
  const { user, logout } = useAuth()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const isActive = (path: string) => location.pathname === path

  const activeStyle = {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    color: 'primary.main',
    fontWeight: 600,
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 1, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          component={Link}
          to="/"
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            textDecoration: 'none',
            letterSpacing: '-0.03em',
            background: (t) => t.palette.brand.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          up2daite
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 4 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  fontWeight: 500,
                  color: 'text.secondary',
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  },
                  ...(isActive(item.path) ? activeStyle : {}),
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          {!isMobile && (
            <Button
              href="mailto:hello@up2daite.com"
              variant="contained"
              size="small"
              disableElevation
              sx={{
                background: (t) => t.palette.brand.gradient,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
              }}
            >
              Newsletter
            </Button>
          )}

          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{
              ml: 1,
              border: '2px solid',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              <PersonIcon sx={{ fontSize: 18 }} />
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { mt: 1, minWidth: 220, borderRadius: 2 },
            }}
          >
            {user && (
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="body2" fontWeight={600}>{user.username}</Typography>
                <Typography variant="caption" color="text.secondary">Admin</Typography>
              </Box>
            )}
            {user && <Divider />}
            {user && (
              <MenuItem component={Link} to="/admin" onClick={handleProfileMenuClose}>
                <ListItemIcon><AdminIcon fontSize="small" /></ListItemIcon>
                Admin-Bereich
              </MenuItem>
            )}
            <MenuItem component={Link} to="/about" onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <InfoIcon fontSize="small" />
              </ListItemIcon>
              About
            </MenuItem>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mode === 'sidebar'}
                    onChange={toggleMode}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Sidebar Layout
                  </Typography>
                }
              />
            </Box>
            {user && <Divider />}
            {user && (
              <MenuItem
                onClick={() => { handleProfileMenuClose(); logout() }}
                sx={{ color: 'error.main' }}
              >
                <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                Abmelden
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, borderRadius: '0 16px 16px 0' },
        }}
      >
        <Box sx={{ p: 2 }}>
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
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  ...(isActive(item.path) ? activeStyle : {}),
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mt: 'auto' }} />
        <Box sx={{ p: 2 }}>
          <Button
            href="mailto:hello@up2daite.com"
            variant="contained"
            fullWidth
            disableElevation
            sx={{
              background: (t) => t.palette.brand.gradient,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Newsletter abonnieren
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  )
}
