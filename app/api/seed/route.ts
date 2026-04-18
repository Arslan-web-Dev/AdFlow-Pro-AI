import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

const demoCategories = [
  { name: 'Electronics', slug: 'electronics', description: 'Gadgets, devices, and tech products', icon: 'Smartphone' },
  { name: 'Vehicles', slug: 'vehicles', description: 'Cars, bikes, and automobiles', icon: 'Car' },
  { name: 'Furniture', slug: 'furniture', description: 'Home and office furniture', icon: 'Sofa' },
  { name: 'Fashion', slug: 'fashion', description: 'Clothing, shoes, and accessories', icon: 'Shirt' },
  { name: 'Sports', slug: 'sports', description: 'Sports equipment and gear', icon: 'Dumbbell' },
  { name: 'Appliances', slug: 'appliances', description: 'Home appliances and machines', icon: 'Home' },
  { name: 'Education', slug: 'education', description: 'Books and educational materials', icon: 'Book' },
  { name: 'Music', slug: 'music', description: 'Musical instruments and equipment', icon: 'Music' },
  { name: 'Kids', slug: 'kids', description: 'Baby and kids products', icon: 'Baby' },
  { name: 'Home Decor', slug: 'home-decor', description: 'Home decoration items', icon: 'Lamp' },
];

const demoCities = [
  { name: 'Lahore', slug: 'lahore', country: 'Pakistan' },
  { name: 'Karachi', slug: 'karachi', country: 'Pakistan' },
  { name: 'Islamabad', slug: 'islamabad', country: 'Pakistan' },
  { name: 'Faisalabad', slug: 'faisalabad', country: 'Pakistan' },
  { name: 'Peshawar', slug: 'peshawar', country: 'Pakistan' },
  { name: 'Multan', slug: 'multan', country: 'Pakistan' },
];

const demoPackages = [
  { name: 'Basic', duration_days: 30, weight: 1, price: 500, features: ['30 days visibility', 'Standard listing'] },
  { name: 'Premium', duration_days: 60, weight: 5, price: 1500, features: ['60 days visibility', 'Featured badge', 'Priority ranking'] },
  { name: 'Enterprise', duration_days: 90, weight: 10, price: 3000, features: ['90 days visibility', 'Featured badge', 'Homepage display', 'Auto-refresh'] },
];

// Pakistani Ads with Images
interface DemoAd {
  title: string;
  description: string;
  price: number;
  category: string;
  city: string;
  status: string;
  image: string;
}

