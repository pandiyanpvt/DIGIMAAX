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
import printerImage from '../../assets/hero/printing-teapot  1.png';

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

  const sliderImages = [
    printerImage,
    printerImage,
    printerImage,
    printerImage,
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [sliderImages.length]);

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
        background: 'linear-gradient(270deg, #4B11A9 0%, #29085D 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
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
                  color: 'text.secondary',
                  mb: 4,
                  fontWeight: 300,
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

          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ position: 'relative' }}
            >
              <Box
                sx={{
                  position: 'relative',
                  height: {
                    xs: '300px',        
                    sm: '350px',        
                    md: '400px',        
                    lg: '450px',        
                    xl: '500px',        
                  },
                  maxHeight: '60vh',    
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: isMobile ? 2 : 4,
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: { xs: '15px', sm: '20px', lg: '25px' },
                    boxShadow: {
                      xs: '0 10px 30px rgba(0, 0, 0, 0.3)',
                      sm: '0 15px 45px rgba(0, 0, 0, 0.3)',
                      lg: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    },
                    border: { xs: '1.5px solid rgba(255, 255, 255, 0.1)', lg: '2px solid rgba(255, 255, 255, 0.1)' },
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                      }}
                    >
                      <Box
                        component="img"
                        src={sliderImages[currentSlide]}
                        alt={`Hero image ${currentSlide + 1}`}
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
                      bottom: { xs: 15, sm: 20, lg: 25 },
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: { xs: 0.8, sm: 1, lg: 1.2 },
                      zIndex: 2,
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
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
