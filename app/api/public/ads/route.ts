/* cspell:disable */
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
        slug: ad.slug,
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
    console.log('Supabase fallback - checking environment variables...');
    console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING');
    console.log('  SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING');
    console.log('  supabaseAdmin client:', supabaseAdmin ? 'Initialized' : 'NULL');

    if (!supabaseAdmin) {
      const errorMsg = 'Supabase not configured. Missing environment variables: ' + 
        (!process.env.NEXT_PUBLIC_SUPABASE_URL ? 'NEXT_PUBLIC_SUPABASE_URL ' : '') +
        (!process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SUPABASE_SERVICE_ROLE_KEY' : '');
      console.error(errorMsg);
      return NextResponse.json(
        { 
          error: 'Database not available',
          details: errorMsg,
          source: 'supabase_not_initialized'
        },
        { status: 503 }
      );
    }

    try {
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

      console.log('Executing Supabase query...', { category, city, search, page, limit });
      const { data: ads, error, count } = await supabaseQuery;
      
      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Supabase query failed: ${error.message}`);
      }

      console.log('Supabase result - ads found:', ads?.length || 0, 'total count:', count);

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
    } catch (supabaseError) {
      console.error('Supabase fallback error:', supabaseError);
      return NextResponse.json(
        { 
          error: 'Failed to fetch ads from Supabase',
          details: supabaseError instanceof Error ? supabaseError.message : String(supabaseError)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Get public ads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
