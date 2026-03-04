import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/mui/PageLoader';

const API_URL = import.meta.env.VITE_BACKEND_URL;

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Alert,
} from '@mui/material';

const getGradeColor = (grade) => {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'success';
    case 'B+':
    case 'B':
      return 'info';
    case 'C':
      return 'warning';
    case 'D':
      return 'warning';
    default:
      return 'error';
  }
};

export default function ViewMarksPage() {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchMarks = async () => {
      try {
        setError(null);
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
      } catch (err) {
        console.error('Failed to fetch marks:', err);
        setError(err.message || 'Failed to fetch marks');
        setMarks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarks();
  }, [user?.id]);

  if (!user) {
    return null; // or redirect; AuthProvider handles loading
  }

  if (isLoading) {
    return <PageLoader />;
  }

  const subjectRef = (m) => m.subjectId && typeof m.subjectId === 'object' ? m.subjectId : {};
  const totalCredits = marks.reduce((sum, m) => sum + (subjectRef(m).credits || 0), 0);
  const weightedSum = marks.reduce(
    (sum, m) => sum + (m.totalMarks || 0) * (subjectRef(m).credits || 0),
    0
  );
  const sgpa =
    totalCredits > 0 ? (weightedSum / totalCredits / 10).toFixed(2) : '0.00';

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
        >
          View Marks
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your academic performance for the current semester
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Total Subjects
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {marks.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Total Credits
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {totalCredits}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                SGPA
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary">
                {sgpa}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Marks Table */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Semester 3 - 2024-25"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: { xs: 400, sm: 'auto' } }}>
              <TableHead>
                <TableRow>
                  <TableCell>Subject Code</TableCell>
                  <TableCell>Subject Name</TableCell>
                  <TableCell align="center">Credits</TableCell>
                  <TableCell align="center">Internal (40)</TableCell>
                  <TableCell align="center">External (60)</TableCell>
                  <TableCell align="center">Total (100)</TableCell>
                  <TableCell align="center">Grade</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {marks.map((mark) => {
                  const subj = subjectRef(mark);
                  return (
                    <TableRow key={mark._id || mark.id} hover>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {subj.code ?? '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>{subj.name ?? '—'}</TableCell>
                      <TableCell align="center">
                        {subj.credits ?? '—'}
                      </TableCell>
                      <TableCell align="center">
                        {mark.internalMarks ?? '—'}
                      </TableCell>
                      <TableCell align="center">
                        {mark.externalMarks ?? '—'}
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontWeight={500}>
                          {mark.totalMarks ?? '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={mark.grade ?? '—'}
                          color={getGradeColor(mark.grade)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Grade Scale Reference */}
      <Card>
        <CardHeader
          title="Grade Scale Reference"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {[
              { grade: 'A+', range: '90-100' },
              { grade: 'A', range: '80-89' },
              { grade: 'B+', range: '70-79' },
              { grade: 'B', range: '60-69' },
              { grade: 'C', range: '50-59' },
              { grade: 'D', range: '40-49' },
              { grade: 'F', range: 'Below 40' },
            ].map((item) => (
              <Box
                key={item.grade}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Chip
                  label={item.grade}
                  color={getGradeColor(item.grade)}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {item.range}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
