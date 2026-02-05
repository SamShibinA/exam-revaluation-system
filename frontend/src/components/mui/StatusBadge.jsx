import { Chip } from '@mui/material';

const statusConfig = {
  pending: { label: 'Pending', color: 'warning' },
  in_review: { label: 'In Review', color: 'info' },
  approved: { label: 'Approved', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
  completed: { label: 'Completed', color: 'success' },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 500 }}
    />
  );
}
