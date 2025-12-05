import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';
import { getProducts } from '../../services/products';

const ProductsSection = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const theme = useTheme();
  const isLargeDisplay = useMediaQuery(theme.breakpoints.up('xl'));
  const isExtraLargeDisplay = useMediaQuery('(min-width: 1920px)');
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // Fetch first 4 products, sorted by trending
        const result = await getProducts({
          limit: 4,
          page: 1,
          sort: 'trending',
        });
        setFeaturedProducts(result.products || []);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [language]);

  return (
    <Box
      id="products"
      sx={{
        background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)',
        pb: { xs: 6, md: 6 },
      }}
    >
      <Container 
        maxWidth={isExtraLargeDisplay ? 'xl' : isLargeDisplay ? 'lg' : 'lg'}
        sx={{ px: isExtraLargeDisplay ? 6 : isLargeDisplay ? 4 : 3 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              color: 'white',
              fontWeight: 'bold',
              mb: isLargeDisplay ? 3 : 2,
              fontSize: { 
                xs: '2rem', 
                md: '3rem',
                lg: '3.5rem',
                xl: isExtraLargeDisplay ? '4.5rem' : '4rem',
              }
            }}
          >
            {t('shop.shopWithUs')}
          </Typography>
          <Box
            sx={{
              width: isLargeDisplay ? (isExtraLargeDisplay ? '120px' : '100px') : '80px',
              height: isLargeDisplay ? '5px' : '4px',
              background: 'white',
              borderRadius: '2px',
              mx: 'auto',
              mb: isLargeDisplay ? 3 : 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: isLargeDisplay ? '900px' : '700px',
              mx: 'auto',
              mb: isLargeDisplay ? 8 : 6,
              fontSize: { 
                xs: '1rem', 
                md: '1.2rem',
                lg: '1.3rem',
                xl: isExtraLargeDisplay ? '1.5rem' : '1.4rem',
              }
            }}
          >
            {t('shop.shopDesc')}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
              gap: 3,
              mb: 6,
              justifyContent: 'center',
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 8 }}>
                <CircularProgress sx={{ color: '#2196F3' }} />
              </Box>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <Box
                  key={product.id}
                  sx={{
                    flex: { 
                      xs: '1 1 100%', 
                      sm: '1 1 calc(50% - 12px)', 
                      md: '1 1 calc(25% - 18px)' 
                    },
                    display: 'flex',
                    minWidth: 0,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    style={{ width: '100%', display: 'flex' }}
                  >
                    <Card
                      onClick={() => navigate(`/product/${product.id}`)}
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '15px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: '0 12px 40px rgba(33, 150, 243, 0.3)',
                          border: '1px solid rgba(33, 150, 243, 0.5)',
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height={isLargeDisplay ? (isExtraLargeDisplay ? 280 : 250) : 200}
                        image={product.image || product.primary_image || ''}
                        alt={product.title || product.name || 'Product'}
                        sx={{
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: { 
                              xs: '1rem', 
                              md: '1.1rem',
                              lg: '1.2rem',
                              xl: isExtraLargeDisplay ? '1.4rem' : '1.3rem',
                            }
                          }}
                        >
                          {product.title || product.name || 'Product'}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: { 
                              xs: '0.85rem', 
                              md: '0.9rem',
                              lg: '1rem',
                              xl: isExtraLargeDisplay ? '1.15rem' : '1.1rem',
                            }
                          }}
                        >
                          {product.description || ''}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Box>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {language === 'fr' 
                    ? 'Aucun produit disponible pour le moment.' 
                    : 'No products available at the moment.'}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ textAlign: 'center', my: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/shop')}
              sx={{
                background: '#2196F3',
                borderRadius: '25px',
                px: isLargeDisplay ? (isExtraLargeDisplay ? 7 : 6) : 5,
                py: isLargeDisplay ? 2 : 1.5,
                fontSize: isLargeDisplay 
                  ? (isExtraLargeDisplay ? '1.4rem' : '1.25rem')
                  : '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
                minHeight: isLargeDisplay ? '56px' : 'auto',
                '&:hover': {
                  background: '#1976D2',
                  boxShadow: '0 12px 40px rgba(33, 150, 243, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {t('shop.visitOurShop')}
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ProductsSection;