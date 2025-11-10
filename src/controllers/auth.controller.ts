import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password, role } = req.body;

    const result = await authService.register({
      nombre,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    console.error('Error registering user:', error);

    if (error instanceof Error && error.message === 'El email ya está registrado') {
      res.status(400).json({
        error: 'BadRequest',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'InternalServerError',
      message: 'Error al registrar el usuario',
    });
  }
};

/**
 * Login a user
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    console.error('Error logging in:', error);

    if (error instanceof Error && error.message === 'Credenciales inválidas') {
      res.status(401).json({
        error: 'Unauthorized',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'InternalServerError',
      message: 'Error al iniciar sesión',
    });
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      message: 'Token actualizado exitosamente',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    console.error('Error refreshing token:', error);

    if (
      error instanceof Error &&
      error.message === 'Token de refresco inválido o expirado'
    ) {
      res.status(401).json({
        error: 'Unauthorized',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'InternalServerError',
      message: 'Error al actualizar el token',
    });
  }
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // User ID is attached by auth middleware
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No autenticado',
      });
      return;
    }

    const user = await authService.getUserById(userId);

    if (!user) {
      res.status(404).json({
        error: 'NotFound',
        message: 'Usuario no encontrado',
      });
      return;
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({
      error: 'InternalServerError',
      message: 'Error al obtener el usuario',
    });
  }
};

/**
 * Logout user (client-side should remove tokens)
 * POST /api/auth/logout
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    // JWT tokens are stateless, so logout is handled client-side
    // by removing tokens from storage
    res.status(200).json({
      message: 'Sesión cerrada exitosamente',
    });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({
      error: 'InternalServerError',
      message: 'Error al cerrar sesión',
    });
  }
};
