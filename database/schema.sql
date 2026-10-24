-- =============================================================================
-- StockSmart Database Schema Definition
-- Compatible with: MySQL 8.0+ / TiDB Cloud / MariaDB 10.5+
-- Safe execution: Uses CREATE TABLE IF NOT EXISTS (Non-destructive)
-- =============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'STAFF',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categories_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Locations Table (Warehouses, Stores, Fulfillment centers)
CREATE TABLE IF NOT EXISTS `locations` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_locations_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. Suppliers Table
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(255) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `sku` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `quantity` INT DEFAULT 0,
  `reorder_level` INT DEFAULT 10,
  `barcode` VARCHAR(255) DEFAULT NULL,
  `is_active` BIT(1) DEFAULT b'1',
  `category_id` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_products_sku` (`sku`),
  UNIQUE KEY `uk_products_barcode` (`barcode`),
  KEY `fk_products_category` (`category_id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6. Inventory Table (Per-location stock)
CREATE TABLE IF NOT EXISTS `inventory` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL,
  `location_id` BIGINT NOT NULL,
  `quantity` INT DEFAULT 0,
  `reorder_level` INT DEFAULT 10,
  PRIMARY KEY (`id`),
  KEY `fk_inventory_product` (`product_id`),
  KEY `fk_inventory_location` (`location_id`),
  CONSTRAINT `fk_inventory_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_inventory_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 7. Purchases Table
CREATE TABLE IF NOT EXISTS `purchases` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `supplier_id` BIGINT NOT NULL,
  `location_id` BIGINT DEFAULT NULL,
  `total_amount` DECIMAL(38,2) DEFAULT NULL,
  `status` VARCHAR(255) DEFAULT 'PENDING',
  `purchase_date` DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_purchases_supplier` (`supplier_id`),
  KEY `fk_purchases_location` (`location_id`),
  CONSTRAINT `fk_purchases_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `fk_purchases_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 8. Purchase Items Table
CREATE TABLE IF NOT EXISTS `purchase_items` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `purchase_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `quantity` INT DEFAULT NULL,
  `unit_cost` DECIMAL(38,2) DEFAULT NULL,
  `subtotal` DECIMAL(38,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_purchase_items_purchase` (`purchase_id`),
  KEY `fk_purchase_items_product` (`product_id`),
  CONSTRAINT `fk_purchase_items_purchase` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_purchase_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 9. Sales Table
CREATE TABLE IF NOT EXISTS `sales` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `customer_name` VARCHAR(255) DEFAULT NULL,
  `total_amount` DECIMAL(38,2) DEFAULT NULL,
  `sale_status` VARCHAR(255) DEFAULT 'COMPLETED',
  `payment_status` VARCHAR(255) DEFAULT 'PAID',
  `created_at` DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 10. Sale Items Table
CREATE TABLE IF NOT EXISTS `sale_items` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `sale_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `quantity` INT DEFAULT NULL,
  `price` DECIMAL(38,2) DEFAULT NULL,
  `subtotal` DECIMAL(38,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sale_items_sale` (`sale_id`),
  KEY `fk_sale_items_product` (`product_id`),
  CONSTRAINT `fk_sale_items_sale` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sale_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 11. Stock Movements Table (Audit Trail)
CREATE TABLE IF NOT EXISTS `stock_movements` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL,
  `location_id` BIGINT NOT NULL,
  `quantity` INT DEFAULT NULL,
  `type` VARCHAR(50) DEFAULT NULL,
  `reference_id` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_stock_movements_product` (`product_id`),
  KEY `fk_stock_movements_location` (`location_id`),
  CONSTRAINT `fk_stock_movements_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_stock_movements_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
