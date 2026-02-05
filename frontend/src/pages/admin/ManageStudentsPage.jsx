import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Grid,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export default function ManageStudentsPage() {
  const students = [
    { id: 'STU2024001', name: 'John Doe', email: 'john@university.edu', department: 'Computer Science', semester: 3 },
    { id: 'STU2024002', name: 'Alice Smith', email: 'alice@university.edu', department: 'Computer Science', semester: 3 },
    { id: 'STU2024003', name: 'Bob Wilson', email: 'bob@university.edu', department: 'Information Technology', semester: 5 },
    { id: 'STU2024004', name: 'Carol Johnson', email: 'carol@university.edu', department: 'Computer Science', semester: 3 },
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
          Manage Students
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View and manage student records
        </Typography>
      </Box>

      {/* Search */}
      <TextField
        placeholder="Search students by name or ID..."
        size="small"
        fullWidth
        sx={{ mb: { xs: 2, sm: 3 }, maxWidth: { sm: 400 } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Students Grid */}
      <Grid container spacing={2}>
        {students.map((student) => (
          <Grid item xs={12} sm={6} lg={4} key={student.id}>
            <Card
              sx={{
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 4 },
              }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.100', color: 'primary.main' }}>
                    {student.name.charAt(0)}
                  </Avatar>
                }
                title={student.name}
                subheader={student.id}
                titleTypographyProps={{ fontWeight: 500 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                    {student.email}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body2">{student.department}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Semester
                  </Typography>
                  <Typography variant="body2">{student.semester}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
