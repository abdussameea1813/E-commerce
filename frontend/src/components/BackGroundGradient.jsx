// src/components/BackgroundGradient.jsx
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundGradient = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-purple-900 to-indigo-950 opacity-70"
    ></motion.div>
  );
};

export default BackgroundGradient;