import cron from 'node-cron';
import { generateAdsForAllClients } from './ad-generator';
import { autoExpireAds } from '../utils/ad-workflow';
import { publishScheduledAds, sendExpiryNotifications, logDBHeartbeat } from '../utils/scheduled-jobs';
import Log from '../models/Log';
import connectDB from '../db/mongodb';

let isSchedulerRunning = false;

export function startAIGenerationScheduler() {
  if (isSchedulerRunning) {
    console.log('AI Generation Scheduler is already running');
    return;
  }

  isSchedulerRunning = true;

  // Run daily at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    try {
      await connectDB();
      console.log('Starting daily AI ad generation...');
      
      const result = await generateAdsForAllClients(['Technology', 'Health', 'Business', 'Entertainment']);
      
      console.log('Daily AI ad generation completed:', result);
      
      await Log.create({
        level: 'info',
        action: 'ai_ad_generated',
        details: {
          type: 'scheduled_daily',
          result: result.success ? 'success' : 'failed',
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Error in daily AI generation:', error);
      
      await Log.create({
        level: 'error',
        action: 'system_error',
        details: {
          error: (error as Error).message,
          context: 'daily_ai_generation',
        },
      });
    }
  });

  console.log('AI Generation Scheduler started - runs daily at 9:00 AM');
}

export function startAutoExpireScheduler() {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    try {
      await connectDB();
      console.log('Running auto-expire check...');
      
      const result = await autoExpireAds();
      
      console.log('Auto-expire check completed:', result);
      
      await Log.create({
        level: 'info',
        action: 'system_error',
        details: {
          type: 'auto_expire',
          result: result.success ? 'success' : 'failed',
          expiredCount: result.success ? result.expiredCount : 0,
        },
      });
    } catch (error) {
      console.error('Error in auto-expire check:', error);
    }
  });

  console.log('Auto-Expire Scheduler started - runs every hour');
}

export function startPublishScheduledScheduler() {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    try {
      await connectDB();
      console.log('Running publish scheduled ads...');
      
      const result = await publishScheduledAds();
      
      console.log('Publish scheduled ads completed:', result);
      
      await Log.create({
        level: 'info',
        action: 'scheduled_ads_published',
        details: {
          result: result.success ? 'success' : 'failed',
          publishedCount: result.success ? result.publishedCount : 0,
        },
      });
    } catch (error) {
      console.error('Error in publish scheduled ads:', error);
    }
  });

  console.log('Publish Scheduled Scheduler started - runs every hour');
}

export function startExpiryNotificationScheduler() {
  // Run daily at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    try {
      await connectDB();
      console.log('Running expiry notification check...');
      
      const result = await sendExpiryNotifications();
      
      console.log('Expiry notification check completed:', result);
      
      await Log.create({
        level: 'info',
        action: 'expiry_notifications_sent',
        details: {
          result: result.success ? 'success' : 'failed',
          notificationCount: result.success ? result.notificationCount : 0,
        },
      });
    } catch (error) {
      console.error('Error in expiry notification check:', error);
    }
  });

  console.log('Expiry Notification Scheduler started - runs daily at 9:00 AM');
}

export function startDBHeartbeatScheduler() {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      await connectDB();
      
      await logDBHeartbeat();
      
    } catch (error) {
      console.error('Error in DB heartbeat:', error);
    }
  });

  console.log('DB Heartbeat Scheduler started - runs every 5 minutes');
}

export function startAllSchedulers() {
  startAIGenerationScheduler();
  startAutoExpireScheduler();
  startPublishScheduledScheduler();
  startExpiryNotificationScheduler();
  startDBHeartbeatScheduler();
}

export function stopSchedulers() {
  isSchedulerRunning = false;
  // Stop all scheduled tasks
  const tasks = cron.getTasks();
  tasks.forEach(task => task.stop());
  console.log('All schedulers stopped');
}
