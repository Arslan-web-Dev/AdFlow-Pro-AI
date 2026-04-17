import connectDB from '../db/mongodb';
import Ad from '../models/Ad';
import SystemHealthLog from '../models/SystemHealthLog';
import { publishAd } from './ad-workflow';
import { updateAllAdRankScores } from './package-engine';

export async function publishScheduledAds() {
  try {
    await connectDB();

    const now = new Date();
    const scheduledAds = await Ad.find({
      status: 'scheduled',
      publishAt: { $lte: now },
    });

    const results = [];
    for (const ad of scheduledAds) {
      const result = await publishAd(ad._id.toString(), ad.userId, 'system');
      results.push(result);
    }

    return { success: true, publishedCount: scheduledAds.length, results };
  } catch (error) {
    console.error('Publish scheduled ads error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function sendExpiryNotifications() {
  try {
    await connectDB();

    const fortyEightHoursFromNow = new Date();
    fortyEightHoursFromNow.setHours(fortyEightHoursFromNow.getHours() + 48);

    const adsExpiringSoon = await Ad.find({
      status: 'published',
      expireAt: { $lte: fortyEightHoursFromNow, $gte: new Date() },
    }).populate('userId', 'email name');

    // In a real implementation, you would send emails here
    // For now, we'll just log the notifications
    console.log(`Sending expiry notifications for ${adsExpiringSoon.length} ads`);

    return { success: true, notificationCount: adsExpiringSoon.length };
  } catch (error) {
    console.error('Send expiry notifications error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function logDBHeartbeat() {
  try {
    await connectDB();

    const startTime = Date.now();

    // Test MongoDB connection
    await Ad.findOne();

    const responseTime = Date.now() - startTime;

    await SystemHealthLog.create({
      source: 'mongodb',
      responseMs: responseTime,
      status: 'healthy',
      checkedAt: new Date(),
    });

    return { success: true, responseTime };
  } catch (error) {
    console.error('DB heartbeat error:', error);

    await SystemHealthLog.create({
      source: 'mongodb',
      status: 'down',
      errorMessage: (error as Error).message,
      checkedAt: new Date(),
    });

    return { success: false, error: (error as Error).message };
  }
}

export async function refreshRankScores() {
  try {
    await connectDB();

    const result = await updateAllAdRankScores();

    return result;
  } catch (error) {
    console.error('Refresh rank scores error:', error);
    return { success: false, error: (error as Error).message };
  }
}
