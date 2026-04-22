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
  // Return default toggles - stored in memory/config only
  return defaultFeatureToggles;
}

export async function updateFeatureToggle(
  toggleId: string,
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find and update the toggle in memory
    const toggle = defaultFeatureToggles.find(t => t.id === toggleId);
    if (toggle) {
      toggle.enabled = enabled;
    }
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
