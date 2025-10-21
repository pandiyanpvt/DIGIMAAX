import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      id="contact"
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
            Contact Us
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Coming Soon...
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ContactSection;