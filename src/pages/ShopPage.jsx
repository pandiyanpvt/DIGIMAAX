import React, { useState, useMemo } from 'react';
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
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  InputAdornment,
  Rating,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Snackbar,
  Alert,
  Fade,
  Skeleton,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Product images
import mugImg from '../assets/products/shop/Customized Mug.jpg';
import clockImg from '../assets/products/shop/Customized Wall Clock.jpg';
import shirtImg from '../assets/products/shop/shirt.jpg';
import tshirtImg from '../assets/products/shop/tshit.jpg';
import shopHero from '../assets/hero/shophero.jpg';

// Products data with realistic information
const products = [
  { 
    id: 1, 
    name: 'Customized Photo Mug', 
    category: 'For Home', 
    price: 24.99, 
    rating: 4.8, 
    reviews: 245, 
    image: mugImg,
    badge: 'Best Seller',
    description: 'Personalized ceramic mug with your photos',
    inStock: true,
  },
  { 
    id: 2, 
    name: 'Designer Wall Clock', 
    category: 'For Home', 
    price: 39.99, 
    rating: 4.9, 
    reviews: 189, 
    image: clockImg,
    badge: 'New Arrival',
    description: 'Modern wall clock with custom design',
    inStock: true,
  },
  { 
    id: 3, 
    name: 'Premium Polo Shirt', 
    category: 'For Storage', 
    price: 34.99, 
    rating: 4.7, 
    reviews: 312, 
    image: shirtImg,
    badge: 'Best Seller',
    description: 'High-quality branded polo shirt',
    inStock: true,
  },
  { 
    id: 4, 
    name: 'Custom Printed T-Shirt', 
    category: 'For Storage', 
    price: 19.99, 
    rating: 4.6, 
    reviews: 428, 
    image: tshirtImg,
    badge: 'On Discount',
    oldPrice: 29.99,
    description: 'Personalized t-shirt with your design',
    inStock: true,
  },
  { 
    id: 5, 
    name: 'Wireless Earbuds Pro', 
    category: 'For Music', 
    price: 89.99, 
    rating: 4.9, 
    reviews: 567, 
    image: mugImg,
    badge: 'New Arrival',
    description: 'Premium wireless earbuds with ANC',
    inStock: true,
  },
  { 
    id: 6, 
    name: 'Studio Headphones', 
    category: 'For Music', 
    price: 149.99, 
    rating: 5.0, 
    reviews: 234, 
    image: clockImg,
    badge: 'Best Seller',
    description: 'Professional studio-grade headphones',
    inStock: true,
  },
  { 
    id: 7, 
    name: 'Smart Phone Stand', 
    category: 'For Phone', 
    price: 16.99, 
    rating: 4.5, 
    reviews: 178, 
    image: shirtImg,
    badge: null,
    description: 'Adjustable phone holder for desk',
    inStock: true,
  },
  { 
    id: 8, 
    name: 'Phone Case Premium', 
    category: 'For Phone', 
    price: 12.99, 
    rating: 4.4, 
    reviews: 445, 
    image: tshirtImg,
    badge: 'On Discount',
    oldPrice: 19.99,
    description: 'Durable protective phone case',
    inStock: true,
  },
  { 
    id: 9, 
    name: 'Bluetooth Speaker', 
    category: 'For Music', 
    price: 59.99, 
    rating: 4.8, 
    reviews: 389, 
    image: mugImg,
    badge: null,
    description: 'Portable wireless speaker',
    inStock: true,
  },
  { 
    id: 10, 
    name: 'LED Desk Lamp', 
    category: 'For Home', 
    price: 44.99, 
    rating: 4.7, 
    reviews: 156, 
    image: clockImg,
    badge: 'New Arrival',
    description: 'Modern LED lamp with touch control',
    inStock: true,
  },
  { 
    id: 11, 
    name: 'Wireless Charger', 
    category: 'For Phone', 
    price: 29.99, 
    rating: 4.6, 
    reviews: 298, 
    image: shirtImg,
    badge: null,
    description: 'Fast wireless charging pad',
    inStock: true,
  },
  { 
    id: 12, 
    name: 'Canvas Print Set', 
    category: 'For Home', 
    price: 79.99, 
    rating: 4.9, 
    reviews: 167, 
    image: tshirtImg,
    badge: 'Best Seller',
    description: 'Premium canvas wall art set',
    inStock: true,
  },
];

