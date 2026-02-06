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

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of exam revaluation system
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/admin/requests"
          variant="contained"
          endIcon={<ArrowIcon />}
          fullWidth={false}
          sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
        >
          View All Requests
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            description="Registered students"
            icon={UsersIcon}
            variant="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Requests"
            value={stats?.totalRequests || 0}
            description={`${stats?.completedToday || 0} completed today`}
            icon={ClipboardIcon}
            variant="accent"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Pending Review"
            value={stats?.pendingRequests || 0}
            description="Awaiting action"
            icon={ClockIcon}
            variant="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Avg. Processing"
            value={stats?.avgProcessingTime || '-'}
            description="Time per request"
            icon={TrendingUpIcon}
            variant="success"
          />
        </Grid>
      </Grid>

      {/* Request Breakdown */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Request Status" titleTypographyProps={{ variant: 'h6' }} />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: 'warning.50',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ClockIcon sx={{ color: 'warning.main' }} />
                  <Typography fontWeight={500}>Pending</Typography>
                </Box>
                <Typography variant="h5" fontWeight={700}>
                  {stats?.pendingRequests || 0}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: 'info.50',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FileSearchIcon sx={{ color: 'info.main' }} />
                  <Typography fontWeight={500}>In Review</Typography>
                </Box>
                <Typography variant="h5" fontWeight={700}>
                  {stats?.inReviewRequests || 0}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: 'success.50',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                  <Typography fontWeight={500}>Approved</Typography>
                </Box>
                <Typography variant="h5" fontWeight={700}>
                  {stats?.approvedRequests || 0}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: 'error.50',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CancelIcon sx={{ color: 'error.main' }} />
                  <Typography fontWeight={500}>Rejected</Typography>
                </Box>
                <Typography variant="h5" fontWeight={700}>
                  {stats?.rejectedRequests || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Requests */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
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
                      borderColor: 'divider',
                      borderRadius: 2,
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        bgcolor: 'grey.50',
                      },
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography fontWeight={500}>{request.studentName}</Typography>
                        <Typography variant="caption" color="text.secondary">
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
