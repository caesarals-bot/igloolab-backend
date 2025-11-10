-- ============================================
-- IglooLab Backend - Database Schema
-- PostgreSQL Database Script
-- ============================================

-- Create Database (if not exists)
-- Note: Run this command separately as a superuser if needed
-- CREATE DATABASE igloolab;

-- Connect to the database
\c igloolab;

-- ============================================
-- Table: users
-- Description: Stores user accounts with authentication
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- Table: products
-- Description: Stores pharmaceutical products inventory
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    descripcion TEXT NOT NULL,
    fecha_elaboracion TIMESTAMP NOT NULL,
    fecha_vencimiento TIMESTAMP NOT NULL,
    "imageUrl" TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_fecha_vencimiento CHECK (fecha_vencimiento > fecha_elaboracion)
);

-- Index for faster product name searches (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_products_nombre ON products(LOWER(nombre));

-- Index for filtering by expiration date
CREATE INDEX IF NOT EXISTS idx_products_fecha_vencimiento ON products(fecha_vencimiento);

-- ============================================
-- Table: migrations
-- Description: Tracks TypeORM migrations
-- ============================================
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    timestamp BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Insert sample admin user
-- Password: Admin123 (hashed with bcrypt)
INSERT INTO users (nombre, email, password, role) 
VALUES (
    'Admin IglooLab',
    'admin@igloolab.com',
    '$2a$10$8K1p/a0dL3fJvN8P9fGRZeL6zqhqP8X7R6vYQJ6N8zN7gH6mF4F3m',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (nombre, precio, descripcion, fecha_elaboracion, fecha_vencimiento, "imageUrl")
VALUES 
(
    'Paracetamol 500mg',
    15000,
    'Analgésico y antipirético de venta libre para el alivio del dolor leve a moderado',
    '2024-01-15 00:00:00',
    '2026-01-15 00:00:00',
    'https://example.com/paracetamol.jpg'
),
(
    'Ibuprofeno 400mg',
    20000,
    'Antiinflamatorio no esteroideo para el tratamiento del dolor y la inflamación',
    '2024-02-01 00:00:00',
    '2026-02-01 00:00:00',
    'https://example.com/ibuprofeno.jpg'
),
(
    'Amoxicilina 500mg',
    35000,
    'Antibiótico de amplio espectro para infecciones bacterianas',
    '2024-03-10 00:00:00',
    '2025-03-10 00:00:00',
    'https://example.com/amoxicilina.jpg'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- Views (Optional - for reporting)
-- ============================================

-- View: Products expiring soon (within 30 days)
CREATE OR REPLACE VIEW products_expiring_soon AS
SELECT 
    id,
    nombre,
    precio,
    fecha_vencimiento,
    EXTRACT(DAY FROM (fecha_vencimiento - CURRENT_TIMESTAMP)) as days_until_expiration
FROM products
WHERE fecha_vencimiento <= CURRENT_TIMESTAMP + INTERVAL '30 days'
  AND fecha_vencimiento > CURRENT_TIMESTAMP
ORDER BY fecha_vencimiento ASC;

-- View: Expired products
CREATE OR REPLACE VIEW products_expired AS
SELECT 
    id,
    nombre,
    precio,
    fecha_vencimiento,
    EXTRACT(DAY FROM (CURRENT_TIMESTAMP - fecha_vencimiento)) as days_expired
FROM products
WHERE fecha_vencimiento < CURRENT_TIMESTAMP
ORDER BY fecha_vencimiento DESC;

-- ============================================
-- Triggers for updated_at
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for products table
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Permissions (Optional - for production)
-- ============================================

-- Create application user (uncomment and modify as needed)
-- CREATE USER igloolab_app WITH PASSWORD 'your_secure_password';
-- GRANT CONNECT ON DATABASE igloolab TO igloolab_app;
-- GRANT USAGE ON SCHEMA public TO igloolab_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO igloolab_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO igloolab_app;

-- ============================================
-- End of Schema
-- ============================================
