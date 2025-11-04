import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Rating,
  Chip,
  TextField,
  Button,
  MenuItem,
  Card,
  CardMedia,
  Stack,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useCart } from '../context/CartContext';
import { formatLKR } from '../utils/currency';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/products';
import { CircularProgress, Alert } from '@mui/material';

const ProductDetailPage = () => {
  const [color, setColor] = useState('Black');
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [customText, setCustomText] = useState('');
  const [imageFile, setImageFile] = useState();
  const { addToCart, updateCartQuantity } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState();
  const [activeImg, setActiveImg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProductById(id)
      .then((p) => { if (!active) return; setProduct(p); setActiveImg(p.image); })
      .catch(() => { if (!active) return; setError('Product not found'); })
      .finally(() => { if (!active) return; setLoading(false); });
    return () => { active = false; };
  }, [id]);

  return (
    <Box sx={{ background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)', minHeight: '100vh', pt: { xs: 8, md: 10 }, pb: 8 }}>
      <Container maxWidth="lg">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.6)' }} />} sx={{ mb: 2 }}>
          <Link underline="hover" color="#FFD700" href="/shop">Shop</Link>
          <Typography color="white">{product?.title || 'Product'}</Typography>
        </Breadcrumbs>

        {error && (
          <Paper elevation={0} sx={{ p: 3, mb: 3, textAlign: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3 }}>
            <Typography sx={{ color: 'white', mb: 2 }}>{error}</Typography>
            <Button variant="contained" onClick={() => navigate('/shop')} sx={{ background: 'linear-gradient(45deg, #2196F3, #FF4081)', textTransform: 'none', fontWeight: 800 }}>Back to Shop</Button>
          </Paper>
        )}

        {loading && !error && (
          <Typography sx={{ color: 'white', textAlign: 'center', py: 4 }}>Loading product...</Typography>
        )}

        {!loading && !error && product && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3 }}>
                  <Box sx={{ position: 'relative', pt: '75%', background: 'rgba(0,0,0,0.25)' }}>
                    <CardMedia component="img" image={activeImg} alt={product?.title} loading="lazy" sx={{ position: 'absolute', inset: 0, objectFit: 'contain', p: 3 }} />
                  </Box>
                </Card>
                <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
                  {product && (product.gallery || (product.image ? [product.image] : [])).filter(Boolean).map((src, i) => (
                    <Card key={i} onClick={() => setActiveImg(src)} sx={{ width: 72, height: 72, background: 'rgba(255,255,255,0.06)', border: activeImg===src ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.12)', cursor: 'pointer' }}>
                      <CardMedia component="img" image={src} alt={`thumb-${i}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Card>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 900 }}>{product?.title || (loading ? 'Loading…' : 'Unknown Product')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Rating value={product?.rating || 0} precision={0.1} readOnly sx={{ '& .MuiRating-iconFilled': { color: '#FFD700' } }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{product ? `${product.rating} rating` : ''}</Typography>
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 900 }}>{formatLKR(product?.price || 0)}</Typography>
                    <Chip size="small" color="error" label="In Stock" />
                  </Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 2 }}>{product?.desc}</Typography>

                  <Box sx={{ mt: 3 }}>
                    <Typography sx={{ color: 'white', fontWeight: 700, mb: 1 }}>Customization</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth select size="small" label="Color" value={color} onChange={(e) => setColor(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }}>
                          {['Black','White','Navy','Red'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth select size="small" label="Size" value={size} onChange={(e) => setSize(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }}>
                          {['S','M','L','XL'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth size="small" label="Custom Text" value={customText} onChange={(e) => setCustomText(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }} />
                      </Grid>
                      <Grid item xs={12}>
                        <Button component="label" variant="outlined" sx={{ color: '#FFD700', borderColor: 'rgba(255,215,0,0.6)', textTransform: 'none', fontWeight: 700 }}>
                          Upload Your Image
                          <input hidden type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0])} />
                        </Button>
                        {imageFile && (
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', ml: 1 }}>{imageFile.name}</Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="small" type="number" label="Quantity" value={qty} inputProps={{ min: 1 }} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }} />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (!product) return;
                        addToCart(product.id, { title: product.title, price: product.price, image: product.image, color, size, customText });
                        if (qty > 1) {
                          updateCartQuantity(product.id, qty);
                        }
                      }}
                      sx={{ background: 'linear-gradient(45deg, #2196F3, #FF4081)', textTransform: 'none', fontWeight: 800 }}
                    >
                      Add to Cart
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/checkout')} sx={{ color: '#FFD700', borderColor: 'rgba(255,215,0,0.6)', textTransform: 'none', fontWeight: 800 }}>Buy Now</Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 5 }}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 900, mb: 2 }}>Related Products</Typography>
              <Grid container spacing={2}>
                {[1,2,3,4].map(i => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                      <Box sx={{ position: 'relative', pt: '65%', background: 'rgba(0,0,0,0.25)', borderRadius: 2 }} />
                      <Typography sx={{ color: 'white', fontWeight: 700, mt: 1 }}>Product {i}</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>LKR 2,999</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ProductDetailPage;


