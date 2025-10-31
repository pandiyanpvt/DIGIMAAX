import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  IconButton,
  Button,
  Chip,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Import product images
import mugImg from '../assets/products/shop/Customized Mug.jpg';
import clockImg from '../assets/products/shop/Customized Wall Clock.jpg';
import shirtImg from '../assets/products/shop/shirt.jpg';
import tshirtImg from '../assets/products/shop/tshit.jpg';

// Products data
const products = [
  { id: 1, name: 'Customized Photo Mug', category: 'For Home', price: 24.99, rating: 4.8, reviews: 245, image: mugImg, badge: 'Best Seller', description: 'Personalized ceramic mug with your photos', inStock: true },
  { id: 2, name: 'Designer Wall Clock', category: 'For Home', price: 39.99, rating: 4.9, reviews: 189, image: clockImg, badge: 'New Arrival', description: 'Modern wall clock with custom design', inStock: true },
  { id: 3, name: 'Premium Polo Shirt', category: 'For Storage', price: 34.99, rating: 4.7, reviews: 312, image: shirtImg, badge: 'Best Seller', description: 'High-quality branded polo shirt', inStock: true },
  { id: 4, name: 'Custom Printed T-Shirt', category: 'For Storage', price: 19.99, rating: 4.6, reviews: 428, image: tshirtImg, badge: 'On Discount', oldPrice: 29.99, description: 'Personalized t-shirt with your design', inStock: true },
  { id: 5, name: 'Wireless Earbuds Pro', category: 'For Music', price: 89.99, rating: 4.9, reviews: 567, image: mugImg, badge: 'New Arrival', description: 'Premium wireless earbuds with ANC', inStock: true },
  { id: 6, name: 'Studio Headphones', category: 'For Music', price: 149.99, rating: 5.0, reviews: 234, image: clockImg, badge: 'Best Seller', description: 'Professional studio-grade headphones', inStock: true },
  { id: 7, name: 'Smart Phone Stand', category: 'For Phone', price: 16.99, rating: 4.5, reviews: 178, image: shirtImg, badge: null, description: 'Adjustable phone holder for desk', inStock: true },
  { id: 8, name: 'Phone Case Premium', category: 'For Phone', price: 12.99, rating: 4.4, reviews: 445, image: tshirtImg, badge: 'On Discount', oldPrice: 19.99, description: 'Durable protective phone case', inStock: true },
  { id: 9, name: 'Bluetooth Speaker', category: 'For Music', price: 59.99, rating: 4.8, reviews: 389, image: mugImg, badge: null, description: 'Portable wireless speaker', inStock: true },
  { id: 10, name: 'LED Desk Lamp', category: 'For Home', price: 44.99, rating: 4.7, reviews: 156, image: clockImg, badge: 'New Arrival', description: 'Modern LED lamp with touch control', inStock: true },
  { id: 11, name: 'Wireless Charger', category: 'For Phone', price: 29.99, rating: 4.6, reviews: 298, image: shirtImg, badge: null, description: 'Fast wireless charging pad', inStock: true },
  { id: 12, name: 'Canvas Print Set', category: 'For Home', price: 79.99, rating: 4.9, reviews: 167, image: tshirtImg, badge: 'Best Seller', description: 'Premium canvas wall art set', inStock: true },
];

const CompareProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isAuthenticated, openSignInModal } = useAuth();

  // Get product IDs from URL params (e.g., ?ids=1,2,3)
  const productIds = useMemo(() => {
    const idsParam = searchParams.get('ids');
    if (!idsParam) return [];
    return idsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
  }, [searchParams]);

  const compareProducts = useMemo(() => {
    return products.filter(p => productIds.includes(p.id)).slice(0, 4); // Max 4 products
  }, [productIds]);

  const removeProduct = (productId) => {
    const newIds = productIds.filter(id => id !== productId);
    if (newIds.length === 0) {
      navigate('/shop');
    } else {
      setSearchParams({ ids: newIds.join(',') });
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      openSignInModal();
      return;
    }
    addToCart(product.id, {
      title: product.name,
      image: product.image,
      price: product.price,
      color: 'Default',
      size: 'Standard',
    });
  };

  if (compareProducts.length === 0) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)',
        minHeight: '100vh',
        pt: { xs: 7, md: 8 },
        pb: 8,
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ color: 'white', mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
              Compare Products
            </Typography>
          </Box>
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
            <Typography variant="h5" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
              No products to compare
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
              Add products from the shop to compare them side by side
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
              Browse Products
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  const comparisonRows = [
    { label: 'Image', key: 'image', type: 'image' },
    { label: 'Name', key: 'name', type: 'text' },
    { label: 'Price', key: 'price', type: 'price' },
    { label: 'Rating', key: 'rating', type: 'rating' },
    { label: 'Reviews', key: 'reviews', type: 'number' },
    { label: 'Category', key: 'category', type: 'text' },
    { label: 'Description', key: 'description', type: 'text' },
    { label: 'In Stock', key: 'inStock', type: 'boolean' },
    { label: 'Badge', key: 'badge', type: 'badge' },
  ];

  return (
    <Box sx={{ 
      background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)',
      minHeight: '100vh',
      pt: { xs: 7, md: 8 },
      pb: 8,
    }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{ color: 'white', mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                Compare Products
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {compareProducts.length} products
            </Typography>
          </Box>
        </motion.div>

        <TableContainer
          component={Paper}
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '2px solid rgba(255, 215, 0, 0.2)',
            overflowX: 'auto',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#FFD700', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  Features
                </TableCell>
                {compareProducts.map((product) => (
                  <TableCell
                    key={product.id}
                    align="center"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      minWidth: 250,
                      position: 'relative',
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => removeProduct(product.id)}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': { color: '#DC143C' },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    <Box
                      sx={{
                        width: '100%',
                        height: 150,
                        borderRadius: 2,
                        overflow: 'hidden',
                        mb: 1,
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '10px',
                        }}
                      />
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {comparisonRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell sx={{ color: '#FFD700', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    {row.label}
                  </TableCell>
                  {compareProducts.map((product) => (
                    <TableCell
                      key={product.id}
                      align="center"
                      sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
                    >
                      {row.type === 'image' && (
                        <Box
                          sx={{
                            width: 100,
                            height: 100,
                            margin: '0 auto',
                            borderRadius: 2,
                            overflow: 'hidden',
                            cursor: 'pointer',
                          }}
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              padding: '5px',
                            }}
                          />
                        </Box>
                      )}
                      {row.type === 'text' && (
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {product[row.key]}
                        </Typography>
                      )}
                      {row.type === 'price' && (
                        <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>
                          ${product[row.key].toFixed(2)}
                        </Typography>
                      )}
                      {row.type === 'rating' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Rating value={product[row.key]} precision={0.1} size="small" readOnly sx={{
                            '& .MuiRating-iconFilled': { color: '#FFD700' },
                            '& .MuiRating-iconEmpty': { color: 'rgba(255, 255, 255, 0.3)' },
                          }} />
                          <Typography variant="body2" sx={{ color: 'white' }}>
                            {product[row.key]}
                          </Typography>
                        </Box>
                      )}
                      {row.type === 'number' && (
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {product[row.key]}
                        </Typography>
                      )}
                      {row.type === 'boolean' && (
                        <Chip
                          label={product[row.key] ? 'In Stock' : 'Out of Stock'}
                          size="small"
                          sx={{
                            background: product[row.key] ? '#4caf50' : '#DC143C',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      )}
                      {row.type === 'badge' && (
                        <Box>
                          {product[row.key] ? (
                            <Chip
                              label={product[row.key]}
                              size="small"
                              sx={{
                                background: 
                                  product[row.key] === 'New Arrival' ? '#4caf50' :
                                  product[row.key] === 'Best Seller' ? '#ff9800' :
                                  product[row.key] === 'On Discount' ? '#DC143C' :
                                  '#2196f3',
                                color: 'white',
                                fontWeight: 700,
                              }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              -
                            </Typography>
                          )}
                        </Box>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell sx={{ color: '#FFD700', fontWeight: 600, borderBottom: 'none' }}>
                  Actions
                </TableCell>
                {compareProducts.map((product) => (
                  <TableCell key={product.id} align="center" sx={{ borderBottom: 'none' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => handleAddToCart(product)}
                        sx={{
                          background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1976D2, #C2185B)',
                          },
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/product/${product.id}`)}
                        sx={{
                          borderColor: 'rgba(255, 215, 0, 0.5)',
                          color: '#FFD700',
                          '&:hover': {
                            borderColor: '#FFD700',
                            background: 'rgba(255, 215, 0, 0.1)',
                          },
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default CompareProductsPage;

