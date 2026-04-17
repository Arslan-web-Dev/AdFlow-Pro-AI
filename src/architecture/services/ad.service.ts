import adRepository from '../repositories/ad.repository';
import logRepository from '../repositories/log.repository';
import { AdStatus } from '../../models/ad.model';
import { LogAction, LogLevel } from '../../models/log.model';

/**
 * Ad Service
 * Handles ad-related business logic and workflow
 */
export class AdService {
  /**
   * Create ad (User only)
   */
  public async createAd(userId: string, data: {
    title: string;
    description: string;
    mediaUrl: string;
    budget: number;
  }) {
    try {
      const ad = await adRepository.createAd({
        title: data.title,
        description: data.description,
        mediaUrl: data.mediaUrl,
        budget: data.budget,
        status: AdStatus.DRAFT,
        userId: userId as any,
      });

      // Log ad creation
      await logRepository.createLog({
        userId: userId as any,
        action: LogAction.AD_CREATED,
        level: LogLevel.INFO,
        details: { adId: ad._id, title: ad.title },
      });

      return { success: true, ad };
    } catch (error) {
      console.error('Create ad error:', error);
      return { success: false, error: 'Failed to create ad' };
    }
  }

  /**
   * Get user's ads
   */
  public async getUserAds(userId: string) {
    try {
      const ads = await adRepository.findByUserId(userId);
      return { success: true, ads };
    } catch (error) {
      console.error('Get user ads error:', error);
      return { success: false, error: 'Failed to fetch ads' };
    }
  }

  /**
   * Get ad by ID
   */
  public async getAdById(adId: string) {
    try {
      const ad = await adRepository.findById(adId);
      if (!ad) {
        return { success: false, error: 'Ad not found' };
      }
      return { success: true, ad };
    } catch (error) {
      console.error('Get ad by ID error:', error);
      return { success: false, error: 'Failed to fetch ad' };
    }
  }

  /**
   * Update ad (User can only update draft ads)
   */
  public async updateAd(userId: string, adId: string, data: {
    title?: string;
    description?: string;
    mediaUrl?: string;
    budget?: number;
  }) {
    try {
      const ad = await adRepository.findById(adId);
      if (!ad) {
        return { success: false, error: 'Ad not found' };
      }

      // Check if user owns the ad
      if (ad.userId.toString() !== userId) {
        return { success: false, error: 'Access denied' };
      }

      // Check if ad is in draft status
      if (ad.status !== AdStatus.DRAFT) {
        return { success: false, error: 'Can only update draft ads' };
      }

      const updatedAd = await adRepository.updateById(adId, data);

      // Log ad update
      await logRepository.createLog({
        userId: userId as any,
        action: LogAction.AD_UPDATED,
        level: LogLevel.INFO,
        details: { adId },
      });

      return { success: true, ad: updatedAd };
    } catch (error) {
      console.error('Update ad error:', error);
      return { success: false, error: 'Failed to update ad' };
    }
  }

  /**
   * Delete ad (User can only delete draft ads)
   */
  public async deleteAd(userId: string, adId: string) {
    try {
      const ad = await adRepository.findById(adId);
      if (!ad) {
        return { success: false, error: 'Ad not found' };
      }

      // Check if user owns the ad
      if (ad.userId.toString() !== userId) {
        return { success: false, error: 'Access denied' };
      }

      // Check if ad is in draft status
      if (ad.status !== AdStatus.DRAFT) {
        return { success: false, error: 'Can only delete draft ads' };
      }

      const result = await adRepository.deleteAd(adId);

      // Log ad deletion
      await logRepository.createLog({
        userId: userId as any,
        action: LogAction.AD_DELETED,
        level: LogLevel.INFO,
        details: { adId },
      });

      return { success: true };
    } catch (error) {
      console.error('Delete ad error:', error);
      return { success: false, error: 'Failed to delete ad' };
    }
  }

  /**
   * Submit ad for review (User)
   */
  public async submitAd(userId: string, adId: string) {
    try {
      const ad = await adRepository.findById(adId);
      if (!ad) {
        return { success: false, error: 'Ad not found' };
      }

      // Check if user owns the ad
      if (ad.userId.toString() !== userId) {
        return { success: false, error: 'Access denied' };
      }

      // Check if ad is in draft status
      if (ad.status !== AdStatus.DRAFT) {
        return { success: false, error: 'Ad is not in draft status' };
      }

      const updatedAd = await adRepository.updateStatus(adId, AdStatus.SUBMITTED);

      // Log ad submission
      await logRepository.createLog({
        userId: userId as any,
        action: LogAction.AD_SUBMITTED,
        level: LogLevel.INFO,
        details: { adId },
      });

      return { success: true, ad: updatedAd };
    } catch (error) {
      console.error('Submit ad error:', error);
      return { success: false, error: 'Failed to submit ad' };
    }
  }

