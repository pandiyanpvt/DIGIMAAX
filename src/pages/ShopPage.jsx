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
  CardActions,
  Button,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Badge,
} from '@mui/material';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../context/CartContext';

// Product images
import mugImg from '../assets/products/shop/Customized Mug.jpg';
import clockImg from '../assets/products/shop/Customized Wall Clock.jpg';
import shirtImg from '../assets/products/shop/shirt.jpg';
import tshirtImg from '../assets/products/shop/tshit.jpg';
import shopHero from '../assets/hero/shophero.jpg';

// Service images
import serverStorageImg from '../assets/products/services/Server Storage.jpg';
import cctvImg from '../assets/products/services/CCTVInstallation.jpg';
import printedModelsImg from '../assets/products/services/PrintedModels.jpg';
import desiImg from '../assets/products/services/Desi.jpg';

const shopItems = [
  { id: 1, title: 'Customized Mug', image: mugImg, tag: 'Popular' },
  { id: 2, title: 'Customized Wall Clock', image: clockImg, tag: 'New' },
  { id: 3, title: 'Custom Shirt', image: shirtImg, tag: 'Trending' },
  { id: 4, title: 'Custom T‑Shirt', image: tshirtImg, tag: 'Bestseller' },
];

const recentlyViewedItems = [
  { id: 1, title: 'Customized Wall Clock', image: clockImg, isLiked: true },
  { id: 2, title: 'Customized Mug', image: mugImg, isLiked: false },
  { id: 3, title: 'Customized T - Shirt', image: shirtImg, isLiked: true },
  { id: 4, title: 'Customized T - Shirt', image: tshirtImg, isLiked: false },
];

const servicesItems = [
  { id: 1, title: 'Server Storage', image: serverStorageImg, isLiked: true },
  { id: 2, title: 'CCTV Installation', image: cctvImg, isLiked: true },
  { id: 3, title: '3D Printed Models', image: printedModelsImg, isLiked: true },
  { id: 4, title: 'Interior Designing', image: desiImg, isLiked: true },
  { id: 5, title: 'LED Boards', image: serverStorageImg, isLiked: false },
  { id: 6, title: 'POS Systems', image: cctvImg, isLiked: true },
  { id: 7, title: 'Product Advertisement', image: printedModelsImg, isLiked: true },
  { id: 8, title: 'Wall Designs', image: desiImg, isLiked: false },
  { id: 9, title: 'Opt Lasers', image: serverStorageImg, isLiked: true },
  { id: 10, title: 'Blackberry Jam', image: cctvImg, isLiked: true },
  { id: 11, title: 'Prompts (3D Animation)', image: printedModelsImg, isLiked: true },
  { id: 12, title: 'Woman Magazine', image: desiImg, isLiked: true },
];

const ShopPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartDrawerOpen, setCartDrawerOpen, addToCart, removeFromCart, updateCartQuantity, getCartTotalItems, getCartTotalPrice } = useCart();
  
  // State management for likes
  const [likedItems, setLikedItems] = useState(new Set());
  const [showAllRecentlyViewed, setShowAllRecentlyViewed] = useState(false);

  // Function to toggle like status
  const toggleLike = (itemId) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Function to handle add to cart with item details
  const handleAddToCart = (itemId, itemDetails) => {
    addToCart(itemId, itemDetails);
    console.log(`Item ${itemId} added to cart`);
  };

  // Function to navigate to product detail page
  const navigateToProductDetail = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  // Function to handle show more recently viewed
  const handleShowMore = () => {
    setShowAllRecentlyViewed(!showAllRecentlyViewed);
  };

  // Helper function to get item details by ID
  const getItemDetails = (itemId) => {
    // Check in shopItems
    const shopItem = shopItems.find(item => item.id.toString() === itemId);
    if (shopItem) return shopItem;
    
    // Check in recentlyViewedItems
    const recentItem = recentlyViewedItems.find(item => `recent-${item.id}` === itemId);
    if (recentItem) return recentItem;
    
    // Check in servicesItems
    const serviceItem = servicesItems.find(item => `service-${item.id}` === itemId);
    if (serviceItem) return serviceItem;
    
    return null;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 0,
        pb: 8,
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 'calc(100vh - 56px)', md: 'calc(100vh - 64px)' },
          mb: 4,
          borderRadius: 0,
          overflow: 'hidden',
          mx: 0,
        }}
      >
        <Box
          component="img"
          src={shopHero}
          alt="Shop hero"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'brightness(0.9)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.0) 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            p: { xs: 2, md: 4 },
          }}
        >
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
            Shop
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Shop Items Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                mb: 4,
                fontWeight: 'bold',
                color: '#2c2c2c',
                fontFamily: 'sans-serif',
              }}
            >
              Featured Products
            </Typography>
            
            <Grid container spacing={3}>
              {shopItems.map((item, index) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: 400,
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        borderRadius: 2,
                        overflow: 'hidden',
                        position: 'relative',
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {/* Image Container */}
                      <Box 
                        sx={{ position: 'relative', height: 250, cursor: 'pointer' }}
                        onClick={() => navigateToProductDetail(item.id)}
                      >
                        <CardMedia
                          component="img"
                          height="250"
                          image={item.image}
                          alt={item.title}
                          sx={{ objectFit: 'cover' }}
                        />
                        
                        {/* Tag */}
                        <Chip
                          label={item.tag}
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            backgroundColor: '#1976d2',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                          }}
                        />
                        
                        {/* Heart Icon */}
                        <IconButton
                          onClick={() => toggleLike(item.id)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.9)',
                            },
                          }}
                          size="small"
                        >
                          <FavoriteIcon
                            sx={{
                              color: likedItems.has(item.id) ? '#ff9800' : '#9e9e9e',
                              fontSize: 20,
                            }}
                          />
                        </IconButton>
                      </Box>

                      {/* Content */}
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: 'sans-serif',
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            mb: 1,
                            color: '#2c2c2c',
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            fontSize: '0.9rem',
                            mb: 2,
                          }}
                        >
                          Customize your own {item.title.toLowerCase()} with our premium quality materials.
                        </Typography>
                      </CardContent>

                      {/* Actions */}
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<ShoppingBagIcon />}
                          onClick={() => handleAddToCart(item.id, {
                            title: item.title,
                            image: item.image,
                            price: 5000, // Default price
                            color: 'White',
                            size: 'L',
                          })}
                          sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': {
                              backgroundColor: '#1565c0',
                            },
                            fontWeight: 'bold',
                            py: 1.5,
                          }}
                        >
                          Add to Cart
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      </Container>

      {/* Recently Viewed Section */}
      <Box sx={{ mt: 8, mb: 4 }}>
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#2c2c2c',
            py: 2,
            px: { xs: 2, md: 4 },
            borderTop: '3px solid #1976d2',
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: 'sans-serif',
                }}
              >
                Recently Viewed
              </Typography>
              <Box
                onClick={handleShowMore}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                <Typography sx={{ mr: 1, fontFamily: 'sans-serif' }}>
                  {showAllRecentlyViewed ? 'Show Less' : 'Show More'}
                </Typography>
                <KeyboardArrowRightIcon 
                  sx={{ 
                    transform: showAllRecentlyViewed ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }} 
                />
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Product Cards Container */}
        <Box
          sx={{
            backgroundColor: '#f5f5f5',
            py: 3,
            px: { xs: 2, md: 4 },
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': {
                  height: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#e0e0e0',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#1976d2',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              {(showAllRecentlyViewed ? recentlyViewedItems : recentlyViewedItems.slice(0, 2)).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      minWidth: 280,
                      maxWidth: 280,
                      height: 320,
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Image Container */}
                    <Box sx={{ position: 'relative', height: 200 }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.image}
                        alt={item.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      {/* Heart Icon */}
                      <IconButton
                        onClick={() => toggleLike(`recent-${item.id}`)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.9)',
                          },
                        }}
                        size="small"
                      >
                        <FavoriteIcon
                          sx={{
                            color: likedItems.has(`recent-${item.id}`) ? '#ff9800' : '#9e9e9e',
                            fontSize: 20,
                          }}
                        />
                      </IconButton>
                    </Box>

                    {/* Title Bar */}
                    <Box
                      sx={{
                        backgroundColor: '#000',
                        color: 'white',
                        p: 2,
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'sans-serif',
                          fontWeight: 500,
                          fontSize: '1rem',
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ml: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: '1px',
                            height: '20px',
                            backgroundColor: 'white',
                            mr: 1,
                          }}
                        />
                        <IconButton
                          onClick={() => handleAddToCart(`recent-${item.id}`, {
                            title: item.title,
                            image: item.image,
                            price: 5000,
                            color: 'White',
                            size: 'L',
                          })}
                          sx={{
                            color: 'white',
                            p: 0.5,
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                          }}
                        >
                          <ShoppingBagIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Services Section */}
      <Box sx={{ mt: 8, mb: 4 }}>
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#2c2c2c',
            py: 2,
            px: { xs: 2, md: 4 },
            borderTop: '3px solid #1976d2',
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: 'sans-serif',
                }}
              >
                Services
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Services Grid Container */}
        <Box
          sx={{
            backgroundColor: '#f5f5f5',
            py: 3,
            px: { xs: 2, md: 4 },
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={2}>
              {servicesItems.map((item, index) => (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card
                    sx={{
                        height: 280,
                      display: 'flex',
                      flexDirection: 'column',
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        borderRadius: 2,
                        overflow: 'hidden',
                        position: 'relative',
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {/* Image Container */}
                      <Box sx={{ position: 'relative', height: 200, flexGrow: 1 }}>
                      <CardMedia
                        component="img"
                          height="200"
                        image={item.image}
                        alt={item.title}
                        sx={{ objectFit: 'cover' }}
                      />
                        {/* Heart Icon */}
                        <IconButton
                          onClick={() => toggleLike(`service-${item.id}`)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.9)',
                            },
                          }}
                        size="small"
                        >
                          <FavoriteIcon
                            sx={{
                              color: likedItems.has(`service-${item.id}`) ? '#ff9800' : '#9e9e9e',
                              fontSize: 20,
                            }}
                          />
                        </IconButton>
                    </Box>

                      {/* Title Bar */}
                      <Box
                        sx={{
                          backgroundColor: '#000',
                          color: 'white',
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          minHeight: 60,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: 'sans-serif',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            lineHeight: 1.2,
                            flex: 1,
                          }}
                        >
                        {item.title}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ml: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: '1px',
                            height: '20px',
                            backgroundColor: 'white',
                            mr: 1,
                          }}
                        />
                        <IconButton
                          onClick={() => handleAddToCart(`service-${item.id}`, {
                            title: item.title,
                            image: item.image,
                            price: 3000, // Service price
                            color: 'N/A',
                            size: 'N/A',
                          })}
                          sx={{
                            color: 'white',
                            p: 0.5,
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                          }}
                        >
                          <ShoppingBagIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Box>
                      </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
      </Container>
        </Box>
      </Box>

      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c2c2c' }}>
              Shopping Cart
            </Typography>
            <IconButton onClick={() => setCartDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Cart Items */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {cartItems.size === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <ShoppingBagIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#666' }}>
                  Your cart is empty
                </Typography>
                <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                  Add some items to get started
                </Typography>
              </Box>
            ) : (
              <List>
                {Array.from(cartItems.entries()).map(([itemId, item]) => {
                  return (
                    <ListItem key={itemId} sx={{ backgroundColor: 'white', mb: 1, borderRadius: 1 }}>
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
                      <ListItemText
                        primary={item.title}
                        secondary={`${item.price * item.quantity} LKR`}
                        sx={{ flexGrow: 1 }}
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Button
                            size="small"
                            onClick={() => updateCartQuantity(itemId, item.quantity - 1)}
                            sx={{ minWidth: 'auto', p: 0.5 }}
                          >
                            -
                          </Button>
                          <Typography sx={{ minWidth: 20, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => updateCartQuantity(itemId, item.quantity + 1)}
                            sx={{ minWidth: 'auto', p: 0.5 }}
                          >
                            +
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => removeFromCart(itemId)}
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Box>

          {/* Footer */}
          {cartItems.size > 0 && (
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total ({getCartTotalItems()} items):
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  ${getCartTotalPrice()}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('/checkout');
                }}
                sx={{
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#1565c0' },
                  py: 1.5,
                  fontWeight: 'bold',
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default ShopPage;


