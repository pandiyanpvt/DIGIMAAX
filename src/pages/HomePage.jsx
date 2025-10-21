import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/sections/HeroSection';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <HeroSection />
    </motion.div>
  );
};

export default HomePage;
