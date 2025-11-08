import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';

/**
 * Get dashboard statistics
 * GET /api/dashboard/stats
 */
export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await dashboardService.getStats();

    res.status(200).json({
      stats,
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      error: 'InternalServerError',
      message: 'Error al obtener las estadísticas del dashboard',
    });
  }
};

/**
 * Get products grouped by expiry status
 * GET /api/dashboard/expiry-status
 */
export const getExpiryStatus = async (_req: Request, res: Response): Promise<void> => {
  try {
    const status = await dashboardService.getProductsByExpiryStatus();

    res.status(200).json({
      expiryStatus: status,
    });
  } catch (error) {
    console.error('Error getting expiry status:', error);
    res.status(500).json({
      error: 'InternalServerError',
      message: 'Error al obtener el estado de vencimientos',
    });
  }
};
