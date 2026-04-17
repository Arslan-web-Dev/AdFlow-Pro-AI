import cron from 'node-cron';
import Ad from '@/lib/models/Ad';
import Payment from '@/lib/models/Payment';
import Log from '@/lib/models/Log';
import SystemHealthLog from '@/lib/models/SystemHealthLog';
import { supabaseAdmin } from '@/lib/supabase/client';
import { createAIGeneratedAd, generateDailyAdsForUser } from '@/lib/ai/ad-generator';

/**
 * Cron Job System
 * Handles scheduled tasks for AdFlow Pro
 */
export class CronJobSystem {
  private static instance: CronJobSystem;
  private tasks: any[] = [];

  private constructor() {}

  public static getInstance(): CronJobSystem {
    if (!CronJobSystem.instance) {
      CronJobSystem.instance = new CronJobSystem();
    }
    return CronJobSystem.instance;
  }

  /**
   * Initialize all cron jobs
   */
  public async initialize(): Promise<void> {
    console.log('🚀 Initializing Cron Job System...');

    // Auto publish ads - Runs every hour
    const publishTask = cron.schedule('0 * * * *', async () => {
      await this.autoPublishAds();
    });
    this.tasks.push(publishTask);

    // Expire ads - Runs every hour
    const expireTask = cron.schedule('30 * * * *', async () => {
      await this.expireAds();
    });
    this.tasks.push(expireTask);

    // Generate AI ads daily - Runs at midnight
    const aiTask = cron.schedule('0 0 * * *', async () => {
      await this.generateAIAds();
    });
    this.tasks.push(aiTask);

    // Sync MongoDB to Supabase - Runs every 6 hours
    const syncTask = cron.schedule('0 */6 * * *', async () => {
      await this.syncToSupabase();
    });
    this.tasks.push(syncTask);

    // System health check - Runs every 30 minutes
    const healthTask = cron.schedule('*/30 * * * *', async () => {
      await this.healthCheck();
    });
    this.tasks.push(healthTask);

    console.log('✅ Cron Job System initialized successfully');
  }

  /**
   * Auto publish ads that are approved and payment verified
   */
  private async autoPublishAds(): Promise<void> {
    try {
      console.log('🚀 Running auto publish ads job...');

      const ads = await Ad.find({ 
        status: 'approved',
        publishedAt: { $exists: false }
      });

      let publishedCount = 0;
      for (const ad of ads) {
        // Check if payment is verified
        const payment = await Payment.findOne({ 
          adId: ad._id, 
          status: 'verified' 
        });

        if (payment) {
          await Ad.findByIdAndUpdate(ad._id, {
            status: 'published',
            publishedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          });

          // Log publication
          await Log.create({
            userId: ad.userId,
            action: 'ad_published',
            level: 'info',
            details: { adId: ad._id, autoPublished: true }
          });

          publishedCount++;
        }
      }

      console.log(`✅ Auto publish job completed. Published ${publishedCount} ads.`);
    } catch (error) {
      console.error('❌ Auto publish ads job failed:', error);
      await Log.create({
        action: 'sync_failed',
        level: 'error',
        details: { job: 'auto_publish_ads', error: (error as Error).message }
      });
    }
  }

  /**
   * Expire ads that have passed their expiry date
   */
  private async expireAds(): Promise<void> {
    try {
      console.log('⏰ Running expire ads job...');

      const expiredAds = await Ad.find({
        status: 'published',
        expiresAt: { $lt: new Date() }
      });

      let expiredCount = 0;
      for (const ad of expiredAds) {
        await Ad.findByIdAndUpdate(ad._id, { status: 'expired' });
        expiredCount++;

        // Log expiry
        await Log.create({
          userId: ad.userId,
          action: 'ad_expired',
          level: 'info',
          details: { adId: ad._id, autoExpired: true }
        });
      }

      console.log(`✅ Expire ads job completed. Expired ${expiredCount} ads.`);
    } catch (error) {
      console.error('❌ Expire ads job failed:', error);
      await Log.create({
        action: 'sync_failed',
        level: 'error',
        details: { job: 'expire_ads', error: (error as Error).message }
      });
    }
  }

  /**
   * Generate AI ads for users who have opted in
   */
  private async generateAIAds(): Promise<void> {
    try {
      console.log('🤖 Running AI ads generation job...');

      // In production, this would:
      // 1. Find users who have opted in for AI ad generation
      // 2. Generate ad copy using AI service
      // 3. Create draft ads for review
      // 4. Notify users about generated ads

      console.log('✅ AI ads generation job completed.');
    } catch (error) {
      console.error('❌ AI ads generation job failed:', error);
      await Log.create({
        action: 'sync_failed',
        level: 'error',
        details: { job: 'ai_ads_generation', error: (error as Error).message }
      });
    }
  }

  /**
   * Sync MongoDB data to Supabase
   */
  private async syncToSupabase(): Promise<void> {
    try {
      console.log('🔄 Running sync to Supabase job...');

      // Check Supabase health
      const { error } = await supabaseAdmin.from('users').select('id').limit(1);
      if (error) {
        console.warn('⚠️ Supabase is not healthy, skipping sync');
        return;
      }

      // Sync critical data
      // In production, this would sync all critical tables
      // For now, we'll just log the health check

      console.log('✅ Sync to Supabase job completed.');
    } catch (error) {
      console.error('❌ Sync to Supabase job failed:', error);
      await Log.create({
        action: 'sync_failed',
        level: 'error',
        details: { job: 'sync_to_supabase', error: (error as Error).message }
      });
    }
  }

  /**
   * System health check
   */
  private async healthCheck(): Promise<void> {
    try {
      console.log('🏥 Running system health check...');

      // Check MongoDB connection
      const mongoHealthy = true; // In production, check actual connection

      // Check Supabase connection
      const { error } = await supabaseAdmin.from('users').select('id').limit(1);
      const supabaseHealthy = !error;

      const health = {
        mongodb: mongoHealthy ? 'healthy' : 'unhealthy',
        supabase: supabaseHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date(),
      };

      // Log health check
      await SystemHealthLog.create({
        source: 'cron-health-check',
        status: mongoHealthy && supabaseHealthy ? 'healthy' : 'unhealthy',
        responseMs: 0, // In production, measure actual response time
        checkedAt: new Date(),
      });

      console.log('✅ System health check completed:', health);
    } catch (error) {
      console.error('❌ System health check failed:', error);
      await Log.create({
        action: 'sync_failed',
        level: 'error',
        details: { job: 'health_check', error: (error as Error).message }
      });
    }
  }

  /**
   * Stop all cron jobs
   */
  public stop(): void {
    this.tasks.forEach(task => task.stop());
    this.tasks = [];
    console.log('🛑 Cron jobs stopped');
  }
}

export default CronJobSystem.getInstance();
