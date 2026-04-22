import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/client';

// GET all ads for admin (from Supabase)
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    // Build query for Supabase
    let query = supabaseAdmin
      .from('ads')
      .select(`
        *,
        profiles:profiles!ads_user_id_fkey (
          name,
          email
        )
      `);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category', category);
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: ads, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get total count
    const { count } = await supabaseAdmin
      .from('ads')
      .select('*', { count: 'exact', head: true });

    // Transform data to match expected format
    const transformedAds = ads?.map(ad => ({
      id: ad.id,
      _id: ad.id,
      title: ad.title,
      slug: ad.slug,
      description: ad.description,
      category: ad.category,
      city: ad.city,
      status: ad.status,
      price: ad.price,
      currency: ad.currency || 'USD',
      views: ad.views || 0,
      clicks: ad.clicks || 0,
      createdAt: ad.created_at,
      createdBy: ad.users?.name || 'Unknown',
      userId: ad.user_id,
      media: ad.media || [],
    })) || [];

    return NextResponse.json({
      ads: transformedAds,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Get admin ads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new ad (admin only)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { 
      title, 
      description, 
      category, 
      city, 
      price,
      currency = 'USD',
      tags,
      media = [],
      userId,
    } = body;

    // Validation
    if (!title || !description || !category || !city || !price || !userId) {
      return NextResponse.json(
        { error: 'Title, description, category, city, price, and userId are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '') + '-' + Date.now();

    const { data: ad, error } = await supabaseAdmin
      .from('ads')
      .insert({
        title,
        description,
        slug,
        user_id: userId,
        category,
        city,
        price: Number(price),
        currency,
        status: 'published',
        priority: 10,
        tags: tags || [],
        media: media,
        views: 0,
        clicks: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ad }, { status: 201 });
  } catch (error) {
    console.error('Create ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
