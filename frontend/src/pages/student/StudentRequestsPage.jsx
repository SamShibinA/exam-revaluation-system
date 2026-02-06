import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${API_URL}/requests/me`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch requests');
        }

        setRequests(data);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box
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
          <Typography variant="h5" fontWeight={700}>
            My Requests
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track the status of your review and revaluation requests
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} to="/student/apply-review" variant="outlined">
            Apply for Review
          </Button>
          <Button component={Link} to="/student/apply-revaluation" variant="contained">
            Apply for Revaluation
          </Button>
        </Box>
      </Box>

      {requests.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <ClipboardIcon sx={{ fontSize: 64, color: 'grey.300' }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              No requests yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              You haven't submitted any review or revaluation requests
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'center' }}>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {requests.map((request) => (
            <Card key={request.id || request._id}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">
                      {request.subject.code} - {request.subject.name}
                    </Typography>
                    <Chip
                      label={request.requestType}
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
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
                    bgcolor: 'grey.50',
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandIcon />}>
                    <Typography variant="body2" fontWeight={500}>
                      View Details
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', gap: 4, mb: 2, flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Current Marks
                        </Typography>
                        <Typography variant="h6">
                          {request.currentMarks}/100
                        </Typography>
                      </Box>

                      {request.updatedMarks !== undefined && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Updated Marks
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            {request.updatedMarks}/100
                            {request.updatedMarks > request.currentMarks && (
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{ ml: 1 }}
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
                          bgcolor: 'background.paper',
                          p: 2,
                          borderRadius: 1,
                          mb: 2,
                        }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          Admin Remarks
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {request.adminRemarks}
                        </Typography>
                      </Box>
                    )}

                    {request.responseSheet && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FileIcon />}
                        endIcon={<ExternalLinkIcon />}
                        href={request.responseSheet}
                        target="_blank"
                        rel="noopener noreferrer"
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
