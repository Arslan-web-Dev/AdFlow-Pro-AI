import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { data: ad, error } = await supabaseAdmin
      .from('ads')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single();

    if (error || !ad) {
      return NextResponse.json({ error: 'Failed to reject ad' }, { status: 500 });
    }

    return NextResponse.json({ ad });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
