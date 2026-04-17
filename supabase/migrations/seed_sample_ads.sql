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
    ('Jobs', 'jobs', 'Briefcase'),
    ('Furniture', 'furniture', 'Armchair'),
    ('Sports', 'sports', 'Dumbbell'),
    ('Education', 'education', 'Book'),
    ('Appliances', 'appliances', 'WashingMachine'),
    ('Music', 'music', 'Guitar'),
    ('Home Decor', 'home-decor', 'Lightbulb'),
    ('Kids', 'kids', 'Baby')
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
    ('Rawalpindi', 'Pakistan', 'Punjab'),
    ('Peshawar', 'Pakistan', 'Khyber Pakhtunkhwa'),
    ('Multan', 'Pakistan', 'Punjab')
  ON CONFLICT DO NOTHING;

  -- Insert 30 sample ads with images and related products
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
    image_urls,
    related_products,
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
    ARRAY[v.image_url] AS image_urls,
    v.related_products AS related_products,
    'published' AS status,
    v.is_featured,
    NOW()
  FROM (SELECT id FROM auth.users LIMIT 1) AS u(id)
  CROSS JOIN (
    VALUES
      ('iPhone 13 Pro Max', 'iphone-13-pro-max',
      'Slightly used, excellent condition',
      850.00, 'electronics', 'Lahore', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5',
      ARRAY['iPhone Charger', 'Phone Case', 'Screen Protector']::text[], true),

      ('Honda Civic 2018', 'honda-civic-2018',
      'Well maintained, low mileage',
      14500.00, 'vehicles', 'Karachi', 'https://images.unsplash.com/photo-1549924231-f129b911e442',
      ARRAY['Car Cover', 'Floor Mats', 'GPS Navigator']::text[], false),

      ('Gaming Laptop RTX 3060', 'gaming-laptop-rtx-3060',
      'High performance gaming laptop',
      1200.00, 'electronics', 'Islamabad', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      ARRAY['Gaming Mouse', 'Mechanical Keyboard', 'Gaming Headset']::text[], true),

      ('Wooden Study Table', 'wooden-study-table',
      'Strong wood, modern design',
      120.00, 'furniture', 'Faisalabad', 'https://images.unsplash.com/photo-1582582494700-9b3b1b58c13d',
      ARRAY['Study Chair', 'Desk Lamp', 'Bookshelf']::text[], false),

      ('Men Leather Jacket', 'men-leather-jacket',
      'Stylish and warm',
      80.00, 'fashion', 'Lahore', 'https://images.unsplash.com/photo-1520975922284-9c1f8c0c5f7d',
      ARRAY['Leather Belt', 'Leather Boots', 'Scarf']::text[], false),

      ('Samsung 55" Smart TV', 'samsung-55-smart-tv',
      '4K UHD, like new',
      600.00, 'electronics', 'Karachi', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
      ARRAY['TV Stand', 'Sound Bar', 'Streaming Device']::text[], true),

      ('Mountain Bike', 'mountain-bike',
      'Durable, good condition',
      200.00, 'sports', 'Peshawar', 'https://images.unsplash.com/photo-1508973379184-7517410fb0ec',
      ARRAY['Bike Helmet', 'Bike Lock', 'Water Bottle']::text[], false),

      ('Office Chair', 'office-chair',
      'Comfortable ergonomic chair',
      75.00, 'furniture', 'Islamabad', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8',
      ARRAY['Desk Mat', 'Foot Rest', 'Lumbar Pillow']::text[], false),

      ('PS5 Console', 'ps5-console',
      'Slightly used with controller',
      700.00, 'electronics', 'Lahore', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db',
      ARRAY['Extra Controller', 'Gaming Headset', 'PS Plus Subscription']::text[], true),

      ('Canon DSLR Camera', 'canon-dslr-camera',
      'Great for photography',
      500.00, 'electronics', 'Karachi', 'https://images.unsplash.com/photo-1519183071298-a2962be96a2d',
      ARRAY['Camera Bag', 'Tripod', 'Memory Card']::text[], false),

      ('Sofa Set 5 Seater', 'sofa-set-5-seater',
      'Clean and stylish',
      400.00, 'furniture', 'Multan', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
      ARRAY['Coffee Table', 'Cushions', 'Side Table']::text[], false),

      ('Air Conditioner 1.5 Ton', 'air-conditioner-1-5-ton',
      'Works perfectly',
      350.00, 'appliances', 'Lahore', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
      ARRAY['AC Cover', 'Remote Control', 'Stabilizer']::text[], false),

      ('Women Handbag', 'women-handbag',
      'Brand new',
      45.00, 'fashion', 'Islamabad', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
      ARRAY['Wallet', 'Sunglasses', 'Scarf']::text[], false),

      ('Dell Monitor 24"', 'dell-monitor-24',
      'HD display',
      150.00, 'electronics', 'Karachi', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
      ARRAY['Monitor Stand', 'HDMI Cable', 'Screen Cleaner']::text[], false),

      ('Study Books Set', 'study-books-set',
      'Complete semester books',
      30.00, 'education', 'Faisalabad', 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
      ARRAY['Notebooks', 'Pens Set', 'Highlighters']::text[], false),

      ('Refrigerator Haier', 'refrigerator-haier',
      'Good cooling',
      300.00, 'appliances', 'Lahore', 'https://images.unsplash.com/photo-1581579188871-45ea61f2a6b7',
      ARRAY['Ice Trays', 'Water Filter', 'Door Organizer']::text[], false),

      ('Nike Running Shoes', 'nike-running-shoes',
      'Comfortable shoes',
      60.00, 'fashion', 'Karachi', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      ARRAY['Athletic Socks', 'Running Shorts', 'Sports Watch']::text[], false),

      ('Dining Table Set', 'dining-table-set',
      '6 chairs included',
      250.00, 'furniture', 'Islamabad', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      ARRAY['Dinner Set', 'Table Runner', 'Napkins']::text[], false),

      ('Smart Watch', 'smart-watch',
      'Fitness tracking',
      90.00, 'electronics', 'Lahore', 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b',
      ARRAY['Watch Band', 'Charging Cable', 'Screen Protector']::text[], false),

      ('Tablet Samsung', 'tablet-samsung',
      'Good battery life',
      200.00, 'electronics', 'Multan', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
      ARRAY['Tablet Case', 'Stylus Pen', 'Screen Protector']::text[], false),

      ('Bed with Mattress', 'bed-with-mattress',
      'King size bed',
      300.00, 'furniture', 'Karachi', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      ARRAY['Bed Sheets', 'Pillows', 'Bedspread']::text[], false),

      ('Guitar Acoustic', 'guitar-acoustic',
      'Beginner friendly',
      100.00, 'music', 'Islamabad', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
      ARRAY['Guitar Picks', 'Guitar Strap', 'Tuner']::text[], false),

      ('Washing Machine', 'washing-machine',
      'Fully automatic',
      250.00, 'appliances', 'Lahore', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c',
      ARRAY['Detergent', 'Fabric Softener', 'Washing Net']::text[], false),

      ('Office Desk', 'office-desk',
      'Modern design',
      110.00, 'furniture', 'Faisalabad', 'https://images.unsplash.com/photo-1598300056393-4aac492f4344',
      ARRAY['Desk Organizer', 'Pen Holder', 'File Cabinet']::text[], false),

      ('LED Lights Set', 'led-lights-set',
      'Decorative lights',
      20.00, 'home-decor', 'Karachi', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      ARRAY['Light Bulbs', 'Remote Control', 'Extension Cord']::text[], false),

      ('Baby Stroller', 'baby-stroller',
      'Safe and comfortable',
      95.00, 'kids', 'Lahore', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
      ARRAY['Baby Carrier', 'Diaper Bag', 'Baby Blanket']::text[], false),

      ('Microwave Oven', 'microwave-oven',
      'Compact size',
      120.00, 'appliances', 'Islamabad', 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
      ARRAY['Microwave Cover', 'Glass Bowl Set', 'Oven Mitts']::text[], false),

      ('Football', 'football',
      'Durable quality',
      25.00, 'sports', 'Peshawar', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6',
      ARRAY['Pump', 'Cones', 'Water Bottle']::text[], false),

      ('Car GPS System', 'car-gps-system',
      'Accurate navigation',
      70.00, 'vehicles', 'Karachi', 'https://images.unsplash.com/photo-1549921296-3a6b0b7f6b9b',
      ARRAY['Car Charger', 'Mount Holder', 'SD Card']::text[], false),

      ('Bluetooth Speaker', 'bluetooth-speaker',
      'Loud sound, portable',
      55.00, 'electronics', 'Lahore', 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad',
      ARRAY['Carrying Case', 'USB Cable', 'Audio Cable']::text[], false)
  ) AS v(title, slug, description, price, category_slug, city_name, image_url, related_products, is_featured)
  JOIN public.categories c ON c.slug = v.category_slug
  ON CONFLICT (slug) DO NOTHING;  
