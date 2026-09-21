import express from 'express';
import { validateCoupon, getPublicCoupons } from '../controllers/couponController.js';
import { protect } from '../middleware/auth.js';
import { publicModerateLimiter } from '../middleware/rateLimiter.js';
import { validateCouponCode } from '../middleware/validate.js';

const router = express.Router();

router.get('/public', publicModerateLimiter, getPublicCoupons);
router.post('/validate', protect, publicModerateLimiter, validateCouponCode, validateCoupon);

export default router;
