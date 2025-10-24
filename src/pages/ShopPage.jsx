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
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Badge,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

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
  { 
    id: 1, 
    title: 'Customized Mug', 
    image: mugImg, 
    tag: 'Popular',
    price: 2500,
    originalPrice: 3000,
    category: 'Accessories',
    rating: 4.5,
    reviews: 128,
    description: 'High-quality ceramic mug with custom printing',
    colors: ['White', 'Black', 'Blue'],
    sizes: ['One Size'],
    inStock: true,
    discount: 17
  },
  { 
    id: 2, 
    title: 'Customized Wall Clock', 
    image: clockImg, 
    tag: 'New',
    price: 4500,
    originalPrice: 5000,
    category: 'Home Decor',
    rating: 4.8,
    reviews: 89,
    description: 'Modern wall clock with custom design',
    colors: ['Black', 'White', 'Wood'],
    sizes: ['12 inch', '16 inch'],
    inStock: true,
    discount: 10
  },
  { 
    id: 3, 
    title: 'Custom Shirt', 
    image: shirtImg, 
    tag: 'Trending',
    price: 3500,
    originalPrice: 4000,
    category: 'Clothing',
    rating: 4.3,
    reviews: 256,
    description: 'Premium cotton shirt with custom embroidery',
    colors: ['White', 'Black', 'Navy', 'Gray'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    discount: 13
  },
  { 
    id: 4, 
    title: 'Custom T‑Shirt', 
    image: tshirtImg, 
    tag: 'Bestseller',
    price: 2000,
    originalPrice: 2500,
    category: 'Clothing',
    rating: 4.7,
    reviews: 342,
    description: 'Comfortable cotton t-shirt with custom print',
    colors: ['White', 'Black', 'Red', 'Blue', 'Green'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    discount: 20
  },
  { 
    id: 5, 
    title: 'Custom Phone Case', 
    image: mugImg, 
    tag: 'New',
    price: 1500,
    originalPrice: 2000,
    category: 'Accessories',
    rating: 4.2,
    reviews: 67,
    description: 'Protective phone case with custom design',
    colors: ['Clear', 'Black', 'White'],
    sizes: ['iPhone 14', 'iPhone 15', 'Samsung Galaxy'],
    inStock: true,
    discount: 25
  },
  { 
    id: 6, 
    title: 'Custom Keychain', 
    image: clockImg, 
    tag: 'Popular',
    price: 800,
    originalPrice: 1000,
    category: 'Accessories',
    rating: 4.6,
    reviews: 145,
    description: 'Durable metal keychain with custom engraving',
    colors: ['Silver', 'Gold', 'Black'],
    sizes: ['Standard'],
    inStock: true,
    discount: 20
  },
  { 
    id: 7, 
    title: 'Custom Hoodie', 
    image: shirtImg, 
    tag: 'Trending',
    price: 5500,
    originalPrice: 6500,
    category: 'Clothing',
    rating: 4.9,
    reviews: 198,
    description: 'Warm hoodie with custom embroidery',
    colors: ['Black', 'Gray', 'Navy', 'Red'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    discount: 15
  },
  { 
    id: 8, 
    title: 'Custom Poster', 
    image: tshirtImg, 
    tag: 'New',
    price: 1200,
    originalPrice: 1500,
    category: 'Home Decor',
    rating: 4.4,
    reviews: 78,
    description: 'High-quality poster with custom artwork',
    colors: ['Full Color'],
    sizes: ['A4', 'A3', 'A2'],
    inStock: true,
    discount: 20
  },
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
  const { isAuthenticated, openSignInModal } = useAuth();
  
  // State management
  const [likedItems, setLikedItems] = useState(new Set());
  const [showAllRecentlyViewed, setShowAllRecentlyViewed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);

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
    if (!isAuthenticated) {
      openSignInModal();
      return;
    }
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

  // Get unique categories
  const categories = ['All', ...new Set(shopItems.map(item => item.category))];

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = shopItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      const matchesStock = !showOnlyInStock || item.inStock;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
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
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy, showOnlyInStock]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle quick view
  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
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
          <Typography 
            variant="h1" 
            sx={{ 
              color: '#fff', 
              fontWeight: 'bold',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: 0,
                width: '60px',
                height: '3px',
                background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                borderRadius: '2px',
              },
            }}
          >
            SHOP
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Enhanced Search and Filter Bar */}
          <Box sx={{ 
            mb: 4, 
            background: 'linear-gradient(135deg, rgba(75, 17, 169, 0.08) 0%, rgba(41, 8, 93, 0.08) 100%)',
            p: 4, 
            borderRadius: 4, 
            border: '2px solid rgba(33, 150, 243, 0.15)',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 8px 32px rgba(75, 17, 169, 0.1)',
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#4B11A9', 
                fontWeight: 'bold', 
                mb: 3,
                textAlign: 'center',
                fontSize: '1.2rem',
              }}
            >
              🔍 Find Your Perfect Products
            </Typography>
            
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item xs={12} md={7}>
                <Box>
                  <TextField
                    fullWidth
                    placeholder="Search by product name, description, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#2196F3', fontSize: 28 }} />
                        </InputAdornment>
                      ),
                      endAdornment: searchQuery && (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setSearchQuery('')}
                            sx={{ color: '#666' }}
                            size="small"
                          >
                            <CloseIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '1.1rem',
                        padding: '4px 0',
                        '&:hover': {
                          backgroundColor: 'white',
                          boxShadow: '0 4px 20px rgba(33, 150, 243, 0.15)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          borderColor: '#2196F3',
                          boxShadow: '0 6px 25px rgba(33, 150, 243, 0.2)',
                        },
                        '& fieldset': {
                          borderColor: 'rgba(33, 150, 243, 0.3)',
                          borderWidth: 2,
                        },
                        '&:hover fieldset': {
                          borderColor: '#2196F3',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196F3',
                        },
                      },
                      '& .MuiInputBase-input': {
                        padding: '16px 14px',
                      },
                    }}
                  />
                  {searchQuery && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#2196F3', 
                        mt: 1, 
                        fontWeight: 'bold',
                        textAlign: 'left',
                      }}
                    >
                      Searching for: "{searchQuery}"
                    </Typography>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: '100%' }}>
                  <FormControl fullWidth>
                    <InputLabel 
                      sx={{ 
                        color: '#4B11A9', 
                        fontWeight: 'bold',
                        fontSize: '1rem',
                      }}
                    >
                      📂 Category
                    </InputLabel>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      label="📂 Category"
                      sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: 3,
                        fontSize: '1.1rem',
                        '&:hover': {
                          backgroundColor: 'white',
                          boxShadow: '0 4px 20px rgba(33, 150, 243, 0.15)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          boxShadow: '0 6px 25px rgba(33, 150, 243, 0.2)',
                        },
                        '& fieldset': {
                          borderColor: 'rgba(33, 150, 243, 0.3)',
                          borderWidth: 2,
                        },
                        '&:hover fieldset': {
                          borderColor: '#2196F3',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196F3',
                        },
                      }}
                    >
                      {categories.map((category) => (
                        <MenuItem 
                          key={category} 
                          value={category}
                          sx={{
                            fontSize: '1rem',
                            fontWeight: category === 'All' ? 'bold' : 'normal',
                            color: category === 'All' ? '#4B11A9' : 'inherit',
                          }}
                        >
                          {category === 'All' ? '🌟 All Categories' : category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Button
                    variant="contained"
                    startIcon={<FilterListIcon />}
                    onClick={() => setFilterDrawerOpen(true)}
                    sx={{ 
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      px: 3,
                      py: 1.5,
                      height: '56px',
                      background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                      boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2, #C2185B)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Filters
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
            {/* Quick Search Suggestions */}
            {!searchQuery && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#666', 
                    mb: 2,
                    fontWeight: 'bold',
                  }}
                >
                  💡 Popular searches:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['Custom Mug', 'T-Shirt', 'Wall Clock', 'Phone Case'].map((term) => (
                    <Chip
                      key={term}
                      label={term}
                      onClick={() => setSearchQuery(term)}
                      sx={{
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        color: '#2196F3',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(33, 150, 243, 0.2)',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>


          {/* Main Shop Items Section */}
          <Box sx={{ mb: 6 }}>
            <Grid container spacing={3}>
              {paginatedProducts.map((item, index) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                        sx={{ 
                          position: 'relative', 
                          height: 200, 
                          cursor: 'pointer',
                          overflow: 'hidden',
                        }}
                        onClick={() => navigateToProductDetail(item.id)}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={item.image}
                          alt={item.title}
                          sx={{ 
                            objectFit: 'cover',
                          }}
                        />
                        
                        {/* Heart Icon */}
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(item.id);
                          }}
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
                            onClick={() => handleAddToCart(item.id, {
                              title: item.title,
                              image: item.image,
                              price: item.price,
                              color: item.colors[0] || 'White',
                              size: item.sizes[0] || 'L',
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 6,
                background: 'linear-gradient(135deg, rgba(75, 17, 169, 0.1) 0%, rgba(41, 8, 93, 0.1) 100%)',
                p: 3,
                borderRadius: 3,
                border: '1px solid rgba(33, 150, 243, 0.2)',
                backdropFilter: 'blur(10px)',
              }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2,
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        backgroundColor: 'white',
                      },
                    },
                    '& .MuiPaginationItem-page.Mui-selected': {
                      background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2, #C2185B)',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </motion.div>
      </Container>

      {/* Recently Viewed Section */}
      <Box sx={{ mt: 8, mb: 4 }}>
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(270deg, #4B11A9 0%, #29085D 100%)',
            py: 2,
            px: { xs: 2, md: 4 },
            borderTop: '3px solid #2196F3',
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
            background: 'linear-gradient(270deg, #4B11A9 0%, #29085D 100%)',
            py: 2,
            px: { xs: 2, md: 4 },
            borderTop: '3px solid #2196F3',
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

      {/* Filter Drawer */}
      <Drawer
        anchor="left"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 350 },
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Filters
            </Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {/* Price Range */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Price Range
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={priceRange}
                  onChange={(e, newValue) => setPriceRange(newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10000}
                  step={100}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">{priceRange[0]} LKR</Typography>
                  <Typography variant="body2">{priceRange[1]} LKR</Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
          
          {/* Category */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Category
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  sx={{ backgroundColor: 'white' }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>
          
          {/* Stock Status */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Availability
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Switch
                    checked={showOnlyInStock}
                    onChange={(e) => setShowOnlyInStock(e.target.checked)}
                  />
                }
                label="In Stock Only"
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Drawer>

      {/* Quick View Modal */}
      <Dialog
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
          },
        }}
      >
        {selectedProduct && (
          <>
            <DialogTitle sx={{ pb: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {selectedProduct.title}
                </Typography>
                <IconButton onClick={() => setQuickViewOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 400,
                      borderRadius: 2,
                      overflow: 'hidden',
                      backgroundColor: 'white',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  >
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ pl: { md: 2 } }}>
                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={selectedProduct.rating} precision={0.1} readOnly />
                      <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>
                        ({selectedProduct.reviews} reviews)
                      </Typography>
                    </Box>
                    
                    {/* Price */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {selectedProduct.price} LKR
                      </Typography>
                      {selectedProduct.originalPrice > selectedProduct.price && (
                        <Typography
                          variant="h6"
                          sx={{
                            textDecoration: 'line-through',
                            color: '#999',
                          }}
                        >
                          {selectedProduct.originalPrice} LKR
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Description */}
                    <Typography variant="body1" sx={{ mb: 3, color: '#666', lineHeight: 1.6 }}>
                      {selectedProduct.description}
                    </Typography>
                    
                    {/* Colors */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Colors:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedProduct.colors.map((color) => (
                          <Chip key={color} label={color} variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                    
                    {/* Sizes */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Sizes:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedProduct.sizes.map((size) => (
                          <Chip key={size} label={size} variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                    
                    {/* Stock Status */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: selectedProduct.inStock ? '#4caf50' : '#f44336',
                        fontWeight: 'bold',
                        mb: 3,
                      }}
                    >
                      {selectedProduct.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 3 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setQuickViewOpen(false);
                  navigateToProductDetail(selectedProduct.id);
                }}
                sx={{ flex: 1 }}
              >
                View Details
              </Button>
              <Button
                variant="contained"
                disabled={!selectedProduct.inStock}
                onClick={() => {
                  handleAddToCart(selectedProduct.id, {
                    title: selectedProduct.title,
                    image: selectedProduct.image,
                    price: selectedProduct.price,
                    color: selectedProduct.colors[0] || 'White',
                    size: selectedProduct.sizes[0] || 'L',
                  });
                  setQuickViewOpen(false);
                }}
                sx={{ flex: 1 }}
              >
                Add to Cart
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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
            {!isAuthenticated ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <PersonIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                  Sign in to add items to cart
                </Typography>
                <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                  Please sign in to continue shopping
                </Typography>
                <Button
                  variant="contained"
                  onClick={openSignInModal}
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#1565c0' },
                    px: 3,
                    py: 1.5,
                    fontWeight: 'bold',
                  }}
                >
                  Sign In
                </Button>
              </Box>
            ) : cartItems.size === 0 ? (
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


