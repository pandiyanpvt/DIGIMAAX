import React, { Suspense, lazy, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import theme from './theme/theme';
import Layout from './components/layout/Layout';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { preloadAllImages } from './utils/imagePreloader';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
// import WishlistPage from './pages/WishlistPage';
// import CategoryPage from './pages/CategoryPage';
// import SearchResultsPage from './pages/SearchResultsPage';
import CompareProductsPage from './pages/CompareProductsPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderTrackingPage from './pages/OrderTrackingPage';

function App() {
  // Preload all images when app starts
  useEffect(() => {
    preloadAllImages();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <ScrollToTop />
              <Layout>
                <Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/services/:slug" element={<ServiceDetailPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/cart" element={<CartPage />} />
                  {/** removed wishlist and search routes **/}
                  <Route path="/compare" element={<CompareProductsPage />} />
                  <Route path="/orders" element={<OrderHistoryPage />} />
                  <Route path="/orders/:id/track" element={<OrderTrackingPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                </Suspense>
              </Layout>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
