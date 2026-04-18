import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({
        pendingCount: 0,
        approvedToday: 0,
        rejectedToday: 0,
        totalReviewed: 0,
      });
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [pendingCount, approvedToday, rejectedToday, totalReviewed] = await Promise.all([
      Ad.countDocuments({ status: 'pending' }),
      Ad.countDocuments({ 
        status: 'published', 
        moderatedBy: payload.userId,
        moderatedAt: { $gte: today }
      }),
      Ad.countDocuments({ 
        status: 'rejected', 
        moderatedBy: payload.userId,
        moderatedAt: { $gte: today }
      }),
      Ad.countDocuments({ 
        moderatedBy: payload.userId,
        moderatedAt: { $exists: true }
      }),
    ]);

    return NextResponse.json({
      pendingCount,
      approvedToday,
      rejectedToday,
      totalReviewed,
    });
  } catch (error) {
    console.error('Get moderator stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
