import { useState } from 'react';
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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotifOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ gap: { xs: 1, sm: 2 }, minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
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
          <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
              backgroundColor: 'grey.100',
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
        <IconButton onClick={handleNotifOpen}>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={handleNotifClose}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
          </Box>
          <Divider />

          <MenuItem onClick={handleNotifClose}>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Request Approved
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Your revaluation request for CS301 has been approved.
              </Typography>
            </Box>
          </MenuItem>

          <MenuItem onClick={handleNotifClose}>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                New Document Uploaded
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Response sheet for CS302 is now available.
              </Typography>
            </Box>
          </MenuItem>

          <MenuItem onClick={handleNotifClose}>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Marks Updated
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Your marks for CS303 have been updated.
              </Typography>
            </Box>
          </MenuItem>

          <Divider />
          <MenuItem
            onClick={handleNotifClose}
            sx={{ justifyContent: 'center', color: 'primary.main' }}
          >
            View all notifications
          </MenuItem>
        </Menu>

        {/* User Menu */}
        <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {user?.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}
          >
            {user?.name}
          </Typography>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              My Account
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
