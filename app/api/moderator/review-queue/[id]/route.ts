import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import AdMedia from '@/lib/models/AdMedia';
import { hasPermission } from '@/lib/auth/rbac';
import { moveToPaymentPending, rejectAd } from '@/lib/utils/ad-workflow';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    if (!hasPermission(payload.role as any, 'canReviewAds')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { action, moderationNote } = body;

    const ad = await Ad.findById(params.id).populate('packageId');
    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Move to payment pending stage
      await moveToPaymentPending(params.id, payload.userId, payload.role);
      
      // Add moderation note if provided
      if (moderationNote) {
        ad.moderationNote = moderationNote;
        await ad.save();
      }

      return NextResponse.json({ success: true, ad });
    }

    if (action === 'reject') {
      const { rejectionReason } = body;
      if (!rejectionReason) {
        return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
      }

      await rejectAd(params.id, payload.userId, payload.role, rejectionReason);
      
      if (moderationNote) {
        ad.moderationNote = moderationNote;
        await ad.save();
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Review ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    if (!hasPermission(payload.role as any, 'canReviewAds')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const ad = await Ad.findById(params.id)
      .populate('userId', 'name email')
      .populate('categoryId', 'name')
      .populate('cityId', 'name')
      .populate('packageId', 'name durationDays weight')
      .populate('moderatorId', 'name');

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Get media for this ad
    const media = await AdMedia.find({ adId: params.id });

    return NextResponse.json({ ad, media });
  } catch (error) {
    console.error('Get ad for review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
