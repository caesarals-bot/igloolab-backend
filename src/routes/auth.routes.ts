import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  getMe,
  logout,
} from '../controllers/auth.controller';
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} from '../validators/auth.validator';
import { handleValidationErrors } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get tokens
 * @access  Public
 */
router.post(
  '/login',
  loginValidation,
  handleValidationErrors,
  login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post(
  '/refresh',
  refreshTokenValidation,
  handleValidationErrors,
  refreshToken
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Protected
 */
router.get('/me', authenticate, getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side removes tokens)
 * @access  Public
 */
router.post('/logout', logout);

export default router;
