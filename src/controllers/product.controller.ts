import { Request, Response } from 'express';
import { productService } from '../services/product.service';

/**
 * Get all products
 * GET /api/products
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page, limit, search, sortBy, order } = req.query;

        const result = await productService.getAllProducts({
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            search: search as string,
            sortBy: sortBy as string,
            order: (order as 'ASC' | 'DESC') || 'DESC',
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({
            error: 'InternalServerError',
            message: 'Error al obtener los productos',
        });
    }
};

/**
 * Get a product by ID
 * GET /api/products/:id
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const product = await productService.getProductById(id);

        if (!product) {
            res.status(404).json({
                error: 'NotFoundError',
                message: 'Producto no encontrado',
            });
            return;
        }

        res.status(200).json({ product });
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).json({
            error: 'InternalServerError',
            message: 'Error al obtener el producto',
        });
    }
};

/**
 * Create a new product
 * POST /api/products
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const productData = req.body;

        const product = await productService.createProduct(productData);

        res.status(201).json({
            message: 'Producto creado exitosamente',
            product,
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            error: 'InternalServerError',
            message: 'Error al crear el producto',
        });
    }
};

/**
 * Update a product
 * PUT /api/products/:id
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const product = await productService.updateProduct(id, updateData);

        if (!product) {
            res.status(404).json({
                error: 'NotFoundError',
                message: 'Producto no encontrado',
            });
            return;
        }

        res.status(200).json({
            message: 'Producto actualizado exitosamente',
            product,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            error: 'InternalServerError',
            message: 'Error al actualizar el producto',
        });
    }
};

/**
 * Delete a product
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const deleted = await productService.deleteProduct(id);

        if (!deleted) {
            res.status(404).json({
                error: 'NotFoundError',
                message: 'Producto no encontrado',
            });
            return;
        }

        res.status(200).json({
            message: 'Producto eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            error: 'InternalServerError',
            message: 'Error al eliminar el producto',
        });
    }
};
