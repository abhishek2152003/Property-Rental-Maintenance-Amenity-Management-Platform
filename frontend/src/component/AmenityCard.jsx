import { Box, Typography, Button, Card, CardContent, styled } from '@mui/material';

// ── STYLED SUB-COMPONENTS ──

const StyledCard = styled(Card)(({ theme }) => ({
  background: '#FFFFFF',
  borderRadius: '24px',
  boxShadow: '0 2px 12px rgba(15,32,68,0.08)',
  overflow: 'hidden',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  border: 'none',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 40px rgba(15,32,68,0.14)',
  },
}));

const CardHeaderVisual = styled(Box)(({ gradient }) => ({
  height: '110px',
  background: gradient || 'linear-gradient(135deg, #162B5B, #3B82F6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '36px',
  flexShrink: 0,
}));

const StatusBadge = styled(Box)(({ status }) => {
  const configs = {
    available: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
    pending: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
    busy: { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  };
  const config = configs[status] || configs.available;

  return {
    backgroundColor: config.bg,
    color: config.text,
    padding: '5px 12px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'inline-flex',
    alignItems: 'center',
    '&::before': {
      content: '""',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: config.dot,
      marginRight: '8px',
    },
  };
});

const ActionButton = styled(Button)({
  borderRadius: '9999px',
  padding: '8px 20px',
  fontSize: '13px',
  fontWeight: 600,
  textTransform: 'none',
  fontFamily: 'DM Sans, sans-serif',
  backgroundColor: '#162B5B',
  color: '#FFFFFF',
  boxShadow: '0 4px 14px rgba(22,43,91,0.35)',
  '&:hover': {
    backgroundColor: '#1E3A72',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(22,43,91,0.45)',
  },
});

// ── MAIN COMPONENT ──

export const AmenityCard = ({
  title,
  category,
  icon = "🏢",
  status = "available",
  gradient,
  onAction
}) => {
  return (
    <>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Libre+Baskerville:wght@700&display=swap');
      </style>

      <StyledCard>
        <CardHeaderVisual gradient={gradient}>
          {icon}
        </CardHeaderVisual>

        <CardContent sx={{
          p: '20px 24px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center' // Centers the title vertically in the content area
        }}>
          <Typography
            variant="overline"
            sx={{
              color: '#3B82F6',
              fontWeight: 600,
              display: 'block',
              mb: 0.5,
              letterSpacing: '0.1em',
              fontSize: '10px'
            }}
          >
            {category}
          </Typography>

          <Typography
            sx={{
              fontFamily: 'Libre Baskerville, serif',
              fontSize: '18px',
              fontWeight: 700,
              color: '#0F2044',
              // Truncate title if it goes over 2 lines
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
              minHeight: '48px' // Keeps height identical for 1 or 2 line titles
            }}
          >
            {title}
          </Typography>
        </CardContent>

        <Box
          sx={{
            p: '16px 24px',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto'
          }}
        >
          <StatusBadge status={status}>
            {status}
          </StatusBadge>

          <ActionButton onClick={onAction}>
            Book Now
          </ActionButton>
        </Box>
      </StyledCard>
    </>
  );
};