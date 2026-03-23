import { Card, CardContent, Box, Typography } from '@mui/material';

const variantStyles = {
  default: {
    gradient: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
    iconColor: '#6b7280',
    bar: '#9ca3af',
  },
  primary: {
    gradient: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
    iconColor: '#0f766e',
    bar: '#0f766e',
  },
  accent: {
    gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    iconColor: '#059669',
    bar: '#5eead4',
  },
  success: {
    gradient: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    iconColor: '#16a34a',
    bar: '#22c55e',
  },
  warning: {
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    iconColor: '#d97706',
    bar: '#f59e0b',
  },
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
}) {
  const styles = variantStyles[variant];

  return (
    <Card
      className="animate-fade-in-up"
      sx={{
        width: '100%',
        position: 'relative',
        overflow: 'visible',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 32px -8px rgba(15, 118, 110, 0.15)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: `linear-gradient(180deg, ${styles.bar} 0%, ${styles.bar}88 100%)`,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
        }}
      />

      <CardContent sx={{ p: 2.5, width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontWeight: 500, letterSpacing: '0.02em' }}
            >
              {title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                {value}
              </Typography>

              {trend && (
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{
                    color: trend.isPositive ? 'success.main' : 'error.main',
                    backgroundColor: trend.isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    px: 0.8,
                    py: 0.2,
                    borderRadius: 1,
                  }}
                >
                  {trend.isPositive ? '+' : '-'}
                  {Math.abs(trend.value)}%
                </Typography>
              )}
            </Box>

            {description && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {description}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              background: styles.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px -4px rgba(0,0,0,0.1)',
            }}
          >
            <Icon sx={{ fontSize: 22, color: styles.iconColor }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
