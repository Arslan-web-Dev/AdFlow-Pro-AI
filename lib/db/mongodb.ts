import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('MONGODB_URI not defined in production. Using Supabase as primary database.');
  } else {
    throw new Error('Please define the MONGODB_URI environment variable for development');
  }
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  // If no MongoDB URI in production, return null to indicate using Supabase
  if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
    console.log('Using Supabase as primary database (MongoDB not configured)');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  // In production without MONGODB_URI, skip MongoDB entirely
  if (process.env.NODE_ENV === 'production' && !MONGODB_URI) {
    return null;
  }

  if (!cached.promise && MONGODB_URI) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    }).catch((err) => {
      console.error('MongoDB connection failed:', err.message);
      cached.promise = null;
      return null;
    });
  }

  try {
    if (cached.promise) {
      cached.conn = await cached.promise;
    }
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    return null;
  }

  return cached.conn;
}

export default connectDB;
