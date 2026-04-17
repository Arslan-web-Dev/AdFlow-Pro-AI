import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import { hasPermission, UserRole } from '@/lib/auth/rbac';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';

// GET /api/users - Get all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to view all users
    if (!hasPermission(user.role as UserRole, 'canManageSystem')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users - Create user (Admin only)
export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to create users
    if (!hasPermission(user.role as UserRole, 'canManageSystem')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, name, role } = body;

    // Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Create user
    const newUser = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      role,
      isActive: true,
      isVerified: true,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          isActive: newUser.isActive,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
