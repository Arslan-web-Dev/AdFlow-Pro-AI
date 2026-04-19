-- Seed data for Supabase (30 ads)
-- Run this in Supabase SQL Editor after creating tables

-- Insert demo user first
INSERT INTO users (id, email, name, role, is_active, is_verified, created_at)
VALUES ('demo-user-001', 'demo@adflow.com', 'Demo User', 'client', true, true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert ads
INSERT INTO ads (id, user_id, title, slug, description, status, tags, created_at, updated_at) VALUES
('ad-001', 'demo-user-001', 'iPhone 13 Pro Max', 'iphone-13-pro-max-001', 'Slightly used, excellent condition', 'published', ARRAY['electronics'], NOW(), NOW()),
('ad-002', 'demo-user-001', 'Honda Civic 2018', 'honda-civic-2018-002', 'Well maintained, low mileage', 'published', ARRAY['vehicles'], NOW(), NOW()),
('ad-003', 'demo-user-001', 'Gaming Laptop RTX 3060', 'gaming-laptop-rtx-3060-003', 'High performance gaming laptop', 'published', ARRAY['electronics'], NOW(), NOW()),
('ad-004', 'demo-user-001', 'Wooden Study Table', 'wooden-study-table-004', 'Strong wood, modern design', 'published', ARRAY['furniture'], NOW(), NOW()),
('ad-005', 'demo-user-001', 'Men''s Leather Jacket', 'mens-leather-jacket-005', 'Stylish and warm', 'published', ARRAY['fashion'], NOW(), NOW()),
('ad-006', 'demo-user-001', 'Samsung 55" Smart TV', 'samsung-55-smart-tv-006', '4K UHD, like new', 'published', ARRAY['electronics'], NOW(), NOW()),
('ad-007', 'demo-user-001', 'Mountain Bike', 'mountain-bike-007', 'Durable, good condition', 'published', ARRAY['sports'], NOW(), NOW()),
('ad-008', 'demo-user-001', 'Office Chair', 'office-chair-008', 'Comfortable ergonomic chair', 'published', ARRAY['furniture'], NOW(), NOW()),
('ad-009', 'demo-user-001', 'PS5 Console', 'ps5-console-009', 'Slightly used with controller', 'published', ARRAY['electronics'], NOW(), NOW()),
('ad-010', 'demo-user-001', 'Canon DSLR Camera', 'canon-dslr-camera-010', 'Great for photography', 'published', ARRAY['electronics'], NOW(), NOW()),
('ad-011', 'demo-user-001', 'Sofa Set 5 Seater', 'sofa-set-5-seater-011', 'Clean and stylish', 'published', ARRAY['furniture'], NOW(), NOW()),
('ad-012', 'demo-user-001', 'Air Conditioner 1.5 Ton', 'air-conditioner-15-ton-012', 'Works perfectly', 'published', ARRAY['electronics'], NOW(), NOW()),
('ad-013', 'demo-user-001', 'Women Handbag', 'women-handbag-013', 'Brand new', 'published', ARRAY['fashion'], NOW(), NOW()),
('ad-014', 'demo-user-001', 'Dell Monitor 24"', 'dell-monitor-24-014', 'HD display', 'published', ARRAY['electronics'], NOW(), NOW()),
('ad-015', 'demo-user-001', 'Study Books Set', 'study-books-set-015', 'Complete semester books', 'published', ARRAY['education'], NOW(), NOW()),
('ad-016', 'demo-user-001', 'Refrigerator Haier', 'refrigerator-haier-016', 'Good cooling', 'published', ARRAY['appliances'], NOW(), NOW()),
('ad-017', 'demo-user-001', 'Nike Running Shoes', 'nike-running-shoes-017', 'Comfortable shoes', 'published', ARRAY['fashion'], NOW(), NOW()),
('ad-018', 'demo-user-001', 'Dining Table Set', 'dining-table-set-018', '6 chairs included', 'published', ARRAY['furniture'], NOW(), NOW()),
('ad-019', 'demo-user-001', 'Smart Watch', 'smart-watch-019', 'Fitness tracking', 'published', ARRAY['electronics'], NOW(), NOW()),
('ad-020', 'demo-user-001', 'Tablet Samsung', 'tablet-samsung-020', 'Good battery life', 'published', ARRAY['electronics'], NOW(), NOW()),
('ad-021', 'demo-user-001', 'Bed with Mattress', 'bed-with-mattress-021', 'King size bed', 'published', ARRAY['furniture'], NOW(), NOW()),
('ad-022', 'demo-user-001', 'Guitar Acoustic', 'guitar-acoustic-022', 'Beginner friendly', 'published', ARRAY['music'], NOW(), NOW()),
('ad-023', 'demo-user-001', 'Washing Machine', 'washing-machine-023', 'Fully automatic', 'published', ARRAY['appliances'], NOW(), NOW()),
('ad-024', 'demo-user-001', 'Office Desk', 'office-desk-024', 'Modern design', 'published', ARRAY['furniture'], NOW(), NOW()),
('ad-025', 'demo-user-001', 'LED Lights Set', 'led-lights-set-025', 'Decorative lights', 'published', ARRAY['home decor'], NOW(), NOW()),
('ad-026', 'demo-user-001', 'Baby Stroller', 'baby-stroller-026', 'Safe and comfortable', 'published', ARRAY['kids'], NOW(), NOW()),
('ad-027', 'demo-user-001', 'Microwave Oven', 'microwave-oven-027', 'Compact size', 'published', ARRAY['appliances'], NOW(), NOW()),
('ad-028', 'demo-user-001', 'Football', 'football-028', 'Durable quality', 'published', ARRAY['sports'], NOW(), NOW()),
('ad-029', 'demo-user-001', 'Car GPS System', 'car-gps-system-029', 'Accurate navigation', 'published', ARRAY['vehicles'], NOW(), NOW()),
('ad-030', 'demo-user-001', 'Bluetooth Speaker', 'bluetooth-speaker-030', 'Loud sound, portable', 'published', ARRAY['electronics'], NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
