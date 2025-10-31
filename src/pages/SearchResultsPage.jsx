import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Rating,
  Pagination,
  Tooltip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

// Import product images
import mugImg from '../assets/products/shop/Customized Mug.jpg';
import clockImg from '../assets/products/shop/Customized Wall Clock.jpg';
import shirtImg from '../assets/products/shop/shirt.jpg';
import tshirtImg from '../assets/products/shop/tshit.jpg';

// Products data - same as ShopPage
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

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isAuthenticated, openSignInModal } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'popular':
        return sorted.sort((a, b) => b.reviews - a.reviews);
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
    setCurrentPage(1);
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ color: 'white', mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
              Search Results
            </Typography>
            {searchQuery && (
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', ml: 2 }}>
                for "{searchQuery}"
              </Typography>
            )}
          </Box>

          {/* Search Bar */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}
          >
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#FFD700' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 215, 0, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 215, 0, 0.6)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFD700',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1,
                },
              }}
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 215, 0, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 215, 0, 0.6)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FFD700',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#FFD700',
                  },
                }}
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
            {sortedProducts.length} {sortedProducts.length === 1 ? 'result' : 'results'} found
          </Typography>
        </motion.div>

        {sortedProducts.length === 0 ? (
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
              No products found
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
              Try adjusting your search query
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
              Browse All Products
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              <AnimatePresence>
                {paginatedProducts.map((product, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -10 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          background: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: 3,
                          border: '2px solid rgba(255, 215, 0, 0.2)',
                          overflow: 'hidden',
                          transition: 'all 0.4s ease',
                          '&:hover': {
                            border: '2px solid rgba(255, 215, 0, 0.6)',
                            boxShadow: '0 15px 50px rgba(255, 215, 0, 0.3)',
                            transform: 'translateY(-10px)',
                          },
                        }}
                      >
                        <Box sx={{ p: 2, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            <Chip
                              label={product.category.replace('For ', '')}
                              size="small"
                              sx={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                height: 22,
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                              }}
                            />
                            {product.badge && (
                              <Chip
                                label={product.badge}
                                size="small"
                                sx={{
                                  background: 
                                    product.badge === 'New Arrival' ? '#4caf50' :
                                    product.badge === 'Best Seller' ? '#ff9800' :
                                    product.badge === 'On Discount' ? '#DC143C' :
                                    '#2196f3',
                                  color: 'white',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  height: 22,
                                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                }}
                              />
                            )}
                          </Box>
                          
                          <Tooltip title={isInWishlist(product.id) ? "Remove from favorites" : "Add to favorites"}>
                            <IconButton
                              size="small"
                              onClick={() => toggleWishlist(product.id)}
                              sx={{
                                color: isInWishlist(product.id) ? '#DC143C' : 'rgba(255, 255, 255, 0.5)',
                                transition: 'all 0.3s',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                  transform: 'scale(1.2)',
                                  color: '#DC143C',
                                  background: 'rgba(220, 20, 60, 0.2)',
                                },
                              }}
                            >
                              {isInWishlist(product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            </IconButton>
                          </Tooltip>
                        </Box>

                        <Box
                          sx={{
                            position: 'relative',
                            paddingTop: '75%',
                            overflow: 'hidden',
                            cursor: 'pointer',
                          }}
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <CardMedia
                            component="img"
                            image={product.image}
                            alt={product.name}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              padding: 2,
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                              },
                            }}
                          />
                        </Box>

                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          <Tooltip title={product.name}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                color: 'white',
                                transition: 'all 0.3s',
                                '&:hover': {
                                  color: '#FFD700',
                                },
                              }}
                              onClick={() => navigate(`/product/${product.id}`)}
                            >
                              {product.name}
                            </Typography>
                          </Tooltip>

                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '0.8rem',
                              color: 'rgba(255, 255, 255, 0.7)',
                              mb: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {product.description}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating
                              value={product.rating}
                              precision={0.1}
                              size="small"
                              readOnly
                              sx={{ 
                                fontSize: '1rem',
                                '& .MuiRating-iconFilled': {
                                  color: '#FFD700',
                                },
                                '& .MuiRating-iconEmpty': {
                                  color: 'rgba(255, 255, 255, 0.3)',
                                },
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem', fontWeight: 500 }}
                            >
                              {product.rating} ({product.reviews})
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: product.oldPrice ? '#DC143C' : '#FFD700',
                                textShadow: product.oldPrice ? '0 0 10px rgba(220, 20, 60, 0.5)' : '0 0 10px rgba(255, 215, 0, 0.5)',
                              }}
                            >
                              ${product.price.toFixed(2)}
                            </Typography>
                            {product.oldPrice && (
                              <>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: '1rem',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    textDecoration: 'line-through',
                                  }}
                                >
                                  ${product.oldPrice.toFixed(2)}
                                </Typography>
                                <Chip
                                  label={`-${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%`}
                                  size="small"
                                  sx={{
                                    background: '#DC143C',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.7rem',
                                    height: 20,
                                    boxShadow: '0 4px 15px rgba(220, 20, 60, 0.4)',
                                  }}
                                />
                              </>
                            )}
                          </Box>
                        </CardContent>

                        <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                          <Tooltip title="Add to shopping cart">
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<ShoppingCartIcon />}
                              onClick={() => handleAddToCart(product)}
                              sx={{
                                borderColor: 'rgba(255, 215, 0, 0.5)',
                                color: '#FFD700',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                background: 'rgba(255, 215, 0, 0.05)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                  borderColor: '#FFD700',
                                  background: 'rgba(255, 215, 0, 0.15)',
                                  transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s',
                              }}
                            >
                              Add
                            </Button>
                          </Tooltip>
                          <Tooltip title="View product details">
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => navigate(`/product/${product.id}`)}
                              sx={{
                                background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                                color: 'white',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #1976D2, #C2185B)',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 6px 20px rgba(33, 150, 243, 0.6)',
                                },
                                transition: 'all 0.3s',
                              }}
                            >
                              Buy Now
                            </Button>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      '&.Mui-selected': {
                        background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                        color: 'white',
                        border: '1px solid rgba(255, 215, 0, 0.5)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976D2, #C2185B)',
                        },
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default SearchResultsPage;

