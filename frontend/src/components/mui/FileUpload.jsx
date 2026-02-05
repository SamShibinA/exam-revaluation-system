import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, IconButton, Paper, Alert } from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Description as FileIcon,
} from '@mui/icons-material';

export function FileUpload({
  onFileSelect,
  accept = { 'application/pdf': ['.pdf'] },
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError(
            `File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
          );
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('Invalid file type. Please upload a PDF file.');
        } else {
          setError('Error uploading file. Please try again.');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [maxSize, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled,
  });

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          border: '2px dashed',
          borderColor: isDragActive
            ? 'primary.main'
            : error
            ? 'error.main'
            : 'grey.300',
          bgcolor: isDragActive ? 'primary.50' : 'transparent',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: !disabled && 'primary.main',
            bgcolor: !disabled && 'grey.50',
          },
        }}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: isDragActive ? 'primary.100' : 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UploadIcon
              sx={{
                fontSize: 28,
                color: isDragActive ? 'primary.main' : 'grey.500',
              }}
            />
          </Box>

          <Box>
            <Typography variant="body2">
              {isDragActive ? (
                'Drop the file here'
              ) : (
                <>
                  <Typography
                    component="span"
                    color="primary"
                    fontWeight={500}
                  >
                    Click to upload
                  </Typography>{' '}
                  or drag and drop
                </>
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              PDF files up to {maxSize / (1024 * 1024)}MB
            </Typography>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {selectedFile && !error && (
        <Paper
          sx={{
            mt: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'grey.50',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: 'primary.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileIcon sx={{ color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </Typography>
            </Box>
          </Box>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Paper>
      )}
    </Box>
  );
}
