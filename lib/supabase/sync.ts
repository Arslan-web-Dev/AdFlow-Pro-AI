import { supabaseAdmin } from './client';
import User from '../models/User';
import Ad from '../models/Ad';
import Log from '../models/Log';
import Analytics from '../models/Analytics';

// Sync user to Supabase
export async function syncUserToSupabase(userId: string) {
  try {
    const user = await User.findById(userId);
    if (!user) return { success: false, error: 'User not found' };

    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase not configured' };
    }

    const { error } = await supabaseAdmin
      .from('users')
      .upsert({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        is_active: user.isActive,
        is_verified: user.isVerified,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Sync ad to Supabase
export async function syncAdToSupabase(adId: string) {
  try {
    const ad = await Ad.findById(adId);
    if (!ad) return { success: false, error: 'Ad not found' };

    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase not configured' };
    }

    const { error } = await supabaseAdmin
      .from('ads')
      .upsert({
        id: ad._id.toString(),
        title: ad.title,
        description: ad.description,
        slug: ad.slug,
        user_id: ad.userId,
        package_id: ad.packageId,
        category_id: ad.categoryId,
        city_id: ad.cityId,
        status: ad.status,
        tags: ad.tags,
        is_featured: ad.isFeatured,
        rank_score: ad.rankScore,
        admin_boost: ad.adminBoost,
        verified_seller_points: ad.verifiedSellerPoints,
        rejection_reason: ad.rejectionReason,
        moderator_id: ad.moderatorId,
        moderation_note: ad.moderationNote,
        publish_at: ad.publishAt,
        expire_at: ad.expireAt,
        created_at: ad.createdAt,
        updated_at: ad.updatedAt,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Sync log to Supabase
export async function syncLogToSupabase(logId: string) {
  try {
    const log = await Log.findById(logId);
    if (!log) return { success: false, error: 'Log not found' };

    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase not configured' };
    }

    const { error } = await supabaseAdmin
      .from('logs')
      .upsert({
        id: log._id.toString(),
        level: log.level,
        action: log.action,
        user_id: log.userId,
        ad_id: log.adId,
        details: log.details,
        ip_address: log.ipAddress,
        user_agent: log.userAgent,
        created_at: log.createdAt,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Sync analytics to Supabase
export async function syncAnalyticsToSupabase(analyticsId: string) {
  try {
    const analytics = await Analytics.findById(analyticsId);
    if (!analytics) return { success: false, error: 'Analytics not found' };

    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase not configured' };
    }

    const { error } = await supabaseAdmin
      .from('analytics')
      .upsert({
        id: analytics._id.toString(),
        date: analytics.date,
        total_users: analytics.totalUsers,
        total_ads: analytics.totalAds,
        active_ads: analytics.activeAds,
        pending_ads: analytics.pendingAds,
        total_revenue: analytics.totalRevenue,
        daily_revenue: analytics.dailyRevenue,
        new_users: analytics.newUsers,
        new_ads: analytics.newAds,
        ads_by_status: analytics.adsByStatus,
        ads_by_category: analytics.adsByCategory,
        users_by_role: analytics.usersByRole,
        ai_generated_ads: analytics.aiGeneratedAds,
        created_at: analytics.createdAt,
        updated_at: analytics.updatedAt,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Full sync all data from MongoDB to Supabase
export async function fullSyncToSupabase() {
  const results = {
    users: { success: 0, failed: 0 },
    ads: { success: 0, failed: 0 },
    logs: { success: 0, failed: 0 },
    analytics: { success: 0, failed: 0 },
  };

  try {
    // Sync all users
    const users = await User.find({});
    for (const user of users) {
      const result = await syncUserToSupabase(user._id.toString());
      if (result.success) {
        results.users.success++;
      } else {
        results.users.failed++;
      }
    }

    // Sync all ads
    const ads = await Ad.find({});
    for (const ad of ads) {
      const result = await syncAdToSupabase(ad._id.toString());
      if (result.success) {
        results.ads.success++;
      } else {
        results.ads.failed++;
      }
    }

    // Sync all logs (last 1000)
    const logs = await Log.find({}).sort({ createdAt: -1 }).limit(1000);
    for (const log of logs) {
      const result = await syncLogToSupabase(log._id.toString());
      if (result.success) {
        results.logs.success++;
      } else {
        results.logs.failed++;
      }
    }

    // Sync all analytics
    const analytics = await Analytics.find({});
    for (const analytic of analytics) {
      const result = await syncAnalyticsToSupabase(analytic._id.toString());
      if (result.success) {
        results.analytics.success++;
      } else {
        results.analytics.failed++;
      }
    }

    return { success: true, results };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
