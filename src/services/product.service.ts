import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Product } from '../entities/Product.entity';

/**
 * Product Service
 * Handles all business logic related to products
 */
export class ProductService {
  private productRepository: Repository<Product>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
  }

  /**
   * Get all products with pagination, search, and sorting
   */
  async getAllProducts(options: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
  }) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'createdAt';
    const order = options.order || 'DESC';

    // Build where clause for search
    const where: FindOptionsWhere<Product> = {};
    if (options.search) {
      where.nombre = Like(`%${options.search}%`);
    }

    // Get products with pagination
    const [products, total] = await this.productRepository.findAndCount({
      where,
      order: { [sortBy]: order },
      skip,
      take: limit,
    });

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    return product;
  }

  /**
   * Create a new product
   */
  async createProduct(productData: {
    nombre: string;
    precio: number;
    descripcion: string;
    fechaElaboracion: string;
    fechaVencimiento: string;
    imagen?: string;
  }): Promise<Product> {
    // Convert string dates to Date objects
    const product = this.productRepository.create({
      ...productData,
      fechaElaboracion: new Date(productData.fechaElaboracion),
      fechaVencimiento: new Date(productData.fechaVencimiento),
    });

    await this.productRepository.save(product);

    return product;
  }

  /**
   * Update a product
   */
  async updateProduct(
    id: string,
    updateData: Partial<{
      nombre: string;
      precio: number;
      descripcion: string;
      fechaElaboracion: string;
      fechaVencimiento: string;
      imagen: string;
    }>
  ): Promise<Product | null> {
    // Check if product exists
    const product = await this.getProductById(id);
    if (!product) {
      return null;
    }

    // Convert string dates to Date objects if provided
    const dataToUpdate: any = { ...updateData };
    if (updateData.fechaElaboracion) {
      dataToUpdate.fechaElaboracion = new Date(updateData.fechaElaboracion);
    }
    if (updateData.fechaVencimiento) {
      dataToUpdate.fechaVencimiento = new Date(updateData.fechaVencimiento);
    }

    // Update product
    await this.productRepository.update(id, dataToUpdate);

    // Return updated product
    return this.getProductById(id);
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Check if a product exists
   */
  async productExists(id: string): Promise<boolean> {
    const count = await this.productRepository.count({
      where: { id },
    });
    return count > 0;
  }
}

// Export singleton instance
export const productService = new ProductService();
