import React from 'react';
import { motion } from 'framer-motion';
import ProductsSection from '../components/sections/ProductsSection';

const ProductsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <ProductsSection />
    </motion.div>
  );
};

export default ProductsPage;
