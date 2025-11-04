import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Link,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Telegram,
  Instagram,
  WhatsApp,
  Facebook,
  Twitter,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import logoImage from '../../assets/hero/DIGIMAAX_LOGO-01 1.png';

const Footer = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Shop', path: '/shop' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const services = [
    'Interior Design',
    'CCTV & Security',
    '3D Printing',
    'Advertising',
    'Name Boards',
    'CNC Design',
  ];

  const socialMedia = [
    { icon: <Facebook />, color: '#1877F2', label: 'Facebook' },
    { icon: <Instagram />, color: '#E4405F', label: 'Instagram' },
    { icon: <Twitter />, color: '#1DA1F2', label: 'Twitter' },
    { icon: <LinkedIn />, color: '#0A66C2', label: 'LinkedIn' },
    { icon: <WhatsApp />, color: '#25D366', label: 'WhatsApp' },
    { icon: <Telegram />, color: '#0088cc', label: 'Telegram' },
  ];

  const contactInfo = [
    { icon: <Phone />, text: '+33 1 23 45 67 89', link: 'tel:+33123456789' },
    { icon: <Email />, text: 'info@digimaax.com', link: 'mailto:info@digimaax.com' },
    { icon: <LocationOn />, text: 'Paris, France', link: null },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(180deg, #29085D 0%, #1a0540 50%, #0d0220 100%)',
        color: 'white',
        pt: { xs: 3, md: 4 },
        pb: 1,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent)',
        }
      }}
    >
      <Container maxWidth="lg">
        <Grid 
          container 
          spacing={4}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Grid item xs={12} sm={6} md={2.5}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box>
                <Box
                  component="img"
                  src={logoImage}
                  alt="DIGIMAAX Logo"
                  sx={{
                    height: 100,
                    mb: 1,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                    fontSize: '1.3rem',
                  }}
                >
                  DIGIMAAX
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.5,
                    fontSize: '0.85rem',
                  }}
                >
                  Where Ideas Become Environments. Creating innovative solutions
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.5,
                    fontSize: '0.85rem',
                  }}
                >
                  for interior design, advertising, and technology.
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  mb: 1.5,
                  color: '#FFD700',
                  fontSize: '1rem',
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    onClick={() => navigate(link.path)}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'inline-block',
                      '&:hover': {
                        color: '#FFD700',
                        transform: 'translateX(5px)',
                      },
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Box>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  mb: 1.5,
                  color: '#FFD700',
                  fontSize: '1rem',
                }}
              >
                Our Services
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                {services.map((service, index) => (
                  <Typography
                    key={index}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#FFD700',
                        transform: 'translateX(5px)',
                      },
                    }}
                  >
                    {service}
                  </Typography>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  mb: 1.5,
                  color: '#FFD700',
                  fontSize: '1rem',
                }}
              >
                Get In Touch
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                {contactInfo.map((contact, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        color: '#2196F3',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {contact.icon}
                    </Box>
                    {contact.link ? (
                      <Link
                        href={contact.link}
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          transition: 'color 0.3s ease',
                          '&:hover': {
                            color: '#FFD700',
                          },
                        }}
                      >
                        {contact.text}
                      </Link>
                    ) : (
                      <Typography
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.85rem',
                        }}
                      >
                        {contact.text}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>

              {/* Social Media */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  color: '#FFD700',
                  fontSize: '0.95rem',
                }}
              >
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                {socialMedia.map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      aria-label={social.label}
                      sx={{
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: 36,
                        height: 36,
                        '&:hover': {
                          backgroundColor: social.color,
                          borderColor: social.color,
                          boxShadow: `0 4px 15px ${social.color}40`,
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
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider
          sx={{
            mt: 3,
            mb: 2,
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.8rem',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            © {new Date().getFullYear()} DIGIMAAX. All rights reserved.
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Link
              href="#"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#FFD700',
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#FFD700',
                },
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#FFD700',
                },
              }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

