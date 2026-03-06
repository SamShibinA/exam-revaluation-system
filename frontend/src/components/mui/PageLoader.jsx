import { Box, CircularProgress, Typography } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

export function PageLoader() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 2.5,
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          size={52}
          thickness={3}
          sx={{
            color: 'primary.main',
            opacity: 0.8,
          }}
        />
        <SchoolIcon
          sx={{
            position: 'absolute',
            fontSize: 22,
            color: 'primary.main',
            opacity: 0.6,
          }}
        />
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        fontWeight={500}
        sx={{ animation: 'pulse 1.5s infinite' }}
      >
        Loading...
      </Typography>
    </Box>
  );
}
