import React from 'react';
import { useCartStore } from '../stores/useCartStore';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

import CartItem from '../components/CartItem';
import PeopleAlsoBought from '../components/PeopleAlsoBought'; // Assuming you have this component
import { Plus, Minus, Trash } from 'lucide-react';
import OrderSummary from '../components/OrderSummary';

// EmptyCartUI component (moved outside for better organization)
const EmptyCartUI = () => (
    <motion.div
        className='flex flex-col items-center justify-center space-y-6 py-20 px-4 text-center
                   bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50'
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 100 }}
    >
        <ShoppingCart className='h-28 w-28 text-emerald-400 opacity-80' /> {/* Larger, more vibrant icon */}
        <h3 className='text-3xl font-extrabold text-white'>Your cart is feeling a bit light...</h3> {/* More engaging message */}
        <p className='text-lg text-gray-300'>Looks like you haven&apos;t added any amazing products yet!</p>
        <Link
            className='mt-6 inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3 text-lg font-semibold text-white
                       transition-all duration-300 hover:bg-emerald-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-lg'
            to='/'
        >
            <span className="mr-2">🛍️</span> Start Shopping Now!
        </Link>
    </motion.div>
);

const CartPage = () => {
    const { cart,  total } = useCartStore(); // Assuming you'll add these to your store

    const totalItems = cart.length; // Get total items from store
    const totalPrice = total // Get total price from store

    return (
        <div className='min-h-screen bg-gray-900 text-white pt-24 pb-12 relative'> {/* Added min-h-screen and pt-24 */}
            {/* Background gradient for extra flair */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 opacity-80"></div>
            <div className="absolute inset-0 z-0 radial-gradient"></div> {/* You'd define radial-gradient in your CSS */}

            <div className='relative z-10 mx-auto max-w-screen-xl px-4 2xl:px-0'>
                <h1 className='text-center text-5xl font-extrabold mb-12 bg-clip-text text-transparent
                               bg-gradient-to-r from-emerald-400 to-purple-400 drop-shadow-lg animate-fade-in-up'>
                    Your Shopping Cart
                </h1>

                <div className='flex flex-col lg:flex-row lg:gap-8'> {/* Changed md to lg for better breakpoint */}
                    <motion.div
                        className='flex-auto w-full lg:w-2/3 xl:w-3/4 mb-8 lg:mb-0 space-y-6' // Changed max-w to w-full and added space-y
                        initial={{ opacity: 0, x: -50 }} // Animate cart items from left
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 100 }}
                    >
                        {cart.length === 0 ? (
                            <EmptyCartUI />
                        ) : (
                            <div className="space-y-6"> {/* Increased space-y for better spacing between items */}
                                {cart.map((item) => (
                                    <CartItem key={item._id} item={item} />
                                ))}
                            </div>
                        )}
                        {/* PeopleAlsoBought moved outside the primary motion.div for separate animation if desired */}
                        {/* Or keep it inside if you want it to animate with the cart items */}
                        {cart.length > 0 && <PeopleAlsoBought />}
                    </motion.div>

                    {cart.length > 0 && (
                        <motion.div
                            className='w-full lg:w-1/3 xl:w-1/4 sticky top-28' // Made sticky and added top padding for fixed navbar
                            initial={{ opacity: 0, x: 50 }} // Animate summary from right
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 100 }}
                        >
                            <OrderSummary />
                            {/* <div className='bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700/50'>
                                <h2 className='text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4'>Order Summary</h2>
                                <div className='space-y-4'>
                                    <div className='flex justify-between items-center text-lg'>
                                        <span className='text-gray-300'>Items ({totalItems})</span>
                                        <span className='font-semibold text-white'>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className='flex justify-between items-center text-lg'>
                                        <span className='text-gray-300'>Shipping</span>
                                        <span className='font-semibold text-white'>Free</span>
                                    </div>
                                    <div className='flex justify-between items-center text-xl font-bold pt-4 border-t border-gray-700'>
                                        <span className='text-emerald-400'>Order Total</span>
                                        <span className='text-emerald-400'>${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    className='mt-8 w-full rounded-lg bg-emerald-600 px-6 py-3 text-center text-lg font-semibold text-white
                                               hover:bg-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-xl'
                                >
                                    Proceed to Checkout
                                </button>
                            </div> */}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;