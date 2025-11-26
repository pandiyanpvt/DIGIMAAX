import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Rating,
  Chip,
  TextField,
  Button,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatLKR } from '../utils/currency';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProducts } from '../services/products';
import { getCategoryById } from '../api/categories';
import { productCardStyles } from '../utils/productCardStyles';
import { CircularProgress, Snackbar, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetailPage = () => {
  const [color, setColor] = useState('Black');
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [customText, setCustomText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { addToCart } = useCart();
  const { isAuthenticated, openSignInModal } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImg, setActiveImg] = useState('');
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [addingToCart, setAddingToCart] = useState(false);

  // Load product and category details
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    
    getProductById(id)
      .then((p) => {
        if (!active) return;
        setProduct(p);
        
        // Set initial active image - use gallery first image, or single image
        if (p.gallery && Array.isArray(p.gallery) && p.gallery.length > 0 && p.gallery[0]) {
          setActiveImg(p.gallery[0]);
        } else if (p.image && typeof p.image === 'string' && p.image.trim() !== '') {
          setActiveImg(p.image);
        }
        
        // Fetch category details for customization flags
        if (p.category_id) {
          return getCategoryById(p.category_id);
        }
        return null;
      })
      .then((categoryResult) => {
        if (!active || !categoryResult) return;
        setCategory(categoryResult.data);
        
        // Fetch related products from same category
        if (categoryResult.data?.id) {
          setRelatedLoading(true);
          return getProducts({
            category: categoryResult.data.id,
            limit: 4,
            page: 1,
          });
        }
        return null;
      })
      .then((relatedResult) => {
        if (!active) return;
        if (relatedResult) {
          // Filter out current product from related products
          const filtered = (relatedResult.products || []).filter(
            (p) => String(p.id) !== String(id)
          );
          setRelatedProducts(filtered.slice(0, 4));
        }
      })
      .catch((err) => {
        if (!active) return;
        console.error('Error loading product:', err);
        setError('Product not found');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
        setRelatedLoading(false);
      });
    
    return () => {
      active = false;
    };
  }, [id]);

  // Handle image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = async () => {
    if (!product) {
      setSnackbar({ open: true, message: 'Product not available', severity: 'error' });
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      setSnackbar({ 
        open: true, 
        message: 'Please sign in to add items to your cart', 
        severity: 'info' 
      });
      openSignInModal();
      return;
    }

    setAddingToCart(true);
    
    try {
      // Prepare customization data based on category settings
      const itemDetails = {
        quantity: qty || 1,
        color: category?.customization_color === 1 ? color : undefined,
        size: category?.customization_size === 1 ? size : undefined,
        customText: category?.customization_text === 1 && customText?.trim() ? customText.trim() : undefined,
        // Handle image file upload - use base64 data URL if available
        customImageUrl: category?.customization_image === 1 && imagePreview ? imagePreview : undefined,
      };

      // Remove undefined values
      Object.keys(itemDetails).forEach(key => {
        if (itemDetails[key] === undefined) {
          delete itemDetails[key];
        }
      });

      await addToCart(product.id, itemDetails);
      setSnackbar({ 
        open: true, 
        message: `${product.title} added to cart successfully!`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbar({ 
        open: true, 
        message: error.message || 'Failed to add item to cart. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setAddingToCart(false);
    }
  };

  // Ensure we always have at least the main product image
  const galleryImages = React.useMemo(() => {
    if (!product) return [];
    
    // First check if we have a gallery array (already normalized URLs from normalizeProduct)
    if (product.gallery && Array.isArray(product.gallery) && product.gallery.length > 0) {
      const validUrls = product.gallery.filter(url => 
        url && typeof url === 'string' && url.trim() !== ''
      );
      if (validUrls.length > 0) {
        return validUrls;
      }
    }
    
    // If no gallery, check if we have images array from API (objects with image_url)
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      // Sort by sort_order and extract image_url
      const sortedImages = [...product.images].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      const imageUrls = sortedImages
        .map(img => {
          // Handle both object format {image_url: "..."} and direct URL string
          if (typeof img === 'string') return img;
          if (img && img.image_url && typeof img.image_url === 'string') return img.image_url;
          return null;
        })
        .filter(Boolean);
      
      if (imageUrls.length > 0) {
        return imageUrls;
      }
    }
    
    // Fallback to single image property
    if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
      return [product.image];
    }
    
    return [];
  }, [product]);

  // Set active image when product loads
  React.useEffect(() => {
    if (product && galleryImages.length > 0) {
      if (!activeImg || !galleryImages.includes(activeImg)) {
        console.log('Setting active image to:', galleryImages[0]);
        setActiveImg(galleryImages[0]);
      }
    }
  }, [product, galleryImages, activeImg]);
  
  // Debug log
  React.useEffect(() => {
    if (product) {
      console.log('Product Detail Page - Product loaded:', {
        productId: product.id,
        productTitle: product.title,
        productImage: product.image,
        productGallery: product.gallery,
        productImages: product.images,
        galleryImages: galleryImages,
        activeImg: activeImg,
      });
    }
  }, [product, galleryImages, activeImg]);

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)',
        minHeight: '100vh',
        pt: { xs: 8, md: 10 },
        pb: 6,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(33, 150, 243, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.5)' }} />}
          sx={{ mb: 4 }}
        >
          <Link
            underline="hover"
            color="#FFD700"
            href="/shop"
            sx={{ 
              cursor: 'pointer', 
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              '&:hover': { 
                color: '#FFA000',
                transform: 'translateX(2px)',
              } 
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate('/shop');
            }}
          >
            Shop
          </Link>
          {/* Only show category name if it's different from product title */}
          {product?.category_name && product?.category_name !== product?.title && (
            <Typography 
              color="rgba(255,255,255,0.7)"
              sx={{ fontSize: '0.9rem' }}
            >
              {product.category_name}
            </Typography>
          )}
          <Typography 
            color="rgba(255,255,255,0.9)"
            sx={{ fontSize: '0.9rem', fontWeight: 500 }}
          >
            {product?.title || 'Product'}
          </Typography>
        </Breadcrumbs>

        {error && (
          <Card
            sx={{
              p: 5,
              mb: 3,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 4,
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            <Typography sx={{ color: 'white', mb: 3, fontSize: '1.1rem', fontWeight: 600 }}>{error}</Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/shop')}
              sx={{
                background: 'linear-gradient(135deg, #2196F3 0%, #FF4081 100%)',
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                py: 1.25,
                borderRadius: 2.5,
                boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976D2 0%, #E91E63 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(33, 150, 243, 0.5)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Back to Shop
            </Button>
          </Card>
        )}

        {loading && !error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#FFD700' }} size={50} />
          </Box>
        )}

        {!loading && !error && product && (
          <>
            <Card
              sx={{
                p: { xs: 2.5, md: 4 },
                mb: 6,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 25px 70px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 215, 0, 0.1) inset',
                  borderColor: 'rgba(255, 215, 0, 0.2)',
                },
              }}
            >
              <Grid container spacing={2}>
                {/* Left Section - Thumbnails + Main Image */}
                <Grid item xs={12} md={5}>
                  {galleryImages && Array.isArray(galleryImages) && galleryImages.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                        {/* Small Thumbnails - Left Side (only if multiple images) */}
                        {galleryImages.length > 1 && (
                          <Stack
                            direction={{ xs: 'row', md: 'column' }}
                            spacing={1.5}
                            sx={{
                              flexShrink: 0,
                              order: { xs: 2, md: 1 },
                            }}
                          >
                            {galleryImages.map((src, i) => {
                              if (!src || typeof src !== 'string' || src.trim() === '') return null;
                              const isActive = activeImg === src || (!activeImg && i === 0);
                              return (
                                <motion.div
                                  key={`thumb-${src}-${i}`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Card
                                    onClick={() => setActiveImg(src)}
                                    sx={{
                                      width: { xs: 75, md: 95 },
                                      height: { xs: 75, md: 95 },
                                      cursor: 'pointer',
                                      background: 'rgba(255, 255, 255, 0.04)',
                                      border: isActive 
                                        ? '3px solid #FFD700' 
                                        : '2px solid rgba(255, 255, 255, 0.15)',
                                      borderRadius: 2.5,
                                      overflow: 'hidden',
                                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                      opacity: isActive ? 1 : 0.6,
                                      boxShadow: isActive
                                        ? '0 6px 20px rgba(255, 215, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.2) inset'
                                        : '0 2px 8px rgba(0, 0, 0, 0.3)',
                                      '&:hover': {
                                        borderColor: '#FFD700',
                                        opacity: 1,
                                        transform: 'translateX(4px) scale(1.05)',
                                        boxShadow: '0 8px 25px rgba(255, 215, 0, 0.5)',
                                      },
                                    }}
                                  >
                                    <Box
                                      component="img"
                                      src={src}
                                      alt={`Thumbnail ${i + 1}`}
                                      sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block',
                                      }}
                                    />
                                  </Card>
                                </motion.div>
                              );
                            })}
                          </Stack>
                        )}

                        {/* Main Large Image - Right Side */}
                        <Box
                          sx={{
                            flex: 1,
                            order: { xs: 1, md: 2 },
                            width: '100%',
                          }}
                        >
                          <Card
                            sx={{
                              width: '100%',
                              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: 4,
                              overflow: 'hidden',
                              boxShadow: '0 15px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <Box
                              sx={{
                                position: 'relative',
                                width: '100%',
                                height: { xs: 400, md: 600 },
                                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%)',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {activeImg && typeof activeImg === 'string' && activeImg.trim() !== '' ? (
                                <Box
                                  component="img"
                                  src={activeImg}
                                  alt={product.title || 'Product'}
                                  loading="lazy"
                                  onError={(e) => {
                                    console.error('Image failed to load:', activeImg);
                                    e.target.style.display = 'none';
                                  }}
                                  sx={{
                                    width: 'auto',
                                    height: 'auto',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    p: 4,
                                    display: 'block',
                                    transition: 'opacity 0.3s ease',
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    textAlign: 'center',
                                  }}
                                >
                                  <Typography variant="body2">No Image Available</Typography>
                                </Box>
                              )}
                              {product.badge && (
                                <Chip
                                  label={product.badge}
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    background: '#2196F3',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    zIndex: 1,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                  }}
                                />
                              )}
                            </Box>
                          </Card>
                        </Box>
                      </Box>
                    </motion.div>
                  ) : (
                    <Card
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        border: '2px dashed rgba(255, 255, 255, 0.2)',
                        minHeight: 400,
                      }}
                    >
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        No images available
                      </Typography>
                    </Card>
                  )}
                </Grid>

                {/* Right Section - Product Details */}
                <Grid item xs={12} md={7}>
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      {/* Product Title */}
                      <Typography
                        variant="h3"
                        sx={{
                          color: 'white',
                          fontWeight: 800,
                          mb: 1,
                          fontSize: { xs: '1.85rem', md: '2.5rem' },
                          lineHeight: 1.3,
                          letterSpacing: '-0.02em',
                          background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {product.title}
                      </Typography>

                      {/* Rating */}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1.5, 
                          mb: 1.5,
                          p: 1.25,
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          width: 'fit-content',
                        }}
                      >
                        <Rating
                          value={product.rating || 0}
                          precision={0.1}
                          readOnly
                          size="medium"
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#FFD700',
                            },
                            '& .MuiRating-iconEmpty': {
                              color: 'rgba(255, 255, 255, 0.15)',
                            },
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ 
                            color: 'rgba(255,255,255,0.75)', 
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          ({product.rating || 0}) {product.rating ? 'rating' : 'No ratings yet'}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                      {/* Price & Stock */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 1.5 }}>
                        <Typography
                          variant="h3"
                          sx={{
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 900,
                            fontSize: { xs: '2.25rem', md: '3rem' },
                            letterSpacing: '-0.03em',
                          }}
                        >
                          {formatLKR(product.price || 0)}
                        </Typography>
                        {product.inStock && (
                          <Chip
                            label="In Stock"
                            sx={{
                              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              px: 2,
                              height: 28,
                              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          />
                        )}
                      </Box>

                      {/* Description */}
                      {(product.description || product.desc) && (
                        <Box
                          sx={{
                            p: 1.5,
                            mb: 1.5,
                            borderRadius: 2.5,
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'rgba(255,255,255,0.9)',
                              lineHeight: 1.8,
                              fontSize: '0.95rem',
                            }}
                          >
                            {product.description || product.desc}
                          </Typography>
                        </Box>
                      )}

                      {/* Customization Section */}
                      {(category?.customization_color === 1 ||
                        category?.customization_size === 1 ||
                        category?.customization_text === 1 ||
                        category?.customization_image === 1) && (
                        <>
                          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 3,
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              mb: 1.5,
                            }}
                          >
                            <Typography
                              sx={{
                                color: 'white',
                                fontWeight: 700,
                                mb: 1.5,
                                fontSize: '1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                '&::before': {
                                  content: '""',
                                  width: 4,
                                  height: 20,
                                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
                                  borderRadius: 2,
                                },
                              }}
                            >
                              Customization Options
                            </Typography>

                          {category?.customization_color === 1 && (
                            <Box sx={{ mb: 1.5 }}>
                              <Typography
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.95)',
                                  fontWeight: 600,
                                  mb: 1,
                                  fontSize: '0.95rem',
                                }}
                              >
                                Color: <span style={{ color: '#FFD700', fontWeight: 700 }}>{color}</span>
                              </Typography>
                              <Stack direction="row" spacing={2} flexWrap="wrap">
                                {[
                                  { name: 'Black', color: '#000000' },
                                  { name: 'White', color: '#FFFFFF' },
                                  { name: 'Navy', color: '#001f3f' },
                                  { name: 'Red', color: '#FF0000' },
                                  { name: 'Blue', color: '#0000FF' },
                                  { name: 'Green', color: '#008000' },
                                ].map((colorOption) => (
                                  <Box
                                    key={colorOption.name}
                                    onClick={() => setColor(colorOption.name)}
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      borderRadius: '50%',
                                      border: color === colorOption.name 
                                        ? '3px solid #FFD700' 
                                        : '2px solid rgba(255, 255, 255, 0.2)',
                                      cursor: 'pointer',
                                      background: colorOption.color,
                                      boxShadow: color === colorOption.name 
                                        ? '0 6px 20px rgba(255, 215, 0, 0.5), 0 0 0 2px rgba(255, 215, 0, 0.2)' 
                                        : '0 2px 8px rgba(0, 0, 0, 0.3)',
                                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                      position: 'relative',
                                      '&:hover': {
                                        transform: 'scale(1.2)',
                                        borderColor: '#FFD700',
                                        boxShadow: '0 8px 25px rgba(255, 215, 0, 0.6)',
                                      },
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                          )}

                          {category?.customization_size === 1 && (
                            <Box sx={{ mb: 1.5 }}>
                              <Typography
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.95)',
                                  fontWeight: 600,
                                  mb: 1,
                                  fontSize: '0.95rem',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                }}
                              >
                                Size
                              </Typography>
                              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                                {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                                  <Button
                                    key={s}
                                    onClick={() => setSize(s)}
                                    variant={size === s ? 'contained' : 'outlined'}
                                    sx={{
                                      minWidth: 55,
                                      height: 48,
                                      borderRadius: 2.5,
                                      fontWeight: 700,
                                      fontSize: '0.9rem',
                                      borderColor: size === s ? '#FFD700' : 'rgba(255, 255, 255, 0.25)',
                                      color: size === s ? '#000' : 'rgba(255, 255, 255, 0.95)',
                                      background: size === s 
                                        ? 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)' 
                                        : 'rgba(255, 255, 255, 0.04)',
                                      boxShadow: size === s
                                        ? '0 4px 15px rgba(255, 215, 0, 0.4)'
                                        : 'none',
                                      '&:hover': {
                                        borderColor: '#FFD700',
                                        backgroundColor: size === s 
                                          ? 'linear-gradient(135deg, #FFA000 0%, #FFD700 100%)' 
                                          : 'rgba(255, 255, 255, 0.08)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: size === s
                                          ? '0 6px 20px rgba(255, 215, 0, 0.5)'
                                          : '0 4px 12px rgba(255, 215, 0, 0.2)',
                                      },
                                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                  >
                                    {s}
                                  </Button>
                                ))}
                              </Stack>
                            </Box>
                          )}

                          {category?.customization_text === 1 && (
                            <Box sx={{ mb: 1.5 }}>
                              <TextField
                                fullWidth
                                size="medium"
                                label="Custom Text"
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                                placeholder="Enter your custom text here"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                    borderRadius: 2.5,
                                    '& fieldset': {
                                      borderColor: 'rgba(255, 255, 255, 0.15)',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: 'rgba(255, 255, 255, 0.25)',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#FFD700',
                                      borderWidth: 2,
                                    },
                                  },
                                  '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': {
                                      color: '#FFD700',
                                    },
                                  },
                                }}
                              />
                            </Box>
                          )}

                          {category?.customization_image === 1 && (
                            <Box sx={{ mb: 1.5 }}>
                              <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUploadIcon />}
                                sx={{
                                  color: '#FFD700',
                                  borderColor: 'rgba(255,215,0,0.5)',
                                  textTransform: 'none',
                                  fontWeight: 700,
                                  py: 1.5,
                                  px: 3,
                                  borderRadius: 2.5,
                                  background: 'rgba(255, 215, 0, 0.05)',
                                  '&:hover': {
                                    borderColor: '#FFD700',
                                    backgroundColor: 'rgba(255, 215, 0, 0.15)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.3)',
                                  },
                                  transition: 'all 0.3s ease',
                                }}
                              >
                                Upload Your Image
                                <input
                                  hidden
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                />
                              </Button>
                              {imagePreview && (
                                <Box sx={{ mt: 2.5 }}>
                                  <CardMedia
                                    component="img"
                                    image={imagePreview}
                                    alt="Preview"
                                    sx={{
                                      maxWidth: 220,
                                      maxHeight: 220,
                                      borderRadius: 2.5,
                                      border: '2px solid rgba(255, 215, 0, 0.4)',
                                      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                                    }}
                                  />
                                </Box>
                              )}
                            </Box>
                          )}
                          </Box>
                        </>
                      )}

                      {/* Quantity and Add to Cart */}
                      <Box 
                        sx={{ 
                          mt: 2,
                          p: 1.5,
                          borderRadius: 3,
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                          <Typography
                            sx={{
                              color: 'rgba(255, 255, 255, 0.95)',
                              fontWeight: 600,
                              fontSize: '0.95rem',
                            }}
                          >
                            Quantity:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <IconButton
                              onClick={() => setQty(Math.max(1, qty - 1))}
                              sx={{
                                color: '#FFD700',
                                border: '2px solid rgba(255, 215, 0, 0.4)',
                                borderRadius: 2,
                                width: 40,
                                height: 40,
                                background: 'rgba(255, 215, 0, 0.05)',
                                '&:hover': {
                                  borderColor: '#FFD700',
                                  backgroundColor: 'rgba(255, 215, 0, 0.15)',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.3s ease',
                              }}
                            >
                              −
                            </IconButton>
                            <TextField
                              value={qty}
                              inputProps={{ 
                                min: 1,
                                readOnly: true,
                                style: { textAlign: 'center', width: 70, color: 'white', fontWeight: 700, cursor: 'default' }
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                  '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.15)',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.25)',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#FFD700',
                                  },
                                },
                              }}
                            />
                            <IconButton
                              onClick={() => setQty(qty + 1)}
                              sx={{
                                color: '#FFD700',
                                border: '2px solid rgba(255, 215, 0, 0.4)',
                                borderRadius: 2,
                                width: 40,
                                height: 40,
                                background: 'rgba(255, 215, 0, 0.05)',
                                '&:hover': {
                                  borderColor: '#FFD700',
                                  backgroundColor: 'rgba(255, 215, 0, 0.15)',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.3s ease',
                              }}
                            >
                              +
                            </IconButton>
                          </Box>
                        </Box>

                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={addingToCart ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <AddShoppingCartIcon />}
                          onClick={handleAddToCart}
                          disabled={addingToCart || !product}
                          sx={{
                            background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                            textTransform: 'none',
                            fontWeight: 700,
                            py: 1.5,
                            fontSize: '0.95rem',
                            borderRadius: 2.5,
                            boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                              transform: 'translateY(-3px)',
                              boxShadow: '0 10px 30px rgba(33, 150, 243, 0.5)',
                            },
                            '&:disabled': {
                              background: 'rgba(33, 150, 243, 0.5)',
                              transform: 'none',
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          {addingToCart ? 'ADDING...' : 'ADD TO CART'}
                        </Button>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </Card>

            {/* Related Products Section */}
            <Box sx={{ mt: 8 }}>
              <Typography
                variant="h4"
                sx={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  mb: 4,
                  fontSize: { xs: '1.85rem', md: '2.25rem' },
                  letterSpacing: '-0.02em',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -12,
                    left: 0,
                    width: 60,
                    height: 4,
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
                    borderRadius: 2,
                  },
                }}
              >
                Related Products
              </Typography>

              {relatedLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress sx={{ color: '#FFD700' }} />
                </Box>
              ) : relatedProducts.length > 0 ? (
                <Grid container spacing={3}>
                  <AnimatePresence mode="wait">
                    {relatedProducts.map((relatedProduct, index) => (
                      <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card
                            sx={{
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              background: 'rgba(255, 255, 255, 0.04)',
                              backdropFilter: 'blur(20px)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: 4,
                              overflow: 'hidden',
                              cursor: 'pointer',
                              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
                              '&:hover': {
                                transform: 'translateY(-12px) scale(1.02)',
                                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 215, 0, 0.2) inset',
                                borderColor: 'rgba(255, 215, 0, 0.4)',
                              },
                            }}
                            onClick={() => navigate(`/product/${relatedProduct.id}`)}
                          >
                            <Box sx={productCardStyles.imageContainer}>
                              <CardMedia
                                component="img"
                                image={relatedProduct.image || ''}
                                alt={relatedProduct.title || 'Product'}
                                sx={{
                                  ...productCardStyles.image,
                                  transition: 'transform 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                  },
                                }}
                              />
                            </Box>
                            <CardContent sx={productCardStyles.cardContent}>
                              <Typography variant="h6" sx={productCardStyles.title}>
                                {relatedProduct.title}
                              </Typography>
                              {(relatedProduct.description || relatedProduct.desc) && (
                                <Typography variant="body2" sx={productCardStyles.description}>
                                  {relatedProduct.description || relatedProduct.desc || ''}
                                </Typography>
                              )}
                              {!(relatedProduct.description || relatedProduct.desc) && (
                                <Box sx={productCardStyles.descriptionSpacer} />
                              )}
                              <Typography variant="h6" sx={productCardStyles.price}>
                                {formatLKR(relatedProduct.price || 0)}
                              </Typography>
                            </CardContent>
                            <CardActions sx={productCardStyles.cardActions}>
                              <Button
                                fullWidth
                                variant="outlined"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/product/${relatedProduct.id}`);
                                }}
                                sx={{
                                  color: '#FFD700',
                                  borderColor: 'rgba(255,215,0,0.5)',
                                  textTransform: 'none',
                                  fontWeight: 700,
                                  '&:hover': {
                                    borderColor: '#FFD700',
                                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                  },
                                }}
                              >
                                View
                              </Button>
                            </CardActions>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </AnimatePresence>
                </Grid>
              ) : (
                <Card
                  sx={{
                    p: 5,
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 3,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      mb: 1,
                    }}
                  >
                    No Related Products Available
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    There are no other products in this category at the moment.
                  </Typography>
                </Card>
              )}
            </Box>
          </>
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              backgroundColor: snackbar.severity === 'success' 
                ? 'rgba(76, 175, 80, 0.95)' 
                : 'rgba(211, 47, 47, 0.95)',
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

export default ProductDetailPage;
