-- สร้าง database
CREATE DATABASE IF NOT EXISTS shop_db;
USE shop_db;

-- สร้าง table shops
CREATE TABLE IF NOT EXISTS shops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- สร้าง table products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    shop_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

-- ข้อมูลตัวอย่าง shops
INSERT INTO shops (name, owner, province) VALUES
('ร้านขายเสื้อ', 'นายA', 'Bangkok'),
('ร้านขายรองเท้า', 'นางสาวB', 'Chonburi'),
('ร้านขายอุปกรณ์', 'นางสาวC', 'Nonthaburi');

-- ข้อมูลตัวอย่าง products
INSERT INTO products (name, price, stock, shop_id) VALUES
('เสื้อ', 100.00, 10, 1),
('รองเท้า', 200.00, 5, 2),
('อุปกรณ์', 300.00, 2, 3);
