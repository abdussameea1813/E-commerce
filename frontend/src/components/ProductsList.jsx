import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash, Star, Loader, XCircle } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';

const ProductsList = () => {
  const {
    products,
    loading,
    error,
    fetchAllProducts, // Changed to fetchAllProducts as per your store
    deleteProduct,
    toggleFeaturedProduct
  } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-emerald-400">
        <Loader className="animate-spin h-10 w-10 mr-3" />
        <p className="text-xl font-semibold">Loading Products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
        <XCircle className="h-10 w-10 mr-3" />
        <p className="text-xl font-semibold">Error: {error}</p>
        <p className="ml-2 text-gray-400">Please try again later.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-400">
        <h2 className="text-3xl font-bold mb-4 text-emerald-400">No Products Found</h2>
        <p className="text-lg">It looks like there are no products to display yet.</p>
        <p className="text-md mt-2">Start by creating a new product from the dashboard!</p>
      </div>
    );
  }

  return (
    // MODIFIED: Adjusted the outermost div's classes
    <div className='bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 min-h-screen pt-24 md:pt-32'>
      {/*
        Removed `flex items-center justify-center` from here.
        Added `pt-24` (or `pt-32` for more space) to account for navbar height.
        Kept `min-h-screen` so the background extends fully, but content starts lower.
        Removed `py-12` as `pt-24` covers the top spacing.
      */}
      <motion.div
        className='bg-gray-800 bg-opacity-70 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden
                   p-6 sm:p-8 max-w-4xl mx-auto border border-gray-700/50'
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className='text-center text-4xl font-extrabold mb-8 bg-clip-text text-transparent
                       bg-gradient-to-r from-emerald-400 to-purple-400 drop-shadow-lg'>
          Product Catalog
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className='bg-gray-700 sticky top-0 z-10'>
              <tr>
                <th scope='col' className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                <th scope='col' className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                <th scope='col' className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                <th scope='col' className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Featured</th>
                <th scope='col' className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <motion.tbody
              className='bg-gray-800 divide-y divide-gray-700'
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {products.map((product) => (
                <motion.tr
                  key={product._id}
                  className='hover:bg-gray-700 transition-colors duration-200'
                  variants={itemVariants}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 mr-3">
                        <img
                          src={product.image || '/placeholder-image.jpg'}
                          alt={product.name}
                          className='h-12 w-12 rounded-full object-cover ring-1 ring-emerald-500 shadow-md'
                        />
                      </div>
                      <div className="ml-2">
                        <div className="text-base font-medium text-white">{product.name}</div>
                        <div className="text-xs text-gray-400 truncate w-32">{product.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-emerald-300 font-semibold">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-purple-600/20 text-purple-300">
                        {product.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => toggleFeaturedProduct(product._id)}
                      title={product.isFeatured ? "Unfeature Product" : "Feature Product"}
                      className={`p-2 rounded-full transition duration-300 ease-in-out
                                  ${product.isFeatured ? 'text-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/30' : 'text-gray-500 hover:text-yellow-400 hover:bg-gray-700'}
                                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
                    >
                      <Star className='h-5 w-5' fill={product.isFeatured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => deleteProduct(product._id)}
                      title="Delete Product"
                      className={`p-2 rounded-full text-red-500 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20
                                  transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                    >
                      <Trash className='h-5 w-5' />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductsList;