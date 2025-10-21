import React from 'react';
import { motion } from 'framer-motion';
import AboutSection from '../components/sections/AboutSection';

const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <AboutSection />
    </motion.div>
  );
};

export default AboutPage;
