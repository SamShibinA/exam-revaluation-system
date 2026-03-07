import { useEffect, useState } from "react";
import { FileUpload } from "../../components/mui/FileUpload";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Paper,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Description as FileIcon,
  Delete as DeleteIcon,
  OpenInNew as ViewIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

export default function UploadDocumentPage() {
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("auth_token");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [requestId, setRequestId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [requests, setRequests] = useState([]);

  // Pagination State
  const [uploads, setUploads] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalUploads, setTotalUploads] = useState(0);
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);

  const fetchUploads = async (currentPage, currentLimit) => {
    setIsLoadingUploads(true);
    try {
      // API expects 1-indexed page, limit=0 for All
      const apiPage = currentPage + 1;
      const apiLimit = currentLimit === -1 ? 0 : currentLimit;

      const res = await fetch(`${BASE_URL}/uploads?page=${apiPage}&limit=${apiLimit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data && data.data) {
        setUploads(data.data);
        setTotalUploads(data.total || 0);
      } else {
        setUploads([]);
        setTotalUploads(0);
      }
    } catch (error) {
      console.error("Failed to fetch uploads:", error);
      setUploads([]);
    } finally {
      setIsLoadingUploads(false);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${BASE_URL}/requests?limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data && Array.isArray(data.data)) {
          // Show only review requests (not revaluation) for response sheet upload
          const reviewOnly = data.data.filter((r) => (r.requestType || "").toLowerCase() === "review");
          setRequests(reviewOnly);
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    fetchUploads(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestId || !selectedFile) {
      enqueueSnackbar("Please select a request and a file", { variant: "error" });
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("requestId", requestId);
      formData.append("documentType", "response_sheet"); // Default backend expected value
      formData.append("file", selectedFile);

      const res = await fetch(`${BASE_URL}/uploads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      enqueueSnackbar(`Document uploaded successfully API response`, { variant: "success" });
      setRequestId("");
      setSelectedFile(null);
      // Refresh list
      fetchUploads(page, rowsPerPage);
    } catch (error) {
      enqueueSnackbar(error.message || "Upload failed", { variant: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      const res = await fetch(`${BASE_URL}/uploads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete");
      }

      enqueueSnackbar("Document deleted successfully", { variant: "success" });
      fetchUploads(page, rowsPerPage);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", width: "100%", px: { xs: 0, sm: 1 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 }, display: 'flex', alignItems: 'center', gap: 2 }} className="animate-fade-in-up">
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px -4px rgba(15, 118, 110, 0.3)',
        }}>
          <UploadIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: "1.1rem", sm: "1.5rem" }, letterSpacing: '-0.02em' }}>
            Upload Documents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload response sheets for student review requests
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 4 }} className="animate-fade-in-up animate-stagger-1">
        <CardHeader
          title="Upload Response Sheet"
          subheader="Select a request and document file to upload"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Select Request"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem disabled value="">
                    <em>Select a request to upload document for</em>
                  </MenuItem>
                  {requests.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.studentName} - {r.subject?.name} ({r.id.substring(0, 8).toUpperCase()})
                    </MenuItem>
                  ))}
                  {requests.length === 0 && (
                    <MenuItem disabled value="">No requests available</MenuItem>
                  )}
                </TextField>
              </Grid>
            </Grid>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Upload File
              </Typography>
              <FileUpload onFileSelect={(file) => setSelectedFile(file)} accept={{ "application/pdf": [".pdf"] }} maxSize={10 * 1024 * 1024} />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isUploading}
              startIcon={isUploading ? <CircularProgress size={20} /> : <UploadIcon />}
              sx={{
                py: 1.3,
                background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #0d5c56 0%, #0f766e 100%)' },
              }}
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Uploaded Documents List */}
      <Card className="animate-fade-in-up animate-stagger-2">
        <CardHeader title="Uploaded Documents" titleTypographyProps={{ variant: "h6" }} />
        <CardContent>
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="uploaded documents table">
              <TableHead sx={{ bgcolor: "background.default" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>File Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Request ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingUploads ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : uploads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No documents uploaded yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  uploads.map((upload) => (
                    <TableRow
                      key={upload._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FileIcon color="primary" fontSize="small" />
                          <Typography variant="body2" sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {upload.filename}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          {upload.requestId}
                        </Typography>
                      </TableCell>
                      <TableCell>{new Date(upload.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => window.open(upload.fileUrl, "_blank")}
                            title="View Document"
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(upload._id)}
                            title="Delete Document"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, { label: 'All', value: -1 }]}
            component="div"
            count={totalUploads}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
