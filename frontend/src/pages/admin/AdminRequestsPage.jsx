import { useEffect, useState } from 'react';
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
  Tooltip,
} from '@mui/material';
import {
  Visibility as EyeIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function AdminRequestsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const [newStatus, setNewStatus] = useState('pending');
  const [updatedMarks, setUpdatedMarks] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');

  const token = localStorage.getItem("auth_token");

  const fetchRequests = async (page = 1, status, search) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (status && status !== "all") params.append("status", status);
      if (search) params.append("search", search);

      const res = await fetch(`${API_URL}/requests?${params.toString()}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          enqueueSnackbar("Session expired. Please login again.", { variant: "error" });
          return;
        }
        throw new Error(data.message || "Failed to fetch requests");
      }

      setRequests(Array.isArray(data.data) ? data.data : []);
      setPagination({ page: data.page || 1, totalPages: data.totalPages || 1 });
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      enqueueSnackbar("Failed to load requests", { variant: "error" });
      setRequests([]);
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
      const res = await fetch(`${API_URL}/requests/${selectedRequest.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          updatedMarks: updatedMarks !== '' ? parseInt(updatedMarks) : undefined,
          adminRemarks: adminRemarks || undefined,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed");

      enqueueSnackbar(`Request ${selectedRequest.id} updated successfully.`, { variant: "success" });
      setIsDialogOpen(false);
      fetchRequests(pagination.page, filterStatus);
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to update request", { variant: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = [
    {
      key: "id",
      header: "Request ID",
      render: (request) => (
        <Typography variant="body2" fontFamily="monospace" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
          {request.id}
        </Typography>
      ),
    },
    {
      key: "studentName",
      header: "Student",
      render: (request) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>{request.studentName}</Typography>
          <Typography variant="caption" color="text.secondary">{request.studentEmail}</Typography>
        </Box>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (request) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>{request.subject.code}</Typography>
          <Typography variant="caption" color="text.secondary">{request.subject.name}</Typography>
        </Box>
      ),
    },
    {
      key: "requestType",
      header: "Type",
      render: (request) => (
        <Chip label={request.requestType} size="small" variant="outlined" sx={{ textTransform: "capitalize", fontWeight: 600 }} />
      ),
    },
    {
      key: "currentMarks",
      header: "Marks",
      render: (request) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>{request.currentMarks}</Typography>
          {request.updatedMarks !== undefined && (
            <Typography variant="body2" color="success.main" fontWeight={600}>→ {request.updatedMarks}</Typography>
          )}
        </Box>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (request) => <StatusBadge status={request.status} />,
    },
    {
      key: "createdAt",
      header: "Date",
      render: (request) => (
        <Typography variant="body2" color="text.secondary">{format(new Date(request.createdAt), "MMM dd, yyyy")}</Typography>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (request) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => handleViewRequest(request)}>
              <EyeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {request.status === "pending" && (
            <>
              <Tooltip title="Approve">
                <IconButton
                  size="small"
                  sx={{ color: 'success.main', '&:hover': { bgcolor: 'rgba(34, 197, 94, 0.08)' } }}
                  onClick={() => {
                    setSelectedRequest(request);
                    setNewStatus("approved");
                    setIsDialogOpen(true);
                  }}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  size="small"
                  sx={{ color: 'error.main', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' } }}
                  onClick={() => {
                    setSelectedRequest(request);
                    setNewStatus("rejected");
                    setIsDialogOpen(true);
                  }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }} className="animate-fade-in-up">
        <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: "1.1rem", sm: "1.5rem" }, letterSpacing: '-0.02em' }}>
          All Requests 📋
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
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
          borderBottom: '1px solid rgba(204, 251, 241, 0.5)',
          fontWeight: 700,
        }}>
          Request Details
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ pt: 2 }}>
              <TextField
                select
                fullWidth
                label="Update Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                sx={{ mb: 2.5 }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_review">In Review</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>

              {(newStatus === "approved" || newStatus === "completed") && (
                <TextField
                  fullWidth
                  type="number"
                  label="Updated Marks (optional)"
                  value={updatedMarks}
                  onChange={(e) => setUpdatedMarks(e.target.value)}
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ mb: 2.5 }}
                />
              )}

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Admin Remarks"
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setIsDialogOpen(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateRequest}
            variant="contained"
            disabled={isProcessing}
            startIcon={isProcessing && <CircularProgress size={16} />}
            sx={{
              background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #0d5c56 0%, #0f766e 100%)' },
            }}
          >
            {isProcessing ? "Updating..." : "Update Request"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
