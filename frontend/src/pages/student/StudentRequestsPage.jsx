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
        console.log('Fetched requests raw data:', data);

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
    <Box sx={{ width: '100%', overflow: 'hidden', px: { xs: 1, sm: 0 } }}>
      <Box
        className="animate-fade-in-up"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: { xs: 2.5, sm: 3.5 },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, letterSpacing: '-0.02em' }}
          >
            My Requests 📝
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Track the status of your review and revaluation requests
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
          <Button
            component={Link}
            to="/student/apply-review"
            variant="outlined"
            fullWidth={false}
            sx={{ flex: { xs: 1, sm: 'none' }, py: { xs: 1, sm: 1.2 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Apply for Review
          </Button>
          <Button
            component={Link}
            to="/student/apply-revaluation"
            variant="contained"
            fullWidth={false}
            sx={{
              flex: { xs: 1, sm: 'none' },
              py: { xs: 1, sm: 1.2 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
                sx={{
                  p: { xs: 2, sm: 3 },
                  pb: 1,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  '& .MuiCardHeader-content': { width: '100%' },
                  '& .MuiCardHeader-action': {
                    alignSelf: { xs: 'flex-start', sm: 'center' },
                    m: 0,
                    mt: { xs: 1.5, sm: 0 },
                    ml: { xs: 0, sm: 'auto' }
                  }
                }}
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                      {request.subject?.code || 'Unknown Code'} - {request.subject?.name || 'Unknown Subject'}
                    </Typography>
                    <Chip
                      label={request.requestType}
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '0.7rem' }}
                    />
                  </Box>
                }
                subheader={
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    Request ID: {request.id || request._id} • Submitted on {format(
                      new Date(request.createdAt),
                      'MMM dd, yyyy'
                    )}
                  </Typography>
                }
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
                  <AccordionDetails sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box sx={{ display: 'flex', gap: { xs: 2, sm: 4 }, mb: 2.5, flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          Current Marks
                        </Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          {request.currentMarks ?? 'N/A'}/100
                        </Typography>
                      </Box>

                      {request.updatedMarks !== undefined && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            Updated Marks
                          </Typography>
                          <Typography variant="h6" color="success.main" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                            {request.updatedMarks}/100
                            {request.updatedMarks > request.currentMarks && (
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{ ml: 1, color: 'success.main', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                              >
                                (+{request.updatedMarks - request.currentMarks})
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      )}

                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          Payment Info
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color="success.main" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          ₹{request.amountPaid || '0'} • {request.paymentStatus === 'success' ? 'Paid' : 'Pending'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        Your Reason
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>{request.reason}</Typography>
                    </Box>

                    {request.adminRemarks && (
                      <Box
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.8)',
                          p: 2,
                          borderRadius: 2.5,
                          mb: 2.5,
                          border: '1px solid rgba(204, 251, 241, 0.5)',
                        }}
                      >
                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.85rem' }}>
                          Admin Remarks
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
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
                        size="medium"
                        fullWidth={true}
                        startIcon={<FileIcon />}
                        sx={{ borderRadius: 2, textTransform: 'none', py: 1 }}
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
