import { body, query } from 'express-validator';

/**
 * Validation rules for creating a product
 */
export const createProductValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isString()
    .withMessage('El nombre debe ser un texto')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('El nombre debe tener entre 3 y 255 caracteres'),

  body('precio')
    .notEmpty()
    .withMessage('El precio es requerido')
    .isNumeric()
    .withMessage('El precio debe ser un número')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser mayor o igual a 0'),

  body('descripcion')
    .notEmpty()
    .withMessage('La descripción es requerida')
    .isString()
    .withMessage('La descripción debe ser un texto')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),

  body('fechaElaboracion')
    .notEmpty()
    .withMessage('La fecha de elaboración es requerida')
    .isISO8601()
    .withMessage('La fecha de elaboración debe ser una fecha válida (ISO 8601)'),

  body('fechaVencimiento')
    .notEmpty()
    .withMessage('La fecha de vencimiento es requerida')
    .isISO8601()
    .withMessage('La fecha de vencimiento debe ser una fecha válida (ISO 8601)')
    .custom((fechaVencimiento, { req }) => {
      const fechaElab = new Date(req.body.fechaElaboracion);
      const fechaVenc = new Date(fechaVencimiento);
      
      if (fechaVenc <= fechaElab) {
        throw new Error('La fecha de vencimiento debe ser posterior a la fecha de elaboración');
      }
      
      return true;
    }),

  body('imagen')
    .optional()
    .isString()
    .withMessage('La imagen debe ser un texto (URL)')
    .trim()
    .isLength({ max: 500 })
    .withMessage('La URL de la imagen no puede exceder 500 caracteres'),
];

/**
 * Validation rules for updating a product
 * All fields are optional
 */
export const updateProductValidation = [
  body('nombre')
    .optional()
    .isString()
    .withMessage('El nombre debe ser un texto')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('El nombre debe tener entre 3 y 255 caracteres'),

  body('precio')
    .optional()
    .isNumeric()
    .withMessage('El precio debe ser un número')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser mayor o igual a 0'),

  body('descripcion')
    .optional()
    .isString()
    .withMessage('La descripción debe ser un texto')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),

  body('fechaElaboracion')
    .optional()
    .isISO8601()
    .withMessage('La fecha de elaboración debe ser una fecha válida (ISO 8601)'),

  body('fechaVencimiento')
    .optional()
    .isISO8601()
    .withMessage('La fecha de vencimiento debe ser una fecha válida (ISO 8601)')
    .custom((fechaVencimiento, { req }) => {
      // Si hay fecha de vencimiento, validar con fecha de elaboración
      if (fechaVencimiento && req.body.fechaElaboracion) {
        const fechaElab = new Date(req.body.fechaElaboracion);
        const fechaVenc = new Date(fechaVencimiento);
        
        if (fechaVenc <= fechaElab) {
          throw new Error('La fecha de vencimiento debe ser posterior a la fecha de elaboración');
        }
      }
      
      return true;
    }),

  body('imagen')
    .optional()
    .isString()
    .withMessage('La imagen debe ser un texto (URL)')
    .trim()
    .isLength({ max: 500 })
    .withMessage('La URL de la imagen no puede exceder 500 caracteres'),
];

/**
 * Validation rules for query parameters (list products)
 */
export const listProductsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),

  query('search')
    .optional()
    .isString()
    .withMessage('El término de búsqueda debe ser un texto')
    .trim(),

  query('sortBy')
    .optional()
    .isIn(['nombre', 'precio', 'fechaElaboracion', 'fechaVencimiento', 'createdAt'])
    .withMessage('El campo de ordenamiento no es válido'),

  query('order')
    .optional()
    .isIn(['asc', 'desc', 'ASC', 'DESC'])
    .withMessage('El orden debe ser "asc" o "desc"'),
];
