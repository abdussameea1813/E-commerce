// controllers/analytics.controller.js
import Order from "../models/order.model.js"; // Corrected import path/name if necessary
import Product from "../models/product.model.js"; // Corrected import path/name if necessary
import User from "../models/user.model.js";     // Corrected import path/name if necessary

/**
 * @desc Get high-level analytics data (total users, products, sales, revenue)
 * @route GET /api/analytics/summary
 * @access Private (Admin only)
 */
export const getAnalyticsData = async (req, res, next) => { // Added 'next' for error handling
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: null, // Group all documents
                    totalSalesCount: { $sum: 1 }, // Count of orders
                    totalRevenue: { $sum: "$totalAmount" } // Sum of totalAmount from all orders
                }
            }
        ]);

        // Destructure, providing default values if no orders exist
        const { totalSalesCount, totalRevenue } = salesData[0] || { totalSalesCount: 0, totalRevenue: 0 };

        // Return a consistent success response
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalOrders: totalSalesCount, // Renamed for clarity: "totalSales" could be ambiguous
                totalRevenue: parseFloat(totalRevenue.toFixed(2)) // Format revenue to 2 decimal places
            }
        });
    } catch (error) {
        // Use next(error) to pass to your centralized error handling middleware
        next(error);
    }
};

/**
 * @desc Get daily sales and revenue data within a date range
 * @route GET /api/analytics/daily-sales?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * @access Private (Admin only)
 *
 * This function is now directly exposed as an API endpoint.
 * Date parameters will come from req.query.
 */
export const getDailySalesData = async (req, res, next) => { // Added 'next'
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, message: "Please provide both startDate and endDate query parameters (YYYY-MM-DD)." });
        }

        // Parse dates as Date objects for MongoDB query
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Set to end of the day to include full endDate

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
            return res.status(400).json({ success: false, message: "Invalid date range. Ensure dates are valid and startDate is before or equal to endDate." });
        }

        const dailySalesData = await Order.aggregate([
            {
                $match: {
                    // Use createdAt for general sales, or deliveredAt for 'delivered' sales analytics
                    createdAt: { $gte: start, $lte: end },
                    orderStatus: { $ne: 'Cancelled' } // Exclude cancelled orders from sales data
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalOrders: { $sum: 1 }, // Count of orders for that day
                    revenue: { $sum: "$totalAmount" }, // Sum of revenue for that day
                },
            },
            { $sort: { _id: 1 } }, // Sort by date ascending
        ]);

        // Helper function (defined below for clarity)
        const dateArray = getDatesInRange(start, end);

        // Map through all dates in the range to ensure even days with no sales are included
        const formattedDailySales = dateArray.map(date => {
            const foundData = dailySalesData.find(item => item._id === date);

            return {
                date,
                totalOrders: foundData?.totalOrders || 0,
                revenue: parseFloat((foundData?.revenue || 0).toFixed(2)), // Format revenue
            };
        });

        res.status(200).json({
            success: true,
            data: formattedDailySales
        });
    } catch (error) {
        next(error);
    }
};


// --- Helper function for date range (moved inside controller or in a utils file) ---
// Note: This function should ideally be in a separate 'utils' file if used by many controllers.
// For now, let's keep it here for direct reference within the controller.
function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    // Loop through each day from startDate to endDate
    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]); // Get YYYY-MM-DD format
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
    return dates;
}