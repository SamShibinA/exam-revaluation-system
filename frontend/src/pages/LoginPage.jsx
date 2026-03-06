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
        background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 25%, #f0fdfa 50%, #e0faf4 75%, #f0fdfa 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        p: { xs: 2, sm: 3 },
        overflow: 'hidden',
      }}
    >
      {/* Background Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15, 118, 110, 0.08) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '45%',
          height: '45%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(94, 234, 212, 0.1) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '60%',
          width: '30%',
          height: '30%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.06) 0%, transparent 70%)',
          animation: 'float 12s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      <Card
        className="animate-scale-in"
        sx={{
          maxWidth: 420,
          width: '100%',
          position: 'relative',
          zIndex: 1,
          mx: { xs: 1, sm: 0 },
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.75)',
          border: '1px solid rgba(204, 251, 241, 0.5)',
          boxShadow: '0 20px 60px -15px rgba(15, 118, 110, 0.15), 0 8px 20px -10px rgba(15, 118, 110, 0.1)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
            <Box
              sx={{
                width: { xs: 52, sm: 60 },
                height: { xs: 52, sm: 60 },
                borderRadius: 3,
                background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 24px -6px rgba(15, 118, 110, 0.4)',
                animation: 'float 4s ease-in-out infinite',
              }}
            >
              <SchoolIcon sx={{ fontSize: { xs: 26, sm: 30 }, color: 'white' }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem' }, letterSpacing: '-0.02em' }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
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
              sx={{ mb: 2.5 }}
            />

            <Box sx={{ mb: 2.5 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
              >
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Password
                </Typography>
                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  variant="body2"
                  underline="hover"
                  fontWeight={500}
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
              sx={{
                mb: 3,
                py: 1.3,
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0d5c56 0%, #0f766e 100%)',
                },
              }}
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
            <Box sx={{
              background: 'linear-gradient(135deg, rgba(240, 253, 250, 0.8) 0%, rgba(204, 251, 241, 0.3) 100%)',
              borderRadius: 3,
              p: 2,
              border: '1px solid rgba(204, 251, 241, 0.5)',
            }}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                display="block"
                textAlign="center"
                mb={1.5}
                sx={{ letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.6rem' }}
              >
                Demo Credentials
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: 'rgba(255,255,255,0.7)',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  mb: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  👨‍🎓 Student:
                </Typography>
                <Typography variant="caption" fontFamily="monospace" fontWeight={600} sx={{ fontSize: '0.68rem' }}>
                  student@university.edu / student123
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: 'rgba(255,255,255,0.7)',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  🛡️ Admin:
                </Typography>
                <Typography variant="caption" fontFamily="monospace" fontWeight={600} sx={{ fontSize: '0.68rem' }}>
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
