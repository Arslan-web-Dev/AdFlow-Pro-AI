import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import { hasPermission, UserRole } from '@/lib/auth/rbac';
import { setExpireDate } from '@/lib/utils/package-engine';
import { saveMediaToDatabase } from '@/lib/utils/media-normalization';

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

    // Check permission
    if (!hasPermission(payload.role as UserRole, 'canCreateAds')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const {
      packageId,
      categoryId,
      cityId,
      title,
      description,
      tags,
      mediaUrls,
    } = body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingAd = await Ad.findOne({ slug });
    if (existingAd) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Create ad
    const ad = await Ad.create({
      userId: payload.userId,
      packageId,
      categoryId,
      cityId,
      title,
      slug,
      description,
      tags: tags || [],
      status: 'draft',
    });

    // Set expire date based on package
    await setExpireDate(ad._id.toString(), packageId);

    // Save media if provided
    if (mediaUrls && mediaUrls.length > 0) {
      for (const mediaUrl of mediaUrls) {
        await saveMediaToDatabase(ad._id.toString(), mediaUrl);
      }
    }

    return NextResponse.json({ success: true, ad });
  } catch (error) {
    console.error('Create ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    const query: any = { userId: payload.userId };
    if (status) {
      query.status = status;
    }

    const ads = await Ad.find(query)
      .sort({ createdAt: -1 })
      .populate('categoryId', 'name')
      .populate('cityId', 'name')
      .populate('packageId', 'name durationDays');

    return NextResponse.json({ ads });
  } catch (error) {
    console.error('Get client ads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
