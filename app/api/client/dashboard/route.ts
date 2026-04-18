import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
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

    // Try MongoDB first (for local development)
    const db = await connectDB();

    if (db) {
      // Get user's ads stats
      const totalAds = await Ad.countDocuments({ userId: payload.userId });
      const activeAds = await Ad.countDocuments({ userId: payload.userId, status: 'published' });
      const pendingAds = await Ad.countDocuments({ userId: payload.userId, status: 'pending' });
      
      // Get total views and clicks
      const statsResult = await Ad.aggregate([
        { $match: { userId: payload.userId } },
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$views' },
            totalClicks: { $sum: '$clicks' },
          },
        },
      ]);

      const totalViews = statsResult[0]?.totalViews || 0;
      const totalClicks = statsResult[0]?.totalClicks || 0;
      const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

      // Get recent ads
      const recentAds = await Ad.find({ userId: payload.userId })
        .sort({ createdAt: -1 })
        .limit(5);

      return NextResponse.json({
        stats: {
          totalAds,
          activeAds,
          pendingAds,
          totalViews,
          totalClicks,
          ctr: `${ctr}%`,
        },
        recentAds: recentAds.map(ad => ({
          _id: ad._id,
          title: ad.title,
          status: ad.status,
          views: ad.views,
          clicks: ad.clicks,
          createdAt: ad.createdAt,
        })),
      });
    }

    // Fallback to Supabase (for production/Vercel)
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { data: ads, error: adsError } = await supabaseAdmin!
      .from('ads')
      .select('*')
      .eq('user_id', payload.userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (adsError) {
      console.error('Supabase ads error:', adsError);
      return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
    }

    // Calculate stats with new status workflow
    const stats = {
      totalAds: ads.length,
      activeAds: ads.filter(a => a.status === 'published').length,
      pendingAds: ads.filter(a => a.status === 'pending').length,
      totalViews: ads.reduce((sum, a) => sum + (a.views || 0), 0),
      totalClicks: ads.reduce((sum, a) => sum + (a.clicks || 0), 0),
      ctr: '0.0%',
    };

    // Calculate CTR
    if (stats.totalViews > 0) {
      stats.ctr = ((stats.totalClicks / stats.totalViews) * 100).toFixed(1) + '%';
    }

    return NextResponse.json({
      stats,
      recentAds: ads.map(ad => ({
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
