import BaseRepository from './base.repository';
import AnalyticsModel, { IAnalytics } from '../../models/analytics.model';
import supabaseSync from './supabase-sync.repository';
import { syncTables } from '../config/supabase.config';

/**
 * Analytics Repository
 * Handles all analytics-related database operations
 */
export class AnalyticsRepository extends BaseRepository<IAnalytics> {
  constructor() {
    super(AnalyticsModel);
  }

  /**
   * Find analytics by ad ID
   */
  public async findByAdId(adId: string): Promise<IAnalytics[]> {
    return this.find({ adId }, { sort: { date: -1 } });
  }

  /**
   * Find analytics by user ID
   */
  public async findByUserId(userId: string): Promise<IAnalytics[]> {
    return this.find({ userId }, { sort: { date: -1 } });
  }

  /**
   * Find analytics by date range
   */
  public async findByDateRange(startDate: Date, endDate: Date): Promise<IAnalytics[]> {
    return this.find({
      date: { $gte: startDate, $lte: endDate },
    }, { sort: { date: -1 } });
  }

  /**
   * Find analytics by ad and date range
   */
  public async findByAdAndDateRange(adId: string, startDate: Date, endDate: Date): Promise<IAnalytics[]> {
    return this.find({
      adId,
      date: { $gte: startDate, $lte: endDate },
    }, { sort: { date: -1 } });
  }

  /**
   * Get aggregate analytics for an ad
   */
  public async getAggregateByAdId(adId: string): Promise<{
    totalImpressions: number;
    totalClicks: number;
    avgCTR: number;
    totalRevenue: number;
  } | null> {
    const analytics = await this.findByAdId(adId);
    
    if (analytics.length === 0) {
      return {
        totalImpressions: 0,
        totalClicks: 0,
        avgCTR: 0,
        totalRevenue: 0,
      };
    }

    const totalImpressions = analytics.reduce((sum, a) => sum + a.impressions, 0);
    const totalClicks = analytics.reduce((sum, a) => sum + a.clicks, 0);
    const totalRevenue = analytics.reduce((sum, a) => sum + a.revenue, 0);
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      totalImpressions,
      totalClicks,
      avgCTR,
      totalRevenue,
    };
  }

  /**
   * Create or update daily analytics
   */
  public async upsertDailyAnalytics(data: Partial<IAnalytics>): Promise<IAnalytics> {
    const existing = await this.findOne({
      adId: data.adId,
      userId: data.userId,
      date: data.date,
    });

    if (existing) {
      // Update existing record
      const updated = await this.updateById(existing._id.toString(), {
        impressions: data.impressions || 0,
        clicks: data.clicks || 0,
        ctr: data.ctr || 0,
        revenue: data.revenue || 0,
      });
      
      if (updated) {
        await supabaseSync.syncRecord(syncTables[5], updated.toJSON(), 'update');
      }
      
      return updated!;
    }

    // Create new record
    const analytics = await this.create(data);
    await supabaseSync.syncRecord(syncTables[5], analytics.toJSON(), 'create');
    
    return analytics;
  }

  /**
   * Get daily analytics for date
   */
  public async getDailyAnalytics(adId: string, date: Date): Promise<IAnalytics | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.findOne({
      adId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
  }
}

export default new AnalyticsRepository();
