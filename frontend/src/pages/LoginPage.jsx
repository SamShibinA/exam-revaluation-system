import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
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
  Divider,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;
    setError(null);
    setIsGoogleLoading(true);
    try {
      const data = await loginWithGoogle(credentialResponse.credential);
      enqueueSnackbar('Welcome! You have successfully signed in with Google.', { variant: 'success' });
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err?.message || 'Google sign-in failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

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
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3.5, sm: 5 } }}>
            <Box
              sx={{
                width: { xs: 48, sm: 64 },
                height: { xs: 48, sm: 64 },
                borderRadius: 3.5,
                background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
                boxShadow: '0 8px 24px -6px rgba(15, 118, 110, 0.4)',
                animation: 'float 4s ease-in-out infinite',
              }}
            >
              <SchoolIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: 'white' }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: '1.25rem', sm: '1.75rem' }, letterSpacing: '-0.02em' }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
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
                mb: 2,
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

            {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
              <>
                <Divider sx={{ my: 2 }}>or</Divider>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      setError('Google sign-in was cancelled or failed');
                      setIsGoogleLoading(false);
                    }}
                    use_fedcm_for_prompt
                    theme="filled_black"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                    width={320}
                    locale="en"
                  />
                </Box>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
