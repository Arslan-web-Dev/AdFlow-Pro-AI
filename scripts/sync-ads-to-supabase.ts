import dotenv from 'dotenv';
import connectDB from '../lib/db/mongodb';
import Ad from '../lib/models/Ad';
import User from '../lib/models/User';
import Category from '../lib/models/Category';
import City from '../lib/models/City';
import Package from '../lib/models/Package';
import { supabaseAdmin } from '../lib/supabase/client';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function syncToSupabase() {
  try {
    console.log('� Syncing MongoDB to Supabase...');

    if (!supabaseAdmin) {
      console.error('❌ Supabase not configured. Please set environment variables.');
      process.exit(1);
    }

    console.log('�� Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Sync users first
    console.log('\n� Syncing users...');
    const users = await User.find({});
    console.log(`✅ Found ${users.length} users`);
    let userSuccess = 0;
    for (const user of users) {
      if (!supabaseAdmin) break;
      const { error } = await supabaseAdmin.from('users').upsert({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        is_active: user.isActive,
        is_verified: user.isVerified,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      });
      if (!error) userSuccess++;
    }
    console.log(`   ✓ Synced ${userSuccess}/${users.length} users`);

    // Sync categories
    console.log('\n📁 Syncing categories...');
    const categories = await Category.find({});
    console.log(`✅ Found ${categories.length} categories`);
    let categorySuccess = 0;
    for (const category of categories) {
      if (!supabaseAdmin) break;
      const { error } = await supabaseAdmin.from('categories').upsert({
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        is_active: category.isActive,
        created_at: category.createdAt,
        updated_at: category.updatedAt,
      });
      if (!error) categorySuccess++;
    }
    console.log(`   ✓ Synced ${categorySuccess}/${categories.length} categories`);

    // Sync cities
    console.log('\n🏙️  Syncing cities...');
    const cities = await City.find({});
    console.log(`✅ Found ${cities.length} cities`);
    let citySuccess = 0;
    for (const city of cities) {
      if (!supabaseAdmin) break;
      const { error } = await supabaseAdmin.from('cities').upsert({
        id: city._id.toString(),
        name: city.name,
        slug: city.slug,
        is_active: city.isActive,
        created_at: city.createdAt,
        updated_at: city.updatedAt,
      });
      if (!error) citySuccess++;
    }
    console.log(`   ✓ Synced ${citySuccess}/${cities.length} cities`);

    // Sync packages
    console.log('\n📦 Syncing packages...');
    const packages = await Package.find({});
    console.log(`✅ Found ${packages.length} packages`);
    let packageSuccess = 0;
    for (const pkg of packages) {
      if (!supabaseAdmin) break;
      const { error } = await supabaseAdmin.from('packages').upsert({
        id: pkg._id.toString(),
        name: pkg.name,
        duration_days: pkg.durationDays,
        weight: pkg.weight,
        is_featured: pkg.isFeatured,
        homepage_visibility: pkg.homepageVisibility,
        auto_refresh_days: pkg.autoRefreshDays,
        price: pkg.price,
        features: pkg.features,
        is_active: pkg.isActive,
        created_at: pkg.createdAt,
        updated_at: pkg.updatedAt,
      });
      if (!error) packageSuccess++;
    }
    console.log(`   ✓ Synced ${packageSuccess}/${packages.length} packages`);

    // Sync ads
    console.log('\n📝 Syncing ads...');
    const ads = await Ad.find({});
    console.log(`✅ Found ${ads.length} ads`);
    let adSuccess = 0;
    for (const ad of ads) {
      if (!supabaseAdmin) break;
      const { error } = await supabaseAdmin.from('ads').upsert({
        id: ad._id.toString(),
        title: ad.title,
        description: ad.description,
        slug: ad.slug,
        user_id: ad.userId,
        package_id: ad.packageId,
        category_id: ad.categoryId,
        city_id: ad.cityId,
        status: ad.status,
        tags: ad.tags,
        is_featured: ad.isFeatured,
        rank_score: ad.rankScore,
        admin_boost: ad.adminBoost,
        verified_seller_points: ad.verifiedSellerPoints,
        rejection_reason: ad.rejectionReason,
        moderator_id: ad.moderatorId,
        moderation_note: ad.moderationNote,
        publish_at: ad.publishAt,
        expire_at: ad.expireAt,
        created_at: ad.createdAt,
        updated_at: ad.updatedAt,
      });
      if (!error) adSuccess++;
    }
    console.log(`   ✓ Synced ${adSuccess}/${ads.length} ads`);

    console.log('\n✅ Sync completed!');
    console.log(`   Users: ${userSuccess}/${users.length}`);
    console.log(`   Categories: ${categorySuccess}/${categories.length}`);
    console.log(`   Cities: ${citySuccess}/${cities.length}`);
    console.log(`   Packages: ${packageSuccess}/${packages.length}`);
    console.log(`   Ads: ${adSuccess}/${ads.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Sync error:', error);
    process.exit(1);
  }
}

syncToSupabase();
