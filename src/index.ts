// IMPORTANT: reflect-metadata must be imported first for TypeORM decorators
import 'reflect-metadata';
import express from 'express';
import { initializeDatabase } from './config/database';
import { env } from './config/env';
import homeRoute from './routes/home.route';
import productRoutes from './routes/product.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/', homeRoute);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);

/**
 * Start server
 * Initialize database connection before starting Express server
 */
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Start Express server
    const PORT = env.PORT;
    app.listen(PORT, () => {
      console.log('🚀 Server is running!');
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('⚠️  SIGTERM received, closing server gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('⚠️  SIGINT received, closing server gracefully...');
  process.exit(0);
});

// Start the server
startServer();