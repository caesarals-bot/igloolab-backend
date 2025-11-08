import { Router } from 'express';
import {
  getDashboardStats,
  getExpiryStatus,
} from '../controllers/dashboard.controller';

const router = Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics (total products, inventory value, expiring products, etc.)
 * @access  Public (no authentication required - will be protected later)
 */
router.get('/stats', getDashboardStats);

/**
 * @route   GET /api/dashboard/expiry-status
 * @desc    Get products grouped by expiry status (expired, expiring soon, valid)
 * @access  Public (no authentication required - will be protected later)
 */
router.get('/expiry-status', getExpiryStatus);

export default router;
