import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/client';
import { hasPermission } from '@/lib/auth/rbac';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { data: cities, error } = await supabaseAdmin
      .from('cities')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
    }

    return NextResponse.json({ cities: cities || [] });
  } catch (error) {
    console.error('Get cities error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!hasPermission(payload.role as any, 'canManageSystem')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { name, slug, country } = body;

    const { data: city, error } = await supabaseAdmin
      .from('cities')
      .insert({ name, slug, country, is_active: true })
      .select()
      .single();

    if (error || !city) {
      return NextResponse.json({ error: 'Failed to create city' }, { status: 500 });
    }

    return NextResponse.json({ success: true, city });
  } catch (error) {
    console.error('Create city error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
