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
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Welcome Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
          borderRadius: { xs: 2, sm: 3 },
          p: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 },
          color: 'white',
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
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
            title="CGPA"
            value={stats?.cgpa ? stats.cgpa.toFixed(2) : '0.00'}
            description="Cumulative GPA"
            icon={TrendingUpIcon}
            variant="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Pending Requests"
            value={stats?.pendingRequests || 0}
            description={`${stats?.totalRequests || 0} total requests`}
            icon={ClockIcon}
            variant="warning"
          />
        </Grid>
      </Grid>

      {/* Quick Actions & Recent Requests */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Quick Actions */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader title="Quick Actions" titleTypographyProps={{ variant: 'h6' }} />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                component={Link}
                to="/student/marks"
                variant="outlined"
                fullWidth
                sx={{ justifyContent: 'space-between' }}
                endIcon={<ArrowIcon />}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileIcon fontSize="small" />
                  View My Marks
                </Box>
              </Button>

              <Button
                component={Link}
                to="/student/apply-review"
                variant="outlined"
                fullWidth
                sx={{ justifyContent: 'space-between' }}
                endIcon={<ArrowIcon />}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ClipboardIcon fontSize="small" />
                  Apply for Review
                </Box>
              </Button>

              <Button
                component={Link}
                to="/student/apply-revaluation"
                variant="outlined"
                fullWidth
                sx={{ justifyContent: 'space-between' }}
                endIcon={<ArrowIcon />}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon fontSize="small" />
                  Apply for Revaluation
                </Box>
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Requests */}
        <Grid item xs={12} lg={6}>
          <Card>
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
                  <ClipboardIcon sx={{ fontSize: 48, color: 'grey.300' }} />
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
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
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
      <Card>
        <CardHeader title="Request Summary" titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                  bgcolor: 'warning.50',
                  borderRadius: 2,
                }}
              >
                <ClockIcon sx={{ fontSize: 32, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {stats?.pendingRequests || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                  bgcolor: 'info.50',
                  borderRadius: 2,
                }}
              >
                <FileIcon sx={{ fontSize: 32, color: 'info.main' }} />
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {stats?.inReviewRequests || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    In Review
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                  bgcolor: 'success.50',
                  borderRadius: 2,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 32, color: 'success.main' }} />
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {stats?.approvedRequests || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Approved
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                  bgcolor: 'error.50',
                  borderRadius: 2,
                }}
              >
                <CancelIcon sx={{ fontSize: 32, color: 'error.main' }} />
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {stats?.rejectedRequests || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rejected
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
