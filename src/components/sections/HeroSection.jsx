import React from 'react';
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
import { motion } from 'framer-motion';
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

  const socialIcons = [
    { icon: <Telegram />, color: '#0088cc' },
    { icon: <Instagram />, color: '#E4405F' },
    { icon: <Apple />, color: '#000000' },
    { icon: <WhatsApp />, color: '#25D366' },
  ];

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
          {/* Left Content */}
          <Grid item xs={12} md={6}>
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

              {/* Social Media Icons */}
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

          {/* Right Content - 3D Printer */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ position: 'relative' }}
            >
              <Box
                sx={{
                  position: 'relative',
                  height: isMobile ? '400px' : '600px',
                  display: 'flex',
                  alignItems: 'right',
                  justifyContent: 'flex-end',
                  paddingRight: isMobile ? 2 : 4,
                }}
              >
                {/* 3D Printer Image */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Box
                    component="img"
                    src={printerImage}
                    alt="3D Printer printing a blue teapot"
                    sx={{
                      width: isMobile ? '300px' : '500px',
                      height: isMobile ? '300px' : '500px',
                      objectFit: 'contain',
                      borderRadius: '20px',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
