import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const status = searchParams.get('status') || 'published';
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Try MongoDB first (for local development)
    console.log('Connecting to MongoDB...');
    const db = await connectDB();
    console.log('MongoDB connection result:', db ? 'Connected' : 'Failed/Skipped');

    if (db) {
      // Build query
      const query: any = { status };

      // Only show non-expired ads for published
      if (status === 'published') {
        query.$or = [
          { expiresAt: { $gt: new Date() } },
          { expiresAt: { $exists: false } },
        ];
      }

      if (category && category !== 'all') {
        query.category = { $regex: new RegExp(category, 'i') };
      }

      if (city && city !== 'all') {
        query.city = { $regex: new RegExp(city, 'i') };
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      const ads = await Ad.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Ad.countDocuments(query);

      // Transform ads to match the expected format
      const transformedAds = ads.map(ad => ({
        _id: ad._id,
        title: ad.title,
        description: ad.description,
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
      }));

      return NextResponse.json({
        ads: transformedAds,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    }

    // Fallback to Supabase (for production/Vercel)
    console.log('Supabase fallback, supabaseAdmin:', supabaseAdmin ? 'Exists' : 'NULL');
    if (!supabaseAdmin) {
      console.log('SupabaseAdmin is null, returning empty');
      return NextResponse.json(
        { ads: [], pagination: { page, limit, total: 0, pages: 0 } },
        { status: 200 }
      );
    }

    let supabaseQuery = supabaseAdmin
      .from('ads')
      .select('*')
      .eq('status', status);

    if (category && category !== 'all') {
      supabaseQuery = supabaseQuery.ilike('category', `%${category}%`);
    }

    if (city && city !== 'all') {
      supabaseQuery = supabaseQuery.ilike('city', `%${city}%`);
    }

    if (search) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,city.ilike.%${search}%`);
    }

    supabaseQuery = supabaseQuery
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    console.log('Executing Supabase query...');
    const { data: ads, error, count } = await supabaseQuery;
    console.log('Supabase result - ads:', ads?.length || 0, 'error:', error, 'count:', count);

    if (error) {
      console.error('Supabase ads error:', error);
      return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
    }

    const total = count || ads?.length || 0;

    return NextResponse.json({
      ads: ads || [],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get public ads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
