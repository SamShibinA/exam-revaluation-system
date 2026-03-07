import { Box, Typography } from '@mui/material';
import {
  Schedule as ClockIcon,
  FindInPage as FileSearchIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const timelineSteps = [
  { status: 'pending', label: 'Submitted', icon: ClockIcon },
  { status: 'in_review', label: 'In Review', icon: FileSearchIcon },
  { status: 'approved', label: 'Decision', icon: CheckIcon },
  { status: 'completed', label: 'Completed', icon: CheckCircleIcon },
];

const getStepIndex = (status) => {
  if (status === 'rejected') return 2;
  return timelineSteps.findIndex((step) => step.status === status);
};

export function RequestTimeline({ currentStatus }) {
  const currentIndex = getStepIndex(currentStatus);
  const isRejected = currentStatus === 'rejected';

  return (
    <Box sx={{ width: '100%', py: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {timelineSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const showRejected = isRejected && index === 2;

          const getBgColor = () => {
            if (isCompleted) return 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
            if (isCurrent && !showRejected) return 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)';
            if (showRejected) return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            return 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)';
          };

          const getTextColor = () => {
            if (isCompleted || isCurrent) return 'text.primary';
            if (showRejected) return 'error.main';
            return 'text.secondary';
          };

          return (
            <Box
              key={step.status}
              sx={{ display: 'flex', alignItems: 'center', flex: 1 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    borderRadius: '50%',
                    background: getBgColor(),
                    color:
                      isCompleted || isCurrent || showRejected
                        ? 'white'
                        : '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: (isCompleted || isCurrent || showRejected)
                      ? '0 4px 12px -4px rgba(0,0,0,0.2)'
                      : 'none',
                    transition: 'all 0.3s ease',
                    animation: isCurrent ? 'pulseRing 2s infinite' : 'none',
                  }}
                >
                  {showRejected ? <CloseIcon sx={{ fontSize: { xs: 14, sm: 18 } }} /> : <Icon sx={{ fontSize: { xs: 14, sm: 18 } }} />}
                </Box>
                <Typography
                  variant="caption"
                  fontWeight={isCurrent || isCompleted ? 600 : 500}
                  sx={{ mt: 1, color: getTextColor(), fontSize: '0.68rem' }}
                >
                  {showRejected ? 'Rejected' : step.label}
                </Typography>
              </Box>

              {index < timelineSteps.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 3,
                    mx: 1,
                    borderRadius: 2,
                    background:
                      index < currentIndex
                        ? 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)'
                        : '#e5e7eb',
                    transition: 'all 0.5s ease',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
