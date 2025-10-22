import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';

// Import service images
import interiorDesignImage from '../../assets/hero/Rectangle 94.png';
import advertisingImage from '../../assets/hero/Rectangle 95.png';
import printingImage from '../../assets/hero/Rectangle 96.png';
import securityImage from '../../assets/hero/Rectangle 97.png';
import nameBoardsImage from '../../assets/hero/Rectangle 98.png';
import cncImage from '../../assets/hero/Rectangle 99.png';

const ServicesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const services = [
    {
      id: 1,
      title: 'Interior Design',
      description: `Creates Emotional Impact:
Well-Designed Spaces Influence Mood, Productivity, And Customer Experience.

Supports Branding:
Interior Aesthetics Reflect A Company's Identity And Professionalism.

Boosts Property Value:
Especially Relevant In Hospitality And Commercial Sectors, Where Design Affects ROI.`,
      image: interiorDesignImage,
      layout: 'left' // Text Left, Image Right
    },
    {
      id: 2,
      title: 'Advertising',
      description: `Drives Visibility:
Strategic Advertising Campaigns Increase Brand Awareness And Market Presence.

Builds Trust:
Professional Marketing Materials Establish Credibility And Customer Confidence.

Supports Growth:
Customer Acquisition And Retention Through Targeted Advertising Solutions.`,
      image: advertisingImage,
      layout: 'left' // Text Left, Image Right
    },
    {
      id: 3,
      title: 'Customized Printing',
      description: `From Business Cards To Banners, T-Shirts To Textiles:
We Print On Various Materials Including Paper, Vinyl, Metal, And Cloth.

Vibrant Colors, Durable Finishes, And Fast Turnaround:
Quality Printing Services That Meet Your Business Needs.`,
      image: printingImage,
      layout: 'left' // Text Left, Image Right
    },
    {
      id: 4,
      title: 'CCTV & Security Systems',
      description: `Protect Your Premises With Professionally Installed Surveillance Systems, Tailored To Your Layout And Security Needs.

Advanced Technology:
High-Quality Cameras And Monitoring Systems For Complete Security Coverage.`,
      image: securityImage,
      layout: 'left' // Text Left, Image Right
    },
    {
      id: 5,
      title: 'Name Boards',
      description: `First Impression Matters:
Professional Name Boards Create Lasting Impact On Customers.

Brand Recognition:
Custom Designs That Reflect Your Business Identity And Values.

Durability And Style:
Using Materials Like Stainless Steel And Fiber For Long-Lasting Quality.`,
      image: nameBoardsImage,
      layout: 'left' // Text Left, Image Right
    },
    {
      id: 6,
      title: 'CNC Design',
      description: `Precision And Customization:
Computer-Controlled Manufacturing For Accurate And Detailed Results.

Efficiency:
Streamlined Production Process With Consistent Quality Output.

Versatility:
From Architecture To Electronics, CNC Design Serves Multiple Industries.`,
      image: cncImage,
      layout: 'left' // Text Left, Image Right
    }
  ];

  const footerServices = [
    { 
      icon: '🌍', 
      title: 'International Shipping',
      description: 'Global delivery services'
    },
    { 
      icon: '🚚', 
      title: 'Door-To-Door Transport Services',
      description: 'Convenient delivery options'
    },
    { 
      icon: '☀️', 
      title: 'Climate Controlled Travel Environments',
      description: 'Protected shipping conditions'
    },
    { 
      icon: '📞', 
      title: '24/7 Customer Support',
      description: 'Round-the-clock assistance'
    }
  ];

  const renderService = (service, index) => {
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
                    {service.id}
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      color: '#FFD700',
                      fontWeight: 'bold',
                      fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                      fontFamily: 'sans-serif',
                      lineHeight: 1.2,
                      flex: 1,
                      minWidth: 0
                    }}
                  >
                    {service.title}
                  </Typography>
                </Box>

                {/* Description */}
                <Typography
                  variant="body1"
                  sx={{
                    color: 'white',
                    fontSize: { xs: '0.95rem', md: '1.1rem' },
                    lineHeight: 1.7,
                    fontFamily: 'sans-serif',
                    whiteSpace: 'pre-line',
                    maxWidth: { xs: '100%', md: '450px' },
                    textAlign: { xs: 'center', md: 'left' },
                    opacity: 0.95
                  }}
                >
                  {service.description}
                </Typography>
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
                  height: { xs: '250px', sm: '300px', md: '380px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: { xs: 2, md: 0 }
                }}
              >
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
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Connecting Arrow */}
        {index < services.length - 1 && (
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
      <Container maxWidth="md" sx={{ px: { xs: 2, md: 4 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Title */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                fontWeight: 'bold',
                fontFamily: 'sans-serif',
                mb: 2,
                lineHeight: 1.2
              }}
            >
              Why Choose US
            </Typography>
            <Box
              sx={{
                width: { xs: '60px', md: '80px' },
                height: '4px',
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                borderRadius: '2px',
                mx: 'auto',
                boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
              }}
            />
          </Box>
          
          {/* Services */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {services.map((service, index) => renderService(service, index))}
          </Box>

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
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                  fontWeight: 'bold',
                  fontFamily: 'sans-serif',
                  mb: 2
                }}
              >
                Our Services
              </Typography>
              <Box
                sx={{
                  width: { xs: '50px', md: '70px' },
                  height: '3px',
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
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '20px',
                        p: { xs: 2, md: 2.5 },
                        textAlign: 'center',
                        color: '#000',
                        minHeight: { xs: '140px', md: '160px' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25)',
                          transform: 'translateY(-8px)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -8,
                          left: -8,
                          right: -8,
                          bottom: -8,
                          background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 255, 255, 0.1))',
                          borderRadius: '28px',
                          zIndex: -1,
                        }
                      }}
                    >
                      {/* Icon */}
                      <Box
                        sx={{
                          fontSize: { xs: '1.8rem', md: '2.2rem' },
                          mb: { xs: 0.8, md: 1 },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: { xs: '50px', md: '60px' },
                          height: { xs: '50px', md: '60px' },
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
                        }}
                      >
                        {item.icon}
                      </Box>
                      
                      {/* Title */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' },
                          fontWeight: 'bold',
                          fontFamily: 'sans-serif',
                          mb: 0.5,
                          lineHeight: 1.1,
                          textAlign: 'center',
                          color: '#333',
                        }}
                      >
                        {item.title}
                      </Typography>
                      
                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                          fontWeight: 'medium',
                          fontFamily: 'sans-serif',
                          textAlign: 'center',
                          color: '#666',
                          lineHeight: 1.2,
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
