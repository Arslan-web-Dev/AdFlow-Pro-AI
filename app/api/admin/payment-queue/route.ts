import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Payment from '@/lib/models/Payment';
import { hasPermission } from '@/lib/auth/rbac';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check permission
    if (!hasPermission(payload.role as any, 'canVerifyPayments')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '50');

    const payments = await Payment.find({ status })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('adId', 'title status');

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Get payment queue error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
