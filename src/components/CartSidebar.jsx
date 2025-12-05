import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
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
  CardMedia,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ClearIcon from '@mui/icons-material/Clear';
import { useCart } from '../context/CartContext';
import { formatLKR } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

const CartSidebar = () => {
  const navigate = useNavigate();
  const { cartItems, updateCartQuantity, removeFromCart, getCartTotalPrice, clearCart, cartDrawerOpen, setCartDrawerOpen } = useCart();
  const { isAuthenticated, openSignInModal } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation();

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
      showSnackbar(t('cart.itemRemoved', { name: deleteDialog.itemName }), 'info');
      setDeleteDialog({ open: false, itemId: null, itemName: '' });
    }
  };

  const handleClearCart = () => {
    setClearDialog(true);
  };

  const confirmClearCart = async () => {
    await clearCart();
    showSnackbar(t('cart.clearCartSuccess'), 'info');
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
        showSnackbar(t('cart.quantityUpdated'), 'success');
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      openSignInModal();
      setCartDrawerOpen(false);
      return;
    }
    if (items.length === 0) {
      return;
    }
    setCheckoutDialog(true);
  };

  const handleViewCart = () => {
    setCartDrawerOpen(false);
    navigate('/cart');
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 450, md: 500 },
            background: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #16213E 100%)',
            color: 'white',
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, wordBreak: 'break-word' }}>
                {t('cart.title')}
              </Typography>
              <IconButton
                onClick={() => setCartDrawerOpen(false)}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', wordBreak: 'break-word' }}>
              {items.length} {items.length === 1 ? t('nav.items') : t('nav.itemsPlural')} {t('cart.inCart')}
            </Typography>
          </Box>

          {/* Cart Items */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {items.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <ShoppingCartIcon sx={{ fontSize: 80, color: 'rgba(33, 150, 243, 0.4)', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, color: 'white', fontWeight: 600, wordBreak: 'break-word' }}>
                  {t('cart.empty')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)', wordBreak: 'break-word' }}>
                  {t('cart.emptyDesc')}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setCartDrawerOpen(false);
                    navigate('/shop');
                  }}
                  sx={{
                    background: '#2196F3',
                    '&:hover': {
                      background: '#1976D2',
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 'fit-content',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t('cart.continueShopping')}
                </Button>
              </Box>
            ) : (
              <>
                {items.length > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Tooltip title={t('cart.clearAllItems')}>
                      <Button
                        size="small"
                        startIcon={<ClearIcon />}
                        onClick={handleClearCart}
                        sx={{
                          color: '#FF4081',
                          textTransform: 'none',
                          fontSize: '0.85rem',
                          minWidth: 'fit-content',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            background: 'rgba(255, 64, 129, 0.1)',
                          },
                        }}
                      >
                        {t('cart.clearCart')}
                      </Button>
                    </Tooltip>
                  </Box>
                )}
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Paper
                        sx={{
                          mb: 2,
                          p: 2,
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: 2,
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          {/* Product Image */}
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 2,
                              overflow: 'hidden',
                              flexShrink: 0,
                              cursor: 'pointer',
                              border: '1px solid rgba(33, 150, 243, 0.3)',
                            }}
                            onClick={() => {
                              setCartDrawerOpen(false);
                              navigate(`/product/${item.product_id || item.id}`);
                            }}
                          >
                            <Box
                              component="img"
                              src={item.image}
                              alt={item.title}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </Box>

                          {/* Product Details */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: '0.95rem',
                                  cursor: 'pointer',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                                onClick={() => {
                                  setCartDrawerOpen(false);
                                  navigate(`/product/${item.product_id || item.id}`);
                                }}
                              >
                                {item.title}
                              </Typography>
                              <Tooltip title={t('cart.removeItem')}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveProduct(item.id, item.title)}
                                  sx={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    ml: 1,
                                    '&:hover': {
                                      color: '#FF4081',
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>

                            {/* Variants */}
                            {(item.color || item.size || item.customText || item.customImageUrl) && (
                              <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                                {item.color && (
                                  <Chip
                                    label={item.color}
                                    size="small"
                                    sx={{
                                      background: 'rgba(33, 150, 243, 0.2)',
                                      color: '#64B5F6',
                                      fontSize: '0.7rem',
                                      height: 20,
                                    }}
                                  />
                                )}
                                {item.size && (
                                  <Chip
                                    label={item.size}
                                    size="small"
                                    sx={{
                                      background: 'rgba(255, 64, 129, 0.2)',
                                      color: '#FF79B0',
                                      fontSize: '0.7rem',
                                      height: 20,
                                    }}
                                  />
                                )}
                                {item.customText && (
                                  <Chip
                                    label={`${t('cart.textPrefix')} ${item.customText.length > 10 ? item.customText.substring(0, 10) + '...' : item.customText}`}
                                    size="small"
                                    sx={{
                                      background: 'rgba(255, 215, 0, 0.2)',
                                      color: '#FFD700',
                                      fontSize: '0.7rem',
                                      height: 20,
                                      maxWidth: '150px',
                                      '& .MuiChip-label': {
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      },
                                    }}
                                  />
                                )}
                                {item.customImageUrl && (
                                  <Tooltip title={t('cart.customImage')}>
                                    <Box
                                      sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        border: '2px solid rgba(255, 215, 0, 0.5)',
                                        cursor: 'pointer',
                                        flexShrink: 0,
                                        '&:hover': {
                                          borderColor: '#FFD700',
                                          transform: 'scale(1.15)',
                                        },
                                        transition: 'all 0.3s ease',
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(item.customImageUrl, '_blank');
                                      }}
                                    >
                                      <CardMedia
                                        component="img"
                                        image={item.customImageUrl}
                                        alt="Custom Image"
                                        sx={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover',
                                        }}
                                      />
                                    </Box>
                                  </Tooltip>
                                )}
                              </Box>
                            )}

                            {/* Quantity and Price */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                  sx={{
                                    background: 'rgba(33, 150, 243, 0.15)',
                                    color: 'white',
                                    border: '1px solid rgba(33, 150, 243, 0.3)',
                                    width: 28,
                                    height: 28,
                                    '&:hover': {
                                      background: 'rgba(33, 150, 243, 0.3)',
                                    },
                                    '&.Mui-disabled': {
                                      background: 'rgba(255, 255, 255, 0.05)',
                                      color: 'rgba(255, 255, 255, 0.3)',
                                    },
                                  }}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography
                                  sx={{
                                    color: 'white',
                                    minWidth: 30,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                  }}
                                >
                                  {item.quantity}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  sx={{
                                    background: 'rgba(33, 150, 243, 0.15)',
                                    color: 'white',
                                    border: '1px solid rgba(33, 150, 243, 0.3)',
                                    width: 28,
                                    height: 28,
                                    '&:hover': {
                                      background: 'rgba(33, 150, 243, 0.3)',
                                    },
                                  }}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              <Typography
                                sx={{
                                  color: '#64B5F6',
                                  fontWeight: 700,
                                  fontSize: '1.1rem',
                                }}
                              >
                                {formatLKR(item.price * item.quantity)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                      {index < items.length - 1 && (
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </>
            )}
          </Box>

          {/* Footer with Summary and Buttons */}
          {items.length > 0 && (
            <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.2)' }}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, wordBreak: 'break-word' }}>
                    {t('checkout.total')}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#64B5F6', fontWeight: 700 }}>
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
                  py: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    background: '#1976D2',
                  },
                }}
              >
                {t('cart.proceedToCheckout')}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleViewCart}
                sx={{
                  borderColor: 'rgba(33, 150, 243, 0.5)',
                  color: '#64B5F6',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.2,
                  borderRadius: 2,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    borderColor: '#2196F3',
                    background: 'rgba(33, 150, 243, 0.1)',
                  },
                }}
              >
                {t('cart.viewFullCart')}
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Snackbar */}
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
        <DialogTitle sx={{ color: 'white', fontWeight: 700, wordBreak: 'break-word' }}>
          {t('cart.removeItem')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)', wordBreak: 'break-word' }}>
            {t('cart.removeItemConfirm', { name: deleteDialog.itemName })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, itemId: null, itemName: '' })}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={confirmRemove}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #2196F3, #FF4081)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2, #C2185B)',
              },
              minWidth: 'fit-content',
              whiteSpace: 'nowrap',
            }}
          >
            {t('cart.remove')}
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
        <DialogTitle sx={{ color: 'white', fontWeight: 700, wordBreak: 'break-word' }}>
          {t('cart.clearCart')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)', wordBreak: 'break-word' }}>
            {t('cart.clearCartConfirm')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setClearDialog(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={confirmClearCart}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #2196F3, #FF4081)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2, #C2185B)',
              },
              minWidth: 'fit-content',
              whiteSpace: 'nowrap',
            }}
          >
            {t('cart.clearAll')}
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
        <DialogTitle sx={{ color: 'white', fontWeight: 700, wordBreak: 'break-word' }}>
          {t('cart.checkoutUnavailable')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)', wordBreak: 'break-word' }}>
            {t('cart.checkoutUnavailableDesc')}
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
              minWidth: 'fit-content',
              whiteSpace: 'nowrap',
            }}
          >
            {t('common.ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartSidebar;

