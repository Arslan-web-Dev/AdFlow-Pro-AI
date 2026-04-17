import connectDB from '../db/mongodb';
import Ad from '../models/Ad';
import Payment from '../models/Payment';
import Package from '../models/Package';
import Category from '../models/Category';
import City from '../models/City';
import SystemHealthLog from '../models/SystemHealthLog';
import AuditLog from '../models/AuditLog';

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
    await connectDB();

    // Listings metrics
    const totalAds = await Ad.countDocuments();
    const activeAds = await Ad.countDocuments({ status: 'published' });
    const pendingReviews = await Ad.countDocuments({ status: 'under_review' });
    const expiredAds = await Ad.countDocuments({ status: 'expired' });
    const publishedAds = await Ad.countDocuments({ status: 'published' });
    const draftAds = await Ad.countDocuments({ status: 'draft' });

    // Revenue metrics
    const verifiedPayments = await Payment.countDocuments({ status: 'verified' });
    const payments = await Payment.find({ status: 'verified' });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyPayments = await Payment.find({
      status: 'verified',
      createdAt: { $gte: thirtyDaysAgo },
    });
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

    // Revenue by package
    const packages = await Package.find();
    const revenueByPackage = await Promise.all(
      packages.map(async (pkg) => {
        const ads = await Ad.find({ packageId: pkg._id, status: 'published' });
        const packagePayments = await Payment.find({
          adId: { $in: ads.map(a => a._id) },
          status: 'verified',
        });
        const revenue = packagePayments.reduce((sum, p) => sum + p.amount, 0);
        return {
          packageName: pkg.name,
          revenue,
        };
      })
    );

    // Moderation metrics
    const totalReviewed = await Ad.countDocuments({
      status: { $in: ['published', 'rejected'] },
    });
    const rejectedAds = await Ad.countDocuments({ status: 'rejected' });
    const approvalRate = totalReviewed > 0 ? ((totalReviewed - rejectedAds) / totalReviewed) * 100 : 0;
    const rejectionRate = totalReviewed > 0 ? (rejectedAds / totalReviewed) * 100 : 0;
    const flaggedAds = await AuditLog.countDocuments({
      actionType: 'rejected',
    });

    // Taxonomy metrics
    const categories = await Category.find({ isActive: true });
    const adsByCategory = await Promise.all(
      categories.map(async (cat) => {
        const count = await Ad.countDocuments({ categoryId: cat._id, status: 'published' });
        return { categoryName: cat.name, count };
      })
    );

    const cities = await City.find({ isActive: true });
    const adsByCity = await Promise.all(
      cities.map(async (city) => {
        const count = await Ad.countDocuments({ cityId: city._id, status: 'published' });
        return { cityName: city.name, count };
      })
    );

    // Operations metrics
    const recentHealthLog = await SystemHealthLog.findOne({
      source: 'mongodb',
    }).sort({ checkedAt: -1 });
    const dbHeartbeatStatus = recentHealthLog?.status || 'unknown';
    const dbResponseTime = recentHealthLog?.responseMs || 0;

    const scheduledJobsSuccess = await AuditLog.countDocuments({
      actionType: 'published',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    const failedValidations = await AuditLog.countDocuments({
      actionType: 'rejected',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

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
        revenueByPackage,
      },
      moderation: {
        approvalRate,
        rejectionRate,
        flaggedAds,
        totalReviewed,
      },
      taxonomy: {
        adsByCategory,
        adsByCity,
      },
      operations: {
        scheduledJobsSuccess,
        dbHeartbeatStatus,
        dbResponseTime,
        failedValidations,
      },
    };
  } catch (error) {
    console.error('Get analytics summary error:', error);
    throw error;
  }
}
