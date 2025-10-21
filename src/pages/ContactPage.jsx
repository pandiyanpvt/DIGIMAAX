import React from 'react';
import { motion } from 'framer-motion';
import ContactSection from '../components/sections/ContactSection';

const ContactPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <ContactSection />
    </motion.div>
  );
};

export default ContactPage;
