import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import Category from '@/lib/models/Category';
import City from '@/lib/models/City';
import Package from '@/lib/models/Package';
import AdMedia from '@/lib/models/AdMedia';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'rank';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Try MongoDB first (for local development)
    const db = await connectDB();

    if (db) {
      // Build query - only show published and non-expired ads
      const query: any = {
        status: 'published',
        expireAt: { $gt: new Date() },
      };

      if (category) {
        query.categoryId = category;
      }

      if (city) {
        query.cityId = city;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      // Sort logic
      let sortOption: any = {};
      if (sort === 'rank') {
        sortOption = { rankScore: -1, createdAt: -1 };
      } else if (sort === 'newest') {
        sortOption = { createdAt: -1 };
      } else if (sort === 'oldest') {
        sortOption = { createdAt: 1 };
      }

      const ads = await Ad.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'name')
        .populate('categoryId', 'name slug')
        .populate('cityId', 'name slug')
        .populate('packageId', 'name durationDays weight');

      const total = await Ad.countDocuments(query);

      // Get media for each ad
      const adIds = ads.map(ad => ad._id.toString());
      const mediaMap = await AdMedia.find({ adId: { $in: adIds } });
      const mediaByAdId: Record<string, any[]> = {};
      mediaMap.forEach(m => {
        if (!mediaByAdId[m.adId]) {
          mediaByAdId[m.adId] = [];
        }
        mediaByAdId[m.adId].push(m);
      });

      const adsWithMedia = ads.map(ad => ({
        ...ad.toObject(),
        media: mediaByAdId[ad._id.toString()] || [],
      }));

      return NextResponse.json({
        ads: adsWithMedia,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    }

    // Fallback to Supabase (for production/Vercel)
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    let supabaseQuery = supabaseAdmin
      .from('ads')
      .select('*')
      .eq('status', 'published')
      .gt('expire_at', new Date().toISOString());

    if (category) {
      supabaseQuery = supabaseQuery.eq('category_id', category);
    }

    if (city) {
      supabaseQuery = supabaseQuery.eq('city_id', city);
    }

    if (search) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Sort logic
    if (sort === 'rank') {
      supabaseQuery = supabaseQuery.order('rank_score', { ascending: false }).order('created_at', { ascending: false });
    } else if (sort === 'newest') {
      supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
    } else if (sort === 'oldest') {
      supabaseQuery = supabaseQuery.order('created_at', { ascending: true });
    }

    const { data: ads, error, count } = await supabaseQuery.range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error('Supabase ads error:', error);
      return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
    }

    const total = count || 0;

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
