import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import Payment from '@/lib/models/Payment';

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

    // Get user's ads by status
    const draftAds = await Ad.countDocuments({ userId: payload.userId, status: 'draft' });
    const submittedAds = await Ad.countDocuments({ userId: payload.userId, status: 'submitted' });
    const underReviewAds = await Ad.countDocuments({ userId: payload.userId, status: 'under_review' });
    const paymentPendingAds = await Ad.countDocuments({ userId: payload.userId, status: 'payment_pending' });
    const paymentSubmittedAds = await Ad.countDocuments({ userId: payload.userId, status: 'payment_submitted' });
    const scheduledAds = await Ad.countDocuments({ userId: payload.userId, status: 'scheduled' });
    const publishedAds = await Ad.countDocuments({ userId: payload.userId, status: 'published' });
    const expiredAds = await Ad.countDocuments({ userId: payload.userId, status: 'expired' });
    const rejectedAds = await Ad.countDocuments({ userId: payload.userId, status: 'rejected' });

    // Get recent ads
    const recentAds = await Ad.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('categoryId', 'name')
      .populate('cityId', 'name')
      .populate('packageId', 'name');

    // Get payment history
    const payments = await Payment.find({
      adId: { $in: recentAds.map(a => a._id) },
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      stats: {
        draftAds,
        submittedAds,
        underReviewAds,
        paymentPendingAds,
        paymentSubmittedAds,
        scheduledAds,
        publishedAds,
        expiredAds,
        rejectedAds,
      },
      recentAds,
      payments,
    });
  } catch (error) {
    console.error('Get client dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
