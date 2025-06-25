import React from 'react';
import { Plus, Minus, Trash } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion for animations

const CartItem = ({ item }) => {
    const { removeFromCart, updateQuantity } = useCartStore();

    // Placeholder image for products without one
    const imageUrl = item.image && item.image !== "" ? item.image : '/placeholder-product.jpg';

    // Framer Motion variants for item removal (optional, but nice)
    const itemVariants = {
        hidden: { opacity: 0, x: -50, height: 0, margin: 0 },
        visible: { opacity: 1, x: 0, height: 'auto', margin: '1.5rem 0' }, // Tailwind's space-y-6 is 1.5rem
        exit: { opacity: 0, x: 50, height: 0, margin: 0, transition: { duration: 0.3 } } // Smooth exit animation
    };

    return (
        <motion.div
            className='rounded-xl border p-5 shadow-lg border-gray-700 bg-gray-800 transition-all duration-300 ease-in-out hover:shadow-xl'
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit" // Used by AnimatePresence in the parent, if implemented
            layout // Ensures smooth layout transitions on item add/remove
        >
            <div className='md:flex md:items-center md:justify-between md:gap-6'>
                {/* Product Image */}
                <div className='shrink-0 md:order-1 mb-4 md:mb-0'>
                    <img
                        src={imageUrl}
                        alt={item.name}
                        className='h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-lg object-cover ring-1 ring-emerald-500/50 shadow-md'
                    />
                </div>

                {/* Product Details (Name, Description) */}
                <div className="w-full min-w-0 flex-1 space-y-2 md:order-2 md:max-w-md">
                    <h3 className='text-lg font-bold text-white hover:text-emerald-400 transition-colors duration-200'>
                        {/* Consider making product name a link to the product page */}
                        <Link to={`/product/${item._id}`} className='hover:underline'>
                            {item.name}
                        </Link>
                    </h3>
                    <p className='text-sm text-gray-400 line-clamp-2'>{item.description}</p>
                </div>

                {/* Quantity and Price */}
                <div className='flex items-center justify-between mt-4 md:mt-0 md:order-3 md:justify-end md:gap-8'>
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                        <motion.button
                            className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-600 bg-gray-700 text-gray-300
                                       hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200'
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1} // Disable if quantity is 1
                            whileTap={{ scale: 0.9 }}
                            title="Decrease quantity"
                        >
                            <Minus className='h-4 w-4' />
                        </motion.button>
                        <span className='text-lg font-semibold text-white w-8 text-center'>{item.quantity}</span> {/* Larger quantity text */}
                        <motion.button
                            className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-600 bg-gray-700 text-gray-300
                                       hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200'
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            whileTap={{ scale: 0.9 }}
                            title="Increase quantity"
                        >
                            <Plus className='h-4 w-4' />
                        </motion.button>
                    </div>

                    {/* Price */}
                    <div className="text-xl font-bold text-emerald-400 w-24 text-right"> {/* Adjusted width for price alignment */}
                        ${(item.price * item.quantity).toFixed(2)} {/* Display total for item */}
                    </div>
                </div>

                {/* Remove Button */}
                <div className="flex justify-end md:order-4 mt-4 md:mt-0">
                    <motion.button
                        className='inline-flex items-center text-sm font-medium text-red-500 hover:text-red-400 transition-colors duration-200
                                   rounded-lg px-3 py-2 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500'
                        onClick={() => removeFromCart(item._id)}
                        whileTap={{ scale: 0.9 }}
                        title="Remove item from cart"
                    >
                        <Trash className='h-5 w-5 mr-1' /> {/* Slightly larger icon */}
                        Remove
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem;