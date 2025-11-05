import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import SignInModal from '../SignInModal';
import CartSidebar from '../CartSidebar';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #16213E 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(33, 150, 243, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 64, 129, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(33, 150, 243, 0.05) 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        {children}
        <Footer />
        <SignInModal />
        <CartSidebar />
      </Box>
    </Box>
  );
};

export default Layout;
