import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
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

    const [
      { count: totalUsers },
      { count: totalAds },
      { count: pendingAds },
      { count: approvedAds },
      { count: rejectedAds },
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('ads').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabaseAdmin.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalAds: totalAds || 0,
        pendingAds: pendingAds || 0,
        approvedAds: approvedAds || 0,
        rejectedAds: rejectedAds || 0,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
