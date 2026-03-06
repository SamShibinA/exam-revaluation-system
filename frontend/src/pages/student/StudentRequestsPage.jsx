import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/mui/PageLoader';
import { StatusBadge } from '../../components/mui/StatusBadge';
import { RequestTimeline } from '../../components/mui/RequestTimeline';

const API_URL = import.meta.env.VITE_BACKEND_URL;

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Assignment as ClipboardIcon,
  ExpandMore as ExpandIcon,
  OpenInNew as ExternalLinkIcon,
  Description as FileIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

export default function StudentRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${API_URL}/requests/my/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch requests');
        }

        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [user?.id]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box
        className="animate-fade-in-up"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: { xs: 2, sm: 3 },
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
            My Requests 📝
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track the status of your review and revaluation requests
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} to="/student/apply-review" variant="outlined">
            Apply for Review
          </Button>
          <Button
            component={Link}
            to="/student/apply-revaluation"
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0d5c56 0%, #0f766e 100%)',
              },
            }}
          >
            Apply for Revaluation
          </Button>
        </Box>
      </Box>

      {requests.length === 0 ? (
        <Card className="animate-fade-in-up animate-stagger-1">
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h2" sx={{ opacity: 0.1, mb: 1 }}>📋</Typography>
            <Typography variant="h6" sx={{ mt: 1 }} fontWeight={600}>
              No requests yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
              You haven't submitted any review or revaluation requests
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button component={Link} to="/student/apply-review" variant="outlined">
                Apply for Review
              </Button>
              <Button component={Link} to="/student/apply-revaluation" variant="contained">
                Apply for Revaluation
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {requests.map((request, idx) => (
            <Card
              key={request.id || request._id}
              className={`animate-fade-in-up animate-stagger-${Math.min(idx + 1, 6)}`}
              sx={{
                borderLeft: '4px solid',
                borderLeftColor: request.status === 'approved' ? 'success.main'
                  : request.status === 'rejected' ? 'error.main'
                    : request.status === 'pending' ? 'warning.main'
                      : 'primary.main',
              }}
            >
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="h6" fontWeight={700}>
                      {request.subject.code} - {request.subject.name}
                    </Typography>
                    <Chip
                      label={request.requestType}
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                    />
                  </Box>
                }
                subheader={`Request ID: ${request.id || request._id} • Submitted on ${format(
                  new Date(request.createdAt),
                  'MMM dd, yyyy'
                )}`}
                action={<StatusBadge status={request.status} />}
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <RequestTimeline currentStatus={request.status} />
                </Box>

                <Accordion
                  sx={{
                    boxShadow: 'none',
                    background: 'linear-gradient(135deg, rgba(240, 253, 250, 0.6) 0%, rgba(204, 251, 241, 0.2) 100%)',
                    borderRadius: '12px !important',
                    border: '1px solid rgba(204, 251, 241, 0.4)',
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandIcon />}>
                    <Typography variant="body2" fontWeight={600}>
                      View Details
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', gap: 4, mb: 2, flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Current Marks
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {request.currentMarks}/100
                        </Typography>
                      </Box>

                      {request.updatedMarks !== undefined && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Updated Marks
                          </Typography>
                          <Typography variant="h6" color="success.main" fontWeight={700}>
                            {request.updatedMarks}/100
                            {request.updatedMarks > request.currentMarks && (
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{ ml: 1, color: 'success.main', fontWeight: 600 }}
                              >
                                (+{request.updatedMarks - request.currentMarks})
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Your Reason
                      </Typography>
                      <Typography variant="body2">{request.reason}</Typography>
                    </Box>

                    {request.adminRemarks && (
                      <Box
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.8)',
                          p: 2,
                          borderRadius: 2.5,
                          mb: 2,
                          border: '1px solid rgba(204, 251, 241, 0.5)',
                        }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          Admin Remarks
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {request.adminRemarks}
                        </Typography>
                      </Box>
                    )}

                    {request.responseSheet && (
                      <Button
                        component={Link}
                        to="/student/view-document"
                        state={{
                          documentUrl: request.responseSheet,
                          subjectName: request.subject?.name,
                          requestId: request._id || request.id
                        }}
                        variant="outlined"
                        size="small"
                        startIcon={<FileIcon />}
                      >
                        View Response Sheet
                      </Button>
                    )}
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
