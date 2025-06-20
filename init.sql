CREATE DATABASE "mcp";

-- Create Category Table
CREATE TABLE IF NOT EXISTS "Category" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Create Supplier Table
CREATE TABLE IF NOT EXISTS "Supplier" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contactInfo TEXT
);

-- Create Product Table
CREATE TABLE IF NOT EXISTS "Product" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    isAvailable BOOLEAN DEFAULT TRUE,
    tags TEXT[],
    categoryId INT NOT NULL,
    supplierId INT NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_category FOREIGN KEY (categoryId) REFERENCES "Category"(id) ON DELETE CASCADE,
    CONSTRAINT fk_supplier FOREIGN KEY (supplierId) REFERENCES "Supplier"(id) ON DELETE CASCADE
);

-- Create InventoryLog Table
CREATE TABLE IF NOT EXISTS "InventoryLog" (
    id SERIAL PRIMARY KEY,
    productId INT NOT NULL,
    change INT NOT NULL,
    reason TEXT,
    createdAt TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_product FOREIGN KEY (productId) REFERENCES "Product"(id) ON DELETE CASCADE
);
