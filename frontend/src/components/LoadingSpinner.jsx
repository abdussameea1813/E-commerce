import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react'; // Using Lucide Loader icon

const LoadingSpinner = ({ size = 64, className = '', overlay = false }) => {
  // Variants for the outer spinning ring
  const outerSpinVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        ease: "linear",
        duration: 2, // Slower spin for the outer ring
      },
    },
  };

  // Variants for the inner spinning ring (spins in the opposite direction, faster)
  const innerSpinVariants = {
    animate: {
      rotate: -360,
      transition: {
        repeat: Infinity,
        ease: "linear",
        duration: 1.5, // Faster spin for the inner ring
      },
    },
  };

  // Variants for the central Loader icon (subtle pulse animation)
  const iconVariants = {
    animate: {
      scale: [1, 1.05, 1], // Scales up and down slightly
      opacity: [0.8, 1, 0.8], // Fades in and out slightly
      transition: {
        repeat: Infinity,
        ease: "easeInOut",
        duration: 1.8, // Smooth pulse duration
      },
    },
  };

  const spinnerContent = (
    <div
      style={{ width: size, height: size }} // Dynamic sizing for the overall container
      className={`relative flex items-center justify-center ${className}`}
    >
      {/* Outer spinning ring - Purple dominant */}
      <motion.div
        variants={outerSpinVariants}
        animate="animate"
        className="absolute inset-0 rounded-full border-4 border-transparent
                   border-t-purple-500 border-b-indigo-600 opacity-70"
      ></motion.div>

      {/* Inner spinning ring - Emerald dominant */}
      <motion.div
        variants={innerSpinVariants}
        animate="animate"
        // Slightly smaller than the outer ring
        style={{ width: size * 0.7, height: size * 0.7 }}
        className="absolute rounded-full border-4 border-transparent
                   border-t-emerald-500 border-b-teal-600 opacity-80"
      ></motion.div>

      {/* Central Lucide Loader Icon with pulse animation */}
      <motion.div
        variants={iconVariants}
        animate="animate"
        className="z-10" // Ensure the icon is on top of the rings
      >
        {/* Size the icon relative to the main spinner size */}
        <Loader style={{ width: size * 0.35, height: size * 0.35 }} className="text-white opacity-90" />
      </motion.div>
    </div>
  );

  // If 'overlay' prop is true, wrap the spinner content in a full-screen overlay
  if (overlay) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} // Adds an exit animation when the overlay is unmounted
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm"
      >
        {spinnerContent}
      </motion.div>
    );
  }

  // Otherwise, just return the spinner content itself
  return spinnerContent;
};

export default LoadingSpinner;