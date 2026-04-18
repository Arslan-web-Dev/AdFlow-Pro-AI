import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import Payment from '@/lib/models/Payment';
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
      // Get user's ads by status
      const draftAds = await Ad.countDocuments({ userId: payload.userId, status: 'draft' });
      const submittedAds = await Ad.countDocuments({ userId: payload.userId, status: 'submitted' });
      const underReviewAds = await Ad.countDocuments({ userId: payload.userId, status: 'under_review' });
      const paymentPendingAds = await Ad.countDocuments({ userId: payload.userId, status: 'payment_pending' });
      const paymentSubmittedAds = await Ad.countDocuments({ userId: payload.userId, status: 'payment_submitted' });
      const scheduledAds = await Ad.countDocuments({ userId: payload.userId, status: 'scheduled' });
      const publishedAds = await Ad.countDocuments({ userId: payload.userId, status: 'published' });
      const expiredAds = await Ad.countDocuments({ userId: payload.userId, status: 'expired' });
      const rejectedAds = await Ad.countDocuments({ userId: payload.userId, status: 'rejected' });

      // Get recent ads
      const recentAds = await Ad.find({ userId: payload.userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('categoryId', 'name')
        .populate('cityId', 'name')
        .populate('packageId', 'name');

      // Get payment history
      const payments = await Payment.find({
        adId: { $in: recentAds.map(a => a._id) },
      }).sort({ createdAt: -1 });

      return NextResponse.json({
        stats: {
          draftAds,
          submittedAds,
          underReviewAds,
          paymentPendingAds,
          paymentSubmittedAds,
          scheduledAds,
          publishedAds,
          expiredAds,
          rejectedAds,
        },
        recentAds,
        payments,
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

    // Calculate stats
    const stats = {
      draftAds: ads.filter(a => a.status === 'draft').length,
      submittedAds: ads.filter(a => a.status === 'submitted').length,
      underReviewAds: ads.filter(a => a.status === 'under_review').length,
      paymentPendingAds: ads.filter(a => a.status === 'payment_pending').length,
      paymentSubmittedAds: ads.filter(a => a.status === 'payment_submitted').length,
      scheduledAds: ads.filter(a => a.status === 'scheduled').length,
      publishedAds: ads.filter(a => a.status === 'published').length,
      expiredAds: ads.filter(a => a.status === 'expired').length,
      rejectedAds: ads.filter(a => a.status === 'rejected').length,
    };

    // Get categories, cities, and packages for recent ads
    const recentAdsWithDetails = await Promise.all(
      ads.map(async (ad) => {
        const [{ data: category }, { data: city }, { data: pkg }] = await Promise.all([
          supabaseAdmin!.from('categories').select('name').eq('id', ad.category_id).single(),
          supabaseAdmin!.from('cities').select('name').eq('id', ad.city_id).single(),
          supabaseAdmin!.from('packages').select('name').eq('id', ad.package_id).single(),
        ]);

        return {
          _id: ad.id,
          title: ad.title,
          status: ad.status,
          categoryId: { name: category?.name || 'Unknown' },
          cityId: { name: city?.name || 'Unknown' },
          packageId: { name: pkg?.name || 'Unknown' },
          createdAt: ad.created_at,
        };
      })
    );

    return NextResponse.json({
      stats,
      recentAds: recentAdsWithDetails,
      payments: [],
    });
  } catch (error) {
    console.error('Get client dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
