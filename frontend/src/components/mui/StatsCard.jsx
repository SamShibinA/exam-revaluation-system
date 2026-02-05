import { Card, CardContent, Box, Typography } from '@mui/material';

const variantColors = {
  default: { bar: 'grey.500', icon: 'grey.100', iconColor: 'grey.600' },
  primary: { bar: 'primary.main', icon: 'primary.50', iconColor: 'primary.main' },
  accent: { bar: 'secondary.main', icon: 'secondary.50', iconColor: 'secondary.main' },
  success: { bar: 'success.main', icon: 'success.50', iconColor: 'success.main' },
  warning: { bar: 'warning.main', icon: 'warning.50', iconColor: 'warning.main' },
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
}) {
  const colors = variantColors[variant];

  return (
    <Card sx={{ position: 'relative', overflow: 'visible' }}>
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: colors.bar,
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
        }}
      />

      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" fontWeight={700}>
                {value}
              </Typography>

              {trend && (
                <Typography
                  variant="caption"
                  fontWeight={500}
                  color={trend.isPositive ? 'success.main' : 'error.main'}
                >
                  {trend.isPositive ? '+' : '-'}
                  {Math.abs(trend.value)}%
                </Typography>
              )}
            </Box>

            {description && (
              <Typography variant="caption" color="text.secondary">
                {description}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: colors.icon,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 24, color: colors.iconColor }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
