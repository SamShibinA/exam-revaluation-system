import { useEffect, useState } from "react";
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
} from "@mui/material";
import {
  Person as UserIcon,
  Notifications as BellIcon,
  Security as ShieldIcon,
} from "@mui/icons-material";

export default function AdminSettingsPage() {
  const token = localStorage.getItem("auth_token");

  const [profile, setProfile] = useState({ fullName: "", email: "", department: "" });
  const [notifications, setNotifications] = useState({ emailNotifications: true, dailySummary: true, urgentAlerts: true });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile({ fullName: data.fullName || "", email: data.email || "", department: data.department || "" });
        setNotifications({
          emailNotifications: data.emailNotifications ?? true,
          dailySummary: data.dailySummary ?? true,
          urgentAlerts: data.urgentAlerts ?? true,
        });
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveProfile = async () => {
    await fetch(`${BASE_URL}/admin/settings/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(profile),
    });
    alert("Profile updated successfully");
  };

  const handleToggle = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    await fetch(`${BASE_URL}/admin/settings/notifications`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(updated),
    });
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    const res = await fetch(`${BASE_URL}/admin/settings/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Password updated successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      alert(data.message || "Failed to update password");
    }
  };

  const SectionIcon = ({ icon: Icon, gradient }) => (
    <Box sx={{
      width: 40,
      height: 40,
      borderRadius: 2.5,
      background: gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px -4px rgba(0,0,0,0.15)',
    }}>
      <Icon sx={{ color: 'white', fontSize: 20 }} />
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", width: "100%", px: { xs: 1, sm: 2 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }} className="animate-fade-in-up">
        <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: "1.1rem", sm: "1.5rem" }, letterSpacing: '-0.02em' }}>
          Settings ⚙️
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account and system preferences
        </Typography>
      </Box>

      {/* Profile Settings */}
      <Card sx={{ mb: 3 }} className="animate-fade-in-up animate-stagger-1">
        <CardHeader
          avatar={<SectionIcon icon={UserIcon} gradient="linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)" />}
          title="Profile Settings"
          subheader="Update your personal information"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </Grid>
          </Grid>
          <TextField fullWidth label="Department" value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} sx={{ mb: 2.5 }} />
          <Button
            variant="contained"
            onClick={handleSaveProfile}
            sx={{
              background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #0d5c56 0%, #0f766e 100%)' },
            }}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card sx={{ mb: 3 }} className="animate-fade-in-up animate-stagger-2">
        <CardHeader
          avatar={<SectionIcon icon={BellIcon} gradient="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)" />}
          title="Notifications"
          subheader="Configure how you receive notifications"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates for new requests' },
            { key: 'dailySummary', label: 'Daily Summary', desc: 'Get a daily summary of pending requests' },
            { key: 'urgentAlerts', label: 'Urgent Alerts', desc: 'Immediate notifications for urgent matters' },
          ].map((item, i, arr) => (
            <Box key={item.key}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.5 }}>
                <Box>
                  <Typography fontWeight={600}>{item.label}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                </Box>
                <Switch checked={notifications[item.key]} onChange={() => handleToggle(item.key)} color="primary" />
              </Box>
              {i < arr.length - 1 && <Divider />}
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="animate-fade-in-up animate-stagger-3">
        <CardHeader
          avatar={<SectionIcon icon={ShieldIcon} gradient="linear-gradient(135deg, #ef4444 0%, #f87171 100%)" />}
          title="Security"
          subheader="Manage your account security"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <TextField fullWidth type="password" label="Current Password" sx={{ mb: 2.5 }} value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
          <TextField fullWidth type="password" label="New Password" sx={{ mb: 2.5 }} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
          <TextField fullWidth type="password" label="Confirm New Password" sx={{ mb: 2.5 }} value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
          <Button
            variant="contained"
            onClick={handleChangePassword}
            sx={{
              background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #0d5c56 0%, #0f766e 100%)' },
            }}
          >
            Update Password
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
