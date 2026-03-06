import { useEffect, useState } from 'react';
import { StatsCard } from '../../components/mui/StatsCard';
import { StatusBadge } from '../../components/mui/StatusBadge';
import { PageLoader } from '../../components/mui/PageLoader';
import { Link } from 'react-router-dom';
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
  People as UsersIcon,
  Assignment as ClipboardIcon,
  Schedule as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  FindInPage as FileSearchIcon,
  ArrowForward as ArrowIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        const [statsRes, requestsRes] = await Promise.all([
          fetch(`${API_URL}/admin/stats`, { headers }),
          fetch(`${API_URL}/requests?limit=5`, { headers }),
        ]);

        const statsData = statsRes.ok ? await statsRes.json() : null;
        const requestsData = requestsRes.ok ? await requestsRes.json() : null;

        if (statsData) setStats(statsData);
        if (requestsData) setRecentRequests(requestsData.data || []);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (isLoading) {
    return <PageLoader />;
  }

  const statusItems = [
    { label: 'Pending', value: stats?.pendingRequests || 0, icon: <ClockIcon />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' },
    { label: 'In Review', value: stats?.inReviewRequests || 0, icon: <FileSearchIcon />, color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.08)' },
    { label: 'Approved', value: stats?.approvedRequests || 0, icon: <CheckCircleIcon />, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.08)' },
    { label: 'Rejected', value: stats?.rejectedRequests || 0, icon: <CancelIcon />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)' },
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box
        className="animate-fade-in-up"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: { xs: 2, sm: 3 },
          p: { xs: 2.5, sm: 3.5 },
          background: 'linear-gradient(135deg, #0a5f58 0%, #0f766e 40%, #14b8a6 100%)',
          borderRadius: { xs: 3, sm: 4 },
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '50%',
          background: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <Box sx={{ position: 'relative' }}>
          <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: '1.2rem', sm: '1.6rem' }, letterSpacing: '-0.02em' }}>
            Admin Dashboard 🛡️
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Overview of exam revaluation system
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/admin/requests"
          variant="contained"
          endIcon={<ArrowIcon />}
          sx={{
            alignSelf: { xs: 'stretch', sm: 'center' },
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.25)',
            position: 'relative',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            },
          }}
        >
          View All Requests
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard title="Total Students" value={stats?.totalStudents || 0} description="Registered students" icon={UsersIcon} variant="primary" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard title="Total Requests" value={stats?.totalRequests || 0} description={`${stats?.completedToday || 0} completed today`} icon={ClipboardIcon} variant="accent" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard title="Pending Review" value={stats?.pendingRequests || 0} description="Awaiting action" icon={ClockIcon} variant="warning" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard title="Avg. Processing" value={stats?.avgProcessingTime || '-'} description="Time per request" icon={TrendingUpIcon} variant="success" />
        </Grid>
      </Grid>

      {/* Request Breakdown */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }} className="animate-fade-in-up animate-stagger-2">
            <CardHeader title="Request Status" titleTypographyProps={{ variant: 'h6' }} />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {statusItems.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    bgcolor: item.bg,
                    borderRadius: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateX(4px)',
                      boxShadow: `0 4px 12px -4px ${item.color}30`,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: item.color }}>{item.icon}</Box>
                    <Typography fontWeight={600}>{item.label}</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={800}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Requests */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }} className="animate-fade-in-up animate-stagger-3">
            <CardHeader
              title="Recent Requests"
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <Button component={Link} to="/admin/requests" size="small" endIcon={<ArrowIcon />}>
                  View all
                </Button>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {recentRequests.map((request) => (
                  <Box
                    key={request.id}
                    component={Link}
                    to={`/admin/requests?id=${request.id}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      border: '1px solid',
                      borderColor: 'rgba(204, 251, 241, 0.5)',
                      borderRadius: 3,
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.light',
                        backgroundColor: 'rgba(240, 253, 250, 0.5)',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography fontWeight={600}>{request.studentName}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                          {request.id}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