const recommendations = [
  { 
    id: 101, 
    name: 'Premium Travel Mug', 
    category: 'For Home', 
    price: 29.99, 
    rating: 4.9, 
    reviews: 234, 
    image: clockImg,
    badge: 'Trending',
    inStock: true,
  },
  { 
    id: 102, 
    name: 'Noise Cancelling Headset', 
    category: 'For Music', 
    price: 129.99, 
    rating: 5.0, 
    reviews: 412, 
    image: shirtImg,
    badge: 'Top Rated',
    inStock: true,
  },
  { 
    id: 103, 
    name: 'Smart Watch Band', 
    category: 'For Phone', 
    price: 19.99, 
    rating: 4.7, 
    reviews: 189, 
    image: tshirtImg,
    badge: 'Popular',
    inStock: true,
  },
];

const ShopPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, openSignInModal } = useAuth();
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState('All Product');
  const [selectedBadge, setSelectedBadge] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [favorites, setFavorites] = useState(new Set());
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const itemsPerPage = 9;
  const maxPrice = 200;

  // Toggle favorite
  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        showSnackbar('Removed from favorites', 'info');
      } else {
        newFavorites.add(productId);
        showSnackbar('Added to favorites', 'success');
      }
      return newFavorites;
    });
  };

  // Snackbar handler
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Add to cart handler with notification
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
    showSnackbar(`${product.name} added to cart!`, 'success');
  };

  // Buy now handler
  const handleBuyNow = (product) => {
    if (!isAuthenticated) {
      openSignInModal();
      return;
    }
    navigate(`/product/${product.id}`);
  };

  // Newsletter subscription
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    
    setEmailError('');
    showSnackbar('Successfully subscribed to newsletter!', 'success');
    setEmail('');
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('All Product');
    setSelectedBadge('');
    setSearchQuery('');
    setSortBy('featured');
    setPriceRange([0, maxPrice]);
    setCurrentPage(1);
    showSnackbar('Filters reset', 'info');
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'All Product' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBadge = !selectedBadge || product.badge === selectedBadge;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesCategory && matchesSearch && matchesBadge && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // 'featured' - keep original order
        break;
    }

    return filtered;
  }, [selectedCategory, searchQuery, selectedBadge, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, selectedBadge, priceRange, sortBy]);

  // Recommendations navigation
  const nextRecommendation = () => {
    setRecommendationIndex((prev) => 
      prev + 1 >= recommendations.length ? 0 : prev + 1
    );
  };

  const prevRecommendation = () => {
    setRecommendationIndex((prev) => 
      prev - 1 < 0 ? recommendations.length - 1 : prev - 1
    );
  };

  // Get category count
  const getCategoryCount = (category) => {
    if (category === 'All Product') return products.length;
    return products.filter(p => p.category === category).length;
  };

  return (
    <Box sx={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
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

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '300px', md: '400px' },
          backgroundImage: `url(${shopHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
          mt: { xs: 7, md: 8 },
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
          }}
        />
        
        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              sx={{
                fontSize: { xs: '5rem', md: '10rem', lg: '12rem' },
                fontWeight: 300,
                color: 'rgba(0, 0, 0, 0.08)',
                letterSpacing: '0.05em',
                lineHeight: 1,
                mb: 1,
              }}
            >
              shop
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#333',
                fontWeight: 500,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              Give All You Need
            </Typography>
          </motion.div>
        </Box>

        {/* Search Bar (Top Right) */}
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#666' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <ClearIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              width: { xs: '200px', md: '300px' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#333',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#000',
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl">
        {/* Filter Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: '#666' }}>
              {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} found
            </Typography>
            {(selectedCategory !== 'All Product' || selectedBadge || searchQuery || 
              priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={resetFilters}
                sx={{ textTransform: 'none' }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
          
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="featured">Featured</MenuItem>
              <MenuItem value="popular">Most Popular</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="name">Name: A to Z</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {/* Left Sidebar */}
          <Grid item xs={12} md={2.5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: 'white',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                position: 'sticky',
                top: 100,
              }}
            >
              {/* Category Filter */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <FilterListIcon sx={{ fontSize: 18 }} />
                  Category
                </Typography>

                <RadioGroup
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {['All Product', 'For Home', 'For Music', 'For Phone', 'For Storage'].map((category) => (
                    <FormControlLabel
                      key={category}
                      value={category}
                      control={<Radio size="small" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                            {category}
                          </Typography>
                          <Chip
                            label={getCategoryCount(category)}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              backgroundColor: selectedCategory === category ? '#000' : '#f5f5f5',
                              color: selectedCategory === category ? 'white' : '#666',
                            }}
                          />
                        </Box>
                      }
                      sx={{ mb: 1, mr: 0, width: '100%' }}
                    />
                  ))}
                </RadioGroup>
              </Box>

              {/* Badge Filter */}
              <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3, mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  Special Filters
                </Typography>
                
                <RadioGroup
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value)}
                >
                  <FormControlLabel
                    value=""
                    control={<Radio size="small" />}
                    label={
                      <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                        All Products
                      </Typography>
                    }
                    sx={{ mb: 1 }}
                  />
                  {['New Arrival', 'Best Seller', 'On Discount'].map((badge) => (
                    <FormControlLabel
                      key={badge}
                      value={badge}
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                          {badge}
                        </Typography>
                      }
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
              </Box>

              {/* Price Range Filter */}
              <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  Price Range
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={(e, newValue) => setPriceRange(newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={maxPrice}
                  valueLabelFormat={(value) => `$${value}`}
                  sx={{
                    color: '#000',
                    '& .MuiSlider-thumb': {
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 8px rgba(0, 0, 0, 0.16)',
                      },
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    ${priceRange[0]}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    ${priceRange[1]}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Products Grid */}
          <Grid item xs={12} md={9.5}>
            {/* Empty State */}
            {paginatedProducts.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                }}
              >
                <Typography variant="h5" sx={{ mb: 2, color: '#666' }}>
                  No products found
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#999' }}>
                  Try adjusting your filters or search query
                </Typography>
                <Button
                  variant="contained"
                  onClick={resetFilters}
                  sx={{
                    backgroundColor: '#000',
                    '&:hover': { backgroundColor: '#333' },
                    textTransform: 'none',
                  }}
                >
                  Reset All Filters
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                <AnimatePresence mode="wait">
                  {paginatedProducts.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'white',
                            borderRadius: 2,
                            border: '1px solid #e0e0e0',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                              transform: 'translateY(-6px)',
                            },
                          }}
                        >
                          {/* Top Section with Badges and Favorite */}
                          <Box sx={{ p: 2, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              <Chip
                                label={product.category.replace('For ', '')}
                                size="small"
                                sx={{
                                  backgroundColor: '#f5f5f5',
                                  color: '#666',
                                  fontSize: '0.7rem',
                                  fontWeight: 500,
                                  height: 22,
                                }}
                              />
                              {product.badge && (
                                <Chip
                                  label={product.badge}
                                  size="small"
                                  sx={{
                                    backgroundColor: 
                                      product.badge === 'New Arrival' ? '#4caf50' :
                                      product.badge === 'Best Seller' ? '#ff9800' :
                                      product.badge === 'On Discount' ? '#f44336' :
                                      '#2196f3',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    height: 22,
                                  }}
                                />
                              )}
                            </Box>
                            
                            <Tooltip title={favorites.has(product.id) ? "Remove from favorites" : "Add to favorites"}>
                              <IconButton
                                size="small"
                                onClick={() => toggleFavorite(product.id)}
                                sx={{
                                  color: favorites.has(product.id) ? '#f44336' : '#ccc',
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'scale(1.2)',
                                    color: '#f44336',
                                  },
                                }}
                                aria-label={favorites.has(product.id) ? "Remove from favorites" : "Add to favorites"}
                              >
                                {favorites.has(product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                              </IconButton>
                            </Tooltip>
                          </Box>

                          {/* Product Image */}
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

                          {/* Product Info */}
                          <CardContent sx={{ flexGrow: 1, p: 2 }}>
                            <Tooltip title={product.name}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                  mb: 0.5,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    color: '#2196f3',
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
                                color: '#999',
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {product.description}
                            </Typography>

                            {/* Rating */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Rating
                                value={product.rating}
                                precision={0.1}
                                size="small"
                                readOnly
                                sx={{ fontSize: '1rem' }}
                              />
                              <Typography
                                variant="body2"
                                sx={{ ml: 1, color: '#666', fontSize: '0.75rem' }}
                              >
                                {product.rating} ({product.reviews})
                              </Typography>
                            </Box>

                            {/* Price */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontSize: '1.35rem',
                                  fontWeight: 700,
                                  color: product.oldPrice ? '#f44336' : '#000',
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
                                      color: '#999',
                                      textDecoration: 'line-through',
                                    }}
                                  >
                                    ${product.oldPrice.toFixed(2)}
                                  </Typography>
                                  <Chip
                                    label={`-${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%`}
                                    size="small"
                                    sx={{
                                      backgroundColor: '#ffebee',
                                      color: '#f44336',
                                      fontWeight: 600,
                                      fontSize: '0.7rem',
                                      height: 20,
                                    }}
                                  />
                                </>
                              )}
                            </Box>
                          </CardContent>

                          {/* Action Buttons */}
                          <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                            <Tooltip title="Add to shopping cart">
                              <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<ShoppingCartIcon />}
                                onClick={() => handleAddToCart(product)}
                                sx={{
                                  borderColor: '#e0e0e0',
                                  color: '#333',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  fontSize: '0.85rem',
                                  '&:hover': {
                                    borderColor: '#000',
                                    backgroundColor: '#f5f5f5',
                                    transform: 'translateY(-2px)',
                                  },
                                  transition: 'all 0.2s',
                                }}
                              >
                                Add
                              </Button>
                            </Tooltip>
                            <Tooltip title="View product details">
                              <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleBuyNow(product)}
                                sx={{
                                  backgroundColor: '#000',
                                  color: 'white',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  fontSize: '0.85rem',
                                  '&:hover': {
                                    backgroundColor: '#333',
                                    transform: 'translateY(-2px)',
                                  },
                                  transition: 'all 0.2s',
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
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Fade in={true}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 6,
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Button
                    startIcon={<KeyboardArrowLeftIcon />}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    sx={{
                      textTransform: 'none',
                      color: currentPage === 1 ? '#ccc' : '#666',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: currentPage === 1 ? 'transparent' : '#f5f5f5',
                      },
                    }}
                    aria-label="Previous page"
                  >
                    Previous
                  </Button>

                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 500,
                        '&.Mui-selected': {
                          backgroundColor: '#000',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#333',
                          },
                        },
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                        },
                      },
                    }}
                  />

                  <Button
                    endIcon={<KeyboardArrowRightIcon />}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    sx={{
                      textTransform: 'none',
                      color: currentPage === totalPages ? '#ccc' : '#666',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: currentPage === totalPages ? 'transparent' : '#f5f5f5',
                      },
                    }}
                    aria-label="Next page"
                  >
                    Next
                  </Button>
                </Box>
              </Fade>
            )}

            {/* Explore Recommendations */}
            <Box sx={{ mt: 8, mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '1.5rem' }}>
                  ⭐ Explore our recommendations
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Previous">
                    <IconButton
                      size="small"
                      onClick={prevRecommendation}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: '#000',
                          color: 'white',
                          borderColor: '#000',
                        },
                        transition: 'all 0.2s',
                      }}
                      aria-label="Previous recommendation"
                    >
                      <KeyboardArrowLeftIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Next">
                    <IconButton
                      size="small"
                      onClick={nextRecommendation}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: '#000',
                          color: 'white',
                          borderColor: '#000',
                        },
                        transition: 'all 0.2s',
                      }}
                      aria-label="Next recommendation"
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <AnimatePresence mode="wait">
                  {recommendations.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'white',
                            borderRadius: 2,
                            border: '1px solid #e0e0e0',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                              transform: 'translateY(-6px)',
                            },
                          }}
                        >
                          <Box sx={{ p: 2, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Chip
                                label={product.category.replace('For ', '')}
                                size="small"
                                sx={{
                                  backgroundColor: '#f5f5f5',
                                  color: '#666',
                                  fontSize: '0.7rem',
                                  fontWeight: 500,
                                  height: 22,
                                }}
                              />
                              {product.badge && (
                                <Chip
                                  label={product.badge}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#2196f3',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    height: 22,
                                  }}
                                />
                              )}
                            </Box>
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
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {product.name}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Rating value={product.rating} precision={0.1} size="small" readOnly />
                              <Typography variant="body2" sx={{ ml: 1, color: '#666', fontSize: '0.75rem' }}>
                                {product.rating} ({product.reviews})
                              </Typography>
                            </Box>

                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: '1.35rem',
                                fontWeight: 700,
                                color: '#000',
                              }}
                            >
                              ${product.price.toFixed(2)}
                            </Typography>
                          </CardContent>

                          <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<ShoppingCartIcon />}
                              onClick={() => handleAddToCart(product)}
                              sx={{
                                borderColor: '#e0e0e0',
                                color: '#333',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                '&:hover': {
                                  borderColor: '#000',
                                  backgroundColor: '#f5f5f5',
                                },
                              }}
                            >
                              Add
                            </Button>
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => handleBuyNow(product)}
                              sx={{
                                backgroundColor: '#000',
                                color: 'white',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                '&:hover': {
                                  backgroundColor: '#333',
                                },
                              }}
                            >
                              Buy Now
                            </Button>
                          </CardActions>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            </Box>

            {/* Newsletter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Box
                component="form"
                onSubmit={handleNewsletterSubmit}
                sx={{
                  backgroundColor: '#2c2c2c',
                  borderRadius: 3,
                  p: { xs: 3, md: 5 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3,
                  mb: 6,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: { xs: '1.5rem', md: '2rem' },
                    }}
                  >
                    Ready to Get
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      fontSize: { xs: '1.5rem', md: '2rem' },
                    }}
                  >
                    Our New Stuff?
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: { xs: '100%', md: 'auto' },
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      type="email"
                      placeholder="Enter your email"
                      size="small"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                      }}
                      error={!!emailError}
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                        width: { xs: '100%', sm: '280px' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            border: emailError ? '2px solid #f44336' : 'none',
                          },
                          '&:hover fieldset': {
                            border: emailError ? '2px solid #f44336' : '1px solid #ddd',
                          },
                          '&.Mui-focused fieldset': {
                            border: '2px solid #2196f3',
                          },
                        },
                      }}
                      inputProps={{
                        'aria-label': 'Email address for newsletter',
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: 'white',
                        color: '#000',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      Subscribe
                    </Button>
                  </Box>
                  {emailError && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#ff6b6b',
                        fontSize: '0.75rem',
                        ml: 1,
                      }}
                    >
                      {emailError}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ textAlign: { xs: 'center', md: 'right' }, maxWidth: 400 }}>
                  <Typography variant="body2" sx={{ color: 'white', fontSize: '0.9rem', mb: 0.5, fontWeight: 500 }}>
                    📧 Stay Updated with DIGIMAAX
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                    Get exclusive deals, new arrivals, and special offers delivered to your inbox!
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ShopPage;
