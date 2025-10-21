import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';

const AboutSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      id="about"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(270deg, #4B11A9 0%, #29085D 100%)',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 4,
              background: 'linear-gradient(45deg, #2196F3, #FF4081)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            About Us
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: { xs: '1rem', md: '1.1rem' },
            }}
          >
            Digimaax is a creative and technology-driven company based in France, specializing in interior design, advertising, name boards, and CNC design solutions. We combine artistic vision with precision engineering to help businesses stand out — whether it's through a beautifully designed space, a striking brand identity, or custom-built signage. Our team is passionate about delivering high-quality, tailored results that reflect each client's unique style and goals.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AboutSection;
