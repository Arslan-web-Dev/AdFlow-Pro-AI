import Analytics from '../models/Analytics';
import connectDB from '../db/mongodb';

export interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
}

export const defaultFeatureToggles: FeatureToggle[] = [
  {
    id: 'ai_ad_generation',
    name: 'AI Ad Generation',
    description: 'Enable AI-powered ad generation for users',
    enabled: true,
    category: 'AI',
  },
  {
    id: 'auto_moderation',
    name: 'Auto Moderation',
    description: 'Enable automatic content moderation',
    enabled: false,
    category: 'Moderation',
  },
  {
    id: 'daily_sync',
    name: 'Daily Database Sync',
    description: 'Enable automatic daily sync to Supabase',
    enabled: true,
    category: 'Database',
  },
  {
    id: 'analytics_tracking',
    name: 'Analytics Tracking',
    description: 'Enable detailed analytics tracking',
    enabled: true,
    category: 'Analytics',
  },
  {
    id: 'user_registration',
    name: 'User Registration',
    description: 'Allow new user registrations',
    enabled: true,
    category: 'Auth',
  },
  {
    id: 'marketplace_public',
    name: 'Public Marketplace',
    description: 'Make marketplace publicly accessible',
    enabled: true,
    category: 'Marketplace',
  },
];

export async function getFeatureToggles(): Promise<FeatureToggle[]> {
  try {
    await connectDB();
    
    // For now, return default toggles
    // In production, these would be stored in the database
    return defaultFeatureToggles;
  } catch (error) {
    console.error('Error fetching feature toggles:', error);
    return defaultFeatureToggles;
  }
}

export async function updateFeatureToggle(
  toggleId: string,
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectDB();
    
    // Log the toggle change
    await Analytics.create({
      date: new Date(),
      totalUsers: 0,
      totalAds: 0,
      activeAds: 0,
      pendingAds: 0,
      totalRevenue: 0,
      dailyRevenue: 0,
      newUsers: 0,
      newAds: 0,
      adsByStatus: {},
      adsByCategory: {},
      usersByRole: {},
      aiGeneratedAds: 0,
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating feature toggle:', error);
    return { success: false, error: (error as Error).message };
  }
}

export function isFeatureEnabled(toggleId: string): boolean {
  const toggle = defaultFeatureToggles.find(t => t.id === toggleId);
  return toggle?.enabled ?? false;
}
