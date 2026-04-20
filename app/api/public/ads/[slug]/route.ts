import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Try MongoDB first
    const db = await connectDB();
    if (db) {
      const ad = await Ad.findOne({ slug });

      if (ad) {
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
      }
    }

    // Fallback to Supabase
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const { data: ad, error } = await supabaseAdmin
      .from('ads')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch ad' }, { status: 500 });
    }

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Check expiration in Supabase
    if (ad.expires_at && new Date(ad.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Ad has expired' }, { status: 404 });
    }

    // Transform Supabase ad to match expected format
    const transformedAd = {
      _id: ad.id,
      title: ad.title,
      description: ad.description,
      slug: ad.slug,
      status: ad.status,
      category: ad.category,
      city: ad.city,
      price: ad.price,
      currency: ad.currency || 'USD',
      tags: ad.tags || [],
      media: ad.media || [],
      views: ad.views || 0,
      clicks: ad.clicks || 0,
      createdAt: ad.created_at,
      expiresAt: ad.expires_at,
      contactInfo: ad.contact_info,
      isAIGenerated: ad.is_ai_generated,
    };

    return NextResponse.json({ ad: transformedAd });
  } catch (error) {
    console.error('Get ad by slug error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
