import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { data: packages, error } = await supabaseAdmin
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
    }

    return NextResponse.json({ packages: packages || [] });
  } catch (error) {
    console.error('Get packages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
