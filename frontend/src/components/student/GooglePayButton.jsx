
import { Button, Box } from '@mui/material';

export default function GooglePayButton({ onClick, disabled, amount }) {
  return (
    <Button
      fullWidth
      variant="contained"
      disabled={disabled}
      onClick={onClick}
      sx={{
        backgroundColor: '#000',
        color: '#fff',
        height: '48px',
        borderRadius: '24px',
        textTransform: 'none',
        fontSize: '1.1rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        '&:hover': {
          backgroundColor: '#333',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        },
        '&:disabled': {
          backgroundColor: '#ccc',
        },
      }}
    >
      <Box 
        component="img" 
        src="https://www.gstatic.com/instantbuy/svg/dark_gpay.svg" 
        alt="Google Pay"
        sx={{ height: '20px' }}
      />
      Pay ₹{amount}
    </Button>
  );
}
