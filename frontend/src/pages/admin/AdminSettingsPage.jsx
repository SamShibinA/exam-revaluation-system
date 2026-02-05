import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Switch,
  Divider,
  Grid,
} from '@mui/material';
import {
  Person as UserIcon,
  Notifications as BellIcon,
  Security as ShieldIcon,
} from '@mui/icons-material';

export default function AdminSettingsPage() {
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', width: '100%', px: { xs: 0, sm: 1 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account and system preferences
        </Typography>
      </Box>

      {/* Profile Settings */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<UserIcon color="action" />}
          title="Profile Settings"
          subheader="Update your personal information"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                defaultValue="Dr. Sarah Johnson"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                defaultValue="admin@university.edu"
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Department"
            defaultValue="Exam Department"
            sx={{ mb: 2 }}
          />

          <Button variant="contained">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<BellIcon color="action" />}
          title="Notifications"
          subheader="Configure how you receive notifications"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box>
              <Typography fontWeight={500}>Email Notifications</Typography>
              <Typography variant="body2" color="text.secondary">
                Receive email updates for new requests
              </Typography>
            </Box>
            <Switch defaultChecked />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box>
              <Typography fontWeight={500}>Daily Summary</Typography>
              <Typography variant="body2" color="text.secondary">
                Get a daily summary of pending requests
              </Typography>
            </Box>
            <Switch defaultChecked />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography fontWeight={500}>Urgent Alerts</Typography>
              <Typography variant="body2" color="text.secondary">
                Immediate notifications for urgent matters
              </Typography>
            </Box>
            <Switch defaultChecked />
          </Box>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader
          avatar={<ShieldIcon color="action" />}
          title="Security"
          subheader="Manage your account security"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            sx={{ mb: 2 }}
          />
          <Button variant="contained">Update Password</Button>
        </CardContent>
      </Card>
    </Box>
  );
}
