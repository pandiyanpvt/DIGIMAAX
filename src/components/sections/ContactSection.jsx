import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Email,
  Phone,
  LocationOn,
  Send,
  AccessTime,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';

const ContactSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Form state management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', formData);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        service: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact information data
  const contactInfo = [
    {
      icon: <LocationOn sx={{ fontSize: 30, color: '#1976d2' }} />,
      title: 'Address',
      details: ['123 Business Street', 'City, State 12345', 'United States'],
    },
    {
      icon: <Phone sx={{ fontSize: 30, color: '#1976d2' }} />,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
    },
    {
      icon: <Email sx={{ fontSize: 30, color: '#1976d2' }} />,
      title: 'Email',
      details: ['info@digimaax.com', 'support@digimaax.com'],
    },
    {
      icon: <AccessTime sx={{ fontSize: 30, color: '#1976d2' }} />,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM', 'Sun: Closed'],
    },
  ];

  const services = [
    '3D Printing',
    'Custom Design',
    'CCTV Installation',
    'Server Storage',
    'Interior Design',
    'LED Boards',
    'POS Systems',
    'Product Advertisement',
  ];

  return (
    <Box
      id="contact"
      sx={{
        minHeight: '100vh',
        py: 8,
        background: 'linear-gradient(270deg, #4B11A9 0%, #29085D 100%)',
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontFamily: 'sans-serif',
                pt: 8,
              }}
            >
              Get In Touch
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Ready to bring your ideas to life? Contact us today for a consultation on our 3D printing, design, and technology services.
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ width: '100%', display: 'flex' }}
            >
                <Card
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      mb: 3,
                      color: 'white',
                      fontFamily: 'sans-serif',
                    }}
                  >
                    Send us a Message
                  </Typography>
                  
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          error={!!errors.name}
                          helperText={errors.name}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#2196F3',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#2196F3',
                            },
                            '& .MuiOutlinedInput-input': {
                              color: 'white',
                            },
                            '& .MuiFormHelperText-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                          }}
                        />
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          error={!!errors.email}
                          helperText={errors.email}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#2196F3',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#2196F3',
                            },
                            '& .MuiOutlinedInput-input': {
                              color: 'white',
                            },
                            '& .MuiFormHelperText-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                          }}
                        />
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#2196F3',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#2196F3',
                            },
                            '& .MuiOutlinedInput-input': {
                              color: 'white',
                            },
                          }}
                        />
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Service Interest"
                          name="service"
                          value={formData.service}
                          onChange={handleInputChange}
                          select
                          SelectProps={{
                            native: true,
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#2196F3',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#2196F3',
                            },
                            '& .MuiOutlinedInput-input': {
                              color: 'white',
                            },
                            '& option': {
                              backgroundColor: '#1a0b2e',
                              color: 'white',
                            },
                          }}
                        >
                          <option value="">Select a service</option>
                          {services.map((service) => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          error={!!errors.subject}
                          helperText={errors.subject}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#2196F3',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#2196F3',
                            },
                            '& .MuiOutlinedInput-input': {
                              color: 'white',
                            },
                            '& .MuiFormHelperText-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                          }}
                        />
                      </Grid>
                      
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          error={!!errors.message}
                          helperText={errors.message}
                          multiline
                          rows={5}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#2196F3',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#2196F3',
                            },
                            '& .MuiOutlinedInput-input': {
                              color: 'white',
                            },
                            '& .MuiFormHelperText-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                          }}
                        />
                      </Grid>
                      
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={isSubmitting}
                          startIcon={<Send />}
                          sx={{
                            background: 'linear-gradient(45deg, #2196F3, #FF4081)',
                            borderRadius: '25px',
                            py: 1.5,
                            px: 4,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
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
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Contact Information */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ width: '100%', display: 'flex' }}
            >
              <Card
                  sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      mb: 3,
                      color: 'white',
                      fontFamily: 'sans-serif',
                    }}
                  >
                    Contact Information
                  </Typography>
                
                  {/* Contact Info Boxes in 2x2 Grid */}
                  <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
                {contactInfo.map((info, index) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={info.title} sx={{ display: 'flex' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                          style={{ height: '100%', width: '100%' }}
                  >
                    <Card
                      sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              backdropFilter: 'blur(5px)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        borderRadius: 2,
                              height: '100%',
                              minHeight: '160px',
                              display: 'flex',
                              flexDirection: 'column',
                        '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                            <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          {info.icon}
                          <Typography
                                  variant="subtitle1"
                            sx={{
                                    ml: 1.5,
                              fontWeight: 'bold',
                              color: 'white',
                              fontFamily: 'sans-serif',
                                    fontSize: '0.95rem',
                            }}
                          >
                            {info.title}
                          </Typography>
                        </Box>
                        {info.details.map((detail, idx) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              mb: 0.5,
                                    fontSize: '0.85rem',
                                    lineHeight: 1.4,
                            }}
                          >
                            {detail}
                          </Typography>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Social Media Links & Additional Info */}
                  <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        color: 'white',
                        fontFamily: 'sans-serif',
                        textAlign: 'center',
                      }}
                    >
                      Connect With Us
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <IconButton
                        sx={{
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          '&:hover': {
                            backgroundColor: '#1877F2',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Facebook />
                      </IconButton>
                      <IconButton
                        sx={{
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          '&:hover': {
                            backgroundColor: '#1DA1F2',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Twitter />
                      </IconButton>
                      <IconButton
                        sx={{
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          '&:hover': {
                            backgroundColor: '#E4405F',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Instagram />
                      </IconButton>
                      <IconButton
                        sx={{
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          '&:hover': {
                            backgroundColor: '#0A66C2',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <LinkedIn />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        textAlign: 'center',
                        mt: 2,
                        fontSize: '0.875rem',
                      }}
                    >
                      Follow us on social media for updates and news
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Success Message */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setShowSuccess(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            Message sent successfully! We'll get back to you soon.
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ContactSection;