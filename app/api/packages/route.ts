import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Package from '@/lib/models/Package';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const packages = await Package.find({ isActive: true }).sort({ price: 1 });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error('Get packages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
