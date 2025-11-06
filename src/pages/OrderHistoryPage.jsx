import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  Grid,
  Divider,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../context/AuthContext';

const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 124.99,
    items: [
      { id: 1, name: 'Customized Photo Mug', quantity: 2, price: 24.99, image: '../assets/products/shop/Customized Mug.jpg' },
      { id: 5, name: 'Wireless Earbuds Pro', quantity: 1, price: 89.99, image: '../assets/products/shop/Customized Mug.jpg' },
    ],
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-10',
    status: 'shipped',
    total: 89.98,
    items: [
      { id: 2, name: 'Designer Wall Clock', quantity: 2, price: 39.99, image: '../assets/products/shop/Customized Wall Clock.jpg' },
    ],
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-05',
    status: 'processing',
    total: 54.98,
    items: [
      { id: 4, name: 'Custom Printed T-Shirt', quantity: 2, price: 19.99, image: '../assets/products/shop/tshit.jpg' },
    ],
  },
  {
    id: 'ORD-2024-004',
    date: '2023-12-28',
    status: 'cancelled',
    total: 34.99,
    items: [
      { id: 3, name: 'Premium Polo Shirt', quantity: 1, price: 34.99, image: '../assets/products/shop/shirt.jpg' },
    ],
  },
];

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, openSignInModal } = useAuth();
  const [filterTab, setFilterTab] = useState(0);

  const statusFilters = ['all', 'processing', 'shipped', 'delivered', 'cancelled'];
  const currentFilter = statusFilters[filterTab];

  const filteredOrders = useMemo(() => {
    if (currentFilter === 'all') return mockOrders;
    return mockOrders.filter(order => order.status === currentFilter);
  }, [currentFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#4caf50';
      case 'shipped':
        return '#2196F3';
      case 'processing':
        return '#ff9800';
      case 'cancelled':
        return '#DC143C';
      default:
        return 'rgba(255, 255, 255, 0.7)';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
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
              Please sign in to view your orders
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
              onClick={() => navigate(-1)}
              sx={{ color: 'white', mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
              Order History
            </Typography>
          </Box>

          {/* Filter Tabs */}
          <Paper
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '2px solid rgba(255, 215, 0, 0.2)',
              mb: 4,
            }}
          >
            <Tabs
              value={filterTab}
              onChange={(e, newValue) => setFilterTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&.Mui-selected': {
                    color: '#FFD700',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#FFD700',
                },
              }}
            >
              <Tab label="All Orders" />
              <Tab label="Processing" />
              <Tab label="Shipped" />
              <Tab label="Delivered" />
              <Tab label="Cancelled" />
            </Tabs>
          </Paper>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
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
              <ShoppingBagIcon sx={{ fontSize: 80, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
                No orders found
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
                You haven't placed any orders yet
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/shop')}
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
                Start Shopping
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '2px solid rgba(255, 215, 0, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        border: '2px solid rgba(255, 215, 0, 0.4)',
                        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.15)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                            Order {order.id}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                          <Chip
                            label={getStatusLabel(order.status)}
                            size="small"
                            sx={{
                              background: getStatusColor(order.status),
                              color: 'white',
                              fontWeight: 700,
                            }}
                          />
                          <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>
                            ${order.total.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />

                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        {order.items.map((item) => (
                          <Grid size={{ xs: 12, sm: 6 }} key={item.id}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
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
                          </Grid>
                        ))}
                      </Grid>

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/orders/${order.id}/track`)}
                          sx={{
                            borderColor: 'rgba(255, 215, 0, 0.5)',
                            color: '#FFD700',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              borderColor: '#FFD700',
                              background: 'rgba(255, 215, 0, 0.1)',
                            },
                          }}
                        >
                          Track Order
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default OrderHistoryPage;

