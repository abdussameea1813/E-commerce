import React from 'react';
import { motion } from 'framer-motion'; // Import motion
import CategoryItem from '../components/CategoryItem';

// Placeholder images for demonstration. In a real app, these would be in your public folder or an asset pipeline.
// Ensure these images actually exist in your project's public directory or are correctly imported/served.
const categories  = [
  { href: "/jeans", name: "Jeans", imageUrl: "jeans.jpg" },
  { href: "/tshirts", name: "T-Shirts", imageUrl: "tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "shoes.webp" },
  { href: "/glasses", name: "Glasses", imageUrl: "glasses.jpg" },
  { href: "/jackets", name: "Jackets", imageUrl: "jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "bag.jpg" },
]

const HomePage = () => {
  // Framer Motion variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger animation for individual category items
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className='relative min-h-screen pt-20 overflow-hidden text-white'> {/* Added pt-20 for Navbar clearance */}
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Main Heading with animation */}
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className='text-center text-5xl sm:text-6xl lg:text-7xl font-extrabold text-emerald-400 mb-4 drop-shadow-lg'
        >
          Explore Our Fashion Categories
        </motion.h1>

        {/* Subtitle with animation */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="text-center text-xl sm:text-2xl text-gray-300 mb-12"
        >
          Discover the latest trends and styles in our curated collections.
        </motion.p>

        {/* Category Grid with staggered animation */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10' // Increased gap, used md:grid-cols-2 for better tablet layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <CategoryItem
              key={category.name}
              category={category}
              variants={itemVariants} // Pass itemVariants to CategoryItem
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;