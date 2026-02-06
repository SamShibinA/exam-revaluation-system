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

  // Fetch recent uploads
  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await fetch(`${BASE_URL}/uploads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setRecentUploads(data);
        } else {
          console.error("Expected array for uploads but got:", data);
          setRecentUploads([]);
        }
      } catch (error) {
        console.error("Failed to fetch uploads:", error);
        setRecentUploads([]);
      }
    };

    fetchUploads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!requestId || !documentType || !selectedFile) {
      enqueueSnackbar("Please fill in all fields and select a file", {
        variant: "error",
      });
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      enqueueSnackbar(
        `Document uploaded successfully for request ${requestId}`,
        { variant: "success" }
      );

      // Refresh recent uploads
      setRecentUploads((prev) => [data, ...prev]);

      // Reset form
      setRequestId("");
      setDocumentType("");
      setSelectedFile(null);
    } catch (error) {
      enqueueSnackbar(error.message || "Upload failed", {
        variant: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", width: "100%", px: { xs: 0, sm: 1 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ fontSize: { xs: "1.1rem", sm: "1.5rem" } }}
        >
          Upload Documents
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload response sheets and other documents for student requests
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Upload Response Sheet"
          subheader="Upload the scanned response sheet for a revaluation request"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Request ID"
                  placeholder="e.g., REQ001"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Document Type"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  <MenuItem value="response_sheet">
                    Response Sheet
                  </MenuItem>
                  <MenuItem value="marksheet">Marksheet</MenuItem>
                  <MenuItem value="other">Other Document</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={500} gutterBottom>
                Upload File
              </Typography>
              <FileUpload
                onFileSelect={(file) => setSelectedFile(file)}
                accept={{ "application/pdf": [".pdf"] }}
                maxSize={10 * 1024 * 1024}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isUploading}
              startIcon={
                isUploading ? (
                  <CircularProgress size={20} />
                ) : (
                  <UploadIcon />
                )
              }
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Uploads */}
      <Card>
        <CardHeader title="Recent Uploads" titleTypographyProps={{ variant: "h6" }} />
        <CardContent>
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
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CheckIcon color="success" />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {upload.filename}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {upload.requestId} • {upload.documentType} •{" "}
                      {new Date(upload.createdAt).toDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  size="small"
                  onClick={() => window.open(upload.fileUrl, "_blank")}
                >
                  View
                </Button>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
