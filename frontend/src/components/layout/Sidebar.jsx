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
  { label: 'View Document', href: '/student/view-document', icon: CloudUploadIcon },
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
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'rotate(8deg) scale(1.05)',
            },
          }}
        >
          <SchoolIcon sx={{ fontSize: 22 }} />
        </Box>
        {(isMobile || !collapsed) && (
          <Box sx={{ ml: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              ERS Portal
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.5, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Exam Revaluation
            </Typography>
          </Box>
        )}
      </Box>

      {/* User Info */}
      {(isMobile || !collapsed) && user && (
        <Box sx={{
          p: 2,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2.5,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)',
            backdropFilter: 'blur(8px)',
          }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                width: 40,
                height: 40,
                fontSize: '1rem',
                fontWeight: 700,
                border: '2px solid rgba(255,255,255,0.2)',
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.6 }} noWrap>
                {isAdmin ? '🛡️ Administrator' : `📚 ${user.studentId}`}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 1.5, overflowY: 'auto', px: 0.5 }}>
        {(isMobile || !collapsed) && (
          <Typography
            variant="caption"
            sx={{
              px: 2,
              py: 1,
              display: 'block',
              opacity: 0.4,
              fontSize: '0.6rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            Navigation
          </Typography>
        )}
        <List>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            const button = (
              <ListItem key={item.href} disablePadding sx={{ px: 0.5, mb: 0.3 }}>
                <ListItemButton
                  component={Link}
                  to={item.href}
                  onClick={handleNavClick}
                  sx={{
                    borderRadius: 2.5,
                    minHeight: 44,
                    justifyContent: isMobile || !collapsed ? 'flex-start' : 'center',
                    backgroundColor: isActive
                      ? 'rgba(255,255,255,0.18)'
                      : 'transparent',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    '&::before': isActive ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      bottom: '20%',
                      width: 3,
                      borderRadius: '0 4px 4px 0',
                      background: 'rgba(255,255,255,0.9)',
                    } : {},
                    '&:hover': {
                      backgroundColor: isActive
                        ? 'rgba(255,255,255,0.22)'
                        : 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isMobile || !collapsed ? 1.5 : 0,
                      justifyContent: 'center',
                      color: 'inherit',
                      opacity: isActive ? 1 : 0.7,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  {(isMobile || !collapsed) && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.83rem',
                        fontWeight: isActive ? 600 : 400,
                        letterSpacing: isActive ? '0.01em' : 0,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );

            return !isMobile && collapsed ? (
              <Tooltip key={item.href} title={item.label} placement="right" arrow>
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
          boxShadow: 3,
          '&:hover': {
            backgroundColor: 'grey.100',
          },
        }}
      >
        {collapsed ? (
          <ChevronRightIcon sx={{ fontSize: 14 }} />
        ) : (
          <ChevronLeftIcon sx={{ fontSize: 14 }} />
        )}
      </IconButton>

      {/* Logout */}
      <Box sx={{ p: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Tooltip title="Logout" placement="right">
          <ListItemButton
            onClick={() => {
              if (isMobile && onClose) onClose();
              logout();
            }}
            sx={{
              borderRadius: 2.5,
              minHeight: 44,
              justifyContent: isMobile || !collapsed ? 'flex-start' : 'center',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                '& .MuiListItemIcon-root': {
                  color: '#fca5a5',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isMobile || !collapsed ? 1.5 : 0,
                justifyContent: 'center',
                color: 'inherit',
                opacity: 0.7,
                transition: 'all 0.2s ease',
              }}
            >
              <LogoutIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            {(isMobile || !collapsed) && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ fontSize: '0.83rem' }}
              />
            )}
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
      background: 'linear-gradient(180deg, #0a5f58 0%, #0f766e 30%, #0d6b64 70%, #0a5f58 100%)',
      color: 'primary.contrastText',
      transition: isMobile ? 'none' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflowX: 'hidden',
      borderRight: 'none',
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
