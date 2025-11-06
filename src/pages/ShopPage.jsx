import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Slider,
  Select,
  MenuItem,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Rating,
  Pagination,
  Chip,
  Drawer,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../context/CartContext';
import { formatLKR } from '../utils/currency';
import { getProducts } from '../services/products';

const categories = [
  'Customized Wall Clock',
  'Customized T-Shirt',
  'Customized Mug',
  'Gift Items',
  'Corporate Items',
  'Branding Items',
];

const ShopPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('trending');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const itemsPerPage = 8;

  const filtered = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    let items = products.filter(p => {
      if (!p) return false;
      const matchCat = !selectedCategory || (p.category && p.category === selectedCategory);
      const q = debouncedQuery.trim().toLowerCase();
      const matchSearch = !q || (p.title && p.title.toLowerCase().includes(q)) || (p.desc && p.desc.toLowerCase().includes(q));
      const matchPrice = p.price != null && p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchCat && matchSearch && matchPrice;
    });
    switch (sortBy) {
      case 'priceAsc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        items.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        items.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return items;
  }, [products, debouncedQuery, selectedCategory, priceRange, sortBy]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, selectedCategory, priceRange, sortBy]);

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    setError('');
    getProducts()
      .then((data) => {
        if (!abortController.signal.aborted) setProducts(data);
      })
      .catch(() => {
        if (!abortController.signal.aborted) setError('Failed to load products.');
      })
      .finally(() => {
        if (!abortController.signal.aborted) setLoading(false);
      });
    return () => {
      abortController.abort();
    };
  }, []);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 10000]);
    setSortBy('trending');
    setQuery('');
    setPage(1);
  };


  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)',
        minHeight: '100vh',
        pt: { xs: 8, md: 10 },
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 900,
              mb: 3,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Our Products
          </Typography>
        </motion.div>

        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', width: '100%' }}>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              flexShrink: 0,
              width: 240,
              gap: 1.5,
              pr: 2,
              position: 'sticky',
              top: 100,
              alignSelf: 'flex-start',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
            }}
          >
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                p: 2.5,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 700,
                  mb: 2,
                  fontSize: '1rem',
                }}
              >
                Categories
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  onClick={() => setSelectedCategory('')}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    color: selectedCategory === '' ? '#FFD700' : 'rgba(255, 255, 255, 0.8)',
                    fontWeight: selectedCategory === '' ? 700 : 500,
                    background: selectedCategory === '' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: selectedCategory === '' ? '1px solid rgba(255, 215, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: selectedCategory === '' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      borderColor: '#FFD700',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  All Categories
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      color: selectedCategory === cat ? '#FFD700' : 'rgba(255, 255, 255, 0.8)',
                      fontWeight: selectedCategory === cat ? 700 : 500,
                      background: selectedCategory === cat ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: selectedCategory === cat ? '1px solid rgba(255, 215, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      py: 1.5,
                      px: 2,
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: selectedCategory === cat ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                        borderColor: '#FFD700',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    {cat}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center',
                mb: 3,
                justifyContent: 'flex-start',
                width: 'fit-content',
                maxWidth: '100%',
              }}
            >
              <TextField
                size="small"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: query && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setQuery('');
                          setPage(1);
                        }}
                      >
                        <ClearIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.2rem' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  flex: { xs: '1 1 100%', sm: '0 0 auto' },
                  width: { xs: '100%', sm: 600 },
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    height: '40px',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                }}
              />

              <Box
                sx={{
                  flex: { xs: '1 1 100%', sm: '0 0 auto' },
                  width: { xs: '100%', sm: 250 },
                }}
              >
                <Box sx={{ px: 1 }}>
                  <Slider
                    min={0}
                    max={10000}
                    value={priceRange}
                    onChange={(_, v) => setPriceRange(v)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `LKR ${value}`}
                    sx={{
                      color: 'white',
                      height: 6,
                      '& .MuiSlider-thumb': {
                        width: 16,
                        height: 16,
                        backgroundColor: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.16)',
                        },
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: 'white',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '& .MuiSlider-valueLabel': {
                        backgroundColor: 'white',
                        color: '#000',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      },
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5, px: 1 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem' }}>
                    LKR {priceRange[0]}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem' }}>
                    LKR {priceRange[1]}
                  </Typography>
                </Box>
              </Box>

              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: 'rgba(41, 8, 93, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      mt: 1,
                      '& .MuiMenuItem-root': {
                        color: 'white',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&.Mui-selected': {
                          background: 'rgba(33, 150, 243, 0.3)',
                          color: 'white',
                          '&:hover': {
                            background: 'rgba(33, 150, 243, 0.4)',
                          },
                        },
                      },
                    },
                  },
                }}
                sx={{
                  flex: { xs: '1 1 100%', sm: '0 0 auto' },
                  minWidth: { xs: '100%', sm: 180 },
                  height: '40px',
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                <MenuItem value="trending">Trending</MenuItem>
                <MenuItem value="popular">Popular</MenuItem>
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                <MenuItem value="priceDesc">Price: High to Low</MenuItem>
              </Select>

              <Button
                variant="outlined"
                onClick={handleResetFilters}
                size="small"
                sx={{
                  height: '40px',
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2,
                  borderRadius: 2,
                  whiteSpace: 'nowrap',
                  flex: { xs: '1 1 100%', sm: '0 0 auto' },
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Reset
              </Button>

              <Button
                variant="outlined"
                startIcon={<MenuIcon />}
                onClick={() => setFilterDrawerOpen(true)}
                size="small"
                sx={{
                  height: '40px',
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  textTransform: 'none',
                  fontWeight: 600,
                  display: { xs: 'flex', md: 'none' },
                  '&:hover': {
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                }}
              >
                Categories
              </Button>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {loading
                  ? 'Loading...'
                  : filtered.length === 0
                  ? 'No products found'
                  : `Showing ${(page - 1) * itemsPerPage + 1}-${Math.min(page * itemsPerPage, filtered.length)} of ${filtered.length} products`}
              </Typography>
            </Box>

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#FFD700' }} />
              </Box>
            )}

            {!loading && error && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography sx={{ color: 'white', mb: 2 }}>{error}</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setLoading(true);
                    setError('');
                    getProducts()
                      .then(setProducts)
                      .catch(() => setError('Failed to load products.'))
                      .finally(() => setLoading(false));
                  }}
                  sx={{
                  background: '#2196F3',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': {
                    background: '#1976D2',
                  },
                  }}
                >
                  Retry
                </Button>
              </Box>
            )}

            {!loading && !error && filtered.length === 0 && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  No products found
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                  Try adjusting your filters or search terms
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleResetFilters}
                  sx={{
                    color: '#FFD700',
                    borderColor: 'rgba(255, 215, 0, 0.5)',
                    textTransform: 'none',
                    fontWeight: 700,
                    '&:hover': {
                      borderColor: '#FFD700',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    },
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            )}

            {!loading && !error && filtered.length > 0 && (
              <Grid container spacing={2}>
                <AnimatePresence mode="wait">
                  {paged.map((product, index) => {
                    if (!product || !product.id) return null;
                    return (
                    <Grid item xs={12} sm={6} md={3} lg={3} key={product.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 3,
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                              borderColor: 'rgba(255, 215, 0, 0.5)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: 'relative',
                              width: '100%',
                              pt: '75%',
                              background: 'rgba(0, 0, 0, 0.2)',
                              overflow: 'hidden',
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={product?.image || ''}
                              alt={product?.title || 'Product'}
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                p: 2,
                              }}
                            />
                            {product?.badge && (
                              <Chip
                                label={product.badge}
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: 12,
                                  right: 12,
                                  background: '#2196F3',
                                  color: 'white',
                                  fontWeight: 700,
                                  fontSize: '0.7rem',
                                  zIndex: 1,
                                }}
                              />
                            )}
                            <Chip
                              label={product?.category || 'Product'}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                background: 'rgba(0, 0, 0, 0.7)',
                                backdropFilter: 'blur(4px)',
                                color: 'white',
                                fontSize: '0.7rem',
                                zIndex: 1,
                              }}
                            />
                          </Box>

                          <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1rem',
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                lineHeight: 1.3,
                              }}
                            >
                              {product?.title || 'Product'}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                mb: 2,
                                minHeight: '40px',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                flexGrow: 1,
                                lineHeight: 1.5,
                                fontSize: '0.875rem',
                              }}
                            >
                              {product?.desc || ''}
                            </Typography>

                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 2,
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  color: '#FFD700',
                                  fontWeight: 900,
                                  fontSize: '1.25rem',
                                }}
                              >
                                {formatLKR(product?.price || 0)}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Rating
                                  value={product?.rating || 0}
                                  precision={0.1}
                                  readOnly
                                  size="small"
                                  sx={{
                                    '& .MuiRating-iconFilled': {
                                      color: '#FFD700',
                                    },
                                    '& .MuiRating-iconEmpty': {
                                      color: 'rgba(255, 255, 255, 0.3)',
                                    },
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}
                                >
                                  ({product?.rating || 0})
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>

                          <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                              <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<ShoppingCartIcon />}
                                onClick={() => {
                                  if (product?.id) {
                                    addToCart(product.id, {
                                      title: product?.title || 'Product',
                                      image: product?.image || '',
                                      price: product?.price || 0,
                                    });
                                    setSnackbar({ open: true, message: `${product?.title || 'Product'} added to cart!` });
                                  }
                                }}
                                sx={{
                                  color: '#FFD700',
                                  borderColor: 'rgba(255, 215, 0, 0.5)',
                                  textTransform: 'none',
                                  fontWeight: 700,
                                  py: 1,
                                  borderRadius: 2,
                                  '&:hover': {
                                    borderColor: '#FFD700',
                                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                  },
                                }}
                              >
                                Add to Cart
                              </Button>
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={<VisibilityIcon />}
                                onClick={() => {
                                  if (product?.id) {
                                    navigate(`/product/${product.id}`);
                                  }
                                }}
                                sx={{
                                  background: '#2196F3',
                                  textTransform: 'none',
                                  fontWeight: 700,
                                  py: 1,
                                  borderRadius: 2,
                                  '&:hover': {
                                    background: '#1976D2',
                                  },
                                }}
                              >
                                View
                              </Button>
                            </Stack>
                          </CardActions>
                        </Card>
                      </motion.div>
                    </Grid>
                    );
                  })}
                </AnimatePresence>
              </Grid>
            )}

            {!loading && !error && totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'white',
                      '&.Mui-selected': {
                        backgroundColor: '#FFD700',
                        color: '#000',
                        fontWeight: 700,
                        '&:hover': {
                          backgroundColor: '#FFD700',
                        },
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>

        <Drawer
          anchor="left"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: 280,
              background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)',
              p: 3,
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              Categories
            </Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              onClick={() => {
                setSelectedCategory('');
                setFilterDrawerOpen(false);
              }}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                color: selectedCategory === '' ? '#FFD700' : 'rgba(255, 255, 255, 0.8)',
                fontWeight: selectedCategory === '' ? 700 : 500,
                background: selectedCategory === '' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: selectedCategory === '' ? '1px solid rgba(255, 215, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                py: 1.5,
                px: 2,
                '&:hover': {
                  background: selectedCategory === '' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  borderColor: '#FFD700',
                },
              }}
            >
              All Categories
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setFilterDrawerOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  color: selectedCategory === cat ? '#FFD700' : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  background: selectedCategory === cat ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: selectedCategory === cat ? '1px solid rgba(255, 215, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  fontSize: '0.875rem',
                  '&:hover': {
                    background: selectedCategory === cat ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    borderColor: '#FFD700',
                  },
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>
        </Drawer>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ open: false, message: '' })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ open: false, message: '' })}
            severity="success"
            sx={{
              width: '100%',
              backgroundColor: 'rgba(76, 175, 80, 0.95)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white',
              },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ShopPage;
