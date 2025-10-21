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
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoImage from '../../assets/hero/DIGIMAAX_LOGO-01 1.png';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  useEffect(() => {
    // Use a consistent navbar style across all pages (no scroll-based changes)
    setScrolled(true);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'About Us', to: '/about' },
    { name: 'Services', to: '/services' },
    { name: 'Gallery', to: '/gallery' },
    { name: 'Shop', to: '/shop' },
    { name: 'Contact Us', to: '/contact' },
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
                color: location.pathname === item.to ? '#2196F3' : 'inherit',
                fontWeight: location.pathname === item.to ? 'bold' : 'normal',
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
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
          background: 'linear-gradient(270deg, #4B11A9 0%, #29085D 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box
              component="img"
              src={logoImage}
              alt="DIGIMAAX Logo"
              sx={{
                height: isMobile ? '40px' : '50px',
                width: 'auto',
                objectFit: 'contain',
                cursor: 'pointer',
              }}
            />
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
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
                      color: location.pathname === item.to ? '#2196F3' : 'white',
                      fontWeight: location.pathname === item.to ? 'bold' : 'medium',
                      textTransform: 'none',
                      fontSize: '1rem',
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        width: location.pathname === item.to ? '100%' : 0,
                        height: '2px',
                        backgroundColor: '#2196F3',
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
    </motion.div>
  );
};

export default Navbar;
