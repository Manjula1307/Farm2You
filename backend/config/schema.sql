-- ============================================
-- Farm2You MySQL Schema
-- Run this file once to set up your database
-- ============================================

CREATE DATABASE IF NOT EXISTS farm2you;
USE farm2you;

-- Users table (shared for both Farmers and Consumers)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('farmer', 'consumer') NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Produce listings table (created by Farmers)
CREATE TABLE IF NOT EXISTS produce (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price_per_unit DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL COMMENT 'e.g. kg, dozen, piece',
  quantity_available INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Orders table (created by Consumers)
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  consumer_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'delivered', 'cancelled') DEFAULT 'pending',
  delivery_address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (consumer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table (line items per order)
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  produce_id INT NOT NULL,
  farmer_id INT NOT NULL,
  quantity INT NOT NULL,
  price_per_unit DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (produce_id) REFERENCES produce(id),
  FOREIGN KEY (farmer_id) REFERENCES users(id)
);
