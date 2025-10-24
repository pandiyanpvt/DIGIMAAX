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
  IconButton,
  Chip,
  Divider,
  Badge,
} from '@mui/material';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Product images
import mugImg from '../assets/products/shop/Customized Mug.jpg';
import clockImg from '../assets/products/shop/Customized Wall Clock.jpg';
import shirtImg from '../assets/products/shop/shirt.jpg';
import tshirtImg from '../assets/products/shop/tshit.jpg';

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { getCartTotalItems, addToCart } = useCart();
  const { isAuthenticated, openSignInModal } = useAuth();
  
  // State management
  const [selectedColor, setSelectedColor] = useState('white');
  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  // Product data
  const product = {
    id: 1,
    title: 'Customized T-Shirt',
    price: 5000,
    currency: 'LKR',
    description: 'Step into style and brand identity with Digimaax\'s premium unisex customized T-shirts — tailored for both men and women, and perfect for any occasion. Whether you\'re promoting your business, hosting an event, or outfitting your team, our T-shirts combine comfort, durability, and standout design.',
    images: [
      shirtImg,
      tshirtImg,
      mugImg,
      clockImg,
      shirtImg,
    ],
    colors: [
      { name: 'White', value: 'white', hex: '#ffffff' },
      { name: 'Dark Grey', value: 'darkgrey', hex: '#424242' },
      { name: 'Red', value: 'red', hex: '#f44336' },
      { name: 'Purple', value: 'purple', hex: '#9c27b0' },
      { name: 'Light Blue', value: 'lightblue', hex: '#03a9f4' },
      { name: 'Green', value: 'green', hex: '#4caf50' },
      { name: 'Pink', value: 'pink', hex: '#e91e63' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  };

  const relatedProducts = [
    { id: 1, title: 'Customized T-Shirt', image: shirtImg, price: 5000 },
    { id: 2, title: 'Customized T-Shirt', image: tshirtImg, price: 5000 },
    { id: 3, title: 'Customized T-Shirt', image: mugImg, price: 5000 },
    { id: 4, title: 'Customized T-Shirt', image: clockImg, price: 5000 },
  ];

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openSignInModal();
      return;
    }
    addToCart(product.id, {
      title: product.title,
      image: product.images[0],
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    });
    console.log('Added to cart:', { product, color: selectedColor, size: selectedSize, quantity });
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      openSignInModal();
      return;
    }
    // Add to cart first, then navigate to checkout
    addToCart(product.id, {
      title: product.title,
      image: product.images[0],
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    });
    navigate('/checkout');
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
                Product Details
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
        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Thumbnail Images */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {product.images.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      '&:hover': { border: '2px solid #1976d2' },
                    }}
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Main Product Image */}
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 500,
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={5}>
            <Box sx={{ pl: { md: 2 } }}>
              {/* Product Title */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#2c2c2c',
                  mb: 2,
                  fontFamily: 'sans-serif',
                }}
              >
                {product.title}
              </Typography>

              {/* Price */}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: '#1976d2',
                  mb: 3,
                }}
              >
                {product.price} {product.currency}
              </Typography>

              {/* Color Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2c2c2c' }}>
                  Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {product.colors.map((color) => (
                    <Box
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: color.hex,
                        cursor: 'pointer',
                        border: selectedColor === color.value ? '3px solid #1976d2' : '2px solid #e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Size Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2c2c2c' }}>
                  Size
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'contained' : 'outlined'}
                      onClick={() => setSelectedSize(size)}
                      sx={{
                        minWidth: 50,
                        height: 40,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        backgroundColor: selectedSize === size ? '#1976d2' : 'transparent',
                        borderColor: '#1976d2',
                        color: selectedSize === size ? 'white' : '#1976d2',
                        '&:hover': {
                          backgroundColor: selectedSize === size ? '#1565c0' : '#e3f2fd',
                        },
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </Box>
              </Box>

              {/* Quantity Selector */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2c2c2c' }}>
                  Quantity
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    p: 1,
                    width: 'fit-content',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center', fontWeight: 'bold' }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                  variant="outlined"
                  startIcon={<ShoppingBagIcon />}
                  onClick={handleAddToCart}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    fontWeight: 'bold',
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                      borderColor: '#1565c0',
                    },
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  onClick={handleBuyNow}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    fontWeight: 'bold',
                    backgroundColor: '#2c2c2c',
                    '&:hover': {
                      backgroundColor: '#424242',
                    },
                  }}
                >
                  BUY NOW
                </Button>
              </Box>

              {/* Heart Icon */}
              <IconButton
                onClick={() => setIsLiked(!isLiked)}
                sx={{
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <FavoriteIcon
                  sx={{
                    color: isLiked ? '#ff9800' : '#9e9e9e',
                    fontSize: 24,
                  }}
                />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Product Description */}
        <Box sx={{ mt: 6, mb: 6 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#2c2c2c',
              mb: 3,
              fontFamily: 'sans-serif',
            }}
          >
            {product.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              lineHeight: 1.8,
              fontSize: '1.1rem',
              maxWidth: '80%',
            }}
          >
            {product.description}
          </Typography>
        </Box>

        {/* Related Products */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#2c2c2c',
              mb: 4,
              textAlign: 'center',
              fontFamily: 'sans-serif',
            }}
          >
            Related Products
          </Typography>
          
          <Grid container spacing={3}>
            {relatedProducts.map((item, index) => (
              <Grid key={item.id} item xs={12} sm={6} md={3}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: 350,
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
                    <Box sx={{ position: 'relative', height: 250 }}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={item.image}
                        alt={item.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      
                      {/* Heart Icon */}
                      <IconButton
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
                            color: '#ff9800',
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
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetailPage;
