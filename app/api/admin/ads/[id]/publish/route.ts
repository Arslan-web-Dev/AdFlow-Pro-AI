import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import { hasPermission, UserRole } from '@/lib/auth/rbac';
import { scheduleAd, publishAd } from '@/lib/utils/ad-workflow';
import { setExpireDate } from '@/lib/utils/package-engine';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Check permission
    if (!hasPermission(payload.role as UserRole, 'canPublishAds')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { action, publishDate, isFeatured } = body;

    const ad = await Ad.findById(params.id);
    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Set featured status if provided
    if (typeof isFeatured === 'boolean') {
      ad.isFeatured = isFeatured;
      await ad.save();
    }

    if (action === 'publish') {
      // Set expire date and publish immediately
      await setExpireDate(ad._id.toString(), ad.packageId);
      await publishAd(ad._id.toString(), payload.userId, payload.role);
      return NextResponse.json({ success: true, ad });
    }

    if (action === 'schedule') {
      if (!publishDate) {
        return NextResponse.json({ error: 'Publish date is required for scheduling' }, { status: 400 });
      }

      ad.publishAt = new Date(publishDate);
      await ad.save();
      await scheduleAd(ad._id.toString(), payload.userId, payload.role, new Date(publishDate));
      return NextResponse.json({ success: true, ad });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Publish ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
