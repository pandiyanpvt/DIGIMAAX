import React from 'react';
import { motion } from 'framer-motion';
import ServicesSection from '../components/sections/ServicesSection';

const ServicesPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <ServicesSection />
    </motion.div>
  );
};

export default ServicesPage;
