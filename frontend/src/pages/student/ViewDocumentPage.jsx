import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Button,
    IconButton,
    CircularProgress
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    OpenInNew as ExternalLinkIcon,
    Description as FileIcon,
} from '@mui/icons-material';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function ViewDocumentPage() {
    const location = useLocation();
    const { user } = useAuth();
    const [documentData, setDocumentData] = useState(location.state?.documentUrl ? location.state : null);
    const [fetchError, setFetchError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (documentData) {
            setIsLoading(false);
            return;
        }
        if (!user?.id) {
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        const fetchLatestDocument = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setFetchError(true);
                    return;
                }

                const res = await fetch(`${API_URL}/requests/my/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = await res.json();
                if (cancelled) return;
                if (!res.ok) {
                    setFetchError(true);
                    return;
                }

                const requests = Array.isArray(data) ? data : [];
                const requestWithDoc = requests.find(r => r.responseSheet);

                if (requestWithDoc) {
                    const docUrl = requestWithDoc.responseSheet.startsWith('http')
                        ? requestWithDoc.responseSheet
                        : `${API_URL.replace(/\/api\/?$/, '')}${requestWithDoc.responseSheet.startsWith('/') ? '' : '/'}${requestWithDoc.responseSheet}`;

                    setDocumentData({
                        documentUrl: docUrl,
                        subjectName: requestWithDoc.subject?.name || requestWithDoc.subject?.code || 'Subject',
                        requestId: requestWithDoc.id || requestWithDoc._id
                    });
                } else {
                    setFetchError(true);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Error fetching document:", error);
                    setFetchError(true);
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchLatestDocument();
        return () => { cancelled = true; };
    }, [user?.id, documentData]);

    if (fetchError) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', mt: 10 }}>
                <Typography variant="h1" sx={{ opacity: 0.1, mb: 2 }}>📄</Typography>
                <Typography variant="h5" color="text.secondary" gutterBottom fontWeight={600}>
                    No documents uploaded yet
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={4}>
                    Your requests are currently being processed. Check back later to view your response sheets.
                </Typography>
                <Button component={Link} to="/student/requests" variant="contained">
                    Back to My Requests
                </Button>
            </Box>
        );
    }

    if (isLoading || !documentData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const { documentUrl, subjectName, requestId } = documentData;

    return (
        <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }} className="animate-fade-in-up">
                <IconButton
                    component={Link}
                    to="/student/requests"
                    sx={{ mr: 2, bgcolor: 'background.paper', boxShadow: 1 }}
                >
                    <BackIcon />
                </IconButton>
                <Box flex={1}>
                    <Typography variant="h5" fontWeight={800}>
                        Document Viewer
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {subjectName ? `Viewing response sheet for ${subjectName}` : 'Viewing response sheet'}
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<ExternalLinkIcon />}
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open in New Tab
                </Button>
            </Box>

            <Card className="animate-fade-in-up animate-stagger-1" sx={{ height: 'calc(100vh - 200px)', minHeight: 600 }}>
                <CardHeader
                    title="Response Sheet"
                    subheader={requestId ? `Request ID: ${requestId}` : ''}
                    avatar={
                        <Box sx={{
                            p: 1,
                            borderRadius: 2,
                            bgcolor: 'primary.light',
                            color: 'primary.dark'
                        }}>
                            <FileIcon />
                        </Box>
                    }
                />
                <CardContent sx={{ height: 'calc(100% - 80px)', p: 0, position: 'relative' }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        p: 6,
                        textAlign: 'center',
                        bgcolor: 'rgba(240, 253, 250, 0.3)'
                    }}>
                        <Box sx={{
                            p: 3,
                            borderRadius: '50%',
                            bgcolor: 'rgba(20, 184, 166, 0.1)',
                            color: '#0f766e',
                            mb: 3
                        }}>
                            <FileIcon sx={{ fontSize: 64 }} />
                        </Box>

                        <Typography variant="h5" gutterBottom fontWeight={700}>
                            Response Sheet Ready
                        </Typography>

                        <Typography variant="body1" color="text.secondary" mb={4} maxWidth={500}>
                            The administrator has uploaded the response sheet for this request.
                            You can download the file to your device to view it.
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                size="large"
                                href={documentUrl}
                                download={`ResponseSheet-${requestId || 'Request'}.pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<ExternalLinkIcon />}
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                                    '&:hover': { background: 'linear-gradient(135deg, #0d5c56 0%, #0f766e 100%)' },
                                }}
                            >
                                Download Document
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}