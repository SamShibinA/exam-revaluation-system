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
    <Box sx={{ width: '100%' }}>
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
            if (isCompleted) return 'success.main';
            if (isCurrent && !showRejected) return 'primary.main';
            if (showRejected) return 'error.main';
            return 'grey.200';
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
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: getBgColor(),
                    color:
                      isCompleted || isCurrent || showRejected
                        ? 'white'
                        : 'grey.500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid',
                    borderColor:
                      isCompleted || isCurrent || showRejected
                        ? 'transparent'
                        : 'grey.300',
                  }}
                >
                  {showRejected ? <CloseIcon /> : <Icon />}
                </Box>
                <Typography
                  variant="caption"
                  fontWeight={500}
                  sx={{ mt: 1, color: getTextColor() }}
                >
                  {showRejected ? 'Rejected' : step.label}
                </Typography>
              </Box>

              {index < timelineSteps.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    mx: 1,
                    bgcolor:
                      index < currentIndex
                        ? 'success.main'
                        : 'grey.200',
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
