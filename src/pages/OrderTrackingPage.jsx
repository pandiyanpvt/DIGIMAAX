import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Grid,
  Divider,
  LinearProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../context/AuthContext';

const mockOrder = {
  id: 'ORD-2024-001',
  date: '2024-01-15',
  status: 'shipped',
  total: 124.99,
  trackingNumber: 'TRK123456789',
  estimatedDelivery: '2024-01-22',
  shippingAddress: {
    name: 'John Doe',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  },
  items: [
    { id: 1, name: 'Customized Photo Mug', quantity: 2, price: 24.99, image: '../assets/products/shop/Customized Mug.jpg' },
    { id: 5, name: 'Wireless Earbuds Pro', quantity: 1, price: 89.99, image: '../assets/products/shop/Customized Mug.jpg' },
  ],
  trackingHistory: [
    { date: '2024-01-15T10:00:00', status: 'ordered', message: 'Order placed' },
    { date: '2024-01-16T14:30:00', status: 'processing', message: 'Order confirmed and processing' },
    { date: '2024-01-18T09:15:00', status: 'shipped', message: 'Order shipped from warehouse' },
    { date: null, status: 'delivered', message: 'Out for delivery' },
  ],
};

const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated, openSignInModal } = useAuth();
  const [order, setOrder] = useState(mockOrder);

  useEffect(() => {
  }, [id]);

  const getStatusSteps = () => {
    return [
      { label: 'Ordered', icon: <InventoryIcon />, status: 'ordered' },
      { label: 'Processing', icon: <InventoryIcon />, status: 'processing' },
      { label: 'Shipped', icon: <LocalShippingIcon />, status: 'shipped' },
      { label: 'Delivered', icon: <DoneIcon />, status: 'delivered' },
    ];
  };

  const getCurrentStep = () => {
    const steps = getStatusSteps();
    const statusMap = { ordered: 0, processing: 1, shipped: 2, delivered: 3 };
    return statusMap[order.status] || 0;
  };

  const isStepCompleted = (stepIndex) => {
    return stepIndex <= getCurrentStep();
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)',
        minHeight: '100vh',
        pt: { xs: 7, md: 8 },
        pb: 8,
      }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '2px solid rgba(255, 215, 0, 0.2)',
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
              Please sign in to track your order
            </Typography>
            <Button
              variant="contained"
              onClick={openSignInModal}
              sx={{
                background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                '&:hover': { 
                  background: 'linear-gradient(45deg, #1976D2, #C2185B)',
                },
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)',
      minHeight: '100vh',
      pt: { xs: 7, md: 8 },
      pb: 8,
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton
              onClick={() => navigate('/orders')}
              sx={{ color: 'white', mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
              Order Tracking
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Tracking Status */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '2px solid rgba(255, 215, 0, 0.2)',
                  mb: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                        Order {order.id}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Tracking Number: {order.trackingNumber}
                      </Typography>
                    </Box>
                    <Chip
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      sx={{
                        background: 
                          order.status === 'delivered' ? '#4caf50' :
                          order.status === 'shipped' ? '#2196F3' :
                          order.status === 'processing' ? '#ff9800' :
                          '#DC143C',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1rem',
                        px: 2,
                        py: 3,
                      }}
                    />
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

                  <Stepper orientation="vertical" activeStep={getCurrentStep()}>
                    {getStatusSteps().map((step, index) => (
                      <Step key={step.label} completed={isStepCompleted(index)}>
                        <StepLabel
                          StepIconComponent={() => (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: isStepCompleted(index)
                                  ? 'linear-gradient(45deg, #2196F3, #FF4081)'
                                  : 'rgba(255, 255, 255, 0.1)',
                                color: isStepCompleted(index) ? 'white' : 'rgba(255, 255, 255, 0.3)',
                              }}
                            >
                              {isStepCompleted(index) ? (
                                <CheckCircleIcon />
                              ) : (
                                <RadioButtonUncheckedIcon />
                              )}
                            </Box>
                          )}
                          sx={{
                            '& .MuiStepLabel-label': {
                              color: isStepCompleted(index) ? 'white' : 'rgba(255, 255, 255, 0.7)',
                              fontWeight: isStepCompleted(index) ? 700 : 500,
                            },
                          }}
                        >
                          {step.label}
                        </StepLabel>
                        <StepContent>
                          {order.trackingHistory[index] && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                                {order.trackingHistory[index].message}
                              </Typography>
                              {order.trackingHistory[index].date && (
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                  {new Date(order.trackingHistory[index].date).toLocaleString()}
                                </Typography>
                              )}
                            </Box>
                          )}
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>

                  {order.estimatedDelivery && (
                    <Box sx={{ mt: 3, p: 2, background: 'rgba(255, 215, 0, 0.1)', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600 }}>
                        Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Order Details */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '2px solid rgba(255, 215, 0, 0.2)',
                  mb: 3,
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                    Order Summary
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />

                  {order.items.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 1,
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}

                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Subtotal
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                      ${(order.total - 10).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Shipping
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                      $10.00
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>
                      ${order.total.toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '2px solid rgba(255, 215, 0, 0.2)',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                    Shipping Address
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                    {order.shippingAddress.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                    {order.shippingAddress.address}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {order.shippingAddress.country}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default OrderTrackingPage;

