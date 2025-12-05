import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
} from '@mui/material';
import { Menu as MenuIcon, AccountCircle, Logout, Person, ShoppingCart } from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoImage from '../../assets/hero/DIGIMAAX_LOGO-01 1.png';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isMedium = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeDisplay = useMediaQuery(theme.breakpoints.up('xl'));
  const isExtraLargeDisplay = useMediaQuery('(min-width: 1920px)');
  const location = useLocation();
  const navigate = useNavigate();
  const { openSignInModal, user, signOut, isAuthenticated } = useAuth();
  const { getCartTotalItems, setCartDrawerOpen } = useCart();
  const { language, changeLanguage, languages, currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const cartItemCount = getCartTotalItems();

  useEffect(() => {
    // Use a consistent navbar style across all pages (no scroll-based changes)
    setScrolled(true);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLanguageChange = (langCode) => {
    if (language !== langCode) {
      changeLanguage(langCode);
    }
    handleLanguageMenuClose();
  };

  const handleSignOut = () => {
    signOut();
    handleProfileMenuClose();
  };

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      // Already on home page, prevent navigation and scroll to hero section
      e.preventDefault();
      const heroSection = document.getElementById('home');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback: scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Navigate to home page, then scroll to hero section after navigation
      e.preventDefault();
      navigate('/', { replace: false });
      // Wait for navigation and page load, then scroll to hero section
      // Using multiple timeouts to ensure the element is rendered
      setTimeout(() => {
        const scrollToHero = () => {
          const heroSection = document.getElementById('home');
          if (heroSection) {
            heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            // Retry after a short delay if element not found
            setTimeout(scrollToHero, 50);
          }
        };
        scrollToHero();
      }, 150);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const navItems = [
    { name: t('nav.home'), to: '/' },
    { name: t('nav.about'), to: '/about' },
    { name: t('nav.services'), to: '/services' },
    { name: t('nav.gallery'), to: '/gallery' },
    { name: t('nav.shop'), to: '/shop' },
    { name: t('nav.contact'), to: '/contact' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box
        component="img"
        src={logoImage}
        alt="DIGIMAAX Logo"
        sx={{
          height: '50px',
          width: 'auto',
          objectFit: 'contain',
          my: 2,
        }}
      />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              component={RouterLink}
              to={item.to}
              sx={{ 
                textAlign: 'center',
                color: location.pathname === item.to ? '#FFD700' : 'inherit',
                fontWeight: location.pathname === item.to ? 'bold' : 'normal',
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {/* Cart Icon for Mobile - Only visible when authenticated */}
      {isAuthenticated && (
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <ListItemButton
            onClick={() => {
              setCartDrawerOpen(true);
              handleDrawerToggle();
            }}
            sx={{
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Badge 
              badgeContent={cartItemCount} 
              color="error" 
              sx={{ 
                mr: 2,
                '& .MuiBadge-badge': {
                  fontSize: '0.7rem',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 4px',
                  backgroundColor: '#FF4081',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
            >
              <ShoppingCart sx={{ fontSize: '28px', color: 'white' }} />
            </Badge>
            <ListItemText 
              primary={t('nav.shoppingCart')} 
              secondary={`${cartItemCount} ${cartItemCount !== 1 ? t('nav.itemsPlural') : t('nav.items')}`}
              primaryTypographyProps={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}
              secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}
            />
          </ListItemButton>
        </Box>
      )}

      {/* Language Selector for Mobile */}
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, fontSize: '0.875rem' }}>
          {t('nav.language')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {languages.map((lang) => (
            <Button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
              }}
              variant={language === lang.code ? 'contained' : 'outlined'}
              size="small"
              sx={{
                flex: 1,
                textTransform: 'none',
                borderRadius: '8px',
                backgroundColor: language === lang.code ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                borderColor: language === lang.code ? '#FFD700' : 'rgba(255, 255, 255, 0.3)',
                color: language === lang.code ? '#FFD700' : 'white',
                fontWeight: language === lang.code ? 600 : 400,
                '&:hover': {
                  backgroundColor: language === lang.code ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  borderColor: language === lang.code ? '#FFD700' : 'rgba(255, 255, 255, 0.5)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box
                  component="img"
                  src={lang.flag}
                  alt={lang.name}
                  sx={{
                    width: '20px',
                    height: '15px',
                    objectFit: 'cover',
                    borderRadius: '2px',
                  }}
                />
                <Typography variant="body2">{lang.name}</Typography>
              </Box>
            </Button>
          ))}
        </Box>
      </Box>

      {/* Sign In Button or User Profile for Mobile */}
      <Box sx={{ px: 3, pb: 2 }}>
        {isAuthenticated && user ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 14px rgba(33, 150, 243, 0.4)',
              }}
            >
              {getInitials(user.firstName, user.lastName)}
            </Avatar>
            <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
              {user.email}
            </Typography>
            <Button
              onClick={handleSignOut}
              variant="outlined"
              fullWidth
              startIcon={<Logout />}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              {t('nav.signOut')}
            </Button>
          </Box>
        ) : (
          <Button
            onClick={openSignInModal}
            variant="outlined"
            size="large"
            fullWidth
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              py: 1.5,
              borderRadius: '25px',
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {t('nav.signIn')}
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'rgba(15, 15, 25, 0.28)',
          backdropFilter: 'blur(12px) saturate(140%)',
          WebkitBackdropFilter: 'blur(12px) saturate(140%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          py: 1,
          px: { xs: 1, sm: 2, md: 2, lg: 3 },
          overflow: 'hidden',
        }}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box
              component={RouterLink}
              to="/"
              onClick={handleLogoClick}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                flexShrink: 0,
                outline: 'none',
                backgroundColor: 'transparent !important',
                color: 'transparent',
                '&:focus': {
                  outline: 'none !important',
                  boxShadow: 'none !important',
                  backgroundColor: 'transparent !important',
                  color: 'transparent',
                },
                '&:focus-visible': {
                  outline: 'none !important',
                  boxShadow: 'none !important',
                  backgroundColor: 'transparent !important',
                  color: 'transparent',
                },
                '&:active': {
                  backgroundColor: 'transparent !important',
                  color: 'transparent',
                },
                '&:hover': {
                  backgroundColor: 'transparent !important',
                  color: 'transparent',
                },
                '&::before': {
                  display: 'none',
                },
                '&::after': {
                  display: 'none',
                },
              }}
            >
              <Box
                component="img"
                src={logoImage}
                alt="DIGIMAAX Logo"
                sx={{
                  height: isMobile 
                    ? '40px' 
                    : isMedium 
                      ? '45px' 
                      : isLargeDisplay
                        ? (isExtraLargeDisplay ? '60px' : '55px')
                        : '50px',
                  width: 'auto',
                  objectFit: 'contain',
                  cursor: 'pointer',
                  opacity: 1,
                  filter: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                    filter: 'none',
                  },
                  '&:active': {
                    filter: 'none',
                    opacity: 1,
                  },
                  '&:hover': {
                    filter: 'none',
                    opacity: 1,
                  },
                }}
              />
            </Box>
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              gap: isMedium 
                ? 0.75 
                : isLargeDisplay 
                  ? (isExtraLargeDisplay ? 3 : 2.5)
                  : 2, 
              alignItems: 'center',
              flex: 1,
              justifyContent: 'flex-end',
              minWidth: 0,
              maxWidth: '100%',
              overflow: 'hidden',
              flexWrap: 'nowrap',
            }}>
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={RouterLink}
                    to={item.to}
                    sx={{
                      color: location.pathname === item.to ? '#FFD700' : 'white',
                      fontWeight: location.pathname === item.to ? 'bold' : 'medium',
                      textTransform: 'none',
                      fontSize: isMedium 
                        ? '0.875rem' 
                        : isLargeDisplay
                          ? (isExtraLargeDisplay ? '1.2rem' : '1.1rem')
                          : '1rem',
                      position: 'relative',
                      px: isMedium 
                        ? 1 
                        : isLargeDisplay 
                          ? (isExtraLargeDisplay ? 2.5 : 2)
                          : 1.5,
                      py: isMedium 
                        ? 0.5 
                        : isLargeDisplay 
                          ? 1
                          : 0.75,
                      minWidth: 'auto',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        width: location.pathname === item.to ? '100%' : 0,
                        height: isLargeDisplay ? '3px' : '2px',
                        backgroundColor: '#FFD700',
                        transition: 'all 0.3s ease',
                        transform: 'translateX(-50%)',
                      },
                      '&:hover::after': {
                        width: '100%',
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                </motion.div>
              ))}
              
              {/* Language Dropdown */}
              <Button
                onClick={handleLanguageMenuOpen}
                sx={{
                  color: 'white',
                  fontWeight: 'medium',
                  textTransform: 'none',
                  fontSize: isMedium 
                    ? '0.875rem' 
                    : isLargeDisplay
                      ? (isExtraLargeDisplay ? '1.2rem' : '1.1rem')
                      : '1rem',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  minWidth: isMedium 
                    ? '100px' 
                    : isLargeDisplay
                      ? (isExtraLargeDisplay ? '150px' : '140px')
                      : '120px',
                  justifyContent: 'flex-start',
                  whiteSpace: 'nowrap',
                  px: isMedium 
                    ? 1 
                    : isLargeDisplay 
                      ? (isExtraLargeDisplay ? 2.5 : 2)
                      : 1.5,
                  py: isMedium 
                    ? 0.5 
                    : isLargeDisplay 
                      ? 1
                      : 0.75,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.05)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: Boolean(languageMenuAnchor) ? '100%' : 0,
                    height: isLargeDisplay ? '3px' : '2px',
                    backgroundColor: '#FFD700',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)',
                  },
                  '&:hover::after': {
                    width: '100%',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Box
                  component="img"
                  src={currentLanguage.flag}
                  alt={currentLanguage.name}
                  sx={{
                    width: isMedium 
                      ? '20px' 
                      : isLargeDisplay
                        ? (isExtraLargeDisplay ? '28px' : '26px')
                        : '24px',
                    height: isMedium 
                      ? '15px' 
                      : isLargeDisplay
                        ? (isExtraLargeDisplay ? '21px' : '19px')
                        : '18px',
                    objectFit: 'cover',
                    borderRadius: '2px',
                    flexShrink: 0,
                  }}
                />
                <Typography
                  component="span"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                  }}
                >
                  {currentLanguage.name}
                </Typography>
              </Button>
              
              {/* Sign In Button or User Profile */}
              {isAuthenticated && user ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Box
                      onClick={handleProfileMenuOpen}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: isMedium 
                          ? 0.75 
                          : isLargeDisplay 
                            ? 1.25
                            : 1,
                        px: isMedium 
                          ? 1 
                          : isLargeDisplay 
                            ? (isExtraLargeDisplay ? 2.5 : 2)
                            : 1.5,
                        py: isMedium 
                          ? 0.4 
                          : isLargeDisplay 
                            ? 0.75
                            : 0.5,
                        ml: isMedium ? 0.5 : isLargeDisplay ? 1.5 : 1,
                        borderRadius: '25px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                        },
                      }}
                    >
                      <Person sx={{ 
                        fontSize: isMedium 
                          ? '18px' 
                          : isLargeDisplay
                            ? (isExtraLargeDisplay ? '24px' : '22px')
                            : '20px', 
                        color: 'white' 
                      }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 500,
                          fontSize: isMedium 
                            ? '0.8rem' 
                            : isLargeDisplay
                              ? (isExtraLargeDisplay ? '1.1rem' : '1rem')
                              : '0.9rem',
                          whiteSpace: 'nowrap',
                          display: { md: isMedium ? 'none' : 'block', lg: 'block' },
                        }}
                      >
                        {user.firstName} {user.lastName}
                      </Typography>
                    </Box>
                  </motion.div>
                  
                  {/* Cart Icon - Only visible when authenticated */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <IconButton
                      onClick={() => setCartDrawerOpen(true)}
                      sx={{
                        width: isMedium 
                          ? 40 
                          : isLargeDisplay
                            ? (isExtraLargeDisplay ? 56 : 52)
                            : 45,
                        height: isMedium 
                          ? 40 
                          : isLargeDisplay
                            ? (isExtraLargeDisplay ? 56 : 52)
                            : 45,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        padding: '8px',
                        marginLeft: isMedium 
                          ? '4px' 
                          : isLargeDisplay 
                            ? '12px'
                            : '8px',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Badge 
                        badgeContent={cartItemCount} 
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: isLargeDisplay ? '0.8rem' : '0.7rem',
                            minWidth: isLargeDisplay ? '20px' : '18px',
                            height: isLargeDisplay ? '20px' : '18px',
                            padding: '0 4px',
                            backgroundColor: '#FF4081',
                            color: 'white',
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        <ShoppingCart sx={{ 
                          fontSize: isMedium 
                            ? '20px' 
                            : isLargeDisplay
                              ? (isExtraLargeDisplay ? '28px' : '26px')
                              : '24px', 
                          color: 'white' 
                        }} />
                      </Badge>
                    </IconButton>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={openSignInModal}
                    variant="outlined"
                    size="large"
                    sx={{
                      textTransform: 'none',
                      fontSize: isMedium 
                        ? '0.875rem' 
                        : isLargeDisplay
                          ? (isExtraLargeDisplay ? '1.2rem' : '1.1rem')
                          : '1rem',
                      fontWeight: 600,
                      px: isMedium 
                        ? 2.5 
                        : isLargeDisplay 
                          ? (isExtraLargeDisplay ? 6 : 5)
                          : 4,
                      py: isMedium 
                        ? 0.75 
                        : isLargeDisplay 
                          ? 1.25
                          : 1,
                      minWidth: isMedium 
                        ? '100px' 
                        : isLargeDisplay
                          ? (isExtraLargeDisplay ? '180px' : '160px')
                          : '140px',
                      whiteSpace: 'nowrap',
                      borderRadius: '25px',
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      minHeight: isLargeDisplay ? '56px' : 'auto',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {t('nav.signIn')}
                  </Button>
                </motion.div>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 250,
              background: 'linear-gradient(270deg, #4B11A9 0%, #29085D 100%)',
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>

      {/* Profile Menu Dropdown */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            background: 'rgba(26, 26, 46, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              {user && getInitials(user.firstName, user.lastName)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {user?.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        <MenuItem
          onClick={() => {
            navigate('/profile');
            handleProfileMenuClose();
          }}
          sx={{
            color: 'white',
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
            },
          }}
        >
          <Person sx={{ mr: 2, fontSize: 20 }} />
          {t('nav.myProfile')}
        </MenuItem>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <MenuItem
          onClick={handleSignOut}
          sx={{
            color: '#FF6B6B',
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
            },
          }}
        >
          <Logout sx={{ mr: 2, fontSize: 20 }} />
          {t('nav.signOut')}
        </MenuItem>
      </Menu>

      {/* Language Menu Dropdown */}
      <Menu
        anchorEl={languageMenuAnchor}
        open={Boolean(languageMenuAnchor)}
        onClose={handleLanguageMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        disableScrollLock={true}
        MenuListProps={{
          disablePadding: true,
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: 2,
            backgroundColor: 'rgba(15, 15, 25, 0.28)',
            backdropFilter: 'blur(12px) saturate(140%)',
            WebkitBackdropFilter: 'blur(12px) saturate(140%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            transition: 'all 0.3s ease-in-out',
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={(e) => {
              e.stopPropagation();
              handleLanguageChange(lang.code);
            }}
            selected={language === lang.code}
            sx={{
              color: language === lang.code ? '#FFD700' : 'white',
              py: 1.5,
              fontWeight: language === lang.code ? 600 : 400,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.15)',
                },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
              <Box
                component="img"
                src={lang.flag}
                alt={lang.name}
                sx={{
                  width: '24px',
                  height: '18px',
                  objectFit: 'cover',
                  borderRadius: '2px',
                }}
              />
              <Typography variant="body2">{lang.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </motion.div>
  );
};

export default Navbar;
