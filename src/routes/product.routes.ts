import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import {
  createProductValidation,
  updateProductValidation,
  listProductsValidation,
} from '../validators/product.validator';
import { handleValidationErrors } from '../middlewares/validation.middleware';

const router = Router();

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination, search, and sorting
 * @access  Public (no authentication required)
 */
router.get(
  '/',
  listProductsValidation,
  handleValidationErrors,
  getProducts
);

/**
 * @route   GET /api/products/:id
 * @desc    Get a product by ID
 * @access  Public (no authentication required)
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Public (no authentication required - will be protected later)
 */
router.post(
  '/',
  createProductValidation,
  handleValidationErrors,
  createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Public (no authentication required - will be protected later)
 */
router.put(
  '/:id',
  updateProductValidation,
  handleValidationErrors,
  updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Public (no authentication required - will be protected later)
 */
router.delete('/:id', deleteProduct);

export default router;
