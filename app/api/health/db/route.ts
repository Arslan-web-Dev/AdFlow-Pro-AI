import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import SystemHealthLog from '@/lib/models/SystemHealthLog';

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();

    // Test MongoDB connection
    await connectDB();

    const responseTime = Date.now() - startTime;

    // Log the health check
    await SystemHealthLog.create({
      source: 'mongodb',
      responseMs: responseTime,
      status: 'healthy',
      checkedAt: new Date(),
    });

    return NextResponse.json({
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('DB health check error:', error);

    // Log the failure
    await SystemHealthLog.create({
      source: 'mongodb',
      status: 'down',
      errorMessage: (error as Error).message,
      checkedAt: new Date(),
    });

    return NextResponse.json({
      status: 'down',
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
