import { Outlet } from 'react-router-dom'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import Header from './Header'
import Footer from './Footer'
import Sidebar, { DRAWER_WIDTH } from './Sidebar'
import { useLayout } from '../../context/LayoutContext'

export default function Layout() {
  const { mode } = useLayout()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const showSidebar = mode === 'sidebar' && !isMobile

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {showSidebar && <Sidebar />}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          width: showSidebar ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
        }}
      >
        {!showSidebar && <Header />}

        <Box component="main" sx={{ flex: 1 }}>
          <Outlet />
        </Box>

        <Footer />
      </Box>
    </Box>
  )
}
