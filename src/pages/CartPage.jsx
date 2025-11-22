import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Divider,
  Paper,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import { useCart } from '../context/CartContext';
import { formatLKR } from '../utils/currency';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateCartQuantity, removeFromCart, getCartTotalPrice, clearCart } = useCart();
  const { isAuthenticated, openSignInModal } = useAuth();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, itemId: null, itemName: '' });
  const [clearDialog, setClearDialog] = useState(false);
  const [checkoutDialog, setCheckoutDialog] = useState(false);

  const items = Array.from(cartItems.values());
  const subtotal = getCartTotalPrice();
  const total = subtotal;

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRemoveProduct = (itemId, itemName) => {
    setDeleteDialog({ open: true, itemId, itemName });
  };

  const confirmRemove = async () => {
    if (deleteDialog.itemId) {
      await removeFromCart(deleteDialog.itemId);
      showSnackbar(`${deleteDialog.itemName} removed from cart`, 'info');
      setDeleteDialog({ open: false, itemId: null, itemName: '' });
    }
  };

  const handleClearCart = () => {
    setClearDialog(true);
  };

  const confirmClearCart = async () => {
    await clearCart();
    showSnackbar('Cart cleared successfully', 'info');
    setClearDialog(false);
  };

  const handleQuantityChange = async (itemId, change) => {
    const item = cartItems.get(itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        handleRemoveProduct(itemId, item.title);
      } else {
        await updateCartQuantity(itemId, newQuantity);
        showSnackbar('Quantity updated', 'success');
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      openSignInModal();
      return;
    }
    if (items.length === 0) {
      return;
    }
    setCheckoutDialog(true);
  };

  if (items.length === 0) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #16213E 100%)',
        minHeight: '100vh',
        pt: { xs: 10, md: 12 },
        pb: 8,
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
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
                Shopping Cart
              </Typography>
            </Box>

            <Box
              sx={{
                textAlign: 'center',
                py: 10,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ShoppingCartIcon sx={{ fontSize: 100, color: 'rgba(33, 150, 243, 0.4)', mb: 2 }} />
              </motion.div>
              <Typography variant="h4" sx={{ mb: 2, color: 'white', fontWeight: 700 }}>
                Your cart is empty
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
                Start shopping to add items to your cart
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/shop')}
                sx={{
                  background: '#2196F3',
                  '&:hover': { 
                    background: '#1976D2',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(33, 150, 243, 0.4)',
                  },
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 5,
                  py: 1.8,
                  borderRadius: 2,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #16213E 100%)',
      minHeight: '100vh',
      pt: { xs: 10, md: 12 },
      pb: 8,
    }}>
      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, itemId: null, itemName: '' })}
        PaperProps={{
          sx: {
            background: 'rgba(26, 26, 46, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
          Remove Item
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to remove "{deleteDialog.itemName}" from your cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, itemId: null, itemName: '' })}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmRemove}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #2196F3, #FF4081)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2, #C2185B)',
              },
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear Cart Confirmation Dialog */}
      <Dialog
        open={clearDialog}
        onClose={() => setClearDialog(false)}
        PaperProps={{
          sx: {
            background: 'rgba(26, 26, 46, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
          Clear Cart
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to remove all items from your cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setClearDialog(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmClearCart}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #2196F3, #FF4081)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2, #C2185B)',
              },
            }}
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Checkout Unavailable Dialog */}
      <Dialog
        open={checkoutDialog}
        onClose={() => setCheckoutDialog(false)}
        PaperProps={{
          sx: {
            background: 'rgba(26, 26, 46, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
          Checkout Unavailable
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Checkout is unavailable right now. Please try again later.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCheckoutDialog(false)}
            variant="contained"
            sx={{
              background: '#2196F3',
              '&:hover': {
                background: '#1976D2',
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{ 
                  color: 'white', 
                  mr: 2,
                  background: 'rgba(33, 150, 243, 0.1)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(33, 150, 243, 0.2)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                  Shopping Cart
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                </Typography>
              </Box>
            </Box>
            {items.length > 0 && (
              <Tooltip title="Clear all items">
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearCart}
                  sx={{
                    borderColor: 'rgba(255, 64, 129, 0.5)',
                    color: '#FF4081',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#FF4081',
                      background: 'rgba(255, 64, 129, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Clear Cart
                </Button>
              </Tooltip>
            )}
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid size={{ xs: 12, md: 8 }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    border: '1px solid rgba(33, 150, 243, 0.4)',
                    boxShadow: '0 8px 32px rgba(33, 150, 243, 0.15)',
                  },
                }}
              >
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: -100 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          mb: 3,
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: 3,
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            border: '1px solid rgba(33, 150, 243, 0.4)',
                            boxShadow: '0 8px 24px rgba(33, 150, 243, 0.2)',
                            transform: 'translateY(-4px)',
                          },
                          '&:last-child': { mb: 0 }
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
                          {/* Product Image */}
                          <Box
                            sx={{
                              width: { xs: 100, sm: 140 },
                              height: { xs: 100, sm: 140 },
                              borderRadius: 2,
                              overflow: 'hidden',
                              cursor: 'pointer',
                              flexShrink: 0,
                              position: 'relative',
                              border: '1px solid rgba(33, 150, 243, 0.3)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                border: '1px solid rgba(33, 150, 243, 0.6)',
                                transform: 'scale(1.05)',
                              },
                            }}
                            onClick={() => navigate(`/product/${item.product_id || item.id}`)}
                          >
                            <CardMedia
                              component="img"
                              image={item.image}
                              alt={item.title}
                              sx={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                },
                              }}
                            />
                          </Box>

                          {/* Product Details */}
                          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: 'white',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  fontSize: { xs: '1rem', sm: '1.2rem' },
                                  transition: 'all 0.3s',
                                  '&:hover': { 
                                    color: '#64B5F6',
                                    transform: 'translateX(4px)',
                                  },
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                                onClick={() => navigate(`/product/${item.product_id || item.id}`)}
                              >
                                {item.title}
                              </Typography>
                              <Tooltip title="Remove item">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveProduct(item.id, item.title)}
                                  sx={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    background: 'rgba(255, 64, 129, 0.1)',
                                    ml: 1,
                                    transition: 'all 0.3s',
                                    '&:hover': { 
                                      color: '#FF4081',
                                      background: 'rgba(255, 64, 129, 0.2)',
                                      transform: 'scale(1.2) rotate(90deg)',
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>

                            {/* Product Variants */}
                            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                              {item.color && (
                                <Chip
                                  label={`Color: ${item.color}`}
                                  size="small"
                                  sx={{
                                    background: 'rgba(33, 150, 243, 0.2)',
                                    color: '#64B5F6',
                                    border: '1px solid rgba(33, 150, 243, 0.3)',
                                    fontSize: '0.75rem',
                                    height: 24,
                                  }}
                                />
                              )}
                              {item.size && (
                                <Chip
                                  label={`Size: ${item.size}`}
                                  size="small"
                                  sx={{
                                    background: 'rgba(255, 64, 129, 0.2)',
                                    color: '#FF79B0',
                                    border: '1px solid rgba(255, 64, 129, 0.3)',
                                    fontSize: '0.75rem',
                                    height: 24,
                                  }}
                                />
                              )}
                              {item.customText && (
                                <Chip
                                  label={`Text: ${item.customText}`}
                                  size="small"
                                  sx={{
                                    background: 'rgba(255, 215, 0, 0.2)',
                                    color: '#FFD700',
                                    border: '1px solid rgba(255, 215, 0, 0.3)',
                                    fontSize: '0.75rem',
                                    height: 24,
                                  }}
                                />
                              )}
                            </Box>

                            {/* Quantity Controls and Price */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', flexWrap: 'wrap', gap: 2 }}>
                              {/* Quantity Controls */}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Tooltip title="Decrease quantity">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleQuantityChange(item.id, -1)}
                                    disabled={item.quantity <= 1}
                                    sx={{
                                      background: 'rgba(33, 150, 243, 0.15)',
                                      backdropFilter: 'blur(10px)',
                                      color: 'white',
                                      border: '1px solid rgba(33, 150, 243, 0.3)',
                                      '&:hover': { 
                                        background: 'rgba(33, 150, 243, 0.3)',
                                        borderColor: '#2196F3',
                                        transform: 'scale(1.1)',
                                      },
                                      '&.Mui-disabled': {
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: 'rgba(255, 255, 255, 0.3)',
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                      },
                                      transition: 'all 0.3s',
                                    }}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: 'white',
                                    minWidth: 50,
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    fontSize: '1.2rem',
                                    px: 2,
                                    py: 0.5,
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: 1,
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                  }}
                                >
                                  {item.quantity}
                                </Typography>
                                <Tooltip title="Increase quantity">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                    sx={{
                                      background: 'rgba(33, 150, 243, 0.15)',
                                      backdropFilter: 'blur(10px)',
                                      color: 'white',
                                      border: '1px solid rgba(33, 150, 243, 0.3)',
                                      '&:hover': { 
                                        background: 'rgba(33, 150, 243, 0.3)',
                                        borderColor: '#2196F3',
                                        transform: 'scale(1.1)',
                                      },
                                      transition: 'all 0.3s',
                                    }}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>

                              {/* Price */}
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <Typography
                                  variant="h5"
                                  sx={{
                                    color: '#64B5F6',
                                    fontWeight: 700,
                                    fontSize: { xs: '1.3rem', sm: '1.5rem' },
                                    textShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
                                  }}
                                >
                                  {formatLKR(item.price * item.quantity)}
                                </Typography>
                                {item.quantity > 1 && (
                                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                    {formatLKR(item.price)} each
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Card>
                      {index < items.length - 1 && (
                        <Divider 
                          sx={{ 
                            mt: 3, 
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.3), transparent)',
                          }} 
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Paper>
            </motion.div>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Paper
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'sticky',
                  top: 100,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    border: '1px solid rgba(33, 150, 243, 0.4)',
                    boxShadow: '0 8px 32px rgba(33, 150, 243, 0.15)',
                  },
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#64B5F6', 
                    fontWeight: 700, 
                    mb: 3,
                    fontSize: { xs: '1.3rem', sm: '1.5rem' },
                    textShadow: '0 0 10px rgba(33, 150, 243, 0.3)',
                  }}
                >
                  Order Summary
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: '1.3rem' }}>
                      Total
                    </Typography>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#64B5F6', 
                        fontWeight: 700,
                        fontSize: '1.8rem',
                        textShadow: '0 0 15px rgba(33, 150, 243, 0.5)',
                      }}
                    >
                      {formatLKR(total)}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleCheckout}
                  sx={{
                    background: '#2196F3',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 700,
                    py: 1.8,
                    mb: 2,
                    fontSize: '1rem',
                    borderRadius: 2,
                    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
                    '&:hover': {
                      background: '#1976D2',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(33, 150, 243, 0.6)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/shop')}
                  sx={{
                    background: '#2196F3',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    fontSize: '0.95rem',
                    borderRadius: 2,
                    '&:hover': {
                      background: '#1976D2',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Continue Shopping
                </Button>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CartPage;
