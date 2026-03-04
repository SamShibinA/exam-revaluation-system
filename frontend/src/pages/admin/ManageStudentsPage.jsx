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
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export default function ManageStudentsPage() {
  const token = localStorage.getItem("auth_token");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${BASE_URL}/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          console.error("API returned non-array for students:", data);
          setStudents([]);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setStudents([]);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search
  const filteredStudents = students.filter(
    (student) =>
      (student.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (student.studentId || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ fontSize: { xs: "1.1rem", sm: "1.5rem" } }}
        >
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

      {/* Students Grid */}
      <Grid container spacing={2}>
        {filteredStudents.map((student) => (
          <Grid item xs={12} sm={6} lg={4} key={student._id}>
            <Card
              sx={{
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 4 },
              }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "primary.100", color: "primary.main" }}>
                    {student.name.charAt(0)}
                  </Avatar>
                }
                title={student.name}
                subheader={student.studentId}
                titleTypographyProps={{ fontWeight: 500 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                    {student.email}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body2">
                    {student.department}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Semester
                  </Typography>
                  <Typography variant="body2">
                    {student.currentSemester}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
