import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Box } from '@mui/material';

export function DashboardLayout({ title }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        width: '100%',
      }}
    >
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: '100%',
        }}
      >
        <Navbar title={title} onMenuClick={handleDrawerToggle} />
        <Box component="main" sx={{ flex: 1, p: { xs: 1, sm: 3 }, width: '100%', overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
