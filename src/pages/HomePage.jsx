import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/sections/HeroSection';
import ServicesSection from '../components/sections/ServicesSection';
import ProductsSection from '../components/sections/ProductsSection';
import AboutSection from '../components/sections/AboutSection';
import { Box, Container, Typography, Button, Card, CardMedia, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

import customMugImage from '../assets/products/shop/Customized Mug.jpg';
import customClockImage from '../assets/products/shop/Customized Wall Clock.jpg';
import shirtImage from '../assets/products/shop/shirt.jpg';
import tshirtImage from '../assets/products/shop/tshit.jpg';

import interiorDesignImage from '../assets/products/services/Desi.jpg';
import cctvImage from '../assets/products/services/CCTVInstallation.jpg';
import printingImage from '../assets/products/services/PrintedModels.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  const featuredServices = [
    {
      id: 1,
      title: 'Interior Design',
      description: 'Creates Emotional Impact: Well-Designed Spaces Influence Mood, Productivity, And Customer Experience. Professional designs that reflect your brand identity.',
      image: interiorDesignImage,
    },
    {
      id: 2,
      title: 'CCTV & Security Systems',
      description: 'Protect Your Premises With Professionally Installed Surveillance Systems. Advanced Technology For Complete Security Coverage And Peace Of Mind.',
      image: cctvImage,
    },
    {
      id: 3,
      title: '3D Printing Services',
      description: 'From Prototypes To Final Products. We Print On Various Materials With Precision, High Quality Finishes, And Fast Turnaround Times.',
      image: printingImage,
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Customized Mug',
      image: customMugImage,
      description: 'Personalized mugs for every occasion'
    },
    {
      id: 2,
      name: 'Customized Wall Clock',
      image: customClockImage,
      description: 'Unique wall clocks with custom designs'
    },
    {
      id: 3,
      name: 'Custom Shirt',
      image: shirtImage,
      description: 'Professional custom printed shirts'
    },
    {
      id: 4,
      name: 'Custom T-Shirt',
      image: tshirtImage,
      description: 'Trendy custom t-shirts'
    }
  ];

  const shopFeatures = [
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Shopping',
      description: 'Browse and order with just a few clicks'
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping'
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
      title: 'Quality Guaranteed',
      description: 'Premium products with warranty'
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Always here to help you'
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
              Our Featured Services
            </Typography>
            <Box
              sx={{
                width: '80px',
                height: '4px',
                background: 'linear-gradient(45deg, #2196F3, #FF4081)',
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
               From Interior Design to CCTV Installation, we offer comprehensive services to transform your ideas into reality
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
              {featuredServices.map((service, index) => (
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
                        />
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
                          {service.id}
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
              ))}
            </Box>

             <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/services')}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                  borderRadius: '25px',
                  px: 5,
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
                View All Services
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

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
              Shop With Us
            </Typography>
            <Box
              sx={{
                width: '80px',
                height: '4px',
                background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                borderRadius: '2px',
                mx: 'auto',
                mb: 2,
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
              Discover our collection of customized products. Make it yours!
            </Typography>

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
              {featuredProducts.map((product, index) => (
                <Box
                  key={product.id}
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
                    whileHover={{ y: -10 }}
                    style={{ width: '100%', display: 'flex' }}
                  >
                    <Card
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '15px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 12px 40px rgba(33, 150, 243, 0.3)',
                          border: '1px solid rgba(33, 150, 243, 0.5)',
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                        sx={{
                          objectFit: 'cover',
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: { xs: '1rem', md: '1.1rem' }
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: { xs: '0.85rem', md: '0.9rem' }
                          }}
                        >
                          {product.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Box>
              ))}
            </Box>

            <Box sx={{ textAlign: 'center', my: 6 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/shop')}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                  borderRadius: '25px',
                  px: 5,
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
                Visit Our Shop
              </Button>
            </Box>

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
                Why Choose Us
              </Typography>
              <Box
                sx={{
                  width: '60px',
                  height: '4px',
                  background: 'linear-gradient(45deg, #2196F3, #FF4081)',
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
                          color: '#2196F3',
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
