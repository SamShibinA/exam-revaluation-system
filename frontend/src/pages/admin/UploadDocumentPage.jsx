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
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Description as FileIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

export default function UploadDocumentPage() {
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("auth_token");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [requestId, setRequestId] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [recentUploads, setRecentUploads] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await fetch(`${BASE_URL}/uploads`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setRecentUploads(data);
        } else {
          setRecentUploads([]);
        }
      } catch (error) {
        console.error("Failed to fetch uploads:", error);
        setRecentUploads([]);
      }
    };

    const fetchRequests = async () => {
      try {
        const res = await fetch(`${BASE_URL}/requests?limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data && Array.isArray(data.data)) {
          setRequests(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };

    fetchUploads();
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestId || !documentType || !selectedFile) {
      enqueueSnackbar("Please fill in all fields and select a file", { variant: "error" });
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("requestId", requestId);
      formData.append("documentType", documentType);
      formData.append("file", selectedFile);

      const res = await fetch(`${BASE_URL}/uploads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      enqueueSnackbar(`Document uploaded successfully for request ${requestId}`, { variant: "success" });
      setRecentUploads((prev) => [data, ...prev]);
      setRequestId("");
      setDocumentType("");
      setSelectedFile(null);
    } catch (error) {
      enqueueSnackbar(error.message || "Upload failed", { variant: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", width: "100%", px: { xs: 0, sm: 1 } }}>
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
            Upload response sheets and other documents for student requests
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }} className="animate-fade-in-up animate-stagger-1">
        <CardHeader
          title="Upload Response Sheet"
          subheader="Upload the scanned response sheet for a revaluation request"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="Select Request" value={requestId} onChange={(e) => setRequestId(e.target.value)}>
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
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="Document Type" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                  <MenuItem value="response_sheet">Response Sheet</MenuItem>
                  <MenuItem value="marksheet">Marksheet</MenuItem>
                  <MenuItem value="other">Other Document</MenuItem>
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

      {/* Recent Uploads */}
      <Card className="animate-fade-in-up animate-stagger-2">
        <CardHeader title="Recent Uploads" titleTypographyProps={{ variant: "h6" }} />
        <CardContent>
          {recentUploads.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h3" sx={{ opacity: 0.1 }}>📁</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                No uploads yet
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {recentUploads.map((upload) => (
                <Box
                  key={upload._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    border: "1px solid",
                    borderColor: "rgba(204, 251, 241, 0.5)",
                    borderRadius: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.light',
                      backgroundColor: 'rgba(240, 253, 250, 0.5)',
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2.5,
                      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <CheckIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {upload.filename}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {upload.requestId} • {upload.documentType} •{" "}
                        {new Date(upload.createdAt).toDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Button size="small" onClick={() => window.open(upload.fileUrl, "_blank")}>
                    View
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
