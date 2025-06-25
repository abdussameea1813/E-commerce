// frontend/src/components/admin/AnalyticsTab.js
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { DollarSign, ShoppingBag, Users, Star, TrendingUp, Calendar } from 'lucide-react'; // Icons

import { useUserStore } from '../stores/useUserStore';
import { getAnalyticsDataApi, getDailySalesDataApi } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner'; // Your spinner component

const AnalyticsTab = () => {
    const { accessToken } = useUserStore();
    const [analytics, setAnalytics] = useState(null);
    const [dailySales, setDailySales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

      console.log('AnalyticsTab mounted, accessToken:', accessToken);
        const fetchAnalytics = async () => {
            if (!accessToken) {

                setLoading(false);
                setError('Authentication token not available.');
                toast.error('Admin token missing.');
                return;
            }

            try {
                const [analyticsData, dailySalesData] = await Promise.all([
                    getAnalyticsDataApi(accessToken),
                    getDailySalesDataApi(accessToken)
                ]);
                setAnalytics(analyticsData.data); // Assuming backend wraps in .data
                setDailySales(dailySalesData.data); // Assuming backend wraps in .data
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setError(err.message || 'Failed to load analytics data.');
                toast.error(err.message || 'Failed to load analytics data.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [accessToken]); // Re-fetch if accessToken changes

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className='p-6 bg-gray-800 rounded-lg text-red-400 text-center'>
                <p className="text-xl">{error}</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50"
        >
            <h2 className="text-3xl font-extrabold text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                Store Analytics Overview
            </h2>

            {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <MetricCard icon={<DollarSign className="text-green-400" size={28} />}
                                title="Total Revenue"
                                value={`$${analytics.totalSales?.toFixed(2) || '0.00'}`} />
                    <MetricCard icon={<ShoppingBag className="text-blue-400" size={28} />}
                                title="Total Orders"
                                value={analytics.totalOrders || 0} />
                    <MetricCard icon={<Users className="text-purple-400" size={28} />}
                                title="Total Users"
                                value={analytics.totalUsers || 0} />
                </div>
            )}

            {analytics?.topProducts?.length > 0 && (
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Star className="mr-3 text-yellow-400" size={24} /> Top 5 Products
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-700/50 rounded-lg">
                            <thead>
                                <tr className="bg-gray-700 text-gray-300 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Product</th>
                                    <th className="py-3 px-6 text-center">Units Sold</th>
                                    <th className="py-3 px-6 text-center">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-200 text-sm font-light">
                                {analytics.topProducts.map((product, index) => (
                                    <tr key={product._id} className="border-b border-gray-600 hover:bg-gray-600/50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">
                                            {product.name}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            {product.totalQuantitySold}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            ${(product.totalRevenue || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {dailySales?.length > 0 && (
                <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <TrendingUp className="mr-3 text-red-400" size={24} /> Daily Sales
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-700/50 rounded-lg">
                            <thead>
                                <tr className="bg-gray-700 text-gray-300 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Date</th>
                                    <th className="py-3 px-6 text-center">Sales Count</th>
                                    <th className="py-3 px-6 text-center">Total Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-200 text-sm font-light">
                                {dailySales.map((day, index) => (
                                    <tr key={index} className="border-b border-gray-600 hover:bg-gray-600/50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Calendar className="mr-2 text-blue-300" size={16} />
                                                {new Date(day._id.year, day._id.month - 1, day._id.day).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            {day.count}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            ${day.totalSales.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Optional: Placeholder for a chart (e.g., using Recharts, nivo, Chart.js) */}
            {/* <div className="mt-8 bg-gray-700/50 rounded-lg p-4 h-80 flex items-center justify-center">
                <p className="text-gray-400">Chart will go here (e.g., Daily Sales Line Chart)</p>
            </div> */}
        </motion.div>
    );
};

// Helper component for metric display
const MetricCard = ({ icon, title, value }) => (
    <motion.div
        className="bg-gray-700/50 rounded-lg p-6 shadow-lg flex flex-col items-center justify-center text-center"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
    >
        <div className="mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-300 mb-1">{title}</h3>
        <p className="text-4xl font-bold text-white">{value}</p>
    </motion.div>
);


export default AnalyticsTab;