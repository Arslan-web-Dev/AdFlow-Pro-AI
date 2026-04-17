import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import { hasPermission, UserRole } from '@/lib/auth/rbac';
import { moveToPaymentPending, rejectAd } from '@/lib/utils/ad-workflow';

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

    // Check permission
    if (!hasPermission(payload.role as UserRole, 'canReviewAds')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'under_review';
    const limit = parseInt(searchParams.get('limit') || '50');

    const ads = await Ad.find({ status })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email')
      .populate('categoryId', 'name')
      .populate('cityId', 'name')
      .populate('packageId', 'name durationDays weight');

    return NextResponse.json({ ads });
  } catch (error) {
    console.error('Get moderation queue error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
