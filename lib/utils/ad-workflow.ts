import connectDB from '../db/mongodb';
import Ad, { AdStatus } from '../models/Ad';
import Log from '../models/Log';
import AdStatusHistory from '../models/AdStatusHistory';
import AuditLog from '../models/AuditLog';
import { syncAdToSupabase } from '../supabase/sync';

export const workflowTransitions: Record<AdStatus, AdStatus[]> = {
  draft: ['submitted'],
  submitted: ['under_review', 'draft'],
  under_review: ['payment_pending', 'rejected', 'submitted'],
  payment_pending: ['payment_submitted', 'under_review'],
  payment_submitted: ['payment_verified', 'rejected', 'payment_pending'],
  payment_verified: ['scheduled', 'rejected', 'payment_submitted'],
  scheduled: ['published', 'rejected', 'payment_verified'],
  published: ['expired'],
  expired: [],
  rejected: ['draft'],
};

export function isValidTransition(currentStatus: AdStatus, newStatus: AdStatus): boolean {
  return workflowTransitions[currentStatus]?.includes(newStatus) || false;
}

export async function transitionAdStatus(
  adId: string,
  newStatus: AdStatus,
  userId: string,
  userRole: string,
  reason?: string
) {
  try {
    await connectDB();

    const ad = await Ad.findById(adId);
    if (!ad) {
      return { success: false, error: 'Ad not found' };
    }

    // Check if transition is valid
    if (!isValidTransition(ad.status, newStatus)) {
      return { 
        success: false, 
        error: `Cannot transition from ${ad.status} to ${newStatus}` 
      };
    }

    // Update status
    const previousStatus = ad.status;
    ad.status = newStatus;

    if (reason) {
      ad.rejectionReason = reason;
    }

    if (userId && ['under_review', 'payment_verified', 'rejected'].includes(newStatus)) {
      ad.moderatorId = userId;
    }

    await ad.save();

    // Log the transition in Log
    await Log.create({
      level: 'info',
      action: `ad_${newStatus}` as any,
      userId: userId || ad.userId,
      adId: ad._id.toString(),
      details: {
        previousStatus,
        newStatus,
        reason,
      },
    });

    // Create status history record
    await AdStatusHistory.create({
      adId: ad._id.toString(),
      previousStatus,
      newStatus,
      changedBy: userId,
      changedByRole: userRole,
      note: reason,
    });

    // Create audit log
    await AuditLog.create({
      actorId: userId,
      actorRole: userRole,
      actionType: newStatus,
      targetType: 'ad',
      targetId: ad._id.toString(),
      oldValue: previousStatus,
      newValue: newStatus,
    });

    // Sync to Supabase
    await syncAdToSupabase(ad._id.toString());

    return { success: true, ad };
  } catch (error) {
    console.error('Ad status transition error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function submitAdForReview(adId: string, userId: string, userRole: string) {
  return transitionAdStatus(adId, 'submitted', userId, userRole);
}

export async function moveToPaymentPending(adId: string, moderatorId: string, moderatorRole: string) {
  return transitionAdStatus(adId, 'payment_pending', moderatorId, moderatorRole);
}

export async function submitPaymentProof(adId: string, userId: string, userRole: string) {
  return transitionAdStatus(adId, 'payment_submitted', userId, userRole);
}

export async function verifyPayment(adId: string, adminId: string, adminRole: string) {
  return transitionAdStatus(adId, 'payment_verified', adminId, adminRole);
}

export async function scheduleAd(adId: string, adminId: string, adminRole: string, publishDate: Date) {
  try {
    await connectDB();
    
    const ad = await Ad.findById(adId);
    if (!ad) {
      return { success: false, error: 'Ad not found' };
    }

    ad.publishAt = publishDate;
    await ad.save();

    return transitionAdStatus(adId, 'scheduled', adminId, adminRole);
  } catch (error) {
    console.error('Schedule ad error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function publishAd(adId: string, userId: string, userRole: string) {
  return transitionAdStatus(adId, 'published', userId, userRole);
}

export async function rejectAd(adId: string, moderatorId: string, moderatorRole: string, reason: string) {
  return transitionAdStatus(adId, 'rejected', moderatorId, moderatorRole, reason);
}

export async function expireAd(adId: string) {
  return transitionAdStatus(adId, 'expired', 'system', 'system');
}

export async function getAdsByStatus(status: AdStatus, limit = 50) {
  try {
    await connectDB();
    const ads = await Ad.find({ status })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email')
      .populate('moderatorId', 'name email');
    
    return { success: true, ads };
  } catch (error) {
    console.error('Get ads by status error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getAdsInModerationQueue(limit = 50) {
  return getAdsByStatus('under_review', limit);
}

export async function getAdsPendingPayment(limit = 50) {
  return getAdsByStatus('payment_submitted', limit);
}

export async function getAdsPaymentPending(limit = 50) {
  return getAdsByStatus('payment_pending', limit);
}

export async function autoExpireAds() {
  try {
    await connectDB();
    
    const expiredAds = await Ad.find({
      status: 'published',
      expireAt: { $lt: new Date() },
    });

    const results = [];
    for (const ad of expiredAds) {
      const result = await expireAd(ad._id.toString());
      results.push(result);
    }

    return { success: true, expiredCount: expiredAds.length, results };
  } catch (error) {
    console.error('Auto expire ads error:', error);
    return { success: false, error: (error as Error).message };
  }
}
