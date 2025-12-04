import React from 'react';
import { motion } from 'framer-motion';
import ServicesSection from '../components/sections/ServicesSection';

/**
 * ServicesPage Component
 * 
 * This page displays all services fetched from the backend API.
 * The ServicesSection component handles all data fetching and rendering.
 * 
 * Data Flow:
 * ServicesPage → ServicesSection → getServices() → Backend API
 * 
 * Backend Endpoint: GET /api/services/getAll
 */
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
