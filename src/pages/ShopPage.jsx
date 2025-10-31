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
    <Box sx={{ 
      background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)',
      minHeight: '100vh',
      position: 'relative',
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

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '350px', md: '450px' },
          backgroundImage: `url(${shopHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 6,
          mt: { xs: 7, md: 8 },
          overflow: 'hidden',
        }}
      >
        {/* Overlay with gradient */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(41, 8, 93, 0.85) 0%, rgba(33, 150, 243, 0.6) 100%)',
            backdropFilter: 'blur(2px)',
          }}
        />
        
        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              sx={{
                fontSize: { xs: '5rem', md: '10rem', lg: '12rem' },
                fontWeight: 300,
                color: 'rgba(255, 255, 255, 0.1)',
                letterSpacing: '0.1em',
                lineHeight: 1,
                mb: 2,
                textShadow: '0 0 40px rgba(255, 215, 0, 0.3)',
              }}
            >
              shop
            </Typography>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: '#FFD700',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '2.5rem' },
                  textShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
                  mb: 1,
                }}
              >
                Give All You Need
              </Typography>
              <Box
                sx={{
                  width: '120px',
                  height: '4px',
                  background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                  borderRadius: '2px',
                  mx: 'auto',
                }}
              />
            </motion.div>
          </motion.div>
        </Box>

        {/* Search Bar (Top Right) - Glass effect */}
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
                  <SearchIcon sx={{ fontSize: 18, color: '#FFD700' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <ClearIcon sx={{ fontSize: 18, color: 'white' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              width: { xs: '200px', md: '300px' },
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
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ pb: 8 }}>
        {/* Filter Bar - Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              gap: 2,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              p: { xs: 2, md: 2.5 },
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              flexWrap: 'wrap',
              flex: { xs: '1 1 100%', md: '1 1 auto' },
            }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} found
              </Typography>
              {(selectedCategory !== 'All Product' || selectedBadge || searchQuery || 
                priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
                <Button
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={resetFilters}
                  sx={{ 
                    textTransform: 'none',
                    color: '#FF4081',
                    borderColor: '#FF4081',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 64, 129, 0.1)',
                      borderColor: '#FF4081',
                    }
                  }}
                  variant="outlined"
                >
                  Clear Filters
                </Button>
              )}
            </Box>
            
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: { xs: '100%', sm: 200 },
                maxWidth: { xs: '100%', sm: 250 },
              }}
            >
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
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: 'rgba(41, 8, 93, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      '& .MuiMenuItem-root': {
                        color: 'white',
                        '&:hover': {
                          background: 'rgba(33, 150, 243, 0.2)',
                        },
                        '&.Mui-selected': {
                          background: 'rgba(255, 215, 0, 0.2)',
                          '&:hover': {
                            background: 'rgba(255, 215, 0, 0.3)',
                          },
                        },
                      },
                    },
                  },
                }}
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
        </motion.div>

        <Grid container spacing={3}>
          {/* Left Sidebar */}
          <Grid size={{ xs: 12, md: 2.5 }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '2px solid rgba(255, 215, 0, 0.2)',
                  position: 'sticky',
                  top: 100,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    border: '2px solid rgba(255, 215, 0, 0.4)',
                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.15)',
                  },
                }}
              >
                {/* Category Filter */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: '#FFD700',
                    }}
                  >
                    <FilterListIcon sx={{ fontSize: 20 }} />
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
                      control={
                        <Radio 
                          size="small"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&.Mui-checked': {
                              color: '#2196F3',
                            },
                          }}
                        />
                      } 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'white' }}>
                            {category}
                          </Typography>
                          <Chip
                            label={getCategoryCount(category)}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              background: selectedCategory === category 
                                ? 'linear-gradient(45deg, #2196F3, #FF4081)' 
                                : 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              fontWeight: 600,
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
              <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', pt: 3, mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#FFD700',
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
                    control={
                      <Radio 
                        size="small"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          '&.Mui-checked': {
                            color: '#2196F3',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'white' }}>
                        All Products
                      </Typography>
                    }
                    sx={{ mb: 1 }}
                  />
                  {['New Arrival', 'Best Seller', 'On Discount'].map((badge) => (
                    <FormControlLabel
                      key={badge}
                      value={badge}
                      control={
                        <Radio 
                          size="small"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&.Mui-checked': {
                              color: '#2196F3',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'white' }}>
                          {badge}
                        </Typography>
                      }
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
              </Box>

              {/* Price Range Filter */}
              <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', pt: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#FFD700',
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
                    color: '#2196F3',
                    '& .MuiSlider-thumb': {
                      background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 8px rgba(33, 150, 243, 0.16)',
                      },
                    },
                    '& .MuiSlider-track': {
                      background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '& .MuiSlider-valueLabel': {
                      background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                    ${priceRange[0]}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                    ${priceRange[1]}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
          </Grid>

          {/* Products Grid */}
          <Grid size={{ xs: 12, md: 9.5 }}>
            {/* Empty State */}
            {paginatedProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
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
                    Try adjusting your filters or search query
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={resetFilters}
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                      '&:hover': { 
                        background: 'linear-gradient(45deg, #1976D2, #C2185B)',
                        transform: 'translateY(-2px)',
                      },
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Reset All Filters
                  </Button>
                </Box>
              </motion.div>
            ) : (
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
                          {/* Top Section with Badges and Favorite */}
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
                            
                            <Tooltip title={favorites.has(product.id) ? "Remove from favorites" : "Add to favorites"}>
                              <IconButton
                                size="small"
                                onClick={() => toggleFavorite(product.id)}
                                sx={{
                                  color: favorites.has(product.id) ? '#DC143C' : 'rgba(255, 255, 255, 0.5)',
                                  transition: 'all 0.3s',
                                  background: 'rgba(255, 255, 255, 0.1)',
                                  backdropFilter: 'blur(10px)',
                                  '&:hover': {
                                    transform: 'scale(1.2)',
                                    color: '#DC143C',
                                    background: 'rgba(220, 20, 60, 0.2)',
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

                            {/* Rating */}
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

                            {/* Price */}
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

                          {/* Action Buttons */}
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
                                onClick={() => handleBuyNow(product)}
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
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Fade in={true}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 6,
                      mb: 4,
                      flexWrap: 'wrap',
                      gap: 2,
                      p: 2,
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Button
                      startIcon={<KeyboardArrowLeftIcon />}
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      sx={{
                        textTransform: 'none',
                        color: currentPage === 1 ? 'rgba(255, 255, 255, 0.3)' : 'white',
                        fontWeight: 600,
                        '&:hover': {
                          background: currentPage === 1 ? 'transparent' : 'rgba(33, 150, 243, 0.2)',
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

                    <Button
                      endIcon={<KeyboardArrowRightIcon />}
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      sx={{
                        textTransform: 'none',
                        color: currentPage === totalPages ? 'rgba(255, 255, 255, 0.3)' : 'white',
                        fontWeight: 600,
                        '&:hover': {
                          background: currentPage === totalPages ? 'transparent' : 'rgba(33, 150, 243, 0.2)',
                        },
                      }}
                      aria-label="Next page"
                    >
                      Next
                    </Button>
                  </Box>
                </motion.div>
              </Fade>
            )}

            {/* Explore Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ mt: 8, mb: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '2rem', color: 'white', mb: 1 }}>
                      ⭐ Explore our recommendations
                    </Typography>
                    <Box
                      sx={{
                        width: '100px',
                        height: '4px',
                        background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                        borderRadius: '2px',
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Previous">
                      <IconButton
                        size="small"
                        onClick={prevRecommendation}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255, 215, 0, 0.3)',
                          borderRadius: 2,
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                            borderColor: '#FFD700',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.3s',
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
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255, 215, 0, 0.3)',
                          borderRadius: 2,
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                            borderColor: '#FFD700',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.3s',
                        }}
                        aria-label="Next recommendation"
                      >
                        <KeyboardArrowRightIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

              <Grid container spacing={3}>
                <AnimatePresence>
                  {recommendations.map((product, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
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
                            border: '2px solid rgba(33, 150, 243, 0.3)',
                            overflow: 'hidden',
                            transition: 'all 0.4s ease',
                            '&:hover': {
                              border: '2px solid rgba(33, 150, 243, 0.8)',
                              boxShadow: '0 15px 50px rgba(33, 150, 243, 0.4)',
                              transform: 'translateY(-10px)',
                            },
                          }}
                        >
                          <Box sx={{ p: 2, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
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
                                    background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    height: 22,
                                    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
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
                                fontWeight: 700,
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: 'white',
                              }}
                            >
                              {product.name}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Rating 
                                value={product.rating} 
                                precision={0.1} 
                                size="small" 
                                readOnly 
                                sx={{ 
                                  '& .MuiRating-iconFilled': {
                                    color: '#FFD700',
                                  },
                                  '& .MuiRating-iconEmpty': {
                                    color: 'rgba(255, 255, 255, 0.3)',
                                  },
                                }}
                              />
                              <Typography variant="body2" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem', fontWeight: 500 }}>
                                {product.rating} ({product.reviews})
                              </Typography>
                            </Box>

                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: '#FFD700',
                                textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
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
                                borderColor: 'rgba(33, 150, 243, 0.5)',
                                color: '#2196F3',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                background: 'rgba(33, 150, 243, 0.05)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                  borderColor: '#2196F3',
                                  background: 'rgba(33, 150, 243, 0.15)',
                                  transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s',
                              }}
                            >
                              Add
                            </Button>
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => handleBuyNow(product)}
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
                          </CardActions>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            </Box>
            </motion.div>

            {/* Newsletter Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Box
                component="form"
                onSubmit={handleNewsletterSubmit}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: 4,
                  p: { xs: 3, md: 5 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3,
                  mb: 6,
                  border: '2px solid rgba(255, 215, 0, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s ease',
                  '&:hover': {
                    border: '2px solid rgba(255, 215, 0, 0.4)',
                    boxShadow: '0 15px 50px rgba(33, 150, 243, 0.3)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(255, 64, 129, 0.1) 100%)',
                    zIndex: -1,
                  },
                }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      color: '#FFD700',
                      fontWeight: 700,
                      mb: 0.5,
                      fontSize: { xs: '1.5rem', md: '2.5rem' },
                      textShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
                    }}
                  >
                    Ready to Get
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', md: '2.5rem' },
                    }}
                  >
                    Our New Stuff?
                  </Typography>
                  <Box
                    sx={{
                      width: '80px',
                      height: '4px',
                      background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                      borderRadius: '2px',
                      mt: 1,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: { xs: '100%', md: 'auto' },
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
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
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        width: { xs: '100%', sm: '280px' },
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: emailError ? '#DC143C' : 'rgba(255, 215, 0, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: emailError ? '#DC143C' : 'rgba(255, 215, 0, 0.6)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: emailError ? '#DC143C' : '#FFD700',
                          },
                        },
                        '& .MuiInputBase-input::placeholder': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          opacity: 1,
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
                        background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 4,
                        borderRadius: 2,
                        boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976D2, #C2185B)',
                          transform: 'scale(1.05)',
                          boxShadow: '0 6px 20px rgba(33, 150, 243, 0.6)',
                        },
                        transition: 'all 0.3s',
                      }}
                    >
                      Subscribe
                    </Button>
                  </Box>
                  {emailError && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#DC143C',
                        fontSize: '0.75rem',
                        ml: 1,
                        fontWeight: 600,
                      }}
                    >
                      {emailError}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ textAlign: { xs: 'center', md: 'right' }, maxWidth: 400 }}>
                  <Typography variant="body1" sx={{ color: '#FFD700', fontSize: '1rem', mb: 1, fontWeight: 700 }}>
                    📧 Stay Updated with DIGIMAAX
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
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
