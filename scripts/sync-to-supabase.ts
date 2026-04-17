import dotenv from 'dotenv';
import { fullSyncToSupabase } from '../lib/supabase/sync';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function syncToSupabase() {
  try {
    console.log('🚀 Starting full sync to Supabase...');
    
    const result = await fullSyncToSupabase();
    
    if (result.success && result.results) {
      console.log('\n✅ Sync completed successfully!');
      console.log('   Results:');
      console.log(`   - Users: ${result.results.users.success} synced, ${result.results.users.failed} failed`);
      console.log(`   - Ads: ${result.results.ads.success} synced, ${result.results.ads.failed} failed`);
      console.log(`   - Logs: ${result.results.logs.success} synced, ${result.results.logs.failed} failed`);
      console.log(`   - Analytics: ${result.results.analytics.success} synced, ${result.results.analytics.failed} failed`);
    } else {
      console.error('\n❌ Sync failed:', result.error);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync error:', error);
    process.exit(1);
  }
}

syncToSupabase();
