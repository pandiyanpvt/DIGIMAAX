import React from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)', minHeight: '100vh', pt: { xs: 8, md: 10 }, pb: 8 }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 900, mb: 1 }}>Order Placed</Typography>
          <Typography sx={{ color: 'white', mb: 3 }}>Thank you! We have received your order.</Typography>
          <Button variant="contained" onClick={() => navigate('/orders')} sx={{ mr: 1, background: 'linear-gradient(45deg, #2196F3, #FF4081)', textTransform: 'none', fontWeight: 800 }}>View Orders</Button>
          <Button variant="outlined" onClick={() => navigate('/shop')} sx={{ color: '#FFD700', borderColor: 'rgba(255,215,0,0.6)', textTransform: 'none', fontWeight: 800 }}>Continue Shopping</Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default OrderSuccessPage;


