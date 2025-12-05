import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Box sx={{ background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)', minHeight: '100vh', pt: { xs: 8, md: 10 }, pb: 8 }}>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ color: '#FFD700', fontWeight: 900, mb: 1 }}>{t('notFound.title')}</Typography>
        <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>{t('notFound.message')}</Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ background: 'linear-gradient(45deg, #2196F3, #FF4081)', textTransform: 'none', fontWeight: 800 }}>{t('notFound.goHome')}</Button>
      </Container>
    </Box>
  );
};

export default NotFoundPage;


