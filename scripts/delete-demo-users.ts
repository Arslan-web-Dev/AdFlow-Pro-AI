import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../lib/db/mongodb';
import User from '../lib/models/User';

dotenv.config({ path: '.env.local' });

async function deleteDemoUsers() {
  try {
    console.log('🗑️  Deleting demo users...');
    
    await connectDB();
    console.log('✅ Connected to MongoDB');

    const result = await User.deleteMany({
      email: {
        $in: [
          'demo@adflow.com',
          'superadmin@adflow.com',
          'admin@adflow.com',
          'moderator@adflow.com',
          'client@adflow.com'
        ]
      }
    });

    console.log(`✅ Deleted ${result.deletedCount} demo users`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

deleteDemoUsers();
