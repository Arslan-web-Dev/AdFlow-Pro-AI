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
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user's ads from Supabase
    const { data: ads, error: adsError } = await supabaseAdmin
      .from('ads')
      .select('*')
      .eq('user_id', payload.userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (adsError) {
      console.error('Supabase ads error:', adsError);
      return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
    }

    const adsList = ads || [];

    // Calculate stats
    const stats = {
      totalAds: adsList.length,
      activeAds: adsList.filter((a: any) => a.status === 'published').length,
      pendingAds: adsList.filter((a: any) => a.status === 'pending_review').length,
      totalViews: adsList.reduce((sum: number, a: any) => sum + (a.views || 0), 0),
      totalClicks: adsList.reduce((sum: number, a: any) => sum + (a.clicks || 0), 0),
      ctr: '0.0%',
    };

    // Calculate CTR
    if (stats.totalViews > 0) {
      stats.ctr = ((stats.totalClicks / stats.totalViews) * 100).toFixed(1) + '%';
    }

    return NextResponse.json({
      stats,
      recentAds: adsList.map((ad: any) => ({
        _id: ad.id,
        title: ad.title,
        status: ad.status,
        views: ad.views || 0,
        clicks: ad.clicks || 0,
        createdAt: ad.created_at,
      })),
    });
  } catch (error) {
    console.error('Get client dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
