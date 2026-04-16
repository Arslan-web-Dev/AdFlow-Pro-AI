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
  ('Sargodha', 'Pakistan', 'Punjab'),
  ('Islamabad', 'Pakistan', 'Islamabad Capital Territory'),
  ('Faisalabad', 'Pakistan', 'Punjab'),
  ('Rawalpindi', 'Pakistan', 'Punjab')
ON CONFLICT DO NOTHING;

-- Insert 20 sample ads for demonstration
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
     500.00, 'services', 'Paris', false),

    ('Modern Villa with Pool', 'modern-villa-with-pool',
     'Stunning 4-bedroom villa with private pool, garden, and mountain views.',
     8500.00, 'real-estate', 'Dubai', true),

    ('Honda Civic 2021', 'honda-civic-2021',
     'Well maintained, low mileage, automatic transmission, silver color.',
     18000.00, 'vehicles', 'Lahore', false),

    ('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra',
     'Brand new, 512GB storage, titanium frame, S Pen included.',
     1300.00, 'electronics', 'Karachi', false),

    ('Graphic Design Services', 'graphic-design-services',
     'Professional logo, branding, and UI/UX design. Quick turnaround.',
     300.00, 'services', 'Singapore', false),

    ('Designer Handbag Collection', 'designer-handbag-collection',
     'Authentic luxury handbags in excellent condition. Multiple brands available.',
     2500.00, 'fashion', 'Tokyo', true),

    ('Cozy Studio Apartment', 'cozy-studio-apartment',
     'Perfect for singles, fully furnished, near public transport.',
     1200.00, 'real-estate', 'Berlin', false),

    ('BMW X5 2020', 'bmw-x5-2020',
     'Luxury SUV, black on black, panoramic sunroof, navigation system.',
     55000.00, 'vehicles', 'New York', true),

    ('Sony PlayStation 5', 'sony-playstation-5',
     'Like new, includes 2 controllers and 3 games. Disk edition.',
     450.00, 'electronics', 'London', false),

    ('Home Cleaning Services', 'home-cleaning-services',
     'Professional deep cleaning for homes and offices. Eco-friendly products.',
     150.00, 'services', 'Paris', false),

    ('Vintage Furniture Set', 'vintage-furniture-set',
     'Mid-century modern dining set with 6 chairs. Excellent condition.',
     800.00, 'home-garden', 'Toronto', false),

    ('Golden Retriever Puppies', 'golden-retriever-puppies',
     '8 weeks old, vaccinated, dewormed, with health certificate.',
     600.00, 'pets', 'Lahore', true),

    ('Software Developer Position', 'software-developer-position',
     'Remote full-stack developer role. Competitive salary and benefits.',
     5000.00, 'jobs', 'Dubai', false),

    ('Penthouse with Ocean View', 'penthouse-with-ocean-view',
     'Luxurious 3-bedroom penthouse with stunning ocean views and private elevator.',
     12000.00, 'real-estate', 'Singapore', true),

    ('Toyota Camry Hybrid 2022', 'toyota-camry-hybrid-2022',
     'Fuel efficient, leather interior, sunroof, excellent condition.',
     28000.00, 'vehicles', 'Karachi', false),

    ('Dell XPS 15 Laptop', 'dell-xps-15-laptop',
     'i7 processor, 32GB RAM, 1TB SSD, 4K display. Like new.',
     1500.00, 'electronics', 'Sargodha', false),

    ('Wedding Photography Services', 'wedding-photography-services',
     'Professional wedding photography and videography packages available.',
     1000.00, 'services', 'Islamabad', false)
) AS v(title, slug, description, price, category_slug, city_name, is_featured)
JOIN public.categories c ON c.slug = v.category_slug
ON CONFLICT (slug) DO NOTHING;
