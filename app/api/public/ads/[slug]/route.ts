import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const { slug } = await params;
    
    // Find ad by slug using new model
    const ad = await Ad.findOne({ slug });

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Only show published and non-expired ads
    if (ad.status !== 'published') {
      return NextResponse.json({ error: 'Ad not available' }, { status: 404 });
    }

    // Check expiration
    if (ad.expiresAt && new Date(ad.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Ad has expired' }, { status: 404 });
    }

    // Transform to match expected format
    const transformedAd = {
      _id: ad._id,
      title: ad.title,
      description: ad.description,
      slug: ad.slug,
      status: ad.status,
      category: ad.category,
      city: ad.city,
      price: ad.price,
      currency: ad.currency,
      tags: ad.tags,
      media: ad.media,
      views: ad.views,
      clicks: ad.clicks,
      createdAt: ad.createdAt,
      expiresAt: ad.expiresAt,
      contactInfo: ad.contactInfo,
      isAIGenerated: ad.isAIGenerated,
    };

    return NextResponse.json({ ad: transformedAd });
  } catch (error) {
    console.error('Get ad by slug error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
