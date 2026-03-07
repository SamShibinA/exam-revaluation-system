import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/mui/PageLoader';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function getSubjectId(mark) {
  if (mark.subjectId && typeof mark.subjectId === 'object' && mark.subjectId._id) {
    return String(mark.subjectId._id);
  }
  return mark.subjectId ? String(mark.subjectId) : '';
}

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  RateReview as ReviewIcon,
  Grading as GradingIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const formSchema = z.object({
  subjectId: z.string().min(1, 'Please select a subject'),
  reason: z
    .string()
    .min(20, 'Reason must be at least 20 characters')
    .max(500, 'Reason must not exceed 500 characters'),
});

export default function ApplyForm({ type }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [marks, setMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectId: '',
      reason: '',
    },
  });

  const isReview = type === 'review';
  const title = isReview ? 'Apply for Review' : 'Apply for Revaluation';
  const description = isReview
    ? 'Request to view your answer sheet for a particular subject'
    : 'Request re-evaluation of your answer sheet by an expert';
  const HeaderIcon = isReview ? ReviewIcon : GradingIcon;

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchMarks = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${API_URL}/marks/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch marks');
        }

        let marksData = Array.isArray(data) ? data : [];
        if (marksData.length > 0) {
          // Find the maximum semester among the student's marks
          const maxSemester = Math.max(...marksData.map(m => m.subjectId?.semester || 0));
          // Filter marks to only include subjects from the maximum semester
          marksData = marksData.filter(m => (m.subjectId?.semester || 0) === maxSemester);
        }

        setMarks(marksData);
      } catch (error) {
        console.error('Failed to fetch marks:', error);
        setMarks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarks();
  }, [user?.id]);

  const onSubmit = async (values) => {
    if (!user?.id) {
      enqueueSnackbar('You must be logged in to submit a request', { variant: 'error' });
      return;
    }
    const selectedMark = marks.find((m) => getSubjectId(m) === values.subjectId);
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          studentId: user.id,
          subjectId: values.subjectId,
          requestType: type,
          reason: values.reason,
          currentMarks: selectedMark?.totalMarks ?? null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit request');
      }

      enqueueSnackbar(`Your ${type} request has been submitted successfully.`, {
        variant: 'success',
      });

      navigate('/student/requests');
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to submit request', {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedSubjectId = watch('subjectId');
  const selectedSubject = marks.find(
    (m) => getSubjectId(m) === watchedSubjectId
  );
  const reasonValue = watch('reason') || '';

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', width: '100%', px: { xs: 1, sm: 2 } }}>
      <Box
        sx={{
          mb: { xs: 2.5, sm: 3.5 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1.5, sm: 2 }
        }}
        className="animate-fade-in-up"
      >
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: 3,
          background: isReview
            ? 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)'
            : 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isReview
            ? '0 6px 16px -4px rgba(14, 165, 233, 0.3)'
            : '0 6px 16px -4px rgba(139, 92, 246, 0.3)',
        }}>
          <HeaderIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' }, letterSpacing: '-0.02em' }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>

      {/* Info Card */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }} className="animate-fade-in-up animate-stagger-1">
        <Typography variant="body2" fontWeight={600}>
          Important Information
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2, mt: 1, '& li': { mb: 0.5 } }}>
          {isReview ? (
            <>
              <li>Review fee: ₹500 per subject (non-refundable)</li>
              <li>Response sheet will be made available within 3-5 days</li>
              <li>You can view the sheet online for 48 hours</li>
            </>
          ) : (
            <>
              <li>Revaluation fee: ₹1000 per subject</li>
              <li>Processing time: 7-14 working days</li>
              <li>Marks may increase, decrease, or remain the same</li>
              <li>Fee refunded if marks increase by 10% or more</li>
            </>
          )}
        </Box>
      </Alert>

      {/* Form */}
      <Card className="animate-fade-in-up animate-stagger-2">
        <CardHeader
          title="Request Details"
          subheader={`Fill in the details below to submit your ${type} request`}
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="subjectId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Select Subject"
                  error={!!errors.subjectId}
                  helperText={
                    errors.subjectId?.message ||
                    'Select the subject for which you want to apply'
                  }
                  sx={{ mb: 3 }}
                >
                  {marks.map((mark) => {
                    const sid = getSubjectId(mark);
                    const subj = mark.subjectId && typeof mark.subjectId === 'object' ? mark.subjectId : {};
                    return (
                      <MenuItem key={mark._id || sid} value={sid || ''}>
                        {subj.code ?? '—'} - {subj.name ?? '—'}
                      </MenuItem>
                    );
                  })}
                </TextField>
              )}
            />

            {selectedSubject && (
              <Box
                sx={{
                  background: 'linear-gradient(135deg, rgba(240, 253, 250, 0.8) 0%, rgba(204, 251, 241, 0.3) 100%)',
                  p: 2.5,
                  borderRadius: 3,
                  mb: 3,
                  border: '1px solid rgba(204, 251, 241, 0.5)',
                }}
              >
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Current Marks
                </Typography>
                <Grid container spacing={1.5}>
                  {[
                    { label: 'Internal:', value: `${selectedSubject.internalMarks}/40` },
                    { label: 'External:', value: `${selectedSubject.externalMarks}/60` },
                    { label: 'Total:', value: `${selectedSubject.totalMarks}/100` },
                  ].map((item) => (
                    <Grid item xs={4} key={item.label}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block' }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {item.value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label={`Reason for ${type}`}
                  placeholder={`Explain why you're applying for ${type}...`}
                  error={!!errors.reason}
                  helperText={
                    errors.reason?.message ||
                    `${reasonValue.length}/500 characters`
                  }
                  sx={{ mb: 3 }}
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                sx={{ px: 3 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CheckIcon />
                  )
                }
                sx={{
                  px: 3,
                  background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0d5c56 0%, #0f766e 100%)',
                  },
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
