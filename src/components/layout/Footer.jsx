import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Link,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Telegram,
  Instagram,
  WhatsApp,
  Facebook,
  Twitter,
  Phone,
  Email,
  LocationOn,
  Public,
} from '@mui/icons-material';
import logoImage from '../../assets/hero/DIGIMAAX_LOGO-01 1.png';
import { getSocialMediaLinks } from '../../api/socialMedia';

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

  const SOCIAL_ICON_META = useMemo(
    () => ({
      facebook: { Icon: Facebook, color: '#1877F2' },
      instagram: { Icon: Instagram, color: '#E4405F' },
      twitter: { Icon: Twitter, color: '#1DA1F2' },
      whatsapp: { Icon: WhatsApp, color: '#25D366' },
      telegram: { Icon: Telegram, color: '#0088cc' },
      default: { Icon: Public, color: '#FFD700' },
    }),
    []
  );

  const buildSocialLinks = useCallback(
    (items = []) =>
      items
        .slice()
        .reverse()
        .map((item, index) => {
        const key = (item.social_media || '').toLowerCase().trim();
        const meta = SOCIAL_ICON_META[key] || SOCIAL_ICON_META.default;
        return {
          id: item.id || `social-${index}`,
          label: item.social_media || 'Social',
          href: item.link || '#',
          color: meta.color,
          Icon: meta.Icon,
        };
      }),
    [SOCIAL_ICON_META]
  );

  const fallbackSocialMedia = useMemo(
    () =>
      buildSocialLinks([
        { social_media: 'Facebook', link: 'https://facebook.com/digimaax' },
        { social_media: 'Instagram', link: 'https://instagram.com/digimaax' },
        { social_media: 'Twitter', link: 'https://twitter.com/digimaax' },
        { social_media: 'WhatsApp', link: 'https://wa.me/000000000' },
        { social_media: 'Telegram', link: 'https://t.me/digimaax' },
      ]),
    []
  );

  const [socialMedia, setSocialMedia] = useState(fallbackSocialMedia);
  const [policyDialog, setPolicyDialog] = useState({ open: false, type: null });

  const policyCopy = {
    privacy: {
      title: 'Privacy Policy',
      body: [
        'We collect only the data required to process your orders, provide customer support, and improve our services. This includes contact information, order history, and browsing activity on our website.',
        'Your personal information is never sold. We share data only with trusted service providers (such as payment gateways or logistics partners) strictly for fulfilling your requests.',
        'You can request data export or deletion at any time by contacting support@digimaax.com. We respond within 48 hours.',
      ],
    },
    terms: {
      title: 'Terms of Service',
      body: [
        'By using DIGIMAAX digital experiences, you agree to use our products and content responsibly and to comply with all applicable laws.',
        'All creative assets, graphics, and copy produced by DIGIMAAX remain our intellectual property unless otherwise stated in a signed agreement.',
        'Project timelines are estimates; final delivery dates are confirmed in the project statement of work.',
      ],
    },
    cookies: {
      title: 'Cookie Policy',
      body: [
        'DIGIMAAX uses first-party cookies for session management and analytics cookies to understand feature adoption.',
        'You can disable cookies from your browser settings at any time. Some experience elements — such as cart syncing — may not function without cookies.',
        'We never use cookies to capture sensitive data such as payment information.',
      ],
    },
  };

  const openPolicyDialog = (type) => {
    setPolicyDialog({ open: true, type });
  };

  const closePolicyDialog = () => {
    setPolicyDialog({ open: false, type: null });
  };

  useEffect(() => {
    let isMounted = true;
    const fetchSocialLinks = async () => {
      try {
        const { links } = await getSocialMediaLinks();
        const activeLinks = (links || []).filter(
          (link) => Number(link?.is_active) === 1 && link?.link
        );
        if (isMounted && activeLinks.length) {
          setSocialMedia(buildSocialLinks(activeLinks));
        }
      } catch (error) {
        console.error('Failed to load social media links', error);
      }
    };

    fetchSocialLinks();

    return () => {
      isMounted = false;
    };
  }, [buildSocialLinks]);

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
                        color: 'white',
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
                      component="a"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
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
                      <social.Icon />
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
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#FFD700',
                  cursor: 'pointer',
                },
              }}
              onClick={() => openPolicyDialog('privacy')}
            >
              Privacy Policy
            </Link>
            <Link
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#FFD700',
                  cursor: 'pointer',
                },
              }}
              onClick={() => openPolicyDialog('terms')}
            >
              Terms of Service
            </Link>
            <Link
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#FFD700',
                  cursor: 'pointer',
                },
              }}
              onClick={() => openPolicyDialog('cookies')}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>

      <Dialog
        open={policyDialog.open}
        onClose={closePolicyDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(180deg, rgba(16,6,36,0.95), rgba(7,2,18,0.98))',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 4,
            boxShadow: '0 25px 80px rgba(0,0,0,0.7)',
          },
        }}
      >
        <DialogTitle
          sx={{
            color: '#FFD700',
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {policyDialog.type ? policyCopy[policyDialog.type]?.title : ''}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            color: 'rgba(255,255,255,0.85)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            fontSize: '0.95rem',
            lineHeight: 1.6,
          }}
        >
          {policyDialog.type &&
            policyCopy[policyDialog.type]?.body.map((paragraph, idx) => (
              <Typography key={idx} component="p">
                {paragraph}
              </Typography>
            ))}
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Button
            onClick={closePolicyDialog}
            variant="contained"
            sx={{
              backgroundColor: '#1565C0',
              color: 'white',
              borderRadius: 3,
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 10px 30px rgba(33,150,243,0.3)',
              '&:hover': {
                backgroundColor: '#0D47A1',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Footer;

