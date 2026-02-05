import { useEffect, useState } from 'react';
import { requestService } from '../../services/requestService';
import { DataTable } from '../../components/mui/DataTable';
import { StatusBadge } from '../../components/mui/StatusBadge';
import {
  Box,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Visibility as EyeIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

export default function AdminRequestsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  // Form state for updating request
  const [newStatus, setNewStatus] = useState('pending');
  const [updatedMarks, setUpdatedMarks] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');

  const fetchRequests = async (page = 1, status, search) => {
    setIsLoading(true);
    try {
      const data = await requestService.getAllRequests({
        page,
        limit: 10,
        status: status !== 'all' ? status : undefined,
        search,
      });
      setRequests(data.data);
      setPagination({ page: data.page, totalPages: data.totalPages });
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(1, filterStatus);
  }, [filterStatus]);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setUpdatedMarks(request.updatedMarks?.toString() || '');
    setAdminRemarks(request.adminRemarks || '');
    setIsDialogOpen(true);
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);
    try {
      await requestService.updateRequestStatus(selectedRequest.id, {
        status: newStatus,
        updatedMarks: updatedMarks ? parseInt(updatedMarks) : undefined,
        adminRemarks: adminRemarks || undefined,
      });

      enqueueSnackbar(
        `Request ${selectedRequest.id} has been updated successfully.`,
        { variant: 'success' }
      );

      setIsDialogOpen(false);
      fetchRequests(pagination.page, filterStatus);
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to update request', {
        variant: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'Request ID',
      render: (request) => (
        <Typography variant="body2" fontFamily="monospace">
          {request.id}
        </Typography>
      ),
    },
    {
      key: 'studentName',
      header: 'Student',
      render: (request) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {request.studentName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {request.studentEmail}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (request) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {request.subject.code}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {request.subject.name}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'requestType',
      header: 'Type',
      render: (request) => (
        <Chip
          label={request.requestType}
          size="small"
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      key: 'currentMarks',
      header: 'Marks',
      render: (request) => (
        <Box>
          <Typography variant="body2">{request.currentMarks}</Typography>
          {request.updatedMarks !== undefined && (
            <Typography variant="body2" color="success.main">
              → {request.updatedMarks}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (request) => <StatusBadge status={request.status} />,
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (request) => (
        <Typography variant="body2" color="text.secondary">
          {format(new Date(request.createdAt), 'MMM dd, yyyy')}
        </Typography>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (request) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={() => handleViewRequest(request)}>
            <EyeIcon fontSize="small" />
          </IconButton>
          {request.status === 'pending' && (
            <>
              <IconButton
                size="small"
                color="success"
                onClick={() => {
                  setSelectedRequest(request);
                  setNewStatus('approved');
                  setIsDialogOpen(true);
                }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  setSelectedRequest(request);
                  setNewStatus('rejected');
                  setIsDialogOpen(true);
                }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
          All Requests
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and process student revaluation requests
        </Typography>
      </Box>

      <DataTable
        data={requests}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search by student name or ID..."
        onSearch={(query) => fetchRequests(1, filterStatus, query)}
        pagination={{
          page: pagination.page,
          totalPages: pagination.totalPages,
          onPageChange: (page) => fetchRequests(page, filterStatus),
        }}
        filters={
          <TextField
            select
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_review">In Review</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </TextField>
        }
      />

      {/* Request Detail Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ pt: 1 }}>
              <Box
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Student
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedRequest.studentName}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Subject
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedRequest.subject.code} -{' '}
                      {selectedRequest.subject.name}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Type
                    </Typography>
                    <Chip
                      label={selectedRequest.requestType}
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Current Marks
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedRequest.currentMarks}/100
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Reason
                  </Typography>
                  <Typography variant="body2">
                    {selectedRequest.reason}
                  </Typography>
                </Box>
              </Box>

              <TextField
                select
                fullWidth
                label="Update Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                sx={{ mb: 2 }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_review">In Review</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>

              {(newStatus === 'approved' || newStatus === 'completed') && (
                <TextField
                  fullWidth
                  type="number"
                  label="Updated Marks (optional)"
                  placeholder="Enter new marks"
                  value={updatedMarks}
                  onChange={(e) => setUpdatedMarks(e.target.value)}
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ mb: 2 }}
                />
              )}

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Admin Remarks"
                placeholder="Add remarks for the student..."
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setIsDialogOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateRequest}
            variant="contained"
            disabled={isProcessing}
            startIcon={isProcessing && <CircularProgress size={16} />}
          >
            {isProcessing ? 'Updating...' : 'Update Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
