import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/client';

// GET all ads (with filtering)
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Get token for authenticated requests
    const token = request.cookies.get('token')?.value;
    const payload = token ? verifyToken(token) : null;

    let query = supabaseAdmin.from('ads').select('*');

    // Role-based filtering
    if (payload?.role === 'admin') {
      // Admin: can see all, filter by status if provided
      if (status) query = query.eq('status', status);
      if (userId) query = query.eq('user_id', userId);
    } else if (payload?.role === 'user') {
      // User: only their ads
      query = query.eq('user_id', payload.userId);
      if (status) query = query.eq('status', status);
    } else {
      // Public: only approved/published ads
      query = query.in('status', ['approved', 'published']);
    }

    if (category) query = query.eq('category', category);

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data: ads, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ads: ads || [] });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new ad
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { title, description, category, city, price, currency = 'USD', tags, media = [] } = body;

    if (!title || !description || !category || !city || !price) {
      return NextResponse.json(
        { error: 'Title, description, category, city, and price are required' },
        { status: 400 }
      );
    }

    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now();

    const { data: ad, error } = await supabaseAdmin
      .from('ads')
      .insert({
        title,
        description,
        slug,
        user_id: payload.userId,
        category,
        city,
        price: Number(price),
        currency,
        status: 'pending',
        tags: tags || [],
        media: media.map((url: string, index: number) => ({
          url,
          type: 'image',
          order: index,
        })),
        views: 0,
      })
      .select()
      .single();

    if (error || !ad) {
      return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 });
    }

    return NextResponse.json({ ad }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