  /**
   * Get ads pending review (Manager)
   */
  public async getPendingReviewAds() {
    try {
      const ads = await adRepository.findPendingReview();
      return { success: true, ads };
    } catch (error) {
      console.error('Get pending review ads error:', error);
      return { success: false, error: 'Failed to fetch ads' };
    }
  }

  /**
   * Approve ad (Manager)
   */
  public async approveAd(moderatorId: string, adId: string) {
    try {
      const ad = await adRepository.findById(adId);
      if (!ad) {
        return { success: false, error: 'Ad not found' };
      }

      // Check if ad is in under_review status
      if (ad.status !== AdStatus.UNDER_REVIEW) {
        return { success: false, error: 'Ad is not under review' };
      }

      const updatedAd = await adRepository.updateStatus(adId, AdStatus.APPROVED, moderatorId as any);

      // Log ad approval
      await logRepository.createLog({
        userId: moderatorId as any,
        action: LogAction.AD_APPROVED,
        level: LogLevel.INFO,
        details: { adId },
      });

      return { success: true, ad: updatedAd };
    } catch (error) {
      console.error('Approve ad error:', error);
      return { success: false, error: 'Failed to approve ad' };
    }
  }

  /**
   * Reject ad (Manager)
   */
  public async rejectAd(moderatorId: string, adId: string, reason: string) {
    try {
      const ad = await adRepository.findById(adId);
      if (!ad) {
        return { success: false, error: 'Ad not found' };
      }

      // Check if ad is in under_review status
      if (ad.status !== AdStatus.UNDER_REVIEW) {
        return { success: false, error: 'Ad is not under review' };
      }

      const updatedAd = await adRepository.updateById(adId, {
        status: AdStatus.REJECTED,
        rejectionReason: reason,
        moderatorId: moderatorId as any,
      } as any);

      // Log ad rejection
      await logRepository.createLog({
        userId: moderatorId as any,
        action: LogAction.AD_REJECTED,
        level: LogLevel.INFO,
        details: { adId, reason },
      });

      return { success: true, ad: updatedAd };
    } catch (error) {
      console.error('Reject ad error:', error);
      return { success: false, error: 'Failed to reject ad' };
    }
  }

  /**
   * Publish ad (Admin)
   */
  public async publishAd(adminId: string, adId: string) {
    try {
      const ad = await adRepository.findById(adId);
      if (!ad) {
        return { success: false, error: 'Ad not found' };
      }

      // Check if ad is approved or payment pending
      if (ad.status !== AdStatus.APPROVED && ad.status !== AdStatus.PAYMENT_PENDING) {
        return { success: false, error: 'Ad must be approved first' };
      }

      const updatedAd = await adRepository.updateById(adId, {
        status: AdStatus.PUBLISHED,
        publishedAt: new Date(),
      } as any);

      // Log ad publication
      await logRepository.createLog({
        userId: adminId as any,
        action: LogAction.AD_PUBLISHED,
        level: LogLevel.INFO,
        details: { adId },
      });

      return { success: true, ad: updatedAd };
    } catch (error) {
      console.error('Publish ad error:', error);
      return { success: false, error: 'Failed to publish ad' };
    }
  }

  /**
   * Delete any ad (Admin)
   */
  public async deleteAnyAd(adminId: string, adId: string) {
    try {
      const result = await adRepository.deleteAd(adId);

      // Log ad deletion by admin
      await logRepository.createLog({
        userId: adminId as any,
        action: LogAction.AD_DELETED,
        level: LogLevel.INFO,
        details: { adId, deletedBy: 'admin' },
      });

      return { success: true };
    } catch (error) {
      console.error('Delete ad error:', error);
      return { success: false, error: 'Failed to delete ad' };
    }
  }

  /**
   * Get published ads (Public)
   */
  public async getPublishedAds(options?: { limit?: number; skip?: number }) {
    try {
      const ads = await adRepository.findPublishedAds(options);
      return { success: true, ads };
    } catch (error) {
      console.error('Get published ads error:', error);
      return { success: false, error: 'Failed to fetch ads' };
    }
  }

  /**
   * Increment impressions
   */
  public async incrementImpressions(adId: string) {
    try {
      await adRepository.incrementImpressions(adId);
      return { success: true };
    } catch (error) {
      console.error('Increment impressions error:', error);
      return { success: false, error: 'Failed to increment impressions' };
    }
  }

  /**
   * Increment clicks
   */
  public async incrementClicks(adId: string) {
    try {
      await adRepository.incrementClicks(adId);
      return { success: true };
    } catch (error) {
      console.error('Increment clicks error:', error);
      return { success: false, error: 'Failed to increment clicks' };
    }
  }
}

export default new AdService();
