import { supabaseAdmin } from '../supabase/client';

export type AdStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'payment_pending'
  | 'payment_submitted'
  | 'payment_verified'
  | 'scheduled'
  | 'published'
  | 'expired'
  | 'rejected';

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
  newStatus: string,
  userId: string,
  userRole: string,
  reason?: string
) {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Database not configured' };
    }

    // Get current ad
    const { data: ad, error: fetchError } = await supabaseAdmin
      .from('ads')
      .select('status, user_id')
      .eq('id', adId)
      .single();

    if (fetchError || !ad) {
      return { success: false, error: 'Ad not found' };
    }

    const previousStatus = ad.status;

    // Update ad status
    const updateData: any = { status: newStatus, updated_at: new Date().toISOString() };
    if (reason) updateData.rejection_reason = reason;
    if (userId && ['approved', 'rejected'].includes(newStatus)) {
      updateData.moderator_id = userId;
    }

    const { data: updated, error } = await supabaseAdmin
      .from('ads')
      .update(updateData)
      .eq('id', adId)
      .select()
      .single();

    if (error || !updated) {
      return { success: false, error: 'Failed to update ad status' };
    }

    // Log the transition
    await supabaseAdmin.from('logs').insert({
      level: 'info',
      action: `ad_${newStatus}`,
      user_id: userId || ad.user_id,
      ad_id: adId,
      details: { previous_status: previousStatus, new_status: newStatus, reason },
    });

    return { success: true, ad: updated };
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
    const { error } = await supabaseAdmin
      .from('ads')
      .update({ publish_at: publishDate.toISOString() })
      .eq('id', adId);

    if (error) {
      return { success: false, error: 'Failed to schedule ad' };
    }

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
    const { data: ads, error } = await supabaseAdmin
      .from('ads')
      .select('*, users(name, email), moderator:users!moderator_id(name, email)')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, error: error.message };
    }
    
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
    const now = new Date().toISOString();
    
    const { data: expiredAds, error } = await supabaseAdmin
      .from('ads')
      .select('id')
      .eq('status', 'published')
      .lt('expires_at', now);

    if (error) {
      return { success: false, error: error.message };
    }

    const results = [];
    for (const ad of expiredAds || []) {
      const result = await expireAd(ad.id);
      results.push(result);
    }

    return { success: true, expiredCount: expiredAds?.length || 0, results };
  } catch (error) {
    console.error('Auto expire ads error:', error);
    return { success: false, error: (error as Error).message };
  }
}
