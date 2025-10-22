import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Alert,
  Badge,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useCart } from '../context/CartContext';

// Product images
import shirtImg from '../assets/products/shop/shirt.jpg';
import tshirtImg from '../assets/products/shop/tshit.jpg';
import mugImg from '../assets/products/shop/Customized Mug.jpg';
import clockImg from '../assets/products/shop/Customized Wall Clock.jpg';

const ProductBuyPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotalItems, clearCart } = useCart();
  
  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'Sri Lanka',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderComplete, setOrderComplete] = useState(false);

  const steps = ['Order Summary', 'Shipping Details', 'Payment', 'Confirmation'];

  const calculateSubtotal = () => {
    return Array.from(cartItems.values()).reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return 500; // Fixed shipping cost
  };

  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.15); // 15% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCustomerInfoChange = (field) => (event) => {
    setCustomerInfo({ ...customerInfo, [field]: event.target.value });
  };

  const handleShippingInfoChange = (field) => (event) => {
    setShippingInfo({ ...shippingInfo, [field]: event.target.value });
  };

  const handlePlaceOrder = () => {
    // Simulate order processing
    setTimeout(() => {
      setOrderComplete(true);
      setActiveStep(3);
      clearCart(); // Clear cart after successful order
    }, 2000);
  };

  const renderOrderSummary = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Order Summary
        </Typography>
        {Array.from(cartItems.entries()).map(([itemId, item]) => (
          <Box key={itemId} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: 60, height: 60, mr: 2 }}>
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Color: {item.color} | Size: {item.size}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Quantity: {item.quantity}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {item.price * item.quantity} LKR
            </Typography>
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal:</Typography>
          <Typography>{calculateSubtotal()} LKR</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Shipping:</Typography>
          <Typography>{calculateShipping()} LKR</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Tax (15%):</Typography>
          <Typography>{calculateTax()} LKR</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Total:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            {calculateTotal()} LKR
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderShippingDetails = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
          Shipping Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={customerInfo.firstName}
              onChange={handleCustomerInfoChange('firstName')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={customerInfo.lastName}
              onChange={handleCustomerInfoChange('lastName')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={customerInfo.email}
              onChange={handleCustomerInfoChange('email')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={customerInfo.phone}
              onChange={handleCustomerInfoChange('phone')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={3}
              value={shippingInfo.address}
              onChange={handleShippingInfoChange('address')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={shippingInfo.city}
              onChange={handleShippingInfoChange('city')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Postal Code"
              value={shippingInfo.postalCode}
              onChange={handleShippingInfoChange('postalCode')}
              required
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderPayment = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
          Payment Method
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="card"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CreditCardIcon sx={{ mr: 1 }} />
                  Credit/Debit Card
                </Box>
              }
            />
            <FormControlLabel
              value="cash"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalShippingIcon sx={{ mr: 1 }} />
                  Cash on Delivery
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        {paymentMethod === 'card' && (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  placeholder="MM/YY"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  placeholder="123"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cardholder Name"
                  required
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {paymentMethod === 'cash' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            You will pay cash when your order is delivered. Please have the exact amount ready.
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderConfirmation = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ textAlign: 'center' }}>
        {orderComplete ? (
          <Box>
            <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50', mb: 2 }}>
              Order Placed Successfully!
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order #12345
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              Thank you for your purchase! You will receive a confirmation email shortly.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
                px: 4,
                py: 1.5,
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Review Your Order
            </Typography>
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Customer Information:
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {customerInfo.firstName} {customerInfo.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {customerInfo.email} | {customerInfo.phone}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Shipping Address:
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {shippingInfo.address}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {shippingInfo.city}, {shippingInfo.postalCode}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {shippingInfo.country}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Payment Method:
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={handlePlaceOrder}
              sx={{
                backgroundColor: '#2c2c2c',
                '&:hover': { backgroundColor: '#424242' },
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
              }}
            >
              PLACE ORDER
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderOrderSummary();
      case 1:
        return renderShippingDetails();
      case 2:
        return renderPayment();
      case 3:
        return renderConfirmation();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#2c2c2c',
          py: 2,
          px: { xs: 2, md: 4 },
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ color: 'white', mr: 2 }} onClick={() => navigate(-1)}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                Checkout
              </Typography>
            </Box>
            <Badge badgeContent={getCartTotalItems()} color="primary">
              <IconButton sx={{ color: 'white' }} onClick={() => navigate('/shop')}>
                <ShoppingBagIcon />
              </IconButton>
            </Badge>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Progress Stepper */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {getStepContent(activeStep)}
            </motion.div>

            {/* Navigation Buttons */}
            {!orderComplete && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ color: '#1976d2' }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0) ||
                    (activeStep === 1 && (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode)) ||
                    (activeStep === 2)
                  }
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#1565c0' },
                    px: 4,
                  }}
                >
                  {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
                </Button>
              </Box>
            )}
          </Grid>

          {/* Order Summary Sidebar */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{ position: 'sticky', top: 100 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Order Summary
                  </Typography>
                  {Array.from(cartItems.entries()).map(([itemId, item]) => (
                    <Box key={itemId} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ width: 50, height: 50, mr: 2 }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Qty: {item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {item.price * item.quantity} LKR
                      </Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal:</Typography>
                    <Typography variant="body2">{calculateSubtotal()} LKR</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Shipping:</Typography>
                    <Typography variant="body2">{calculateShipping()} LKR</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tax:</Typography>
                    <Typography variant="body2">{calculateTax()} LKR</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Total:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {calculateTotal()} LKR
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductBuyPage;
