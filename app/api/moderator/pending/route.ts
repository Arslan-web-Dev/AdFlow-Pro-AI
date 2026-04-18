import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ ads: [] });
    }

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Only moderators and admins can access
    if (payload.role !== 'moderator' && payload.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const ads = await Ad.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(50);

    // Transform to include user info (in production, you'd populate from User model)
    const transformedAds = ads.map(ad => ({
      _id: ad._id,
      title: ad.title,
      description: ad.description,
      category: ad.category,
      city: ad.city,
      userName: 'User', // Placeholder - would be populated from User model
      userEmail: 'user@example.com',
      createdAt: ad.createdAt,
    }));

    return NextResponse.json({ ads: transformedAds });
  } catch (error) {
    console.error('Get pending ads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
