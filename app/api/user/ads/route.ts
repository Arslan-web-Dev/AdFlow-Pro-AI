import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/client';
import { hasPermission, UserRole } from '@/lib/auth/rbac';

export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check permission
    if (!hasPermission(payload.role as UserRole, 'canCreateAds')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const {
      package_id,
      category_id,
      city_id,
      title,
      description,
      tags,
      media_urls,
    } = body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const { data: existingAd } = await supabaseAdmin
      .from('ads')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (existingAd) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Create ad
    const { data: ad, error } = await supabaseAdmin
      .from('ads')
      .insert({
        user_id: payload.userId,
        package_id,
        category_id,
        city_id,
        title,
        slug,
        description,
        tags: tags || [],
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      console.error('Create ad error:', error);
      return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 });
    }

    return NextResponse.json({ success: true, ad });
  } catch (error) {
    console.error('Create ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('ads')
      .select('*, categories(name), cities(name), packages(name, duration_days)')
      .eq('user_id', payload.userId)
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }

    const { data: ads, error } = await query;

    if (error) {
      console.error('Get client ads error:', error);
      return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
    }

    return NextResponse.json({ ads: ads || [] });
  } catch (error) {
    console.error('Get client ads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
