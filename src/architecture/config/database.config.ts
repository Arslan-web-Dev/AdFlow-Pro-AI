import mongoose from 'mongoose';

/**
 * Database Configuration
 * Handles MongoDB connection and configuration
 */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adflow-pro';

interface DatabaseConfig {
  isConnected: boolean;
}

class Database {
  private static instance: Database;
  private config: DatabaseConfig = {
    isConnected: false,
  };

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.config.isConnected) {
      return;
    }

    try {
      await mongoose.connect(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.config.isConnected = true;
      console.log('✅ MongoDB connected successfully');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.config.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.config.isConnected = false;
      console.log('✅ MongoDB disconnected successfully');
    } catch (error) {
      console.error('❌ MongoDB disconnection error:', error);
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.config.isConnected;
  }
}

export default Database;
