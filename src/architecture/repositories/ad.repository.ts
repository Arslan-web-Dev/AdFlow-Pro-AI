import BaseRepository from './base.repository';
import AdModel, { IAd, AdStatus } from '../../models/ad.model';
import supabaseSync from './supabase-sync.repository';
import { syncTables } from '../config/supabase.config';

/**
 * Ad Repository
 * Handles all ad-related database operations
 */
export class AdRepository extends BaseRepository<IAd> {
  constructor() {
    super(AdModel);
  }

  /**
   * Find ads by user ID
   */
  public async findByUserId(userId: string): Promise<IAd[]> {
    return this.find({ userId });
  }

  /**
   * Find ads by status
   */
  public async findByStatus(status: AdStatus): Promise<IAd[]> {
    return this.find({ status });
  }

  /**
   * Find ads by user and status
   */
  public async findByUserAndStatus(userId: string, status: AdStatus): Promise<IAd[]> {
    return this.find({ userId, status });
  }

  /**
   * Find published ads
   */
  public async findPublishedAds(options?: {
    limit?: number;
    skip?: number;
  }): Promise<IAd[]> {
    return this.find(
      { status: AdStatus.PUBLISHED },
      { sort: { createdAt: -1 }, ...options }
    );
  }

  /**
   * Find ads pending review
   */
  public async findPendingReview(): Promise<IAd[]> {
    return this.find({ status: AdStatus.UNDER_REVIEW });
  }

  /**
   * Find ads pending payment
   */
  public async findPendingPayment(): Promise<IAd[]> {
    return this.find({ status: AdStatus.PAYMENT_PENDING });
  }

  /**
   * Find expired ads
   */
  public async findExpiredAds(): Promise<IAd[]> {
    return this.find({
      status: AdStatus.PUBLISHED,
      expiresAt: { $lt: new Date() },
    });
  }

  /**
   * Update ad status
   */
  public async updateStatus(adId: string, status: AdStatus, moderatorId?: string): Promise<IAd | null> {
    const updateData: any = { status };
    if (moderatorId) updateData.moderatorId = moderatorId;

    const ad = await this.updateById(adId, updateData);
    
    if (ad) {
      // Sync to Supabase
      await supabaseSync.syncRecord(syncTables[1], ad.toJSON(), 'update');
    }
    
    return ad;
  }

  /**
   * Increment impressions
   */
  public async incrementImpressions(adId: string): Promise<void> {
    await this.updateById(adId, { $inc: { impressions: 1 } } as any);
  }

  /**
   * Increment clicks
   */
  public async incrementClicks(adId: string): Promise<void> {
    await this.updateById(adId, { $inc: { clicks: 1 } } as any);
  }

  /**
   * Update ad budget
   */
  public async updateBudget(adId: string, budget: number): Promise<IAd | null> {
    const ad = await this.updateById(adId, { budget });
    
    if (ad) {
      // Sync to Supabase
      await supabaseSync.syncRecord(syncTables[1], ad.toJSON(), 'update');
    }
    
    return ad;
  }

  /**
   * Set published date
   */
  public async setPublishedDate(adId: string, publishedAt: Date): Promise<IAd | null> {
    const ad = await this.updateById(adId, { publishedAt });
    
    if (ad) {
      // Sync to Supabase
      await supabaseSync.syncRecord(syncTables[1], ad.toJSON(), 'update');
    }
    
    return ad;
  }

  /**
   * Set expiry date
   */
  public async setExpiryDate(adId: string, expiresAt: Date): Promise<IAd | null> {
    const ad = await this.updateById(adId, { expiresAt });
    
    if (ad) {
      // Sync to Supabase
      await supabaseSync.syncRecord(syncTables[1], ad.toJSON(), 'update');
    }
    
    return ad;
  }

  /**
   * Create ad with sync
   */
  public async createAd(data: Partial<IAd>): Promise<IAd> {
    const ad = await this.create(data);
    
    // Sync to Supabase
    await supabaseSync.syncRecord(syncTables[1], ad.toJSON(), 'create');
    
    return ad;
  }

  /**
   * Delete ad with sync
   */
  public async deleteAd(adId: string): Promise<boolean> {
    const ad = await this.findById(adId);
    if (!ad) return false;

    const result = await this.deleteById(adId);
    
    if (result) {
      // Sync deletion to Supabase
      await supabaseSync.syncRecord(syncTables[1], { id: ad._id.toString() }, 'delete');
    }
    
    return result;
  }
}

export default new AdRepository();
