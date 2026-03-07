import { useEffect, useState } from "react";
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
  Divider,
} from "@mui/material";
import { Search as SearchIcon, Email as EmailIcon, School as SchoolIcon, Business as DeptIcon } from "@mui/icons-material";

export default function ManageStudentsPage() {
  const token = localStorage.getItem("auth_token");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${BASE_URL}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setStudents([]);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      (student.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (student.studentId || "").toLowerCase().includes(search.toLowerCase())
  );

  const getAvatarGradient = (name) => {
    const gradients = [
      'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
      'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
      'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      'linear-gradient(135deg, #059669 0%, #34d399 100%)',
      'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
      'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
    ];
    const index = (name || '').charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden", px: { xs: 1, sm: 0 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }} className="animate-fade-in-up">
        <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: "1.1rem", sm: "1.5rem" }, letterSpacing: '-0.02em' }}>
          Manage Students 👨‍🎓
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View and manage student records
        </Typography>
      </Box>

      <TextField
        placeholder="Search students by name or ID..."
        size="small"
        fullWidth
        sx={{ mb: { xs: 2, sm: 3 }, maxWidth: { sm: 400 } }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={2.5}>
        {filteredStudents.map((student, idx) => (
          <Grid item xs={12} sm={6} lg={4} key={student._id}>
            <Card
              className={`animate-fade-in-up animate-stagger-${Math.min(idx + 1, 6)}`}
              sx={{
                cursor: 'default',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px -8px rgba(15, 118, 110, 0.15)',
                },
              }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{
                    background: getAvatarGradient(student.name),
                    fontWeight: 700,
                    width: 44,
                    height: 44,
                    boxShadow: '0 4px 12px -4px rgba(0,0,0,0.2)',
                  }}>
                    {student.name.charAt(0)}
                  </Avatar>
                }
                title={student.name}
                subheader={student.studentId}
                titleTypographyProps={{ fontWeight: 700 }}
                subheaderTypographyProps={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
              />
              <Divider sx={{ mx: 2 }} />
              <CardContent sx={{ pt: 2 }}>
                {[
                  { icon: <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />, label: 'Email', value: student.email },
                  { icon: <DeptIcon sx={{ fontSize: 16, color: 'text.secondary' }} />, label: 'Department', value: student.department },
                  { icon: <SchoolIcon sx={{ fontSize: 16, color: 'text.secondary' }} />, label: 'Semester', value: student.currentSemester },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: 'center',
                      mb: 1,
                      '&:last-child': { mb: 0 },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      {item.icon}
                      <Typography variant="body2" color="text.secondary">
                        {item.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 150, textAlign: 'right' }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
