import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../lib/db/mongodb';
import Ad from '../lib/models/Ad';

dotenv.config({ path: '.env.local' });

async function deleteAds() {
  try {
    console.log('🗑️  Deleting all ads...');
    
    await connectDB();
    console.log('✅ Connected to MongoDB');

    const result = await Ad.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} ads`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

deleteAds();
