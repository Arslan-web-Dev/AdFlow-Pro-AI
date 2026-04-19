-- Seed data for Supabase (30 ads)
-- Run this in Supabase SQL Editor after creating tables

-- Demo User Credentials
-- Email: demo@adflow.com
-- Password: Cui@59191
-- Role: client

-- Insert demo user first
INSERT INTO users (id, email, name, role, is_active, is_verified, created_at)
VALUES ('demo-user-001', 'demo@adflow.com', 'Demo User', 'client', true, true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Add missing columns if not exists
ALTER TABLE ads ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]'::jsonb;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE ads ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Other';
ALTER TABLE ads ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Lahore';

-- Insert ads with images, prices, categories and cities
INSERT INTO ads (id, user_id, title, slug, description, category, city, price, currency, status, tags, media, created_at, updated_at) VALUES
('ad-001', 'demo-user-001', 'iPhone 13 Pro Max', 'iphone-13-pro-max-001', 'Slightly used, excellent condition', 'Electronics', 'Lahore', 850, 'USD', 'published', ARRAY['electronics'], '[{"url": "https://images.unsplash.com/photo-1632661674596-df8be070a5c5", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-002', 'demo-user-001', 'Honda Civic 2018', 'honda-civic-2018-002', 'Well maintained, low mileage', 'Vehicles', 'Karachi', 14500, 'USD', 'published', ARRAY['vehicles'], '[{"url": "https://images.unsplash.com/photo-1549924231-f129b911e442", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-003', 'demo-user-001', 'Gaming Laptop RTX 3060', 'gaming-laptop-rtx-3060-003', 'High performance gaming laptop', 'Electronics', 'Islamabad', 1200, 'USD', 'published', ARRAY['electronics'], '[{"url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-004', 'demo-user-001', 'Wooden Study Table', 'wooden-study-table-004', 'Strong wood, modern design', 'Furniture', 'Faisalabad', 120, 'USD', 'published', ARRAY['furniture'], '[{"url": "https://images.unsplash.com/photo-1582582494700-9b3b1b58c13d", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-005', 'demo-user-001', 'Men''s Leather Jacket', 'mens-leather-jacket-005', 'Stylish and warm', 'Fashion', 'Lahore', 80, 'USD', 'published', ARRAY['fashion'], '[{"url": "https://images.unsplash.com/photo-1520975922284-9c1f8c0c5f7d", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-006', 'demo-user-001', 'Samsung 55" Smart TV', 'samsung-55-smart-tv-006', '4K UHD, like new', 'Electronics', 'Karachi', 600, 'USD', 'published', ARRAY['electronics'], '[{"url": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-007', 'demo-user-001', 'Mountain Bike', 'mountain-bike-007', 'Durable, good condition', 'Sports', 'Peshawar', 200, 'USD', 'published', ARRAY['sports'], '[{"url": "https://images.unsplash.com/photo-1508973379184-7517410fb0ec", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-008', 'demo-user-001', 'Office Chair', 'office-chair-008', 'Comfortable ergonomic chair', 'Furniture', 'Islamabad', 75, 'USD', 'published', ARRAY['furniture'], '[{"url": "https://images.unsplash.com/photo-1580480055273-228ff5388ef8", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-009', 'demo-user-001', 'PS5 Console', 'ps5-console-009', 'Slightly used with controller', 'Electronics', 'Lahore', 700, 'USD', 'published', ARRAY['electronics'], '[{"url": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-010', 'demo-user-001', 'Canon DSLR Camera', 'canon-dslr-camera-010', 'Great for photography', 'Electronics', 'Karachi', 500, 'USD', 'published', ARRAY['electronics'], '[{"url": "https://images.unsplash.com/photo-1519183071298-a2962be96a2d", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-011', 'demo-user-001', 'Sofa Set 5 Seater', 'sofa-set-5-seater-011', 'Clean and stylish', 'Furniture', 'Multan', 400, 'USD', 'published', ARRAY['furniture'], '[{"url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-012', 'demo-user-001', 'Air Conditioner 1.5 Ton', 'air-conditioner-15-ton-012', 'Works perfectly', 'Electronics', 'Lahore', 350, 'USD', 'published', ARRAY['electronics'], '[{"url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-013', 'demo-user-001', 'Women Handbag', 'women-handbag-013', 'Brand new', 'Fashion', 'Islamabad', 45, 'USD', 'published', ARRAY['fashion'], '[{"url": "https://images.unsplash.com/photo-1584917865442-de89df76afd3", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-014', 'demo-user-001', 'Dell Monitor 24"', 'dell-monitor-24-014', 'HD display', 'Electronics', 'Karachi', 150, 'USD', 'published', ARRAY['electronics'], '[{"url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-015', 'demo-user-001', 'Study Books Set', 'study-books-set-015', 'Complete semester books', 'Education', 'Faisalabad', 30, 'USD', 'published', ARRAY['education'], '[{"url": "https://images.unsplash.com/photo-1512820790803-83ca734da794", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-016', 'demo-user-001', 'Refrigerator Haier', 'refrigerator-haier-016', 'Good cooling', 'Appliances', 'Lahore', 300, 'USD', 'published', ARRAY['appliances'], '[{"url": "https://images.unsplash.com/photo-1581579188871-45ea61f2a6b7", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-017', 'demo-user-001', 'Nike Running Shoes', 'nike-running-shoes-017', 'Comfortable shoes', 'Fashion', 'Karachi', 60, 'USD', 'published', ARRAY['fashion'], '[{"url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-018', 'demo-user-001', 'Dining Table Set', 'dining-table-set-018', '6 chairs included', 'Furniture', 'Islamabad', 250, 'USD', 'published', ARRAY['furniture'], '[{"url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-019', 'demo-user-001', 'Smart Watch', 'smart-watch-019', 'Fitness tracking', 'Electronics', 'Lahore', 90, 'USD', 'published', ARRAY['electronics'], '[{"url": "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-020', 'demo-user-001', 'Tablet Samsung', 'tablet-samsung-020', 'Good battery life', 'Electronics', 'Multan', 200, 'USD', 'published', ARRAY['electronics'], '[{"url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-021', 'demo-user-001', 'Bed with Mattress', 'bed-with-mattress-021', 'King size bed', 'Furniture', 'Karachi', 300, 'USD', 'published', ARRAY['furniture'], '[{"url": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-022', 'demo-user-001', 'Guitar Acoustic', 'guitar-acoustic-022', 'Beginner friendly', 'Music', 'Islamabad', 100, 'USD', 'published', ARRAY['music'], '[{"url": "https://images.unsplash.com/photo-1511379938547-c1f69419868d", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-023', 'demo-user-001', 'Washing Machine', 'washing-machine-023', 'Fully automatic', 'Appliances', 'Lahore', 250, 'USD', 'published', ARRAY['appliances'], '[{"url": "https://images.unsplash.com/photo-1582735689369-4fe89db7114c", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-024', 'demo-user-001', 'Office Desk', 'office-desk-024', 'Modern design', 'Furniture', 'Faisalabad', 110, 'USD', 'published', ARRAY['furniture'], '[{"url": "https://images.unsplash.com/photo-1598300056393-4aac492f4344", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-025', 'demo-user-001', 'LED Lights Set', 'led-lights-set-025', 'Decorative lights', 'Home Decor', 'Karachi', 20, 'USD', 'published', ARRAY['home decor'], '[{"url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-026', 'demo-user-001', 'Baby Stroller', 'baby-stroller-026', 'Safe and comfortable', 'Kids', 'Lahore', 95, 'USD', 'published', ARRAY['kids'], '[{"url": "https://images.unsplash.com/photo-1596462502278-27bfdc403348", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-027', 'demo-user-001', 'Microwave Oven', 'microwave-oven-027', 'Compact size', 'Appliances', 'Islamabad', 120, 'USD', 'published', ARRAY['appliances'], '[{"url": "https://images.unsplash.com/photo-1586201375761-83865001e31c", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-028', 'demo-user-001', 'Football', 'football-028', 'Durable quality', 'Sports', 'Peshawar', 25, 'USD', 'published', ARRAY['sports'], '[{"url": "https://images.unsplash.com/photo-1518091043644-c1d4457512c6", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-029', 'demo-user-001', 'Car GPS System', 'car-gps-system-029', 'Accurate navigation', 'Vehicles', 'Karachi', 70, 'USD', 'published', ARRAY['vehicles'], '[{"url": "https://images.unsplash.com/photo-1549921296-3a6b0b7f6b9b", "type": "image", "order": 0}]'::jsonb, NOW(), NOW()),
('ad-030', 'demo-user-001', 'Bluetooth Speaker', 'bluetooth-speaker-030', 'Loud sound, portable', 'Electronics', 'Lahore', 55, 'USD', 'published', ARRAY['electronics'], '[{"url": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad", "type": "image", "order": 0}]'::jsonb, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
  category = EXCLUDED.category,
  city = EXCLUDED.city,
  media = EXCLUDED.media,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency;
