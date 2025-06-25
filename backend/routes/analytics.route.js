// routes/analytics.routes.js
import express from 'express';
import { getAnalyticsData, getDailySalesData } from '../controllers/analytics.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js'; // Your auth middleware

const router = express.Router();

// All analytics routes should be protected and only accessible by admins
router.get('/summary', protectRoute, adminRoute, getAnalyticsData);
router.get('/daily-sales', protectRoute, adminRoute, getDailySalesData); // /api/analytics/daily-sales?startDate=2024-01-01&endDate=2024-01-31

export default router;