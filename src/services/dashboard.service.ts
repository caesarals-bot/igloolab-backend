import { Repository, LessThanOrEqual, MoreThan } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Product } from '../entities/Product.entity';

/**
 * Dashboard Service
 * Handles business logic for dashboard statistics
 */
export class DashboardService {
  private productRepository: Repository<Product>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
  }

  /**
   * Get dashboard statistics
   */
  async getStats() {
    // Get total number of products
    const totalProducts = await this.productRepository.count();

    // Get all products to calculate stats
    const products = await this.productRepository.find({
      select: ['id', 'nombre', 'precio', 'fechaVencimiento'],
    });

    // Calculate total inventory value (sum of all prices)
    const totalInventoryValue = products.reduce(
      (sum, product) => sum + Number(product.precio),
      0
    );

    // Calculate average price
    const averagePrice = totalProducts > 0 ? totalInventoryValue / totalProducts : 0;

    // Get products expiring in the next 30 days
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const expiringProductsList = products
      .filter((product) => {
        const expiryDate = new Date(product.fechaVencimiento);
        return expiryDate > now && expiryDate <= thirtyDaysFromNow;
      })
      .map((product) => {
        const expiryDate = new Date(product.fechaVencimiento);
        const daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          id: product.id,
          nombre: product.nombre,
          fechaVencimiento: product.fechaVencimiento,
          daysUntilExpiry,
        };
      })
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry); // Sort by closest to expiry

    return {
      totalProducts,
      totalInventoryValue: Math.round(totalInventoryValue * 100) / 100, // Round to 2 decimals
      averagePrice: Math.round(averagePrice * 100) / 100, // Round to 2 decimals
      expiringProducts: expiringProductsList.length,
      expiringProductsList,
    };
  }

  /**
   * Get products grouped by expiry status
   */
  async getProductsByExpiryStatus() {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    // Products already expired
    const expired = await this.productRepository.count({
      where: {
        fechaVencimiento: LessThanOrEqual(now),
      },
    });

    // Products expiring in 30 days
    const expiringSoon = await this.productRepository.count({
      where: {
        fechaVencimiento: LessThanOrEqual(thirtyDaysFromNow),
      },
    });

    // Valid products (not expired, not expiring soon)
    const valid = await this.productRepository.count({
      where: {
        fechaVencimiento: MoreThan(thirtyDaysFromNow),
      },
    });

    return {
      expired,
      expiringSoon: expiringSoon - expired, // Subtract already expired
      valid,
    };
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
