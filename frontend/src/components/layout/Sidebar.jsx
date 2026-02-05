import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from '../../context/AuthContext';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Typography,
  IconButton,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  CheckBox as CheckBoxIcon,
  CloudUpload as CloudUploadIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  School as SchoolIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

const studentNavItems = [
  { label: 'Dashboard', href: '/student', icon: DashboardIcon },
  { label: 'View Marks', href: '/student/marks', icon: DescriptionIcon },
  { label: 'Apply for Review', href: '/student/apply-review', icon: AssignmentIcon },
  { label: 'Apply for Revaluation', href: '/student/apply-revaluation', icon: CheckBoxIcon },
  { label: 'Request Status', href: '/student/requests', icon: HistoryIcon },
];

const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: DashboardIcon },
  { label: 'All Requests', href: '/admin/requests', icon: AssignmentIcon },
  { label: 'Upload Documents', href: '/admin/upload', icon: CloudUploadIcon },
  { label: 'Manage Students', href: '/admin/students', icon: PeopleIcon },
  { label: 'Settings', href: '/admin/settings', icon: SettingsIcon },
];

const drawerWidth = 260;
const collapsedWidth = 72;

export function Sidebar({ mobileOpen = false, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = isAdmin ? adminNavItems : studentNavItems;
  const width = isMobile ? drawerWidth : (collapsed ? collapsedWidth : drawerWidth);

  const handleNavClick = () => {
    if (isMobile && onClose) onClose();
  };

  const drawerContent = (
    <>
      {/* Logo */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile || !collapsed ? 'flex-start' : 'center',
          px: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SchoolIcon />
        </Box>
        {(isMobile || !collapsed) && (
          <Typography variant="h6" sx={{ ml: 1.5, fontWeight: 600 }}>
            ERS Portal
          </Typography>
        )}
      </Box>

      {/* User Info */}
      {(isMobile || !collapsed) && user && (
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" fontWeight={500} noWrap>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }} noWrap>
                {isAdmin ? 'Admin' : user.studentId}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 1, overflowY: 'auto' }}>
        <List>
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            const button = (
              <ListItem key={item.href} disablePadding sx={{ px: 1, mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.href}
                  onClick={handleNavClick}
                  sx={{
                    borderRadius: 2,
                    minHeight: 44,
                    justifyContent: isMobile || !collapsed ? 'flex-start' : 'center',
                    backgroundColor: isActive
                      ? 'rgba(255,255,255,0.2)'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isMobile || !collapsed ? 2 : 0,
                      justifyContent: 'center',
                      color: 'inherit',
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  {(isMobile || !collapsed) && <ListItemText primary={item.label} />}
                </ListItemButton>
              </ListItem>
            );

            return !isMobile && collapsed ? (
              <Tooltip key={item.href} title={item.label} placement="right">
                {button}
              </Tooltip>
            ) : (
              button
            );
          })}
        </List>
      </Box>

      {/* Collapse Toggle - desktop only */}
      <IconButton
        onClick={() => setCollapsed(!collapsed)}
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'absolute',
          right: -12,
          top: 80,
          width: 24,
          height: 24,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
          boxShadow: 2,
          '&:hover': {
            backgroundColor: 'grey.100',
          },
        }}
      >
        {collapsed ? (
          <ChevronRightIcon sx={{ fontSize: 16 }} />
        ) : (
          <ChevronLeftIcon sx={{ fontSize: 16 }} />
        )}
      </IconButton>

      {/* Logout */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ p: 1 }}>
        <Tooltip title="Logout" placement="right">
          <ListItemButton
            onClick={() => {
              if (isMobile && onClose) onClose();
              logout();
            }}
            sx={{
              borderRadius: 2,
              minHeight: 44,
              justifyContent: isMobile || !collapsed ? 'flex-start' : 'center',
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isMobile || !collapsed ? 2 : 0,
                justifyContent: 'center',
                color: 'inherit',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {(isMobile || !collapsed) && <ListItemText primary="Logout" />}
          </ListItemButton>
        </Tooltip>
      </Box>
    </>
  );

  const drawerSx = {
    flexShrink: 0,
    width: isMobile ? drawerWidth : width,
    '& .MuiDrawer-paper': {
      width: isMobile ? drawerWidth : width,
      boxSizing: 'border-box',
      backgroundColor: 'primary.main',
      color: 'primary.contrastText',
      transition: isMobile ? 'none' : 'width 0.3s ease',
      overflowX: 'hidden',
      ...(isMobile && { boxSizing: 'border-box', top: 0, left: 0 }),
    },
  };

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={drawerSx}
      >
        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
          {drawerContent}
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer variant="permanent" sx={drawerSx}>
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        {drawerContent}
      </Box>
    </Drawer>
  );
}
