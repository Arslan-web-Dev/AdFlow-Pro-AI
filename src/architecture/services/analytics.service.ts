import analyticsRepository from '../repositories/analytics.repository';
import adRepository from '../repositories/ad.repository';
import { LogAction, LogLevel } from '../../models/log.model';
import logRepository from '../repositories/log.repository';

/**
 * Analytics Service
 * Handles analytics-related business logic
 */
export class AnalyticsService {
  /**
   * Record ad impression
   */
  public async recordImpression(adId: string, userId: string) {
    try {
      const ad = await adRepository.findById(adId);
      if (!ad) {
        return { success: false, error: 'Ad not found' };
      }

      // Increment impressions in ad model
      await adRepository.incrementImpressions(adId);

      // Update daily analytics
      const today = new Date();
      const existingAnalytics = await analyticsRepository.getDailyAnalytics(adId, today);

      if (existingAnalytics) {
        await analyticsRepository.upsertDailyAnalytics({
          adId: ad._id as any,
          userId: ad.userId as any,
          date: today,
          impressions: existingAnalytics.impressions + 1,
          clicks: existingAnalytics.clicks,
          ctr: existingAnalytics.clicks > 0 
            ? ((existingAnalytics.clicks / (existingAnalytics.impressions + 1)) * 100) 
            : 0,
          revenue: existingAnalytics.revenue,
        });
      } else {
        await analyticsRepository.upsertDailyAnalytics({
          adId: ad._id as any,
          userId: ad.userId as any,
          date: today,
          impressions: 1,
          clicks: 0,
          ctr: 0,
          revenue: 0,
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Record impression error:', error);
      return { success: false, error: 'Failed to record impression' };
    }
  }

  /**
   * Record ad click
   */
  public async recordClick(adId: string, userId: string) {
    try {
      const ad = await adRepository.findById(adId);
      if (!ad) {
        return { success: false, error: 'Ad not found' };
      }

      // Increment clicks in ad model
      await adRepository.incrementClicks(adId);

      // Update daily analytics
      const today = new Date();
      const existingAnalytics = await analyticsRepository.getDailyAnalytics(adId, today);

      if (existingAnalytics) {
        const newClicks = existingAnalytics.clicks + 1;
        await analyticsRepository.upsertDailyAnalytics({
          adId: ad._id as any,
          userId: ad.userId as any,
          date: today,
          impressions: existingAnalytics.impressions,
          clicks: newClicks,
          ctr: existingAnalytics.impressions > 0 
            ? ((newClicks / existingAnalytics.impressions) * 100) 
            : 0,
          revenue: existingAnalytics.revenue,
        });
      } else {
        await analyticsRepository.upsertDailyAnalytics({
          adId: ad._id as any,
          userId: ad.userId as any,
          date: today,
          impressions: 0,
          clicks: 1,
          ctr: 0,
          revenue: 0,
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Record click error:', error);
      return { success: false, error: 'Failed to record click' };
    }
  }

  /**
   * Get user analytics dashboard
   */
  public async getUserAnalytics(userId: string) {
    try {
      const analytics = await analyticsRepository.findByUserId(userId);
      
      // Calculate aggregates
      const totalImpressions = analytics.reduce((sum, a) => sum + a.impressions, 0);
      const totalClicks = analytics.reduce((sum, a) => sum + a.clicks, 0);
      const totalRevenue = analytics.reduce((sum, a) => sum + a.revenue, 0);
      const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      return {
        success: true,
        analytics: {
          totalImpressions,
          totalClicks,
          avgCTR,
          totalRevenue,
          dailyData: analytics,
        },
      };
    } catch (error) {
      console.error('Get user analytics error:', error);
      return { success: false, error: 'Failed to fetch analytics' };
    }
  }

  /**
   * Get ad analytics
   */
  public async getAdAnalytics(adId: string) {
    try {
      const aggregate = await analyticsRepository.getAggregateByAdId(adId);
      const dailyData = await analyticsRepository.findByAdId(adId);

      return {
        success: true,
        analytics: {
          ...aggregate,
          dailyData,
        },
      };
    } catch (error) {
      console.error('Get ad analytics error:', error);
      return { success: false, error: 'Failed to fetch analytics' };
    }
  }

  /**
   * Get admin analytics overview
   */
  public async getAdminAnalytics(startDate?: Date, endDate?: Date) {
    try {
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default 30 days
      const end = endDate || new Date();

      const analytics = await analyticsRepository.findByDateRange(start, end);
      
      const totalImpressions = analytics.reduce((sum, a) => sum + a.impressions, 0);
      const totalClicks = analytics.reduce((sum, a) => sum + a.clicks, 0);
      const totalRevenue = analytics.reduce((sum, a) => sum + a.revenue, 0);
      const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      return {
        success: true,
        analytics: {
          totalImpressions,
          totalClicks,
          avgCTR,
          totalRevenue,
          dateRange: { start, end },
        },
      };
    } catch (error) {
      console.error('Get admin analytics error:', error);
      return { success: false, error: 'Failed to fetch analytics' };
    }
  }

  /**
   * Get manager reports
   */
  public async getManagerReports(startDate?: Date, endDate?: Date) {
    try {
      const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Default 7 days
      const end = endDate || new Date();

      const analytics = await analyticsRepository.findByDateRange(start, end);
      
      // Group by ad
      const byAd = new Map<string, any>();
      analytics.forEach(a => {
        const adId = a.adId.toString();
        if (!byAd.has(adId)) {
          byAd.set(adId, { impressions: 0, clicks: 0, revenue: 0 });
        }
        const data = byAd.get(adId);
        data.impressions += a.impressions;
        data.clicks += a.clicks;
        data.revenue += a.revenue;
      });

      return {
        success: true,
        reports: {
          dateRange: { start, end },
          byAd: Object.fromEntries(byAd),
        },
      };
    } catch (error) {
      console.error('Get manager reports error:', error);
      return { success: false, error: 'Failed to fetch reports' };
    }
  }
}

export default new AnalyticsService();
