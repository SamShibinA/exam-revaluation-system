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
  const token = localStorage.getItem("auth_token"); // or wherever you store JWT

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    department: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    dailySummary: true,
    urgentAlerts: true,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // 🔹 Fetch admin settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setProfile({
          fullName: data.fullName || "",
          email: data.email || "",
          department: data.department || "",
        });

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

  // 🔹 Save Profile Changes
  const handleSaveProfile = async () => {
    await fetch(`${BASE_URL}/admin/settings/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });

    alert("Profile updated successfully");
  };

  // 🔹 Update Notifications
  const handleToggle = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);

    await fetch(`${BASE_URL}/admin/settings/notifications`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });
  };

  // 🔹 Change Password
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    const res = await fetch(`${BASE_URL}/admin/settings/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Password updated successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      alert(data.message || "Failed to update password");
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", width: "100%", px: { xs: 0, sm: 1 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ fontSize: { xs: "1.1rem", sm: "1.5rem" } }}
        >
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
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Department"
            value={profile.department}
            onChange={(e) =>
              setProfile({ ...profile, department: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          <Button variant="contained" onClick={handleSaveProfile}>
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<BellIcon color="action" />}
          title="Notifications"
          subheader="Configure how you receive notifications"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography fontWeight={500}>Email Notifications</Typography>
              <Typography variant="body2" color="text.secondary">
                Receive email updates for new requests
              </Typography>
            </Box>
            <Switch
              checked={notifications.emailNotifications}
              onChange={() => handleToggle("emailNotifications")}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography fontWeight={500}>Daily Summary</Typography>
              <Typography variant="body2" color="text.secondary">
                Get a daily summary of pending requests
              </Typography>
            </Box>
            <Switch
              checked={notifications.dailySummary}
              onChange={() => handleToggle("dailySummary")}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography fontWeight={500}>Urgent Alerts</Typography>
              <Typography variant="body2" color="text.secondary">
                Immediate notifications for urgent matters
              </Typography>
            </Box>
            <Switch
              checked={notifications.urgentAlerts}
              onChange={() => handleToggle("urgentAlerts")}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader
          avatar={<ShieldIcon color="action" />}
          title="Security"
          subheader="Manage your account security"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            sx={{ mb: 2 }}
            value={passwords.currentPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, currentPassword: e.target.value })
            }
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            sx={{ mb: 2 }}
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            sx={{ mb: 2 }}
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                confirmPassword: e.target.value,
              })
            }
          />
          <Button variant="contained" onClick={handleChangePassword}>
            Update Password
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
