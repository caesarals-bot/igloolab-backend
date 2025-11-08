import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../entities/User.entity';
import { Product } from '../entities/Product.entity';

/**
 * TypeORM DataSource Configuration
 * This is used for both runtime and CLI operations (migrations, etc.)
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,

  // Entities - Import directly (works in both dev and production)
  entities: [User, Product],
  
  // Migrations
  migrations: ['src/migrations/**/*.ts'],
  
  // Subscribers (event listeners)
  subscribers: [],

  // Synchronize schema (ONLY for development)
  // ⚠️ WARNING: This will DROP and RECREATE tables on every start
  // Set to false in production and use migrations instead
  synchronize: env.NODE_ENV === 'development',

  // Logging
  logging: env.NODE_ENV === 'development' ? ['query', 'error', 'schema'] : ['error'],
  
  // Additional options
  cache: false,
  
  // Connection pool settings
  extra: {
    max: 10, // Maximum number of connections in pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  },
});

/**
 * Initialize database connection
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🔌 Connecting to database...');
    console.log(`📍 Host: ${env.DB_HOST}:${env.DB_PORT}`);
    console.log(`📦 Database: ${env.DB_NAME}`);
    
    await AppDataSource.initialize();
    
    console.log('✅ Database connected successfully!');
    console.log(`🔧 Synchronize: ${env.NODE_ENV === 'development' ? 'ON (dev mode)' : 'OFF (use migrations)'}`);
    
    // Log registered entities
    const entities = AppDataSource.entityMetadatas.map(e => e.name);
    if (entities.length > 0) {
      console.log(`📊 Entities loaded: ${entities.join(', ')}`);
    } else {
      console.log('⚠️  No entities loaded yet');
    }
    
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    throw error;
  }
};

/**
 * Close database connection
 */
export const closeDatabase = async (): Promise<void> => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('🔌 Database connection closed');
  }
};
