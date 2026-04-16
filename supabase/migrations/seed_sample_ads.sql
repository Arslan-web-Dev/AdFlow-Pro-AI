-- Seed categories first (if they don't exist)
INSERT INTO public.categories (name, slug, icon)
VALUES
  ('Real Estate', 'real-estate', 'Home'),
  ('Vehicles', 'vehicles', 'Car'),
  ('Electronics', 'electronics', 'Laptop'),
  ('Services', 'services', 'Wrench'),
  ('Fashion', 'fashion', 'Shirt'),
  ('Home & Garden', 'home-garden', 'Flower'),
  ('Pets', 'pets', 'Dog'),
  ('Jobs', 'jobs', 'Briefcase')
ON CONFLICT (slug) DO NOTHING;

-- Seed cities (if they don't exist)
INSERT INTO public.cities (name, country, state)
VALUES
  ('New York', 'USA', 'NY'),
  ('Toronto', 'Canada', 'ON'),
  ('Mexico City', 'Mexico', NULL),
  ('London', 'UK', NULL),
  ('Paris', 'France', NULL),
  ('Berlin', 'Germany', NULL),
  ('Tokyo', 'Japan', NULL),
  ('Dubai', 'UAE', NULL),
  ('Singapore', 'Singapore', NULL),
  ('Lahore', 'Pakistan', 'Punjab'),
  ('Karachi', 'Pakistan', 'Sindh'),
  ('Sargodha', 'Pakistan', 'Punjab')
ON CONFLICT DO NOTHING;

-- Insert sample ads for demonstration
-- Note: This uses a placeholder user_id. Replace with actual user UUID from your auth.users table
-- You can get your user UUID by running: SELECT id FROM auth.users LIMIT 1;
INSERT INTO public.ads (
  id,
  user_id,
  title,
  slug,
  description,
  price,
  category_id,
  city_name,
  status,
  is_featured,
  created_at
)
SELECT
  gen_random_uuid(),
  u.id AS user_id,
  v.title,
  v.slug,
  v.description,
  v.price,
  c.id AS category_id,
  v.city_name,
  'published' AS status,
  v.is_featured,
  NOW()
FROM (SELECT id FROM auth.users LIMIT 1) AS u(id)
CROSS JOIN (
  VALUES
    ('Luxury Apartment in Downtown', 'luxury-apartment-in-downtown',
     'Beautiful 2 bedroom apartment with city views, modern amenities, and a balcony.',
     3500.00, 'real-estate', 'New York', true),

    ('2022 Tesla Model 3 Long Range', '2022-tesla-model-3-lr',
     'Excellent condition, white exterior, black interior, FSD included.',
     45000.00, 'vehicles', 'Toronto', false),

    ('MacBook Pro M2 Max 64GB', 'macbook-pro-m2-max',
     'Barely used, perfectly clean. Comes with original box and AppleCare+.',
     2800.00, 'electronics', 'Mexico City', true),

    ('iPhone 15 Pro Max 256GB', 'iphone-15-pro-max',
     'Brand new sealed in box. Titanium blue color.',
     1200.00, 'electronics', 'London', false),

    ('Professional Web Development Services', 'web-development-services',
     'Full-stack web development with React, Next.js, and Node.js. 5+ years experience.',
     500.00, 'services', 'Paris', false)
) AS v(title, slug, description, price, category_slug, city_name, is_featured)
JOIN public.categories c ON c.slug = v.category_slug
ON CONFLICT (slug) DO NOTHING;
