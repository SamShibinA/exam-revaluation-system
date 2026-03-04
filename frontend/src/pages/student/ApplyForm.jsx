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
import { Info as InfoIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
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

        setMarks(Array.isArray(data) ? data : []);
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
    <Box sx={{ maxWidth: 700, mx: 'auto', width: '100%', px: { xs: 0, sm: 1 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>

      {/* Info Card */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={500}>
          Important Information
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2, mt: 1 }}>
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
      <Card>
        <CardHeader
          title="Request Details"
          subheader={`Fill in the details below to submit your ${type} request`}
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
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
                  bgcolor: 'grey.50',
                  p: 2,
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <Typography variant="body2" fontWeight={500} gutterBottom>
                  Current Marks
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Internal:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedSubject.internalMarks}/40
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      External:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedSubject.externalMarks}/60
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Total:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedSubject.totalMarks}/100
                    </Typography>
                  </Grid>
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
