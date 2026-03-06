import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Home as HomeIcon, SentimentDissatisfied as SadIcon } from "@mui/icons-material";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #f0fdfa 100%)',
        p: 3,
      }}
    >
      <Box sx={{ textAlign: "center" }} className="animate-fade-in-up">
        <SadIcon sx={{ fontSize: 64, color: 'primary.light', mb: 2, animation: 'float 3s ease-in-out infinite' }} />
        <Typography
          variant="h1"
          fontWeight={800}
          sx={{
            fontSize: { xs: "3rem", sm: "5rem" },
            mb: 1,
            background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #5eead4 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-0.04em',
          }}
        >
          404
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: { xs: "1rem", sm: "1.25rem" }, fontWeight: 500 }}>
          Oops! Page not found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          startIcon={<HomeIcon />}
          sx={{
            background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
            px: 3,
            py: 1,
          }}
        >
          Return Home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;
