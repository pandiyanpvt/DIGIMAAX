import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Telegram,
  Instagram,
  Apple,
  WhatsApp,
} from '@mui/icons-material';
import rectangle94 from '../../assets/hero/header-slider/Rectangle 94.png';
import rectangle95 from '../../assets/hero/header-slider/Rectangle 95.png';
import rectangle96 from '../../assets/hero/header-slider/Rectangle 96.png';
import rectangle97 from '../../assets/hero/header-slider/Rectangle 97.png';
import rectangle98 from '../../assets/hero/header-slider/Rectangle 98.png';
import rectangle99 from '../../assets/hero/header-slider/Rectangle 99.png';
import { getHeaderImages } from '../../api/headerImages';

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const socialIcons = [
    { icon: <Telegram />, color: '#0088cc' },
    { icon: <Instagram />, color: '#E4405F' },
    { icon: <Apple />, color: '#000000' },
    { icon: <WhatsApp />, color: '#25D366' },
  ];

  const fallbackImages = [
    rectangle94,
    rectangle95,
    rectangle96,
    rectangle97,
    rectangle98,
    rectangle99,
  ];

  const [sliderImages, setSliderImages] = useState(fallbackImages);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const slideInOffset = isMobile ? -60 : -120;

  useEffect(() => {
    let isMounted = true;

    const fetchHeaderImages = async () => {
      try {
        const { images } = await getHeaderImages({ min: 1, max: 6 });
        const ordered = images
          .filter((img) => img?.img_url)
          .sort((a, b) => (a.order_no || 0) - (b.order_no || 0))
          .map((img) => img.img_url);

        if (isMounted && ordered.length) {
          setSliderImages(ordered);
        }
      } catch (error) {
        console.error('Failed to load header images', error);
      }
    };

    fetchHeaderImages();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = sliderImages.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
      });

      Promise.all(imagePromises)
        .then(() => {
          setImagesLoaded(true);
        })
        .catch((error) => {
          console.error('Error preloading images:', error);
          setImagesLoaded(true);
        });
    };

    preloadImages();
  }, [sliderImages]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [sliderImages.length]);

  useEffect(() => {
    if (!imagesLoaded) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [sliderImages.length, imagesLoaded]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <Box
      id="home"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        {sliderImages.map((src, index) => (
          <Box
            key={`preload-${index}`}
            component="img"
            src={src}
            alt=""
            sx={{
              position: 'absolute',
              width: 0,
              height: 0,
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        ))}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: slideInOffset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <Box
              component="img"
              src={sliderImages[currentSlide]}
              alt={`Hero background ${currentSlide + 1}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </motion.div>
        </AnimatePresence>
        
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(41, 8, 93, 0.35) 0%, rgba(26, 5, 64, 0.5) 100%)',
            zIndex: 1,
          }}
        />
      </Box>

      {/* Content overlay */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 'bold',
                  color: 'white',
                  mb: 2,
                  position: 'relative',
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
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
                DIGIMAAX
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  fontWeight: 300,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                }}
              >
                Where Ideas Become Environments
              </Typography>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/shop')}
                  sx={{
                    mr: 2,
                    mb: 2,
                    background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                    borderRadius: '25px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2, #C2185B)',
                      boxShadow: '0 12px 40px rgba(33, 150, 243, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Order Now
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                  {socialIcons.map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        sx={{
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          '&:hover': {
                            backgroundColor: social.color,
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Slider indicators */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: { xs: 10, sm: 20, md: 30 },
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 0.8, sm: 1, lg: 1.2 },
          zIndex: 3,
        }}
      >
        {sliderImages.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            sx={{
              width: { xs: 8, sm: 10, lg: 12 },
              height: { xs: 8, sm: 10, lg: 12 },
              borderRadius: '50%',
              backgroundColor: currentSlide === index 
                ? 'white' 
                : 'rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                transform: 'scale(1.2)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroSection;
