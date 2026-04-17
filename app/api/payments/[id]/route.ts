import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Payment from '@/lib/models/Payment';
import { hasPermission, UserRole } from '@/lib/auth/rbac';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const payment = await Payment.findById(id).populate('adId', 'title status');

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Check permission
    if (payload.role === 'client') {
      // Clients can only view their own payments
      const Ad = (await import('@/lib/models/Ad')).default;
      const ad = await Ad.findById(payment.adId);
      if (ad?.userId.toString() !== payload.userId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    return NextResponse.json({ payment });
  } catch (error) {
    console.error('Get payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Check permission - only admin can verify payments
    if (!hasPermission(payload.role as UserRole, 'canVerifyPayments')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { status, rejectionReason } = body;

    const { id } = await params;
    const payment = await Payment.findById(id);
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    payment.status = status;
    if (rejectionReason) {
      payment.rejectionReason = rejectionReason;
    }
    payment.verifiedBy = payload.userId;
    payment.verifiedAt = new Date();

    await payment.save();

    // If payment is verified, update ad status
    if (status === 'verified') {
      const { verifyPayment } = await import('@/lib/utils/ad-workflow');
      await verifyPayment(payment.adId, payload.userId, payload.role);
    }

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('Update payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
