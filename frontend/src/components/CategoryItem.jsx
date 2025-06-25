import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import { ArrowRight } from 'lucide-react'; // Import ArrowRight icon

const CategoryItem = ({ category, variants }) => { // Accept variants prop
  return (
    <motion.div
      className='relative overflow-hidden h-96 w-full rounded-2xl group shadow-xl hover:shadow-2xl transition-shadow duration-300' // Stronger shadows, more rounded
      variants={variants} // Apply passed variants for staggered animation
      whileHover={{ scale: 1.03 }} // Scale up slightly on hover
      transition={{ type: "spring", stiffness: 300, damping: 20 }} // Smooth spring animation
    >
      <Link to={"/category" + category.href} className="block w-full h-full"> {/* Make the whole card clickable */}
        {/* Overlay for readability and consistent look */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 z-10"></div> {/* Gradient from bottom, stronger opacity */}

        {/* Image with hover scale effect */}
        <img
          src={category.imageUrl}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end"> {/* Increased padding */}
          <h3 className='text-white text-3xl font-bold mb-2 drop-shadow-md'>{category.name}</h3> {/* Larger, bolder text, drop shadow */}
          <motion.p
            className='text-gray-300 text-base flex items-center group-hover:text-emerald-300 transition-colors duration-300' // Emerald hover
            initial={{ x: 0 }}
            groupHover={{ x: 5 }} // Slight slide for 'Explore' text
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Explore {category.name}
            <ArrowRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300' /> {/* Arrow icon with hover slide */}
          </motion.p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryItem;