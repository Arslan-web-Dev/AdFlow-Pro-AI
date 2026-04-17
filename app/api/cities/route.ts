import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import City from '@/lib/models/City';
import { hasPermission } from '@/lib/auth/rbac';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const cities = await City.find({ isActive: true }).sort({ name: 1 });

    return NextResponse.json({ cities });
  } catch (error) {
    console.error('Get cities error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check permission
    if (!hasPermission(payload.role as any, 'canManageSystem')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { name, slug, country } = body;

    const city = await City.create({
      name,
      slug,
      country,
      isActive: true,
    });

    return NextResponse.json({ success: true, city });
  } catch (error) {
    console.error('Create city error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
