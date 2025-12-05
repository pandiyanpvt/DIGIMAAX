import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getServices } from '../../api/services';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';

const ServicesSection = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const theme = useTheme();
  const isLargeDisplay = useMediaQuery(theme.breakpoints.up('xl'));
  const isExtraLargeDisplay = useMediaQuery('(min-width: 1920px)');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const backendServices = await getServices();
        
        const transformedServices = backendServices
          .filter((service) => service && service.id)
          .map((service) => {
            const points = service.points && Array.isArray(service.points) && service.points.length > 0
              ? service.points.filter((point) => point && point.point)
              : [];
            
            const imageUrl = service.img_url || '';
            
            return {
              id: service.id,
              name: service.name || 'Untitled Service',
              name_french: service.name_french || '',
              points: points,
              image: imageUrl,
              layout: 'left'
            };
          });
        
        setServices(transformedServices);
        
        if (transformedServices.length === 0) {
          setError('No services found');
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        const errorMessage = err?.response?.data?.error?.message 
          || err?.response?.data?.message 
          || err?.message 
          || 'Failed to load services';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [language]);

  // Footer services with translations
  const footerServices = [
    { 
      icon: '🌍', 
      title: t('services.internationalShipping'),
      description: t('services.internationalShippingDesc')
    },
    { 
      icon: '🚚', 
      title: t('services.doorToDoorTransport'),
      description: t('services.doorToDoorTransportDesc')
    },
    { 
      icon: '☀️', 
      title: t('services.climateControlled'),
      description: t('services.climateControlledDesc')
    },
    { 
      icon: '📞', 
      title: t('services.customerSupport247'),
      description: t('services.customerSupport247Desc')
    }
  ];

  const renderService = (service, index, totalServices) => {
    if (!service || !service.id) {
      return null;
    }

    return (
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
      >
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            {/* Content Side - Always Left */}
            <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 1 }}>
              <Box 
                sx={{ 
                  textAlign: { xs: 'center', md: 'left' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: '100%',
                  px: { xs: 2, md: 0 },
                  py: { xs: 2, md: 4 }
                }}
              >
                {/* Service Title */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    flexWrap: 'wrap',
                    mb: 3
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      backgroundColor: '#DC143C',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.3rem',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(220, 20, 60, 0.3)',
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      color: '#FFD700',
                      fontWeight: 'bold',
                      fontSize: { 
                        xs: '1.8rem', 
                        sm: '2.2rem', 
                        md: '2.5rem',
                        lg: '3rem',
                        xl: isExtraLargeDisplay ? '3.5rem' : '3.25rem',
                      },
                      fontFamily: 'sans-serif',
                      lineHeight: 1.2,
                      flex: 1,
                      minWidth: 0
                    }}
                  >
                    {language === 'fr' && service.name_french 
                      ? service.name_french 
                      : service.name}
                  </Typography>
                </Box>

                {/* Service Points with Design */}
                {service.points && service.points.length > 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: { xs: 1.5, md: 2 },
                      maxWidth: { xs: '100%', md: '450px' },
                    }}
                  >
                    {service.points.map((pointObj, pointIndex) => {
                      // Get the correct language text for the point
                      const pointText = language === 'fr' && pointObj.point_french
                        ? pointObj.point_french
                        : pointObj.point;
                      
                      return (
                        <Box
                          key={pointObj.id || pointIndex}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            p: { xs: 1.5, md: 2 },
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: 2,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              borderColor: 'rgba(255, 215, 0, 0.3)',
                              transform: 'translateX(4px)',
                              boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)',
                            },
                          }}
                        >
                          {/* Check Icon */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: 32,
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: '#FFD700',
                              color: '#4B11A9',
                              flexShrink: 0,
                              mt: 0.25,
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 20 }} />
                          </Box>
                          
                          {/* Point Text */}
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'white',
                              fontSize: { 
                                xs: '0.9rem', 
                                md: '1rem',
                                lg: '1.1rem',
                                xl: isExtraLargeDisplay ? '1.3rem' : '1.2rem',
                              },
                              lineHeight: 1.6,
                              fontFamily: 'sans-serif',
                              flex: 1,
                              opacity: 0.95,
                            }}
                          >
                            {pointText}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      fontStyle: 'italic',
                      textAlign: { xs: 'center', md: 'left' },
                    }}
                  >
                    {language === 'fr' 
                      ? 'Aucun point de service disponible.' 
                      : 'No service points available.'}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Image Side - Always Right */}
            <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 2 }}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  height: { 
                    xs: '250px', 
                    sm: '300px', 
                    md: '380px',
                    lg: '420px',
                    xl: isExtraLargeDisplay ? '500px' : '460px',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: { xs: 2, md: 0 }
                }}
              >
                {service.image ? (
                  <Box
                    component="img"
                    src={service.image}
                    alt={service.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 3,
                    }}
                    onError={(e) => {
                      // Hide broken image if URL fails to load
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
                      borderRadius: 3,
                      color: 'white',
                      fontSize: '0.9rem',
                      textAlign: 'center',
                      px: 2,
                    }}
                  >
                    No Image Available
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Connecting Arrow */}
        {index < totalServices - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: (index + 1) * 0.2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '3rem',
            }}
          >
            {/* Connector line (vertical) */}
            <Box
              sx={{
                width: '3px',
                height: { xs: '60px', md: '80px' },
                background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)',
                borderRadius: '2px',
                boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
              }}
            />
            {/* Down arrow head */}
            <Box
              sx={{
                mt: 1,
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '18px solid #FFD700',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(3px)',
                },
              }}
            />
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <Box
      id="services"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #4B11A9 0%, #29085D 100%)',
        py: { xs: 6, md: 10 },
        position: 'relative',
      }}
    >
      <Container 
        maxWidth={isExtraLargeDisplay ? 'lg' : isLargeDisplay ? 'md' : 'md'} 
        sx={{ px: { xs: 2, md: 4, xl: isExtraLargeDisplay ? 6 : 4 } }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Title */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10, xl: isLargeDisplay ? 12 : 10 } }}>
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontSize: { 
                  xs: '2.2rem', 
                  sm: '2.8rem', 
                  md: '3.5rem',
                  lg: '4rem',
                  xl: isExtraLargeDisplay ? '5rem' : '4.5rem',
                },
                fontWeight: 'bold',
                fontFamily: 'sans-serif',
                mb: isLargeDisplay ? 3 : 2,
                lineHeight: 1.2
              }}
            >
              {language === 'fr' ? 'Pourquoi Nous Choisir' : 'Why Choose US'}
            </Typography>
            <Box
              sx={{
                width: { 
                  xs: '60px', 
                  md: '80px',
                  lg: '100px',
                  xl: isExtraLargeDisplay ? '120px' : '110px',
                },
                height: isLargeDisplay ? '5px' : '4px',
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                borderRadius: '2px',
                mx: 'auto',
                boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
              }}
            />
          </Box>
          
          {/* Services */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress sx={{ color: '#FFD700' }} />
            </Box>
          ) : error ? (
            <Box sx={{ mb: 4 }}>
              <Alert severity="error" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                {error}
              </Alert>
            </Box>
          ) : services.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {services.map((service, index) => 
                renderService(service, index, services.length)
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: 'white', opacity: 0.7 }}>
                {language === 'fr' 
                  ? 'Aucun service disponible pour le moment.' 
                  : 'No services available at the moment.'}
              </Typography>
            </Box>
          )}

          {/* Footer Services */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            style={{ marginTop: '6rem' }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontSize: { 
                    xs: '1.8rem', 
                    md: '2.5rem',
                    lg: '3rem',
                    xl: isExtraLargeDisplay ? '3.5rem' : '3.25rem',
                  },
                  fontWeight: 'bold',
                  fontFamily: 'sans-serif',
                  mb: isLargeDisplay ? 3 : 2
                }}
              >
                {language === 'fr' ? 'Nos Services' : 'Our Services'}
              </Typography>
              <Box
                sx={{
                  width: { 
                    xs: '50px', 
                    md: '70px',
                    lg: '90px',
                    xl: isExtraLargeDisplay ? '110px' : '100px',
                  },
                  height: isLargeDisplay ? '4px' : '3px',
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  borderRadius: '2px',
                  mx: 'auto',
                  boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
                }}
              />
            </Box>
            
            <Grid container spacing={{ xs: 2, md: 2 }} sx={{ mt: 4 }}>
              {footerServices.map((item, index) => (
                <Grid size={{ xs: 6, sm: 3, md: 3 }} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Box
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(15px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '20px',
                        p: { xs: 2, md: 2.5 },
                        textAlign: 'center',
                        color: 'white',
                        height: { 
                          xs: '180px', 
                          sm: '200px', 
                          md: '220px',
                          lg: '240px',
                          xl: isExtraLargeDisplay ? '280px' : '260px',
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        overflow: 'hidden',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.15)',
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                          transform: 'translateY(-8px)',
                          backdropFilter: 'blur(20px) saturate(200%)',
                          WebkitBackdropFilter: 'blur(20px) saturate(200%)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                          borderRadius: '20px',
                          zIndex: -1,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        },
                        '&:hover::before': {
                          opacity: 1,
                        }
                      }}
                    >
                      {/* Icon */}
                      <Box
                        sx={{
                          fontSize: { 
                            xs: '1.8rem', 
                            md: '2.2rem',
                            lg: '2.5rem',
                            xl: isExtraLargeDisplay ? '3rem' : '2.75rem',
                          },
                          mb: { xs: 0.8, md: 1 },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: { 
                            xs: '50px', 
                            md: '60px',
                            lg: '70px',
                            xl: isExtraLargeDisplay ? '80px' : '75px',
                          },
                          height: { 
                            xs: '50px', 
                            md: '60px',
                            lg: '70px',
                            xl: isExtraLargeDisplay ? '80px' : '75px',
                          },
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 4px 15px rgba(255, 215, 0, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(255, 215, 0, 0.3)',
                            borderColor: 'rgba(255, 215, 0, 0.5)',
                            boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)',
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        {item.icon}
                      </Box>
                      
                      {/* Title */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: { 
                            xs: '0.75rem', 
                            sm: '0.8rem', 
                            md: '0.9rem',
                            lg: '1rem',
                            xl: isExtraLargeDisplay ? '1.2rem' : '1.1rem',
                          },
                          fontWeight: 'bold',
                          fontFamily: 'sans-serif',
                          mb: 0.5,
                          lineHeight: 1.1,
                          textAlign: 'center',
                          color: 'white',
                          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {item.title}
                      </Typography>
                      
                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { 
                            xs: '0.65rem', 
                            sm: '0.7rem', 
                            md: '0.75rem',
                            lg: '0.85rem',
                            xl: isExtraLargeDisplay ? '1rem' : '0.95rem',
                          },
                          fontWeight: 'medium',
                          fontFamily: 'sans-serif',
                          textAlign: 'center',
                          color: 'rgba(255, 255, 255, 0.9)',
                          lineHeight: 1.2,
                          textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ServicesSection;
