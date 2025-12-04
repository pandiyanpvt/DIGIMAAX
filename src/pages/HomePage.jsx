import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/sections/HeroSection';
import ServicesSection from '../components/sections/ServicesSection';
import ProductsSection from '../components/sections/ProductsSection';
import AboutSection from '../components/sections/AboutSection';
import { Box, Container, Typography, Button, Card, CardMedia, CardContent, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';


import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { getServices } from '../api/services';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const backendServices = await getServices();
        
        // Transform backend data to featured services format
        // Take first 3 services for featured display
        const transformedServices = backendServices
          .slice(0, 3)
          .map((service, index) => {
            // Get first point as description, or use empty string
            const firstPoint = service.points && service.points.length > 0
              ? (language === 'fr' && service.points[0].point_french
                  ? service.points[0].point_french
                  : service.points[0].point)
              : '';
            
            // Get service name based on language
            const serviceName = language === 'fr' && service.name_french
              ? service.name_french
              : service.name;
            
            return {
              id: service.id,
              title: serviceName || 'Untitled Service',
              description: firstPoint || '',
              image: service.img_url || '',
            };
          });
        
        setFeaturedServices(transformedServices);
      } catch (err) {
        console.error('Error fetching services:', err);
        // Keep empty array on error
        setFeaturedServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [language]);

  const shopFeatures = [
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      title: t('features.easyShopping'),
      description: t('features.easyShoppingDesc')
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: t('features.fastDelivery'),
      description: t('features.fastDeliveryDesc')
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
      title: t('features.qualityGuaranteed'),
      description: t('features.qualityGuaranteedDesc')
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      title: t('features.support247'),
      description: t('features.support247Desc')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <HeroSection />
      
      <Box
        sx={{
          background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)',
        }}
      >
      <Box
        sx={{
          pt: { xs: 6, md: 10 },
          pb: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
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
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              {t('services.ourFeaturedServices')}
            </Typography>
            <Box
              sx={{
                width: '80px',
                height: '4px',
                background: 'white',
                borderRadius: '2px',
                mx: 'auto',
                mb: 6,
              }}
            />
             <Typography
               variant="h6"
               sx={{
                 textAlign: 'center',
                 color: 'rgba(255, 255, 255, 0.8)',
                 maxWidth: '700px',
                 mx: 'auto',
                 mb: 6,
                 fontSize: { xs: '1rem', md: '1.2rem' }
               }}
             >
               {t('services.featuredServicesDesc')}
             </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                mb: 6,
                justifyContent: 'center',
                alignItems: 'stretch',
              }}
            >
              {loadingServices ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 8 }}>
                  <CircularProgress sx={{ color: '#FFD700' }} />
                </Box>
              ) : featuredServices.length > 0 ? (
                featuredServices.map((service, index) => (
                  <Box
                    key={service.id}
                    sx={{
                      flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' },
                      display: 'flex',
                      minWidth: 0,
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      whileHover={{ y: -10 }}
                      style={{ width: '100%', display: 'flex' }}
                    >
                      <Card
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '20px',
                          border: '2px solid rgba(255, 215, 0, 0.3)',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            border: '2px solid rgba(255, 215, 0, 0.6)',
                            boxShadow: '0 15px 50px rgba(255, 215, 0, 0.3)',
                            transform: 'translateY(-5px)',
                          }
                        }}
                      >
                        {/* Service Image */}
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100%',
                            height: 250,
                            overflow: 'hidden',
                          }}
                        >
                          {service.image ? (
                            <CardMedia
                              component="img"
                              image={service.image}
                              alt={service.title}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                }
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '0.9rem',
                              }}
                            >
                              {language === 'fr' ? 'Pas d\'image' : 'No Image'}
                            </Box>
                          )}
                          {/* Overlay with service number */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 15,
                              left: 15,
                              width: 45,
                              height: 45,
                              backgroundColor: '#DC143C',
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '1.3rem',
                              boxShadow: '0 4px 15px rgba(220, 20, 60, 0.4)',
                            }}
                          >
                            {index + 1}
                          </Box>
                        </Box>

                        {/* Service Content */}
                        <CardContent 
                          sx={{ 
                            flexGrow: 1, 
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              color: '#FFD700',
                              fontWeight: 'bold',
                              mb: 2,
                              fontSize: { xs: '1.3rem', md: '1.5rem' },
                              fontFamily: 'sans-serif',
                            }}
                          >
                            {service.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.85)',
                              fontSize: { xs: '0.9rem', md: '1rem' },
                              lineHeight: 1.6,
                              fontFamily: 'sans-serif',
                            }}
                          >
                            {service.description}
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
                      ? 'Aucun service disponible pour le moment.' 
                      : 'No services available at the moment.'}
                  </Typography>
                </Box>
              )}
            </Box>

             <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/services')}
                sx={{
                  background: '#2196F3',
                  borderRadius: '25px',
                  px: 5,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
                  '&:hover': {
                    background: '#1976D2',
                    boxShadow: '0 12px 40px rgba(33, 150, 243, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {t('services.viewAllServices')}
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <ProductsSection />

      <Box
        sx={{
          pb: { xs: 6, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 4, mt: { xs: 6, md: 8 } }}>
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '1.8rem', md: '2.5rem' }
                }}
              >
                {t('features.whyChooseUs')}
              </Typography>
              <Box
                sx={{
                  width: '60px',
                  height: '4px',
                  background: 'white',
                  borderRadius: '2px',
                  mx: 'auto',
                }}
              />
            </Box>

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
              {shopFeatures.map((feature, index) => (
                <Box
                  key={index}
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
                    style={{ width: '100%', display: 'flex' }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: { xs: 'auto', md: '200px' },
                        minHeight: '200px',
                        textAlign: 'center',
                        p: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '15px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(33, 150, 243, 0.3)',
                          transform: 'translateY(-5px)',
                        }
                      }}
                    >
                      <Box
                        sx={{
                          color: 'white',
                          mb: 2,
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontWeight: 'bold',
                          mb: 1,
                          fontSize: { xs: '1rem', md: '1.1rem' }
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: { xs: '0.85rem', md: '0.9rem' }
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>
      </Box>

    </motion.div>
  );
};

export default HomePage;
