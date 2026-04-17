import Package from '../models/Package';
import Ad from '../models/Ad';
import connectDB from '../db/mongodb';

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
    await connectDB();

    const defaultPackages: PackageConfig[] = [
      {
        name: 'Basic',
        durationDays: 7,
        weight: 1,
        isFeatured: false,
        homepageVisibility: false,
        price: 10,
        features: [
          '7 days listing duration',
          'Category visibility',
          'Standard support',
        ],
      },
      {
        name: 'Standard',
        durationDays: 15,
        weight: 2,
        isFeatured: false,
        homepageVisibility: false,
        autoRefreshDays: 5,
        price: 25,
        features: [
          '15 days listing duration',
          'Category priority listing',
          'Manual refresh every 5 days',
          'Email support',
        ],
      },
      {
        name: 'Premium',
        durationDays: 30,
        weight: 3,
        isFeatured: true,
        homepageVisibility: true,
        autoRefreshDays: 3,
        price: 50,
        features: [
          '30 days listing duration',
          'Homepage featured placement',
          'Auto refresh every 3 days',
          'Priority support',
          'Verified seller badge',
        ],
      },
    ];

    for (const pkg of defaultPackages) {
      const existing = await Package.findOne({ name: pkg.name });
      if (!existing) {
        await Package.create(pkg);
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
    await connectDB();
    const pkg = await Package.findOne({ name, isActive: true });
    return pkg;
  } catch (error) {
    console.error('Error getting package:', error);
    return null;
  }
}

export async function getAllPackages() {
  try {
    await connectDB();
    const packages = await Package.find({ isActive: true }).sort({ price: 1 });
    return packages;
  } catch (error) {
    console.error('Error getting packages:', error);
    return [];
  }
}

export async function calculateRankScore(ad: any): Promise<number> {
  try {
    const pkg = await Package.findById(ad.packageId);
    if (!pkg) return 0;

    const featuredScore = ad.isFeatured ? 50 : 0;
    const packageWeightScore = pkg.weight * 10;
    
    // Freshness points (higher for recently published ads)
    const daysSincePublish = ad.publishAt 
      ? Math.floor((Date.now() - new Date(ad.publishAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    const freshnessPoints = Math.max(0, 30 - daysSincePublish); // Max 30 points, decreases over time
    
    const adminBoost = ad.adminBoost || 0;
    const verifiedSellerPoints = ad.verifiedSellerPoints || 0;

    const rankScore = featuredScore + packageWeightScore + freshnessPoints + adminBoost + verifiedSellerPoints;

    // Update the ad with the calculated rank score
    await Ad.findByIdAndUpdate(ad._id, { rankScore });

    return rankScore;
  } catch (error) {
    console.error('Error calculating rank score:', error);
    return 0;
  }
}

export async function updateAllAdRankScores() {
  try {
    await connectDB();
    
    const ads = await Ad.find({ status: 'published' });
    const results = [];
    
    for (const ad of ads) {
      const score = await calculateRankScore(ad);
      results.push({ adId: ad._id, score });
    }

    return { success: true, updatedCount: results.length, results };
  } catch (error) {
    console.error('Error updating rank scores:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function setExpireDate(adId: string, packageId: string) {
  try {
    await connectDB();
    
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return { success: false, error: 'Package not found' };
    }

    const publishDate = new Date();
    const expireDate = new Date();
    expireDate.setDate(publishDate.getDate() + pkg.durationDays);

    await Ad.findByIdAndUpdate(adId, {
      publishAt: publishDate,
      expireAt: expireDate,
    });

    return { success: true, expireDate };
  } catch (error) {
    console.error('Error setting expire date:', error);
    return { success: false, error: (error as Error).message };
  }
}
