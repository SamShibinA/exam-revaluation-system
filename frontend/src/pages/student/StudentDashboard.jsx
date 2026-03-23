import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatsCard } from '../../components/mui/StatsCard';
import { StatusBadge } from '../../components/mui/StatusBadge';
import { PageLoader } from '../../components/mui/PageLoader';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Grid,
} from '@mui/material';

import {
  MenuBook as BookIcon,
  Description as FileIcon,
  Schedule as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  ArrowForward as ArrowIcon,
  Assignment as ClipboardIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = user.id;
        const token = localStorage.getItem("auth_token");

        const statsRes = await fetch(
          `${BASE_URL}/student/stats/${studentId}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const requestsRes = await fetch(
          `${BASE_URL}/requests/my/${studentId}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const statsData = await statsRes.json();
        const requestsData = await requestsRes.json();

        setStats(statsData);
        setRecentRequests(requestsData.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);


  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', px: { xs: 1, sm: 0 } }}>
      {/* Welcome Section */}
      <Box
        className="animate-fade-in-up"
        sx={{
          background: 'linear-gradient(135deg, #0a5f58 0%, #0f766e 40%, #14b8a6 100%)',
          borderRadius: { xs: 2.5, sm: 4 },
          p: { xs: 2.5, sm: 3.5 },
          mb: { xs: 2.5, sm: 3.5 },
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Pattern overlay */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '50%',
          background: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: '1.25rem', sm: '1.6rem' }, position: 'relative', letterSpacing: '-0.02em' }}>
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, fontSize: { xs: '0.75rem', sm: '0.8rem' }, mt: 0.8, position: 'relative' }}>
          Student ID: {user?.studentId} • {user?.department}
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Current Semester"
            value={stats?.currentSemester || 0}
            description="Active semester"
            icon={BookIcon}
            variant="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Subjects"
            value={stats?.totalSubjects || 0}
            description="Enrolled this semester"
            icon={FileIcon}
            variant="accent"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="SGPA"
            value={stats?.sgpa ? stats.sgpa.toFixed(2) : '0.00'}
            description={`Semester ${stats?.currentSemester || 0} GPA`}
            icon={TrendingUpIcon}
            variant="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="CGPA"
            value={stats?.cgpa ? stats.cgpa.toFixed(2) : '0.00'}
            description="Cumulative GPA"
            icon={TrendingUpIcon}
            variant="success"
          />
        </Grid>

      </Grid>

      {/* Quick Actions & Recent Requests */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Quick Actions */}
        <Grid item xs={12} lg={6}>
          <Card className="animate-fade-in-up animate-stagger-2">
            <CardHeader title="Quick Actions" titleTypographyProps={{ variant: 'h6' }} />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { to: '/student/marks', icon: <FileIcon fontSize="small" />, label: 'View My Marks', color: '#0f766e' },
                { to: '/student/apply-review', icon: <ClipboardIcon fontSize="small" />, label: 'Apply for Review', color: '#0ea5e9' },
                { to: '/student/apply-revaluation', icon: <CheckCircleIcon fontSize="small" />, label: 'Apply for Revaluation', color: '#8b5cf6' },
              ].map((action) => (
                <Button
                  key={action.to}
                  component={Link}
                  to={action.to}
                  variant="outlined"
                  fullWidth
                  sx={{
                    justifyContent: 'space-between',
                    py: 1.3,
                    borderColor: 'rgba(204, 251, 241, 0.6)',
                    '&:hover': {
                      borderColor: action.color,
                      backgroundColor: `${action.color}08`,
                    },
                  }}
                  endIcon={<ArrowIcon />}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      backgroundColor: `${action.color}12`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: action.color,
                    }}>
                      {action.icon}
                    </Box>
                    {action.label}
                  </Box>
                </Button>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Requests */}
        <Grid item xs={12} lg={6}>
          <Card className="animate-fade-in-up animate-stagger-3">
            <CardHeader
              title="Recent Requests"
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <Button
                  component={Link}
                  to="/student/requests"
                  size="small"
                  endIcon={<ArrowIcon />}
                >
                  View all
                </Button>
              }
            />
            <CardContent>
              {recentRequests.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h3" sx={{ opacity: 0.1 }}>📋</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    No requests yet
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {recentRequests.map((request) => (
                    <Box
                      key={request.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        border: '1px solid',
                        borderColor: 'rgba(204, 251, 241, 0.5)',
                        borderRadius: 3,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'primary.light',
                          backgroundColor: 'rgba(240, 253, 250, 0.5)',
                        },
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {request.subject.code} - {request.subject.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                      <StatusBadge status={request.status} />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Request Summary */}
      <Card className="animate-fade-in-up animate-stagger-4">
        <CardHeader title="Request Summary" titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <Grid container spacing={2}>
            {[
              { label: 'Pending', value: stats?.pendingRequests || 0, icon: <ClockIcon sx={{ fontSize: 28 }} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' },
              { label: 'In Review', value: stats?.inReviewRequests || 0, icon: <FileIcon sx={{ fontSize: 28 }} />, color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.08)' },
              { label: 'Approved', value: stats?.approvedRequests || 0, icon: <CheckCircleIcon sx={{ fontSize: 28 }} />, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.08)' },
              { label: 'Rejected', value: stats?.rejectedRequests || 0, icon: <CancelIcon sx={{ fontSize: 28 }} />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)' },
            ].map((item) => (
              <Grid item xs={6} sm={3} key={item.label}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, sm: 1.5 },
                    p: { xs: 1.5, sm: 2 },
                    bgcolor: item.bg,
                    borderRadius: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px -4px ${item.color}30`,
                    },
                  }}
                >
                  <Box sx={{ color: item.color, display: 'flex' }}>
                    {item.icon === ClockIcon ? <ClockIcon sx={{ fontSize: { xs: 20, sm: 28 } }} /> :
                      item.icon === FileIcon ? <FileIcon sx={{ fontSize: { xs: 20, sm: 28 } }} /> :
                        item.icon === CheckCircleIcon ? <CheckCircleIcon sx={{ fontSize: { xs: 20, sm: 28 } }} /> :
                          <CancelIcon sx={{ fontSize: { xs: 20, sm: 28 } }} />}
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: '1rem', sm: '1.5rem' }, lineHeight: 1.2 }}>
                      {item.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                      {item.label}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
