import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify admin authentication
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get stats
    const [
      totalUsers,
      totalAds,
      pendingAds,
      publishedAds,
      recentUsers,
      recentAds,
    ] = await Promise.all([
      User.countDocuments(),
      Ad.countDocuments(),
      Ad.countDocuments({ status: 'pending' }),
      Ad.countDocuments({ status: 'published' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      Ad.find().sort({ createdAt: -1 }).limit(5).select('title status category createdAt'),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalAds,
        pendingAds,
        publishedAds,
        recentUsers,
        recentAds,
      },
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
