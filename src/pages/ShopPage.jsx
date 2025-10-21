import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';

// Product images
import mugImg from '../assets/products/shop/Customized Mug.jpg';
import clockImg from '../assets/products/shop/Customized Wall Clock.jpg';
import shirtImg from '../assets/products/shop/shirt.jpg';
import tshirtImg from '../assets/products/shop/tshit.jpg';
import shopHero from '../assets/hero/shophero.jpg';

const shopItems = [
  { id: 1, title: 'Customized Mug', image: mugImg, tag: 'Popular' },
  { id: 2, title: 'Customized Wall Clock', image: clockImg, tag: 'New' },
  { id: 3, title: 'Custom Shirt', image: shirtImg, tag: 'Trending' },
  { id: 4, title: 'Custom T‑Shirt', image: tshirtImg, tag: 'Bestseller' },
];

const ShopPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 0,
        pb: 8,
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 'calc(100vh - 56px)', md: 'calc(100vh - 64px)' },
          mb: 4,
          borderRadius: 0,
          overflow: 'hidden',
          mx: 0,
        }}
      >
        <Box
          component="img"
          src={shopHero}
          alt="Shop hero"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'brightness(0.9)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.0) 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            p: { xs: 2, md: 4 },
          }}
        >
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
            Shop
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          

          <Grid container spacing={3}>
            {shopItems.map((item, index) => (
              <Grid key={item.id} item xs={12} sm={6} md={3}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="220"
                        image={item.image}
                        alt={item.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <Chip
                        label={item.tag}
                        size="small"
                        color="primary"
                        sx={{ position: 'absolute', top: 12, left: 12 }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button fullWidth variant="contained" color="primary">
                        Add to Cart
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      
    </Box>
  );
};

export default ShopPage;


