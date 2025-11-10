import { body } from 'express-validator';

/**
 * Validation rules for user registration
 */
export const registerValidation = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),

  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('El rol debe ser "admin" o "user"'),
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];

/**
 * Validation rules for refresh token
 */
export const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('El token de refresco es requerido')
    .isString()
    .withMessage('El token debe ser una cadena válida'),
];
