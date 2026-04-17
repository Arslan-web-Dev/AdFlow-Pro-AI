import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Configuration
 * Handles Supabase client initialization and configuration
 */

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase credentials not configured');
}

// Anonymous client for client-side operations
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Service role client for server-side operations (bypasses RLS)
export const supabaseServiceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Supabase Sync Configuration
 */
export interface SyncConfig {
  retryAttempts: number;
  retryDelay: number;
  batchSize: number;
}

export const syncConfig: SyncConfig = {
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  batchSize: 100,
};

/**
 * Sync tables configuration
 */
export const syncTables = [
  'users',
  'ads',
  'payments',
  'notifications',
  'logs',
  'analytics',
] as const;

export type SyncTable = typeof syncTables[number];