const demoAds: DemoAd[] = [
  { title: 'iPhone 13 Pro Max', description: 'Slightly used, excellent condition. 256GB storage, all accessories included.', price: 850, category: 'electronics', city: 'lahore', status: 'published', image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800' },
  { title: 'Honda Civic 2018', description: 'Well maintained, low mileage. Single owner, complete service history available.', price: 14500, category: 'vehicles', city: 'karachi', status: 'published', image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800' },
  { title: 'Gaming Laptop RTX 3060', description: 'High performance gaming laptop with NVIDIA RTX 3060. Perfect for gaming and work.', price: 1200, category: 'electronics', city: 'islamabad', status: 'published', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800' },
  { title: 'Wooden Study Table', description: 'Strong wood construction with modern design. Perfect for students and professionals.', price: 120, category: 'furniture', city: 'faisalabad', status: 'published', image: 'https://images.unsplash.com/photo-1582582494700-9b3b1b58c13d?w=800' },
  { title: 'Men Leather Jacket', description: 'Stylish and warm genuine leather jacket. Perfect for winter season.', price: 80, category: 'fashion', city: 'lahore', status: 'published', image: 'https://images.unsplash.com/photo-1520975922284-9c1f8c0c5f7d?w=800' },
  { title: 'Samsung 55 inch Smart TV', description: '4K UHD Smart TV, like new condition. All features working perfectly.', price: 600, category: 'electronics', city: 'karachi', status: 'published', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800' },
  { title: 'Mountain Bike', description: 'Durable mountain bike, good condition. Perfect for outdoor adventures.', price: 200, category: 'sports', city: 'peshawar', status: 'published', image: 'https://images.unsplash.com/photo-1508973379184-7517410fb0ec?w=800' },
  { title: 'Office Chair', description: 'Comfortable ergonomic office chair with lumbar support. Like new condition.', price: 75, category: 'furniture', city: 'islamabad', status: 'published', image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800' },
  { title: 'PS5 Console', description: 'Slightly used PlayStation 5 with controller. All cables and original box included.', price: 700, category: 'electronics', city: 'lahore', status: 'published', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800' },
  { title: 'Canon DSLR Camera', description: 'Professional DSLR camera, great for photography enthusiasts. Lens included.', price: 500, category: 'electronics', city: 'karachi', status: 'published', image: 'https://images.unsplash.com/photo-1519183071298-a2962be96a2d?w=800' },
  { title: 'Sofa Set 5 Seater', description: 'Clean and stylish 5-seater sofa set. Comfortable and durable fabric.', price: 400, category: 'furniture', city: 'multan', status: 'published', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800' },
  { title: 'Air Conditioner 1.5 Ton', description: '1.5 Ton AC unit, works perfectly. Energy efficient cooling.', price: 350, category: 'appliances', city: 'lahore', status: 'published', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800' },
  { title: 'Women Handbag', description: 'Brand new designer handbag. Stylish and spacious, perfect for daily use.', price: 45, category: 'fashion', city: 'islamabad', status: 'published', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800' },
  { title: 'Dell Monitor 24 inch', description: '24 inch HD display monitor. Perfect for work and gaming setup.', price: 150, category: 'electronics', city: 'karachi', status: 'published', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800' },
  { title: 'Study Books Set', description: 'Complete semester books for university students. All subjects included.', price: 30, category: 'education', city: 'faisalabad', status: 'published', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800' },
  { title: 'Refrigerator Haier', description: 'Haier refrigerator with good cooling capacity. Double door, energy efficient.', price: 300, category: 'appliances', city: 'lahore', status: 'published', image: 'https://images.unsplash.com/photo-1581579188871-45ea61f2a6b7?w=800' },
  { title: 'Nike Running Shoes', description: 'Comfortable Nike running shoes. Lightweight and durable for daily jogging.', price: 60, category: 'fashion', city: 'karachi', status: 'published', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' },
  { title: 'Dining Table Set', description: 'Elegant dining table with 6 chairs included. Perfect for family dinners.', price: 250, category: 'furniture', city: 'islamabad', status: 'published', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
  { title: 'Smart Watch', description: 'Fitness tracking smart watch with heart rate monitor. Water resistant.', price: 90, category: 'electronics', city: 'lahore', status: 'published', image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800' },
  { title: 'Tablet Samsung', description: 'Samsung tablet with good battery life. Perfect for media and browsing.', price: 200, category: 'electronics', city: 'multan', status: 'published', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800' },
  { title: 'Bed with Mattress', description: 'King size bed with premium mattress. Solid wood frame, comfortable sleep.', price: 300, category: 'furniture', city: 'karachi', status: 'published', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800' },
  { title: 'Guitar Acoustic', description: 'Beginner friendly acoustic guitar. Good sound quality, comes with case.', price: 100, category: 'music', city: 'islamabad', status: 'published', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800' },
  { title: 'Washing Machine', description: 'Fully automatic washing machine. Multiple wash programs, good condition.', price: 250, category: 'appliances', city: 'lahore', status: 'published', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800' },
  { title: 'Office Desk', description: 'Modern design office desk with drawers. Spacious work area, sturdy build.', price: 110, category: 'furniture', city: 'faisalabad', status: 'published', image: 'https://images.unsplash.com/photo-1598300056393-4aac492f4344?w=800' },
  { title: 'LED Lights Set', description: 'Decorative LED lights set for home decoration. Multiple colors and modes.', price: 20, category: 'home-decor', city: 'karachi', status: 'published', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800' },
  { title: 'Baby Stroller', description: 'Safe and comfortable baby stroller. Easy to fold and carry. Like new.', price: 95, category: 'kids', city: 'lahore', status: 'published', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800' },
  { title: 'Microwave Oven', description: 'Compact size microwave oven. Perfect for small kitchens and quick heating.', price: 120, category: 'appliances', city: 'islamabad', status: 'published', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800' },
  { title: 'Football', description: 'Durable quality football. Official size, perfect for ground play.', price: 25, category: 'sports', city: 'peshawar', status: 'published', image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800' },
  { title: 'Car GPS System', description: 'Accurate navigation GPS system for cars. Easy to install and use.', price: 70, category: 'vehicles', city: 'karachi', status: 'published', image: 'https://images.unsplash.com/photo-1549921296-3a6b0b7f6b9b?w=800' },
  { title: 'Bluetooth Speaker', description: 'Loud sound portable Bluetooth speaker. Long battery life, waterproof.', price: 55, category: 'electronics', city: 'lahore', status: 'published', image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800' },
];

export async function POST(request: NextRequest) {
  try {
    const { seedKey } = await request.json();
    if (seedKey !== 'adflow-seed-2024') {
      return NextResponse.json({ error: 'Invalid seed key' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const results = { categories: 0, cities: 0, packages: 0, ads: 0, errors: [] as string[] };

    // Seed Categories
    for (const cat of demoCategories) {
      const { error } = await supabaseAdmin.from('categories').upsert(cat, { onConflict: 'slug' });
      if (!error) results.categories++;
      else results.errors.push(`Category ${cat.name}: ${error.message}`);
    }

    // Seed Cities
    for (const city of demoCities) {
      const { error } = await supabaseAdmin.from('cities').upsert(city, { onConflict: 'slug' });
      if (!error) results.cities++;
      else results.errors.push(`City ${city.name}: ${error.message}`);
    }

    // Seed Packages
    for (const pkg of demoPackages) {
      const { error } = await supabaseAdmin.from('packages').upsert(pkg, { onConflict: 'name' });
      if (!error) results.packages++;
      else results.errors.push(`Package ${pkg.name}: ${error.message}`);
    }

    // Get first user for ads
    const { data: firstUser } = await supabaseAdmin.from('users').select('id').limit(1).single();
    
    // Get categories and cities for ads
    const { data: categories } = await supabaseAdmin.from('categories').select('id, slug');
    const { data: cities } = await supabaseAdmin.from('cities').select('id, slug');
    const { data: packages } = await supabaseAdmin.from('packages').select('id').limit(1);

    if (firstUser && categories && cities && packages) {
      const catMap = Object.fromEntries(categories.map(c => [c.slug, c.id]));
      const cityMap = Object.fromEntries(cities.map(c => [c.slug, c.id]));
      const packageId = packages[0]?.id;

      for (const ad of demoAds) {
        const categoryId = catMap[ad.category];
        const cityId = cityMap[ad.city];
        
        if (categoryId && cityId && packageId && ad.title) {
          const expireAt = new Date();
          expireAt.setDate(expireAt.getDate() + 30);
          
          const slug = ad.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);

          // Insert the ad
          const { data: insertedAd, error: adError } = await supabaseAdmin
            .from('ads')
            .upsert({
              title: ad.title,
              slug: slug,
              description: ad.description,
              price: ad.price,
              category_id: categoryId,
              city_id: cityId,
              user_id: firstUser.id,
              package_id: packageId,
              status: ad.status,
              expire_at: expireAt.toISOString(),
              rank_score: Math.floor(Math.random() * 100),
            }, { onConflict: 'slug' })
            .select()
            .single();

          if (adError) {
            results.errors.push(`Ad ${ad.title}: ${adError.message}`);
            continue;
          }
          
          // Insert ad media (image)
          if (insertedAd && ad.image) {
            const { error: mediaError } = await supabaseAdmin
              .from('ad_media')
              .upsert({
                ad_id: insertedAd.id,
                type: 'image',
                url: ad.image,
                order_index: 0,
              }, { onConflict: 'ad_id,order_index' });
            
            if (mediaError) {
              results.errors.push(`Media for ${ad.title}: ${mediaError.message}`);
            }
          }

          results.ads++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      results,
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed', details: error.message }, { status: 500 });
  }
}
