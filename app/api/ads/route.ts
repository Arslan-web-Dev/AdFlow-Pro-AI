import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import { canEditAd, canDeleteAd } from '@/lib/auth/rbac';
import Log from '@/lib/models/Log';
import { syncAdToSupabase } from '@/lib/supabase/sync';

// GET all ads (with filtering)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = extractTokenFromHeader(request.headers.get('authorization'));
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

    // Clients can only see their own ads unless viewing marketplace
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
      .limit(limit)
      .populate('userId', 'name email avatar')
      .populate('moderatorId', 'name email');

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
    await connectDB();

    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, packageId, categoryId, cityId, tags } = body;

    // Generate slug from title
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now();

    const ad = await Ad.create({
      title,
      description,
      slug,
      userId: payload.userId,
      packageId: packageId,
      categoryId: categoryId,
      cityId: cityId,
      status: 'draft',
      tags: tags || [],
    });

    // Log ad creation
    await Log.create({
      level: 'info',
      action: 'ad_created',
      userId: payload.userId,
      adId: ad._id.toString(),
      details: { title, categoryId },
    });

    // Sync to Supabase
    await syncAdToSupabase(ad._id.toString());

    return NextResponse.json({ ad }, { status: 201 });
  } catch (error) {
    console.error('Create ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
