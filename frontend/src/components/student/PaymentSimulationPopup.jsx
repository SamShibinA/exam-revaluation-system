
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  CircularProgress,
  Divider,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { CheckCircle as SuccessIcon } from '@mui/icons-material';

export default function PaymentSimulationPopup({ open, onClose, amount, onPaymentSuccess, studentEmail, requestType, studentId, initiatePayment }) {
  const [step, setStep] = useState('confirm'); // confirm, processing, success
  
  useEffect(() => {
    if (open) {
      setStep('confirm');
    }
  }, [open]);

  const handlePay = async () => {
    setStep('processing');
    try {
      // Create transaction via parent's initiatePayment or handle it here
      await initiatePayment();
      setStep('success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setStep('confirm');
    }
  };

  return (
    <Dialog 
      open={open} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, overflow: 'hidden' }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        bgcolor: '#f8f9fa', 
        py: 3,
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 1
      }}>
        <Box 
          component="img" 
          src="https://www.gstatic.com/instantbuy/svg/dark_gpay.svg" 
          alt="Google Pay"
          sx={{ height: '24px', mb: 1 }}
        />
        <Typography variant="h6" fontWeight={700}>
          Confirm Payment
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ px: 4, py: 3 }}>
        {step === 'confirm' && (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} color="primary.main">
                ₹{amount}.00
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To Exam Revaluation System
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">PAYMENT FOR</Typography>
              <Typography variant="body1" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                {requestType} Request
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="caption" color="text.secondary">PAYING FROM</Typography>
              <Typography variant="body1" fontWeight={600}>{studentEmail}</Typography>
            </Box>
          </Box>
        )}

        {step === 'processing' && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
            <Typography variant="h6" fontWeight={600}>
              Processing Payment...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please do not close this window
            </Typography>
          </Box>
        )}

        {step === 'success' && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <SuccessIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h5" fontWeight={800} color="success.main">
              Payment Successful!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your transaction has been completed.
            </Typography>
          </Box>
        )}
      </DialogContent>

      {step === 'confirm' && (
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center', gap: 2 }}>
          <Button 
            onClick={onClose} 
            variant="text" 
            sx={{ flex: 1, borderRadius: 2, py: 1.2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePay} 
            variant="contained" 
            sx={{ 
              flex: 2, 
              borderRadius: 2, 
              py: 1.2,
              bgcolor: '#1a73e8',
              '&:hover': { bgcolor: '#1765cc' }
            }}
          >
            Pay Now
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
