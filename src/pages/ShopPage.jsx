import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
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
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useCart } from '../context/CartContext';
import { formatLKR } from '../utils/currency';
import { getProducts } from '../services/products';

// Products fetched from service

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
  const itemsPerPage = 9;

  const filtered = useMemo(() => {
    let items = products.filter(p => {
      const matchCat = !selectedCategory || p.category === selectedCategory;
      const q = debouncedQuery.trim().toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchCat && matchSearch && matchPrice;
    });
    switch (sortBy) {
      case 'priceAsc':
        items.sort((a, b) => a.price - b.price); break;
      case 'priceDesc':
        items.sort((a, b) => b.price - a.price); break;
      case 'newest':
        items.sort((a, b) => b.id - a.id); break;
      case 'popular':
        items.sort((a, b) => b.rating - a.rating); break;
      default:
        break;
    }
    return items;
  }, [products, debouncedQuery, selectedCategory, priceRange, sortBy]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedQuery, selectedCategory, priceRange, sortBy]);

  React.useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    setError('');
    getProducts()
      .then((data) => { if (!abortController.signal.aborted) setProducts(data); })
      .catch(() => { if (!abortController.signal.aborted) setError('Failed to load products.'); })
      .finally(() => { if (!abortController.signal.aborted) setLoading(false); });
    return () => { abortController.abort(); };
  }, []);

  return (
    <Box sx={{ background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)', minHeight: '100vh', pt: { xs: 8, md: 10 }, pb: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 800 }}>DIGIMAAX Product Shop</Typography>
          <TextField
            size="small"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#FFD700' }} />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => { setQuery(''); setPage(1); }}><ClearIcon sx={{ color: 'white' }} /></IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              width: { xs: '100%', sm: 360 },
              background: 'rgba(255,255,255,0.12)',
              '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' } }
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Box sx={{ minWidth: 220, flex: '1 1 220px' }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.8)', mb: 0.5 }}>Category</Typography>
                <Select
                  fullWidth size="small" value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  displayEmpty
                  sx={{ color: 'white', background: 'rgba(255,255,255,0.08)' }}
                >
                  <MenuItem value="">All</MenuItem>
                  {categories.map(cat => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
                </Select>
              </Box>

              <Box sx={{ minWidth: 260, flex: '2 1 320px' }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.8)', mb: 0.5 }}>Price Range (LKR)</Typography>
                <Slider
                  min={0}
                  max={10000}
                  value={priceRange}
                  onChange={(_, v) => setPriceRange(v)}
                  valueLabelDisplay="auto"
                  sx={{ color: '#2196F3' }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: 'white' }}>LKR {priceRange[0]}</Typography>
                  <Typography variant="caption" sx={{ color: 'white' }}>LKR {priceRange[1]}</Typography>
                </Box>
              </Box>

              <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.8)', mb: 0.5 }}>Sort By</Typography>
                <Select
                  fullWidth size="small" value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ color: 'white', background: 'rgba(255,255,255,0.08)' }}
                >
                  <MenuItem value="trending">Trending</MenuItem>
                  <MenuItem value="popular">Popular</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="priceAsc">Price: Low → High</MenuItem>
                  <MenuItem value="priceDesc">Price: High → Low</MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                <Button variant="outlined" onClick={() => { setSelectedCategory(''); setPriceRange([0, 10000]); setSortBy('trending'); setQuery(''); setPage(1); }} sx={{ color: '#FFD700', borderColor: 'rgba(255,215,0,0.6)', textTransform: 'none', fontWeight: 700 }}>Reset</Button>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'white' }}>
              {filtered.length === 0 ? 'No items' : `${(page - 1) * itemsPerPage + 1}-${Math.min(page * itemsPerPage, filtered.length)} of ${filtered.length} items`}
            </Typography>
          </Box>

          <Grid container spacing={2.5} alignItems="stretch">
              {loading && (
                Array.from({ length: 8 }).map((_, idx) => (
                  <Grid item xs={12} sm={6} md={3} lg={3} key={`sk-${idx}`} sx={{ display: 'flex' }}>
                    <Card sx={{ height: '100%', width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3 }}>
                      <Box sx={{ pt: '70%', background: 'rgba(0,0,0,0.2)' }} />
                      <CardContent>
                        <Box sx={{ height: 18, background: 'rgba(255,255,255,0.12)', borderRadius: 1, mb: 1.5 }} />
                        <Box sx={{ height: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 1, mb: 1 }} />
                        <Box sx={{ height: 12, width: '60%', background: 'rgba(255,255,255,0.08)', borderRadius: 1 }} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
              {!loading && error && (
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 3, textAlign: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3 }}>
                    <Typography sx={{ color: 'white', mb: 1 }}>{error}</Typography>
                    <Button variant="contained" onClick={() => { setLoading(true); setError(''); getProducts().then(setProducts).catch(() => setError('Failed to load products.')).finally(() => setLoading(false)); }} sx={{ background: 'linear-gradient(45deg, #2196F3, #FF4081)', textTransform: 'none', fontWeight: 800 }}>Retry</Button>
                  </Paper>
                </Grid>
              )}
              {!loading && !error && paged.map((p) => (
                <Grid item xs={12} sm={6} md={3} lg={3} key={p.id} sx={{ display: 'flex' }}>
                  <Card sx={{ height: '100%', width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ position: 'relative', pt: '70%', background: 'rgba(0,0,0,0.25)' }}>
                      <CardMedia component="img" image={p.image || ''} alt={p.title} loading="lazy" sx={{ position: 'absolute', inset: 0, objectFit: 'contain', p: 2 }} />
                      <Chip size="small" label={p.category} sx={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.5)', color: 'white' }} />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Tooltip title={p.title}><Typography variant="h6" sx={{ color: 'white', fontWeight: 800, fontSize: '1rem', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</Typography></Tooltip>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mb: 1, height: 38, overflow: 'hidden' }}>{p.desc}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 900 }}>{formatLKR(p.price)}</Typography>
                        <Rating size="small" value={p.rating} precision={0.1} readOnly sx={{ '& .MuiRating-iconFilled': { color: '#FFD700' } }} />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => {
                          // allow guest carts; require auth at checkout only
                          addToCart(p.id, { title: p.title, image: p.image, price: p.price });
                        }}
                        sx={{ color: '#FFD700', borderColor: 'rgba(255,215,0,0.6)', textTransform: 'none', fontWeight: 700 }}
                      >
                        Add to Cart
                      </Button>
                      <Button variant="contained" fullWidth startIcon={<VisibilityIcon />} onClick={() => navigate(`/product/${p.id}`)} sx={{ background: 'linear-gradient(45deg, #2196F3, #FF4081)', textTransform: 'none', fontWeight: 800 }}>View Details</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ShopPage;


