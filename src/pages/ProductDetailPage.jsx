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
import { formatLKR } from '../utils/currency';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProducts } from '../services/products';
import { getCategoryById } from '../api/categories';
import { CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetailPage = () => {
  const [color, setColor] = useState('Black');
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [customText, setCustomText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImg, setActiveImg] = useState('');
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState('');

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
    if (!product) return;
    
    // Prepare customization data based on category settings
    const itemDetails = {
      quantity: qty || 1,
      color: category?.customization_color === 1 ? color : undefined,
      size: category?.customization_size === 1 ? size : undefined,
      customText: category?.customization_text === 1 && customText?.trim() ? customText.trim() : undefined,
      // TODO: Handle image file upload - need to upload image first to get URL
      customImageUrl: category?.customization_image === 1 && imagePreview ? imagePreview : undefined,
    };

    // Remove undefined values
    Object.keys(itemDetails).forEach(key => {
      if (itemDetails[key] === undefined) {
        delete itemDetails[key];
      }
    });

    await addToCart(product.id, itemDetails);
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
        background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)',
        minHeight: '100vh',
        pt: { xs: 8, md: 10 },
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.6)' }} />}
          sx={{ mb: 4 }}
        >
          <Link
            underline="hover"
            color="#FFD700"
            href="/shop"
            sx={{ cursor: 'pointer', '&:hover': { color: '#FFD700' } }}
            onClick={(e) => {
              e.preventDefault();
              navigate('/shop');
            }}
          >
            Shop
          </Link>
          {/* Only show category name if it's different from product title */}
          {product?.category_name && product?.category_name !== product?.title && (
            <Typography color="rgba(255,255,255,0.8)">{product.category_name}</Typography>
          )}
          <Typography color="white">{product?.title || 'Product'}</Typography>
        </Breadcrumbs>

        {error && (
          <Card
            sx={{
              p: 4,
              mb: 3,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3,
            }}
          >
            <Typography sx={{ color: 'white', mb: 2, fontSize: '1.1rem' }}>{error}</Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/shop')}
              sx={{
                background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                textTransform: 'none',
                fontWeight: 800,
                px: 3,
                py: 1,
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2, #E91E63)',
                },
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
                p: { xs: 2, md: 3 },
                mb: 6,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
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
                                      width: { xs: 70, md: 90 },
                                      height: { xs: 70, md: 90 },
                                      cursor: 'pointer',
                                      background: 'rgba(255, 255, 255, 0.06)',
                                      border: isActive 
                                        ? '3px solid #FFD700' 
                                        : '2px solid rgba(255, 255, 255, 0.2)',
                                      borderRadius: 2,
                                      overflow: 'hidden',
                                      transition: 'all 0.3s ease',
                                      opacity: isActive ? 1 : 0.7,
                                      boxShadow: isActive
                                        ? '0 4px 15px rgba(255, 215, 0, 0.5)'
                                        : '0 2px 6px rgba(0, 0, 0, 0.2)',
                                      '&:hover': {
                                        borderColor: '#FFD700',
                                        opacity: 1,
                                        transform: 'translateX(4px)',
                                        boxShadow: '0 4px 15px rgba(255, 215, 0, 0.6)',
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
                              background: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: 3,
                              overflow: 'hidden',
                              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                            }}
                          >
                            <Box
                              sx={{
                                position: 'relative',
                                width: '100%',
                                height: { xs: 400, md: 600 },
                                background: 'rgba(0, 0, 0, 0.2)',
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
                          fontWeight: 900,
                          mb: 2,
                          fontSize: { xs: '1.75rem', md: '2.25rem' },
                          lineHeight: 1.2,
                        }}
                      >
                        {product.title}
                      </Typography>

                      {/* Rating */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
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
                              color: 'rgba(255, 255, 255, 0.2)',
                            },
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}
                        >
                          ({product.rating || 0}) {product.rating ? 'rating' : 'No ratings yet'}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2.5, borderColor: 'rgba(255, 255, 255, 0.15)' }} />

                      {/* Price & Stock */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Typography
                          variant="h3"
                          sx={{
                            color: '#FFD700',
                            fontWeight: 900,
                            fontSize: { xs: '2rem', md: '2.5rem' },
                          }}
                        >
                          {formatLKR(product.price || 0)}
                        </Typography>
                        {product.inStock && (
                          <Chip
                            label="In Stock"
                            sx={{
                              background: '#4CAF50',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              px: 1.5,
                              height: 32,
                              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                            }}
                          />
                        )}
                      </Box>

                      {/* Description */}
                      {(product.description || product.desc) && (
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'rgba(255,255,255,0.85)',
                            mb: 3,
                            lineHeight: 1.7,
                            fontSize: '1rem',
                          }}
                        >
                          {product.description || product.desc}
                        </Typography>
                      )}

                      {/* Customization Section */}
                      {(category?.customization_color === 1 ||
                        category?.customization_size === 1 ||
                        category?.customization_text === 1 ||
                        category?.customization_image === 1) && (
                        <>
                          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.15)' }} />
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 700,
                              mb: 2.5,
                              fontSize: '1.1rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            Customization Options
                          </Typography>

                          {category?.customization_color === 1 && (
                            <Box sx={{ mb: 3 }}>
                              <Typography
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  fontWeight: 600,
                                  mb: 1.5,
                                  fontSize: '0.95rem',
                                }}
                              >
                                Color: <span style={{ color: '#FFD700' }}>{color}</span>
                              </Typography>
                              <Stack direction="row" spacing={1.5} flexWrap="wrap">
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
                                      width: 42,
                                      height: 42,
                                      borderRadius: '50%',
                                      border: color === colorOption.name ? '3px solid #FFD700' : '2px solid rgba(255, 255, 255, 0.3)',
                                      cursor: 'pointer',
                                      background: colorOption.color,
                                      boxShadow: color === colorOption.name 
                                        ? '0 4px 12px rgba(255, 215, 0, 0.4)' 
                                        : '0 2px 6px rgba(0, 0, 0, 0.2)',
                                      transition: 'all 0.3s ease',
                                      position: 'relative',
                                      '&:hover': {
                                        transform: 'scale(1.15)',
                                        borderColor: '#FFD700',
                                      },
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                          )}

                          {category?.customization_size === 1 && (
                            <Box sx={{ mb: 3 }}>
                              <Typography
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  fontWeight: 600,
                                  mb: 1.5,
                                  fontSize: '0.95rem',
                                  textTransform: 'uppercase',
                                }}
                              >
                                REGULAR
                              </Typography>
                              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                                {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                                  <Button
                                    key={s}
                                    onClick={() => setSize(s)}
                                    variant={size === s ? 'contained' : 'outlined'}
                                    sx={{
                                      minWidth: 50,
                                      height: 45,
                                      borderRadius: 2,
                                      fontWeight: 700,
                                      fontSize: '0.9rem',
                                      borderColor: 'rgba(255, 255, 255, 0.3)',
                                      color: size === s ? '#000' : 'rgba(255, 255, 255, 0.9)',
                                      background: size === s 
                                        ? 'linear-gradient(45deg, #FFD700, #FFA000)' 
                                        : 'rgba(255, 255, 255, 0.05)',
                                      '&:hover': {
                                        borderColor: '#FFD700',
                                        backgroundColor: size === s 
                                          ? 'rgba(255, 215, 0, 0.9)' 
                                          : 'rgba(255, 255, 255, 0.1)',
                                      },
                                      transition: 'all 0.3s ease',
                                    }}
                                  >
                                    {s}
                                  </Button>
                                ))}
                              </Stack>
                            </Box>
                          )}

                          {category?.customization_text === 1 && (
                            <Box sx={{ mb: 3 }}>
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
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    '& fieldset': {
                                      borderColor: 'rgba(255, 255, 255, 0.2)',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: 'rgba(255, 255, 255, 0.3)',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#FFD700',
                                    },
                                  },
                                  '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                  },
                                }}
                              />
                            </Box>
                          )}

                          {category?.customization_image === 1 && (
                            <Box sx={{ mb: 3 }}>
                              <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUploadIcon />}
                                sx={{
                                  color: '#FFD700',
                                  borderColor: 'rgba(255,215,0,0.6)',
                                  textTransform: 'none',
                                  fontWeight: 700,
                                  py: 1.5,
                                  px: 3,
                                  '&:hover': {
                                    borderColor: '#FFD700',
                                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                  },
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
                                <Box sx={{ mt: 2 }}>
                                  <CardMedia
                                    component="img"
                                    image={imagePreview}
                                    alt="Preview"
                                    sx={{
                                      maxWidth: 200,
                                      maxHeight: 200,
                                      borderRadius: 2,
                                      border: '2px solid rgba(255, 215, 0, 0.5)',
                                    }}
                                  />
                                </Box>
                              )}
                            </Box>
                          )}
                        </>
                      )}

                      {/* Quantity and Add to Cart */}
                      <Box sx={{ mt: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                          <Typography
                            sx={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontWeight: 600,
                              fontSize: '0.95rem',
                            }}
                          >
                            Quantity:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              onClick={() => setQty(Math.max(1, qty - 1))}
                              sx={{
                                color: '#FFD700',
                                border: '2px solid rgba(255, 215, 0, 0.5)',
                                borderRadius: 1,
                                width: 36,
                                height: 36,
                                '&:hover': {
                                  borderColor: '#FFD700',
                                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                },
                              }}
                            >
                              −
                            </IconButton>
                            <TextField
                              value={qty}
                              inputProps={{ 
                                min: 1,
                                readOnly: true,
                                style: { textAlign: 'center', width: 60, color: 'white', fontWeight: 700, cursor: 'default' }
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
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
                                border: '2px solid rgba(255, 215, 0, 0.5)',
                                borderRadius: 1,
                                width: 36,
                                height: 36,
                                '&:hover': {
                                  borderColor: '#FFD700',
                                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                },
                              }}
                            >
                              +
                            </IconButton>
                          </Box>
                        </Box>

                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<AddShoppingCartIcon />}
                          onClick={handleAddToCart}
                          sx={{
                            background: '#2196F3',
                            textTransform: 'none',
                            fontWeight: 800,
                            py: 1.75,
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
                            '&:hover': {
                              background: '#1976D2',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(33, 150, 243, 0.5)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          ADD TO CART
                        </Button>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </Card>

            {/* Related Products Section */}
            <Box sx={{ mt: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  mb: 3,
                  fontSize: { xs: '1.75rem', md: '2rem' },
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
                              background: 'rgba(255, 255, 255, 0.08)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: 3,
                              overflow: 'hidden',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                              '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                                borderColor: 'rgba(255, 215, 0, 0.5)',
                              },
                            }}
                            onClick={() => navigate(`/product/${relatedProduct.id}`)}
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
                                image={relatedProduct.image || ''}
                                alt={relatedProduct.title || 'Product'}
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  p: 2,
                                  transition: 'transform 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                  },
                                }}
                              />
                            </Box>
                            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
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
                                }}
                              >
                                {relatedProduct.title}
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: '#FFD700',
                                  fontWeight: 900,
                                  fontSize: '1.2rem',
                                }}
                              >
                                {formatLKR(relatedProduct.price || 0)}
                              </Typography>
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0 }}>
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
      </Container>
    </Box>
  );
};

export default ProductDetailPage;
