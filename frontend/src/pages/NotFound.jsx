import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Box, Typography, Link as MuiLink } from "@mui/material";

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
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h1" fontWeight={700} sx={{ fontSize: { xs: "2.5rem", sm: "4rem" }, mb: 2 }}>
          404
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
          Oops! Page not found
        </Typography>
        <MuiLink component={Link} to="/" underline="hover" sx={{ color: "primary.main" }}>
          Return to Home
        </MuiLink>
      </Box>
    </Box>
  );
};

export default NotFound;
