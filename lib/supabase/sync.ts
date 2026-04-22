import { supabaseAdmin } from './client';

// Supabase-only operations - no MongoDB sync needed
// This file now contains utility functions for Supabase operations

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!supabaseAdmin;
}

// Simple batch insert for logs
export async function batchInsertLogs(logs: any[]) {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase not configured' };
    }

    const { error } = await supabaseAdmin.from('logs').insert(logs);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Simple batch upsert for analytics
export async function upsertAnalytics(data: any) {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase not configured' };
    }

    const { error } = await supabaseAdmin
      .from('analytics')
      .upsert(data, { onConflict: 'date' });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
