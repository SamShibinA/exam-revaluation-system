import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const data = await login({ email, password });
      enqueueSnackbar('Welcome back! You have successfully logged in.', {
        variant: 'success',
      });

      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: { xs: 2, sm: 3 },
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: '-25%',
          left: '-25%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          bgcolor: 'primary.main',
          opacity: 0.05,
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-25%',
          right: '-25%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          bgcolor: 'secondary.main',
          opacity: 0.05,
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      <Card sx={{ maxWidth: 420, width: '100%', position: 'relative', zIndex: 1, mx: { xs: 1, sm: 0 } }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
            <Box
              sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <SchoolIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: 'white' }} />
            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your Exam Revaluation Portal
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Password
                </Typography>
                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  variant="body2"
                  underline="hover"
                >
                  Forgot password?
                </MuiLink>
              </Box>

              <TextField
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{ mb: 3 }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Demo Credentials */}
            <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2 }}>
              <Typography
                variant="caption"
                fontWeight={500}
                color="text.secondary"
                display="block"
                textAlign="center"
                mb={1}
              >
                Demo Credentials
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  bgcolor: 'background.paper',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Student:
                </Typography>
                <Typography variant="caption" fontFamily="monospace">
                  student@university.edu / student123
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  bgcolor: 'background.paper',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Admin:
                </Typography>
                <Typography variant="caption" fontFamily="monospace">
                  admin@university.edu / admin123
                </Typography>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
