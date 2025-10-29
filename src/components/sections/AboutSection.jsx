import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowBackIos, ArrowForwardIos, FormatQuote } from '@mui/icons-material';
import ourStoryImage from '../../assets/hero/our-story.png';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO, TechStart Inc.',
    avatar: 'S',
    rating: 5,
    comment: 'Digimaax transformed our office space with their innovative interior design. The team was professional, creative, and delivered beyond our expectations!',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Marketing Director, BrandCo',
    avatar: 'M',
    rating: 5,
    comment: 'Their advertising solutions helped us increase our brand visibility by 300%. The custom name boards and signage are absolutely stunning!',
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Owner, Boutique Cafe',
    avatar: 'E',
    rating: 5,
    comment: 'The CNC design work was impeccable. Digimaax brought our vision to life with precision and artistry. Highly recommended!',
  },
  {
    id: 4,
    name: 'David Martinez',
    role: 'Operations Manager, RetailHub',
    avatar: 'D',
    rating: 5,
    comment: 'Working with Digimaax was a pleasure. Their attention to detail and commitment to quality is unmatched. They truly understand client needs.',
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    role: 'Director, Creative Studio',
    avatar: 'L',
    rating: 5,
    comment: 'From concept to execution, Digimaax exceeded all expectations. Their team is talented, responsive, and delivers exceptional results every time.',
  },
];

const AboutSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <Box
      id="about"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(270deg, #4B11A9 0%, #29085D 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ mb: 12, mt: 6 }}>
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: 8,
                color: '#fff',
                fontWeight: 'bold',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              Our Story
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 4, md: 6 },
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  width: '100%',
                }}
              >
                <Box
                  component="img"
                  src={ourStoryImage}
                  alt="Our Story"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 3,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                  }}
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  width: '100%',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    lineHeight: 1.9,
                    fontSize: { xs: '1rem', md: '1.15rem' },
                    textAlign: 'left',
                    mb: 3,
                  }}
                >
                  Founded with a vision to revolutionize the creative and technology landscape, Digimaax began its journey in France with a simple mission: to blend artistry with innovation. What started as a small team of passionate designers and engineers has grown into a leading company that serves clients across various industries.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    lineHeight: 1.9,
                    fontSize: { xs: '1rem', md: '1.15rem' },
                    textAlign: 'left',
                    mb: 3,
                  }}
                >
                  Our story is built on dedication, creativity, and a commitment to excellence. Every project we undertake is a testament to our belief that great design can transform spaces, elevate brands, and create lasting impressions. From our first interior design project to our cutting-edge CNC solutions, we've consistently pushed boundaries and exceeded expectations.
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Customer Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: 2,
                color: '#fff',
                fontWeight: 'bold',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              What Our Clients Say
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                mb: 6,
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              Don't just take our word for it - hear from our satisfied clients
            </Typography>

            <Box
              sx={{
                position: 'relative',
                maxWidth: '900px',
                mx: 'auto',
                overflow: 'hidden',
                minHeight: { xs: '400px', md: '340px' },
              }}
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  style={{ position: 'absolute', width: '100%' }}
                >
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 4,
                      p: { xs: 2, md: 4 },
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <FormatQuote sx={{ fontSize: 60, color: '#2196F3', opacity: 0.5 }} />
                      </Box>
                      
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#fff',
                          textAlign: 'center',
                          mb: 3,
                          fontSize: { xs: '1rem', md: '1.1rem' },
                          lineHeight: 1.8,
                          fontStyle: 'italic',
                        }}
                      >
                        "{testimonials[currentIndex].comment}"
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Rating
                          value={testimonials[currentIndex].rating}
                          readOnly
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#FFD700',
                            },
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, pb: 6 }}>
                        <Avatar
                          sx={{
                            bgcolor: '#2196F3',
                            width: 56,
                            height: 56,
                            fontSize: '1.5rem',
                          }}
                        >
                          {testimonials[currentIndex].avatar}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              color: '#fff',
                              fontWeight: 'bold',
                            }}
                          >
                            {testimonials[currentIndex].name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            {testimonials[currentIndex].role}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: 'absolute',
                  left: { xs: -10, md: -50 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: 'rgba(33, 150, 243, 0.3)',
                  },
                }}
              >
                <ArrowBackIos sx={{ ml: 1 }} />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: { xs: -10, md: -50 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: 'rgba(33, 150, 243, 0.3)',
                  },
                }}
              >
                <ArrowForwardIos />
              </IconButton>
            </Box>

            {/* Dots Indicator */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
              {testimonials.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  sx={{
                    width: currentIndex === index ? 32 : 12,
                    height: 12,
                    borderRadius: 6,
                    bgcolor: currentIndex === index ? '#2196F3' : 'rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: currentIndex === index ? '#2196F3' : 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AboutSection;
