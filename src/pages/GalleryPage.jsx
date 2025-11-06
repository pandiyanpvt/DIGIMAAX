import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close as CloseIcon, ZoomIn as ZoomInIcon } from '@mui/icons-material';

import gallery1 from '../assets/products/Gellary/2bae113f6e9839dd87fee0c9c3d2326f7aaf74c7.jpg';
import gallery2 from '../assets/products/Gellary/7ad6bc835097a5e543f9b4d8e92f2c86dd0fc1dc.jpg';
import gallery3 from '../assets/products/Gellary/b8e63afc60119e2b7f569522e7f62dfde200e4a6.jpg';
import gallery4 from '../assets/products/Gellary/Rectangle 19.png';
import gallery5 from '../assets/products/Gellary/Rectangle 18.png';
import gallery6 from '../assets/products/Gellary/Rectangle 17.png';
import gallery7 from '../assets/products/Gellary/Rectangle 20.png';
import gallery8 from '../assets/products/Gellary/Rectangle 14.png';
import gallery9 from '../assets/products/Gellary/Rectangle 15.png';
import gallery10 from '../assets/products/Gellary/Rectangle 11.png';
import gallery11 from '../assets/products/Gellary/Rectangle 16.png';
import gallery12 from '../assets/products/Gellary/Rectangle 13.png';
import gallery13 from '../assets/products/Gellary/Rectangle 12.png';
import gallery14 from '../assets/products/Gellary/Rectangle 10.png';

const GalleryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);

  const galleryItems = [
    {
      id: 1,
      title: 'Creative Design Work',
      category: 'Interior Design',
      image: gallery1,
      description: 'Artistic watercolor illustration with cosmic design elements'
    },
    {
      id: 2,
      title: 'Modern Office Space',
      category: 'Interior Design',
      image: gallery2,
      description: 'Industrial office interior with exposed ceiling and modern furniture'
    },
    {
      id: 3,
      title: 'Product Photography',
      category: 'Advertising',
      image: gallery3,
      description: 'Clean product shots with water droplets and professional lighting'
    },
    {
      id: 4,
      title: 'Brand Identity Design',
      category: 'Advertising',
      image: gallery4,
      description: 'Eco-friendly product branding and packaging design'
    },
    {
      id: 5,
      title: 'Character Design',
      category: 'Advertising',
      image: gallery5,
      description: 'Superhero character illustration and design work'
    },
    {
      id: 6,
      title: 'Architectural Photography',
      category: 'Interior Design',
      image: gallery6,
      description: 'Modern minimalist house exterior with clean lines'
    },
    {
      id: 7,
      title: 'Fashion Photography',
      category: 'Advertising',
      image: gallery7,
      description: 'Professional fashion shoot with elegant styling'
    },
    {
      id: 8,
      title: 'Fashion Editorial',
      category: 'Advertising',
      image: gallery8,
      description: 'Creative fashion editorial with abstract background'
    },
    {
      id: 9,
      title: 'Product Branding',
      category: 'Advertising',
      image: gallery9,
      description: 'Nature-inspired product branding and packaging'
    },
    {
      id: 10,
      title: 'Product Line Design',
      category: 'Printing',
      image: gallery10,
      description: 'Consistent product line design with nature themes'
    },
    {
      id: 11,
      title: 'Cosmetic Branding',
      category: 'Printing',
      image: gallery11,
      description: 'Luxury cosmetic product with elegant packaging design'
    },
    {
      id: 12,
      title: 'Kitchen Design',
      category: 'Interior Design',
      image: gallery12,
      description: 'Modern kitchen interior with light wood and stainless steel'
    },
    {
      id: 13,
      title: 'Perfume Branding',
      category: 'Printing',
      image: gallery13,
      description: 'Luxury perfume bottle design with floral elements'
    },
    {
      id: 14,
      title: 'Beverage Design',
      category: 'Printing',
      image: gallery14,
      description: 'Colorful soda can designs with fruit themes'
    }
  ];

  const filteredItems = galleryItems;

  const handleImageClick = (item) => {
    setSelectedImage(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #4B11A9 0%, #29085D 100%)',
        pt: { xs: 8, md: 10 },
        pb: 8,
      }}
    >
      <Container maxWidth={false} sx={{ px: 0 }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6, px: { xs: 2, md: 4 } }}>
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 'bold',
                fontFamily: 'sans-serif',
                mb: 2,
              }}
            >
              Our Gallery
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '1rem', md: '1.2rem' },
                fontFamily: 'sans-serif',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Explore our portfolio of creative projects and innovative solutions
            </Typography>
          </Box>
        </motion.div>

        {/* Category Filter removed */}

        {/* Gallery Grid - Uniform Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
              },
              gap: { xs: 1, sm: 1.5, md: 2 },
              px: { xs: 1, sm: 2, md: 3 },
            }}
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  sx={{
                    background: 'transparent',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      zIndex: 10,
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)',
                    },
                  }}
                  onClick={() => handleImageClick(item)}
                >
                  <Box sx={{ position: 'relative', aspectRatio: '1' }}>
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt={item.title}
                      sx={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        transition: 'transform 0.3s ease',
                        display: 'block',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '&:hover': {
                          opacity: 1,
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          color: 'white',
                          backgroundColor: 'rgba(255, 215, 0, 0.2)',
                          backdropFilter: 'blur(10px)',
                          mb: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 215, 0, 0.4)',
                          },
                        }}
                      >
                        <ZoomInIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Image Modal */}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              background: 'linear-gradient(180deg, #4B11A9 0%, #29085D 100%)',
              borderRadius: 3,
            },
          }}
        >
          <DialogContent sx={{ p: 0, position: 'relative' }}>
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            {selectedImage && (
              <>
                <Box
                  component="img"
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  sx={{
                    width: '100%',
                    height: { xs: '300px', md: '500px' },
                    objectFit: 'cover',
                  }}
                />
                <Box sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#FFD700',
                      fontWeight: 'bold',
                      mb: 1,
                      fontFamily: 'sans-serif',
                    }}
                  >
                    {selectedImage.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'white',
                      mb: 2,
                      fontFamily: 'sans-serif',
                    }}
                  >
                    {selectedImage.description}
                  </Typography>
                  {/* Category tag removed */}
                </Box>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default GalleryPage;
