// src/pages/CategoryPage.jsx
import React, { useEffect } from 'react';
import { useProductStore } from '../stores/useProductStore';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, XCircle } from 'lucide-react'; // Import for loading/error icons

import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
    // Destructure products, loading, and error from the store
    const { products, loading, error, fetchProductsByCategory } = useProductStore();
    const { category } = useParams();

    useEffect(() => {
        fetchProductsByCategory(category);
    }, [fetchProductsByCategory, category]);

    // Conditional rendering for loading, error, and empty states
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-emerald-400 pt-24">
                <Loader className="animate-spin h-12 w-12 mr-4" />
                <p className="text-xl font-semibold">Loading {category.charAt(0).toUpperCase() + category.slice(1)} products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500 pt-24">
                <XCircle className="h-12 w-12 mr-4" />
                <p className="text-xl font-semibold">Error loading products: {error}</p>
                <p className="ml-2 text-gray-400">Please check your connection and try again.</p>
            </div>
        );
    }

    // Main content when products are loaded
    return (
        <div className='bg-gray-900 min-h-screen pt-24 pb-12'> {/* Adjusted padding-top to clear Navbar */}
            <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8'>
                <motion.h1
                    className='text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-400 mb-12
                               bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-400
                               drop-shadow-lg'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    {category.charAt(0).toUpperCase() + category.slice(1)} Products
                </motion.h1>

                {products?.length === 0 ? (
                    <motion.div
                        className='text-center py-16 px-4 rounded-xl bg-gray-800 bg-opacity-70 backdrop-blur-sm
                                   flex flex-col items-center justify-center'
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-300 mb-4">No products found in this category.</h2>
                        <p className="text-lg text-gray-400">Please check back later or explore other categories!</p>
                        {/* Optional: Add a link to go back to home or other categories */}
                        {/* <Link to="/" className="mt-6 text-emerald-400 hover:text-emerald-300 transition-colors duration-200 flex items-center">
                            <ArrowLeft size={20} className="mr-2"/> Back to All Products
                        </Link> */}
                    </motion.div>
                ) : (
                    <motion.div
                        className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8' // Increased gap
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} /> // Assuming _id is the unique key
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;