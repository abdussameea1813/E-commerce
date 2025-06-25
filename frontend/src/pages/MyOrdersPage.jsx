// frontend/src/pages/MyOrdersPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Package, Calendar, DollarSign, MapPin } from 'lucide-react'; // Icons for better UI

import { useUserStore } from '../stores/useUserStore';
import { getMyOrdersApi } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner'; // Assuming you have a spinner component

const MyOrdersPage = () => {
    const { user, accessToken } = useUserStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || !accessToken) {
                setLoading(false);
                setError('User not authenticated.');
                return;
            }
            try {
                const fetchedOrders = await getMyOrdersApi(accessToken);
                setOrders(fetchedOrders);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.message || 'Could not fetch orders.');
                toast.error(err.message || 'Failed to load orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, accessToken]); // Re-fetch if user or token changes

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-900 text-red-400'>
                <p className="text-xl">{error}</p>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-900 text-white pt-24 pb-12 relative'>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 opacity-80"></div>
            <div className="absolute inset-0 z-0 radial-gradient"></div>

            <div className='relative z-10 mx-auto max-w-screen-xl px-4 2xl:px-0'>
                <motion.h1
                    className='text-center text-5xl font-extrabold mb-12 bg-clip-text text-transparent
                                 bg-gradient-to-r from-emerald-400 to-purple-400 drop-shadow-lg animate-fade-in-up'
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                >
                    My Order History
                </motion.h1>

                {orders.length === 0 ? (
                    <motion.div
                        className="text-center bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700/50"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-xl text-gray-300 mb-4">You haven't placed any orders yet.</p>
                        <Link to="/" className="text-emerald-400 hover:underline text-lg">
                            Start Shopping!
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-8">
                        {orders.map(order => (
                            <motion.div
                                key={order._id}
                                className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700/50"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-700 pb-4 mb-4">
                                    <h2 className="text-xl font-bold text-white flex items-center mb-2 md:mb-0">
                                        <Package className="mr-2 text-emerald-400" size={20} /> Order ID: {order._id}
                                    </h2>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold
                                        ${order.orderStatus === 'Delivered' ? 'bg-green-600 text-white' :
                                          order.orderStatus === 'Cancelled' ? 'bg-red-600 text-white' :
                                          'bg-yellow-600 text-white'}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-300 mb-4">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 text-purple-400" size={18} />
                                        <span>Order Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <DollarSign className="mr-2 text-emerald-400" size={18} />
                                        <span>Total: ${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="mr-2 text-orange-400" size={18} />
                                        <span>Ship To: {order.shippingAddress.city}, {order.shippingAddress.country}</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-white mb-3">Items:</h3>
                                <ul className="space-y-2">
                                    {order.items.map(item => (
                                        <li key={item.productId} className="flex justify-between items-center text-md text-gray-300">
                                            <div className="flex items-center">
                                                {item.image && (
                                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-3 border border-gray-600" />
                                                )}
                                                <span>{item.name} x {item.quantity}</span>
                                            </div>
                                            <span className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Optional: Link to a detailed order page if you implement one */}
                                {/* <div className="mt-4 text-right">
                                    <Link to={`/orders/${order._id}`} className="text-emerald-400 hover:underline">
                                        View Order Details
                                    </Link>
                                </div> */}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;