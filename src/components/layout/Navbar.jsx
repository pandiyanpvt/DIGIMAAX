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

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { openSignInModal, user, signOut, isAuthenticated } = useAuth();
  const { getCartTotalItems, setCartDrawerOpen } = useCart();
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

  const handleSignOut = () => {
    signOut();
    handleProfileMenuClose();
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
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
              primary="Shopping Cart" 
              secondary={`${cartItemCount} item${cartItemCount !== 1 ? 's' : ''}`}
              primaryTypographyProps={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}
              secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}
            />
          </ListItemButton>
        </Box>
      )}

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
              Sign Out
            </Button>
          </Box>
        ) : (
          <Button
            onClick={openSignInModal}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              py: 1.5,
              borderRadius: 2,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            Sign In
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
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                        gap: 1,
                        px: 1.5,
                        py: 0.5,
                        ml: 1,
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
                      <Person sx={{ fontSize: '20px', color: 'white' }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 500,
                          fontSize: '0.9rem',
                          whiteSpace: 'nowrap',
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
                        width: 45,
                        height: 45,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        padding: '8px',
                        marginLeft: '8px',
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
                        <ShoppingCart sx={{ fontSize: '24px', color: 'white' }} />
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
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      px: 4,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                      },
                    }}
                  >
                    Sign In
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
          My Profile
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
          Sign Out
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default Navbar;
