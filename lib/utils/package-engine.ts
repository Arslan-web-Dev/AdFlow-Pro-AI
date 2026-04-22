import { supabaseAdmin } from '../supabase/client';

export interface PackageConfig {
  name: string;
  durationDays: number;
  weight: number;
  isFeatured: boolean;
  homepageVisibility: boolean;
  autoRefreshDays?: number;
  price: number;
  features: string[];
}

export async function initializeDefaultPackages() {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Database not configured' };
    }

    const defaultPackages: PackageConfig[] = [
      {
        name: 'Basic',
        durationDays: 7,
        weight: 1,
        isFeatured: false,
        homepageVisibility: false,
        price: 10,
        features: ['7 days listing duration', 'Category visibility', 'Standard support'],
      },
      {
        name: 'Standard',
        durationDays: 15,
        weight: 2,
        isFeatured: false,
        homepageVisibility: false,
        autoRefreshDays: 5,
        price: 25,
        features: ['15 days listing duration', 'Category priority listing', 'Manual refresh every 5 days', 'Email support'],
      },
      {
        name: 'Premium',
        durationDays: 30,
        weight: 3,
        isFeatured: true,
        homepageVisibility: true,
        autoRefreshDays: 3,
        price: 50,
        features: ['30 days listing duration', 'Homepage featured placement', 'Auto refresh every 3 days', 'Priority support', 'Verified seller badge'],
      },
    ];

    for (const pkg of defaultPackages) {
      const { data: existing } = await supabaseAdmin.from('packages').select('id').eq('name', pkg.name).single();
      if (!existing) {
        await supabaseAdmin.from('packages').insert({
          name: pkg.name,
          duration_days: pkg.durationDays,
          weight: pkg.weight,
          is_featured: pkg.isFeatured,
          homepage_visibility: pkg.homepageVisibility,
          auto_refresh_days: pkg.autoRefreshDays,
          price: pkg.price,
          features: pkg.features,
          is_active: true,
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error initializing packages:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getPackageByName(name: string) {
  try {
    if (!supabaseAdmin) return null;
    const { data: pkg } = await supabaseAdmin.from('packages').select('*').eq('name', name).eq('is_active', true).single();
    return pkg;
  } catch (error) {
    console.error('Error getting package:', error);
    return null;
  }
}

export async function getAllPackages() {
  try {
    if (!supabaseAdmin) return [];
    const { data: packages } = await supabaseAdmin.from('packages').select('*').eq('is_active', true).order('price', { ascending: true });
    return packages || [];
  } catch (error) {
    console.error('Error getting packages:', error);
    return [];
  }
}

export async function calculateRankScore(ad: any): Promise<number> {
  // Simplified rank calculation without MongoDB
  const featuredScore = ad.is_featured ? 50 : 0;
  const packageWeightScore = (ad.weight || 1) * 10;
  const adminBoost = ad.admin_boost || 0;
  const verifiedSellerPoints = ad.verified_seller_points || 0;

  return featuredScore + packageWeightScore + adminBoost + verifiedSellerPoints;
}

export async function updateAllAdRankScores() {
  // Simplified version without MongoDB
  return { success: true, updatedCount: 0 };
}

export async function setExpireDate(adId: string, packageId: string) {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Database not configured' };
    }

    const { data: pkg } = await supabaseAdmin.from('packages').select('duration_days').eq('id', packageId).single();
    if (!pkg) {
      return { success: false, error: 'Package not found' };
    }

    const publishDate = new Date();
    const expireDate = new Date();
    expireDate.setDate(publishDate.getDate() + pkg.duration_days);

    await supabaseAdmin.from('ads').update({
      publish_at: publishDate.toISOString(),
      expire_at: expireDate.toISOString(),
    }).eq('id', adId);

    return { success: true, expireDate };
  } catch (error) {
    console.error('Error setting expire date:', error);
    return { success: false, error: (error as Error).message };
  }
}
