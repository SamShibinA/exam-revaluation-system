import { useEffect, useState } from 'react';
import { marksService } from '../../services/marksService';
import { PageLoader } from '../../components/mui/PageLoader';
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
  const [marks, setMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const data = await marksService.getMarks();
        setMarks(data);
      } catch (error) {
        console.error('Failed to fetch marks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarks();
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  const totalCredits = marks.reduce((sum, m) => sum + m.subject.credits, 0);
  const weightedSum = marks.reduce(
    (sum, m) => sum + m.totalMarks * m.subject.credits,
    0
  );
  const sgpa =
    totalCredits > 0 ? (weightedSum / totalCredits / 10).toFixed(2) : '0.00';

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
          View Marks
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your academic performance for the current semester
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
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

        <Grid size={{ xs: 12, sm: 4 }}>
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

        <Grid size={{ xs: 12, sm: 4 }}>
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
                {marks.map((mark) => (
                  <TableRow key={mark.id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>
                        {mark.subject.code}
                      </Typography>
                    </TableCell>
                    <TableCell>{mark.subject.name}</TableCell>
                    <TableCell align="center">
                      {mark.subject.credits}
                    </TableCell>
                    <TableCell align="center">
                      {mark.internalMarks}
                    </TableCell>
                    <TableCell align="center">
                      {mark.externalMarks}
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight={500}>
                        {mark.totalMarks}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={mark.grade}
                        color={getGradeColor(mark.grade)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
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
