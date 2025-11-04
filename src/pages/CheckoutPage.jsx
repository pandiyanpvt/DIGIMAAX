import React, { useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography, TextField, MenuItem, Button, Divider } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatLKR } from '../utils/currency';
import { TAX_RATE, FLAT_SHIPPING_LKR } from '../config/commerce';

const CheckoutPage = () => {
  const { cartItems, getCartTotalPrice } = useCart();
  const items = Array.from(cartItems.values());
  const subtotal = getCartTotalPrice();
  const shipping = items.length > 0 ? FLAT_SHIPPING_LKR : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop');
    }
  }, [items.length, navigate]);
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', address: '', city: '', postal: '', payment: 'COD' });
  const [errors, setErrors] = React.useState({});

  const onPlaceOrder = () => {
    if (items.length === 0) {
      return; // Cannot checkout with empty cart
    }
    const e = {};
    if (!form.name) e.name = 'Required';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone) e.phone = 'Required';
    if (!form.address) e.address = 'Required';
    if (!form.city) e.city = 'Required';
    if (!form.postal) e.postal = 'Required';
    setErrors(e);
    if (Object.keys(e).length === 0) {
      navigate('/order-success');
    }
  };

  return (
    <Box sx={{ background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)', minHeight: '100vh', pt: { xs: 8, md: 10 }, pb: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 2 }}>Checkout</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 900, mb: 2 }}>Billing Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Full Name *" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} error={!!errors.name} helperText={errors.name} sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }} /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Email *" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} error={!!errors.email} helperText={errors.email} sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }} /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Phone *" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} error={!!errors.phone} helperText={errors.phone} sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }} /></Grid>
                <Grid item xs={12}><TextField fullWidth size="small" label="Delivery Address *" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})} error={!!errors.address} helperText={errors.address} sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }} /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="City *" value={form.city} onChange={(e)=>setForm({...form,city:e.target.value})} error={!!errors.city} helperText={errors.city} sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }} /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Postal Code *" value={form.postal} onChange={(e)=>setForm({...form,postal:e.target.value})} error={!!errors.postal} helperText={errors.postal} sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }} /></Grid>
              </Grid>

              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 900, mt: 3, mb: 1 }}>Payment Method</Typography>
              <TextField select fullWidth size="small" value={form.payment} onChange={(e)=>setForm({...form,payment:e.target.value})} sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }}>
                <MenuItem value="COD">Cash on Delivery</MenuItem>
                <MenuItem value="CARD">Card Payment</MenuItem>
                <MenuItem value="BANK">Bank Transfer</MenuItem>
                <MenuItem value="PAYHERE">PayHere (Sri Lanka)</MenuItem>
              </TextField>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, mb: 1 }}>Order Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.9)' }}>
                <Typography>Subtotal</Typography>
                <Typography>{formatLKR(subtotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                <Typography>Delivery</Typography>
                <Typography>{formatLKR(shipping)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                <Typography>Tax (15%)</Typography>
                <Typography>{formatLKR(tax)}</Typography>
              </Box>
              <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.2)' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#FFD700', fontWeight: 900 }}>
                <Typography>Total</Typography>
                <Typography>{formatLKR(total)}</Typography>
              </Box>
              <Button fullWidth variant="contained" onClick={onPlaceOrder} sx={{ mt: 2, background: 'linear-gradient(45deg, #2196F3, #FF4081)', textTransform: 'none', fontWeight: 900 }}>Place Order</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CheckoutPage;


