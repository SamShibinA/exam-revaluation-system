import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  TextField,
  InputAdornment,
  Box,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

export function Navbar({ title, onMenuClick }) {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotifOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
    fetchNotifications(); // fresh list when opening
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(16px)',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ gap: { xs: 1, sm: 2 }, minHeight: { xs: 56, sm: 64 }, px: { xs: 1.5, sm: 2.5 } }}>
        <IconButton
          color="inherit"
          aria-label="open menu"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 1, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        {title && (
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </Typography>
        )}

        <Box sx={{ flex: 1 }} />

        {/* Search */}
        <TextField
          size="small"
          placeholder="Search..."
          sx={{
            display: { xs: 'none', md: 'block' },
            width: 250,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(240, 253, 250, 0.6)',
              borderRadius: 2.5,
              fontSize: '0.85rem',
              '& fieldset': {
                borderColor: 'rgba(204, 251, 241, 0.5)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(15, 118, 110, 0.3)',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {/* Notifications */}
        <IconButton
          onClick={handleNotifOpen}
          sx={{
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 8,
              right: 8,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              animation: 'pulseRing 2s infinite',
            },
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={handleNotifClose}
          PaperProps={{
            sx: { width: 340, maxHeight: 420 },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2.5, py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Notifications
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {unreadCount === 0 ? "You have no unread messages" : `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`}
            </Typography>
          </Box>
          <Divider />

          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No notifications yet.
              </Typography>
            </Box>
          ) : (
            notifications.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => handleMarkAsRead(notif._id)}
                sx={{ py: 1.5, px: 2, bgcolor: notif.isRead ? 'transparent' : 'rgba(15, 118, 110, 0.05)' }}
              >
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', width: '100%' }}>
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: notif.type === 'success' ? '#22c55e' : notif.type === 'error' ? '#ef4444' : notif.type === 'warning' ? '#f59e0b' : '#0ea5e9',
                    mt: 0.8,
                    flexShrink: 0,
                  }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <Typography variant="body2" fontWeight={notif.isRead ? 500 : 700}>
                        {notif.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1, flexShrink: 0 }}>
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3, whiteSpace: 'normal' }}>
                      {notif.message}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))
          )}

          <Divider />
          <MenuItem
            onClick={fetchNotifications}
            sx={{ justifyContent: 'center', color: 'primary.main', fontWeight: 600, py: 1.5 }}
          >
            Refresh Notifications
          </MenuItem>
        </Menu>

        {/* User Menu */}
        <Box
          onClick={handleMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            py: 0.5,
            px: 1,
            borderRadius: 2.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(240, 253, 250, 0.6)',
            },
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: 'primary.main',
              fontSize: '0.85rem',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(15, 118, 110, 0.25)',
            }}
          >
            {user?.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ lineHeight: 1.2 }}
            >
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
              {user?.role === 'admin' ? 'Administrator' : 'Student'}
            </Typography>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2.5, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              My Account
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />

          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>

          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={() => {
              handleMenuClose();
              logout();
            }}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
