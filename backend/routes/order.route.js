// routes/order.routes.js
import express from 'express';
import {
    placeOrder,
    updateOrderStatus,
    getAllOrders,
    getMyOrders,
    getOrderById,
} from '../controllers/order.controller.js'; // Ensure correct path to your controller
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js'; // Import your auth middleware

const router = express.Router();

// Route for users to place new orders
// Requires user to be logged in (authenticated)
router.post('/', protectRoute, placeOrder);

// Admin-specific routes
// These routes require both authentication and an 'admin' role
router.get('/', protectRoute, adminRoute, getAllOrders); // Get all orders (typically for admin dashboard)
router.put('/:id/status', protectRoute, adminRoute, updateOrderStatus); // Update any order's status (e.g., from 'Pending' to 'Shipped')

// User-specific routes
// These routes require user authentication
router.get('/myorders', protectRoute, getMyOrders); // Get orders placed by the currently logged-in user
router.get('/:id', protectRoute, getOrderById); // Get a specific order (with authorization check inside the controller)

export default router;