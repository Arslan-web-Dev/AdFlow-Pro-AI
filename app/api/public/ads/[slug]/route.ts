import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import AdMedia from '@/lib/models/AdMedia';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;
    const ad = await Ad.findOne({ slug })
      .populate('userId', 'name email')
      .populate('categoryId', 'name slug')
      .populate('cityId', 'name slug')
      .populate('packageId', 'name durationDays weight')
      .populate('moderatorId', 'name');

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Only show published and non-expired ads
    if (ad.status !== 'published' || (ad.expireAt && new Date(ad.expireAt) < new Date())) {
      return NextResponse.json({ error: 'Ad not available' }, { status: 404 });
    }

    // Get media for this ad
    const media = await AdMedia.find({ adId: ad._id });

    return NextResponse.json({ ad, media });
  } catch (error) {
    console.error('Get ad by slug error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
