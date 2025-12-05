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
  useTheme,
  useMediaQuery,
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
  YouTube,
  Phone,
  Email,
  LocationOn,
  Public,
} from '@mui/icons-material';
import logoImage from '../../assets/hero/DIGIMAAX_LOGO-01 1.png';
import { getSocialMediaLinks } from '../../api/socialMedia';
import { useTranslation } from '../../hooks/useTranslation';

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isLargeDisplay = useMediaQuery(theme.breakpoints.up('xl'));
  const isExtraLargeDisplay = useMediaQuery('(min-width: 1920px)');

  const quickLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.shop'), path: '/shop' },
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const services = [
    t('services.interiorDesign'),
    t('services.cctvSecurity'),
    t('services.printing3d'),
    t('services.advertising'),
    t('services.nameBoards'),
    t('services.cncDesign'),
  ];

  const SOCIAL_ICON_META = useMemo(
    () => ({
      facebook: { Icon: Facebook, color: '#1877F2' },
      instagram: { Icon: Instagram, color: '#E4405F' },
      twitter: { Icon: Twitter, color: '#1DA1F2' },
      linkedin: { Icon: LinkedIn, color: '#0077B5' },
      youtube: { Icon: YouTube, color: '#FF0000' },
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

  const getPolicyCopy = () => ({
    privacy: {
      title: t('policies.privacyTitle'),
      body: [
        t('policies.privacy1'),
        t('policies.privacy2'),
        t('policies.privacy3'),
      ],
    },
    terms: {
      title: t('policies.termsTitle'),
      body: [
        t('policies.terms1'),
        t('policies.terms2'),
        t('policies.terms3'),
      ],
    },
    cookies: {
      title: t('policies.cookiesTitle'),
      body: [
        t('policies.cookies1'),
        t('policies.cookies2'),
        t('policies.cookies3'),
      ],
    },
  });

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
    { icon: <Phone />, text: '09 73 22 12 64', link: 'tel:+33973221264' },
    { icon: <Phone />, text: '06 52 87 35 70', link: 'tel:+33652873570' },
    { icon: <Email />, text: 'digimaaxfr@gmail.com', link: 'mailto:digimaaxfr@gmail.com' },
    { icon: <LocationOn />, text: '74 Route de Villemomble, 93140 Bondy', link: null },
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
      <Container 
        maxWidth={isExtraLargeDisplay ? 'xl' : isLargeDisplay ? 'lg' : 'lg'}
        sx={{ px: isExtraLargeDisplay ? 6 : isLargeDisplay ? 4 : 3 }}
      >
        <Grid 
          container 
          spacing={isLargeDisplay ? 6 : 4}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
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
                    height: isLargeDisplay ? (isExtraLargeDisplay ? 140 : 120) : 100,
                    mb: isLargeDisplay ? 1.5 : 1,
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
                    mb: isLargeDisplay ? 1.5 : 1,
                    fontSize: isLargeDisplay 
                      ? (isExtraLargeDisplay ? '1.8rem' : '1.5rem')
                      : '1.3rem',
                  }}
                >
                  DIGIMAAX
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.5,
                    fontSize: isLargeDisplay 
                      ? (isExtraLargeDisplay ? '1.1rem' : '1rem')
                      : '0.85rem',
                  }}
                >
                  {t('footer.tagline')}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.5,
                    fontSize: isLargeDisplay 
                      ? (isExtraLargeDisplay ? '1.1rem' : '1rem')
                      : '0.85rem',
                  }}
                >
                  {t('footer.tagline2')}
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
                  mb: isLargeDisplay ? 2 : 1.5,
                  color: '#FFD700',
                  fontSize: isLargeDisplay 
                    ? (isExtraLargeDisplay ? '1.3rem' : '1.2rem')
                    : '1rem',
                }}
              >
                {t('footer.quickLinks')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: isLargeDisplay ? 1 : 0.8 }}>
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    onClick={() => navigate(link.path)}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      fontSize: isLargeDisplay 
                        ? (isExtraLargeDisplay ? '1.1rem' : '1rem')
                        : '0.85rem',
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
                {t('footer.ourServices')}
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
                {t('footer.getInTouch')}
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
                {t('footer.followUs')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {socialMedia.map((social, index) => (
                  <motion.div
                    key={social.id || index}
                    whileHover={{ scale: 1.1, rotate: 5 }}
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
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(15px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                        width: isLargeDisplay ? (isExtraLargeDisplay ? 56 : 52) : 48,
                        height: isLargeDisplay ? (isExtraLargeDisplay ? 56 : 52) : 48,
                        '& svg': {
                          fontSize: isLargeDisplay 
                            ? (isExtraLargeDisplay ? '28px' : '26px')
                            : '24px',
                        },
                        '&:hover': {
                          backgroundColor: social.color,
                          borderColor: social.color,
                          boxShadow: `0 12px 40px ${social.color}50`,
                          transform: 'translateY(-3px) scale(1.05)',
                          backdropFilter: 'blur(20px) saturate(200%)',
                          WebkitBackdropFilter: 'blur(20px) saturate(200%)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              alignItems: { xs: 'center', md: 'flex-start' },
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
            © {new Date().getFullYear()} DIGIMAAX. {t('footer.copyright')}
          </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.8rem',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              Developed by{' '}
              <Link
                href="https://thepandiyan.com"
                target="_blank"
                rel="noopener noreferrer"
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
              >
                The Pandiyan
              </Link>
            </Typography>
          </Box>
          
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
              {t('footer.privacyPolicy')}
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
              {t('footer.termsOfService')}
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
              {t('footer.cookiePolicy')}
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
          {policyDialog.type ? getPolicyCopy()[policyDialog.type]?.title : ''}
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
            getPolicyCopy()[policyDialog.type]?.body.map((paragraph, idx) => (
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
            {t('policies.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Footer;

