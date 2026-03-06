import { Chip, Box } from '@mui/material';

const statusConfig = {
  pending: { label: 'Pending', color: 'warning', dotColor: '#f59e0b' },
  in_review: { label: 'In Review', color: 'info', dotColor: '#0ea5e9' },
  approved: { label: 'Approved', color: 'success', dotColor: '#22c55e' },
  rejected: { label: 'Rejected', color: 'error', dotColor: '#ef4444' },
  completed: { label: 'Completed', color: 'success', dotColor: '#16a34a' },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status || 'Unknown', color: 'default', dotColor: '#9ca3af' };

  return (
    <Chip
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: config.dotColor,
              boxShadow: `0 0 6px ${config.dotColor}60`,
            }}
          />
          {config.label}
        </Box>
      }
      color={config.color}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 600,
        borderWidth: 1.5,
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
}
