// src/components/ProductCard.jsx
import React, { useState } from 'react'; // Import useState for image loading state
import { toast } from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion'; // Import motion for animations
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';

const ProductCard = ({ product }) => {
    const [imageLoaded, setImageLoaded] = useState(false); // State to track image loading

    const {user} = useUserStore();
    const { addToCart } = useCartStore();

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please log in to add items to your cart.");
            return;
        } else {
            addToCart(product);
        } 
        };

    // Fallback for product image if not provided or broken
    const imageUrl = product.image && product.image !== "" ? product.image : '/placeholder-product.jpg'; // Path to a default image in your public folder

    return (
        <motion.div
            className='relative flex flex-col rounded-xl overflow-hidden
                       bg-gray-800 border border-gray-700 hover:border-emerald-500
                       shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out
                       transform hover:-translate-y-1' // Subtle lift on hover
            whileHover={{ scale: 1.03 }} // Framer Motion scale effect on hover
            initial={{ opacity: 0, y: 50 }} // Initial animation for cards appearing
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Product Image Section */}
            <div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-lg'>
                {/* Image loading skeleton */}
                {!imageLoaded && (
                    <div className='absolute inset-0 bg-gray-700 animate-pulse rounded-lg'></div>
                )}
                <img
                    className={`object-cover w-full h-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    src={imageUrl}
                    alt={product.name} // Use product name for alt text for accessibility
                    onLoad={() => setImageLoaded(true)} // Set imageLoaded to true when image finishes loading
                    onError={(e) => {
                        e.target.src = '/placeholder-product.jpg'; // Fallback for broken images
                        setImageLoaded(true); // Still set loaded to true to hide skeleton
                    }}
                />
                {/* Subtle overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent'></div>

                {/* Optional: Add a "New" or "Sale" badge */}
                {/* {product.isNew && (
                    <span className='absolute top-2 left-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white'>New</span>
                )}
                {product.onSale && (
                    <span className='absolute top-2 right-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white'>Sale!</span>
                )} */}
            </div>

            {/* Product Details Section */}
            <div className="mt-4 px-5 pb-5 flex flex-col justify-between flex-grow">
                <h5 className='text-lg font-semibold text-white mb-2 line-clamp-2'>{product.name}</h5> {/* line-clamp for multi-line names */}
                <p className="text-sm text-gray-400 mb-3 line-clamp-3">{product.description}</p> {/* Add description */}

                <div className='mt-auto flex items-center justify-between'> {/* Push price and button to bottom */}
                    <p>
                        <span className='text-2xl font-bold text-emerald-400'>${product.price.toFixed(2)}</span> {/* Format price */}
                    </p>
                    <motion.button
                        className='inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white
                                   hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300
                                   transition duration-200 ease-in-out'
                        onClick={handleAddToCart}
                        whileTap={{ scale: 0.95 }} // Subtle press effect
                    >
                        <ShoppingCart className='mr-2' size={18} /> {/* Smaller icon for button */}
                        Add to cart
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;