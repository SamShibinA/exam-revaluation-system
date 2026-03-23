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
  TextField,
  MenuItem,
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
  const [selectedSemester, setSelectedSemester] = useState('All');
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
    return null;
  }

  if (isLoading) {
    return <PageLoader />;
  }

  const subjectRef = (m) => m.subjectId && typeof m.subjectId === 'object' ? m.subjectId : {};
  
  const semesters = ['All', ...new Set(marks.map(m => subjectRef(m).semester).filter(Boolean))].sort();

  const displayedMarks = selectedSemester === 'All' 
    ? marks 
    : marks.filter(m => subjectRef(m).semester === selectedSemester);

  const totalCredits = displayedMarks.reduce((sum, m) => sum + (subjectRef(m).credits || 0), 0);
  const weightedSum = displayedMarks.reduce(
    (sum, m) => sum + (m.totalMarks || 0) * (subjectRef(m).credits || 0),
    0
  );
  const gpa =
    totalCredits > 0 ? (weightedSum / totalCredits / 10).toFixed(2) : '0.00';

  const summaryCards = [
    { label: 'Total Subjects', value: displayedMarks.length, gradient: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)', color: '#0f766e' },
    { label: 'Total Credits', value: totalCredits, gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#2563eb' },
    { label: selectedSemester === 'All' ? 'CGPA' : 'SGPA', value: gpa, gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', color: '#16a34a' },
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', px: { xs: 1, sm: 0 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }} className="animate-fade-in-up">
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' }, letterSpacing: '-0.02em' }}
          >
            View Marks 📊
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your academic performance grouped by semester
          </Typography>
        </Box>
        <Box>
          <TextField
            select
            size="small"
            label="Filter Semester"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            {semesters.map((sem) => (
               <MenuItem key={sem} value={sem}>
                 {sem === 'All' ? 'All Semesters' : `Semester ${sem}`}
               </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {summaryCards.map((card, i) => (
          <Grid item xs={12} sm={4} key={card.label}>
            <Card
              className={`animate-fade-in-up animate-stagger-${i + 1}`}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: card.gradient,
                border: 'none',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 }, px: 1, width: '100%' }}>
                <Typography variant="body2" sx={{ color: card.color, fontWeight: 600, opacity: 0.8, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                  {card.label}
                </Typography>
                <Typography variant="h3" fontWeight={800} sx={{ color: card.color, letterSpacing: '-0.02em', fontSize: { xs: '1.75rem', sm: '3rem' } }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Marks Table */}
      <Card sx={{ mb: 3 }} className="animate-fade-in-up animate-stagger-4">
        <CardHeader
          title={selectedSemester === 'All' ? "All Semesters" : `Semester ${selectedSemester}`}
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              overflowX: 'auto',
              borderRadius: 3,
              border: '1px solid rgba(204, 251, 241, 0.5)',
            }}
          >
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
                {displayedMarks.map((mark, idx) => {
                  const subj = subjectRef(mark);
                  return (
                    <TableRow
                      key={mark._id || mark.id}
                      hover
                      sx={{
                        backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(240, 253, 250, 0.3)',
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight={600} sx={{ fontSize: '0.85rem' }}>
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
                        <Typography fontWeight={700}>
                          {mark.totalMarks ?? '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={mark.grade ?? '—'}
                          color={getGradeColor(mark.grade)}
                          size="small"
                          sx={{ fontWeight: 700, minWidth: 40 }}
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
      <Card className="animate-fade-in-up animate-stagger-5">
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
                  borderColor: 'rgba(204, 251, 241, 0.5)',
                  borderRadius: 2.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.light',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <Chip
                  label={item.grade}
                  color={getGradeColor(item.grade)}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
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
