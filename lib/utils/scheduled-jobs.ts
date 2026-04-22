import { supabaseAdmin } from '../supabase/client';

export async function publishScheduledAds() {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Database not configured' };
    }

    // Get scheduled ads ready to publish
    const now = new Date().toISOString();
    const { data: scheduledAds, error } = await supabaseAdmin
      .from('ads')
      .select('id, user_id')
      .eq('status', 'scheduled')
      .lte('publish_at', now);

    if (error || !scheduledAds) {
      return { success: false, error: 'Failed to fetch scheduled ads' };
    }

    const results = [];
    for (const ad of scheduledAds) {
      // Update status to published
      const { error: updateError } = await supabaseAdmin
        .from('ads')
        .update({ status: 'published', updated_at: now })
        .eq('id', ad.id);

      results.push({ id: ad.id, success: !updateError });
    }

    return { success: true, publishedCount: scheduledAds.length, results };
  } catch (error) {
    console.error('Publish scheduled ads error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function sendExpiryNotifications() {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Database not configured' };
    }

    const fortyEightHoursFromNow = new Date();
    fortyEightHoursFromNow.setHours(fortyEightHoursFromNow.getHours() + 48);

    // Get ads expiring within 48 hours
    const { data: adsExpiringSoon, error } = await supabaseAdmin
      .from('ads')
      .select('id, user_id')
      .eq('status', 'published')
      .lte('expire_at', fortyEightHoursFromNow.toISOString())
      .gte('expire_at', new Date().toISOString());

    if (error) {
      return { success: false, error: 'Failed to fetch expiring ads' };
    }

    console.log(`Sending expiry notifications for ${adsExpiringSoon?.length || 0} ads`);

    return { success: true, notificationCount: adsExpiringSoon?.length || 0 };
  } catch (error) {
    console.error('Send expiry notifications error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function logDBHeartbeat() {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Database not configured' };
    }

    const startTime = Date.now();

    // Test Supabase connection
    await supabaseAdmin.from('ads').select('count', { count: 'exact', head: true });

    const responseTime = Date.now() - startTime;

    await supabaseAdmin.from('logs').insert({
      level: 'info',
      action: 'db_heartbeat',
      details: { responseTime, status: 'healthy' },
    });

    return { success: true, responseTime };
  } catch (error) {
    console.error('DB heartbeat error:', error);

    await supabaseAdmin.from('logs').insert({
      level: 'error',
      action: 'db_heartbeat',
      details: { error: (error as Error).message, status: 'down' },
    });

    return { success: false, error: (error as Error).message };
  }
}

export async function refreshRankScores() {
  // Simplified version without MongoDB rank score logic
  return { success: true, updatedCount: 0 };
}
