// frontend/src/pages/OrderConfirmationPage.js
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react'; // Using Lucide React for icons

const OrderConfirmationPage = () => {
    const { orderId } = useParams(); // Get the order ID from the URL parameter

    return (
        <div className='min-h-screen bg-gray-900 text-white pt-24 pb-12 relative flex items-center justify-center'>
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 opacity-80"></div>
            <div className="absolute inset-0 z-0 radial-gradient"></div> {/* Ensure 'radial-gradient' CSS is defined */}

            <motion.div
                className='relative z-10 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl p-8 md:p-12 text-center
                           max-w-md w-full border border-gray-700/50 space-y-6'
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 100 }}
            >
                <CheckCircle className='h-24 w-24 text-emerald-500 mx-auto' /> {/* Success icon */}
                <h1 className='text-4xl font-extrabold text-white'>Order Placed!</h1>
                <p className='text-lg text-gray-300'>Your order has been successfully placed.</p>
                {orderId && (
                    <p className='text-md text-gray-400'>
                        Order ID: <span className='font-mono text-emerald-300 font-semibold'>{orderId}</span>
                    </p>
                )}
                <p className='text-md text-gray-300'>
                    You will receive a confirmation email shortly.
                </p>

                <div className='mt-8 space-y-4'>
                    {/* Link to view user's orders (if you implement a 'My Orders' page) */}
                    {/* <Link
                        to='/my-orders'
                        className='inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3 text-lg font-semibold text-white
                                   transition-all duration-300 hover:bg-emerald-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-lg'
                    >
                        View My Orders
                    </Link> */}
                    {/* Link to continue shopping */}
                    <Link
                        to='/'
                        className='block text-gray-400 hover:text-white transition-colors duration-200'
                    >
                        Continue Shopping
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderConfirmationPage;