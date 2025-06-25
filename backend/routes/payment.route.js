import express from 'express';
import dotenv from 'dotenv';

import { protectRoute } from '../middleware/auth.middleware.js';

import { createCheckoutSession, checkoutSuccess } from '../controllers/payment.controller.js';

dotenv.config();
const router = express.Router();

router.post('/create-checkout-session', protectRoute, createCheckoutSession);
router.post('/checkout-success', checkoutSuccess);


export default router;