import { supabaseAdmin } from '../supabase/client';

export interface AnalyticsSummary {
  listings: {
    totalAds: number;
    activeAds: number;
    pendingReviews: number;
    expiredAds: number;
    publishedAds: number;
    draftAds: number;
  };
  revenue: {
    totalRevenue: number;
    verifiedPayments: number;
    monthlyRevenue: number;
    revenueByPackage: Array<{ packageName: string; revenue: number }>;
  };
  moderation: {
    approvalRate: number;
    rejectionRate: number;
    flaggedAds: number;
    totalReviewed: number;
  };
  taxonomy: {
    adsByCategory: Array<{ categoryName: string; count: number }>;
    adsByCity: Array<{ cityName: string; count: number }>;
  };
  operations: {
    scheduledJobsSuccess: number;
    dbHeartbeatStatus: string;
    dbResponseTime: number;
    failedValidations: number;
  };
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    if (!supabaseAdmin) {
      return getEmptyAnalyticsSummary();
    }

    // Get counts from Supabase
    const { data: ads, error: adsError } = await supabaseAdmin.from('ads').select('status');
    const { data: payments, error: paymentsError } = await supabaseAdmin.from('payments').select('amount, status');
    const { data: categories, error: catError } = await supabaseAdmin.from('categories').select('id, name');
    const { data: cities, error: cityError } = await supabaseAdmin.from('cities').select('id, name');

    if (adsError || paymentsError) {
      return getEmptyAnalyticsSummary();
    }

    const adList = ads || [];
    const paymentList = payments || [];

    // Listings metrics
    const totalAds = adList.length;
    const publishedAds = adList.filter(a => a.status === 'approved' || a.status === 'published').length;
    const activeAds = publishedAds;
    const pendingReviews = adList.filter(a => a.status === 'pending').length;
    const expiredAds = adList.filter(a => a.status === 'expired').length;
    const draftAds = adList.filter(a => a.status === 'draft').length;

    // Revenue metrics
    const verifiedPayments = paymentList.filter(p => p.status === 'completed').length;
    const totalRevenue = paymentList.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyRevenue = paymentList
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Simple analytics
    const rejectedAds = adList.filter(a => a.status === 'rejected').length;
    const totalReviewed = publishedAds + rejectedAds;
    const approvalRate = totalReviewed > 0 ? ((totalReviewed - rejectedAds) / totalReviewed) * 100 : 0;
    const rejectionRate = totalReviewed > 0 ? (rejectedAds / totalReviewed) * 100 : 0;

    const catList = categories || [];
    const cityList = cities || [];

    return {
      listings: {
        totalAds,
        activeAds,
        pendingReviews,
        expiredAds,
        publishedAds,
        draftAds,
      },
      revenue: {
        totalRevenue,
        verifiedPayments,
        monthlyRevenue,
        revenueByPackage: [],
      },
      moderation: {
        approvalRate,
        rejectionRate,
        flaggedAds: 0,
        totalReviewed,
      },
      taxonomy: {
        adsByCategory: catList.map(c => ({ categoryName: c.name, count: 0 })),
        adsByCity: cityList.map(c => ({ cityName: c.name, count: 0 })),
      },
      operations: {
        scheduledJobsSuccess: 0,
        dbHeartbeatStatus: 'healthy',
        dbResponseTime: 0,
        failedValidations: 0,
      },
    };
  } catch (error) {
    console.error('Get analytics summary error:', error);
    return getEmptyAnalyticsSummary();
  }
}

function getEmptyAnalyticsSummary(): AnalyticsSummary {
  return {
    listings: { totalAds: 0, activeAds: 0, pendingReviews: 0, expiredAds: 0, publishedAds: 0, draftAds: 0 },
    revenue: { totalRevenue: 0, verifiedPayments: 0, monthlyRevenue: 0, revenueByPackage: [] },
    moderation: { approvalRate: 0, rejectionRate: 0, flaggedAds: 0, totalReviewed: 0 },
    taxonomy: { adsByCategory: [], adsByCity: [] },
    operations: { scheduledJobsSuccess: 0, dbHeartbeatStatus: 'unknown', dbResponseTime: 0, failedValidations: 0 },
  };
}
