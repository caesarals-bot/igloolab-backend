import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt.util';

/**
 * Extend Express Request to include user property
 */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * Authentication Middleware
 * Validates JWT access token and attaches user data to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token no proporcionado',
      });
      return;
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token with JWT_SECRET
    const payload = verifyAccessToken(token);

    // Attach user data to request
    (req as AuthRequest).user = payload;

    // Continue to next middleware
    next();
  } catch (error) {
    console.error('Authentication error:', error);

    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token inválido',
      });
      return;
    }

    if (error instanceof Error && error.name === 'TokenExpiredError') {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token expirado',
      });
      return;
    }

    res.status(500).json({
      error: 'InternalServerError',
      message: 'Error al verificar autenticación',
    });
  }
};
