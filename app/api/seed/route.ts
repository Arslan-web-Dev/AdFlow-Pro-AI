import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import User from '@/lib/models/User';

const ADS_DATA = [
  {
    title: "iPhone 13 Pro Max",
    category: "Electronics",
    city: "Lahore",
    price: 850,
    description: "Slightly used, excellent condition",
    imageUrl: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5"
  },
  {
    title: "Honda Civic 2018",
    category: "Vehicles",
    city: "Karachi",
    price: 14500,
    description: "Well maintained, low mileage",
    imageUrl: "https://images.unsplash.com/photo-1549924231-f129b911e442"
  },
  {
    title: "Gaming Laptop RTX 3060",
    category: "Electronics",
    city: "Islamabad",
    price: 1200,
    description: "High performance gaming laptop",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
  },
  {
    title: "Wooden Study Table",
    category: "Home & Garden",
    city: "Faisalabad",
    price: 120,
    description: "Strong wood, modern design",
    imageUrl: "https://images.unsplash.com/photo-1582582494700-9b3b1b58c13d"
  },
  {
    title: "Men's Leather Jacket",
    category: "Fashion",
    city: "Lahore",
    price: 80,
    description: "Stylish and warm",
    imageUrl: "https://images.unsplash.com/photo-1520975922284-9c1f8c0c5f7d"
  },
  {
    title: "Samsung 55\" Smart TV",
    category: "Electronics",
    city: "Karachi",
    price: 600,
    description: "4K UHD, like new",
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1"
  },
  {
    title: "Mountain Bike",
    category: "Sports",
    city: "Peshawar",
    price: 200,
    description: "Durable, good condition",
    imageUrl: "https://images.unsplash.com/photo-1508973379184-7517410fb0ec"
  },
  {
    title: "Office Chair",
    category: "Home & Garden",
    city: "Islamabad",
    price: 75,
    description: "Comfortable ergonomic chair",
    imageUrl: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8"
  },
  {
    title: "PS5 Console",
    category: "Electronics",
    city: "Lahore",
    price: 700,
    description: "Slightly used with controller",
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db"
  },
  {
    title: "Canon DSLR Camera",
    category: "Electronics",
    city: "Karachi",
    price: 500,
    description: "Great for photography",
    imageUrl: "https://images.unsplash.com/photo-1519183071298-a2962be96a2d"
  },
  {
    title: "Sofa Set 5 Seater",
    category: "Home & Garden",
    city: "Multan",
    price: 400,
    description: "Clean and stylish",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
  },
  {
    title: "Air Conditioner 1.5 Ton",
    category: "Electronics",
    city: "Lahore",
    price: 350,
    description: "Works perfectly",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
  },
  {
    title: "Women Handbag",
    category: "Fashion",
    city: "Islamabad",
    price: 45,
    description: "Brand new",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3"
  },
  {
    title: "Dell Monitor 24\"",
    category: "Electronics",
    city: "Karachi",
    price: 150,
    description: "HD display",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf"
  },
  {
    title: "Study Books Set",
    category: "Books",
    city: "Faisalabad",
    price: 30,
    description: "Complete semester books",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794"
  },
  {
    title: "Refrigerator Haier",
    category: "Home & Garden",
    city: "Lahore",
    price: 300,
    description: "Good cooling",
    imageUrl: "https://images.unsplash.com/photo-1581579188871-45ea61f2a6b7"
  },
  {
    title: "Nike Running Shoes",
    category: "Fashion",
    city: "Karachi",
    price: 60,
    description: "Comfortable shoes",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
  },
  {
    title: "Dining Table Set",
    category: "Home & Garden",
    city: "Islamabad",
    price: 250,
    description: "6 chairs included",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
  },
  {
    title: "Smart Watch",
    category: "Electronics",
    city: "Lahore",
    price: 90,
    description: "Fitness tracking",
    imageUrl: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b"
  },
  {
    title: "Tablet Samsung",
    category: "Electronics",
    city: "Multan",
    price: 200,
    description: "Good battery life",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3"
  },
  {
    title: "Bed with Mattress",
    category: "Home & Garden",
    city: "Karachi",
    price: 300,
    description: "King size bed",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
  },
  {
    title: "Guitar Acoustic",
    category: "Other",
    city: "Islamabad",
    price: 100,
    description: "Beginner friendly",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
  },
  {
    title: "Washing Machine",
    category: "Home & Garden",
    city: "Lahore",
    price: 250,
    description: "Fully automatic",
    imageUrl: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c"
  },
  {
    title: "Office Desk",
    category: "Home & Garden",
    city: "Faisalabad",
    price: 110,
    description: "Modern design",
    imageUrl: "https://images.unsplash.com/photo-1598300056393-4aac492f4344"
  },
  {
    title: "LED Lights Set",
    category: "Home & Garden",
    city: "Karachi",
    price: 20,
    description: "Decorative lights",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
  },
  {
    title: "Baby Stroller",
    category: "Other",
    city: "Lahore",
    price: 95,
    description: "Safe and comfortable",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
  },
  {
    title: "Microwave Oven",
    category: "Home & Garden",
    city: "Islamabad",
    price: 120,
    description: "Compact size",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c"
  },
  {
    title: "Football",
    category: "Sports",
    city: "Peshawar",
    price: 25,
    description: "Durable quality",
    imageUrl: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6"
  },
  {
    title: "Car GPS System",
    category: "Vehicles",
    city: "Karachi",
    price: 70,
    description: "Accurate navigation",
    imageUrl: "https://images.unsplash.com/photo-1549921296-3a6b0b7f6b9b"
  },
  {
    title: "Bluetooth Speaker",
    category: "Electronics",
    city: "Lahore",
    price: 55,
    description: "Loud sound, portable",
    imageUrl: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad"
  }
];

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get or create a demo user
    let user = await User.findOne({ email: 'demo@adflow.com' });
    if (!user) {
      user = await User.create({
        email: 'demo@adflow.com',
        name: 'Demo User',
        password: 'Demo123!',
        role: 'client',
        isActive: true,
        isVerified: true
      });
    }

    const results = {
      created: 0,
      skipped: 0,
      errors: [] as string[]
    };

    for (const adData of ADS_DATA) {
      try {
        // Check if ad already exists
        const existing = await Ad.findOne({ title: adData.title });
        if (existing) {
          results.skipped++;
          continue;
        }

        const slug = adData.title.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '') + '-' + Date.now();

        await Ad.create({
          title: adData.title,
          description: adData.description,
          slug,
          userId: user._id.toString(),
          category: adData.category,
          city: adData.city,
          price: adData.price,
          currency: 'USD',
          status: 'published',
          priority: 'basic',
          tags: [adData.category.toLowerCase()],
          media: [{ url: adData.imageUrl, type: 'image', order: 0 }],
          publishedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isAIGenerated: false,
          views: Math.floor(Math.random() * 100),
          clicks: Math.floor(Math.random() * 20),
          paymentStatus: 'not_required'
        });

        results.created++;
      } catch (err: any) {
        results.errors.push(`${adData.title}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${results.created} ads, skipped ${results.skipped}`,
      results
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Seed failed', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const count = await Ad.countDocuments({ status: 'published' });
    return NextResponse.json({ count, message: `Database has ${count} published ads` });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Check failed', message: error.message },
      { status: 500 }
    );
  }
}
