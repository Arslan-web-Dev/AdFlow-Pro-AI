import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import { logActivity } from '@/lib/models/ActivityLog';

// GET all ads (with filtering)
export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query: any = {};

    // Clients can only see their own ads
    if (payload.role === 'client' && !userId) {
      query.userId = payload.userId;
    } else if (userId) {
      query.userId = userId;
    }

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    const ads = await Ad.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Ad.countDocuments(query);

    return NextResponse.json({
      ads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get ads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new ad
export async function POST(request: NextRequest) {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      description, 
      category, 
      city, 
      price,
      currency = 'USD',
      tags,
      media = [],
      contactEmail,
      contactPhone,
      isAIGenerated = false,
    } = body;

    // Validation
    if (!title || !description || !category || !city || !price) {
      return NextResponse.json(
        { error: 'Title, description, category, city, and price are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '') + '-' + Date.now();

    const ad = await Ad.create({
      title,
      description,
      slug,
      userId: payload.userId,
      category,
      city,
      price: Number(price),
      currency,
      status: 'pending', // New ads go directly to pending for moderation
      priority: 'basic', // Default priority
      tags: tags || [],
      media: media.map((url: string, index: number) => ({
        url,
        type: 'image',
        order: index,
      })),
      contactInfo: {
        email: contactEmail,
        phone: contactPhone,
      },
      isAIGenerated,
      views: 0,
      clicks: 0,
    });

    // Log ad creation
    await logActivity({
      type: 'ad_created',
      description: `Ad "${title}" created by ${payload.email}`,
      userId: payload.userId,
      adId: ad._id.toString(),
      performedBy: payload.userId,
      metadata: { title, category, city, price },
    });

    return NextResponse.json({ 
      ad: {
        _id: ad._id,
        title: ad.title,
        status: ad.status,
        slug: ad.slug,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Create ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
