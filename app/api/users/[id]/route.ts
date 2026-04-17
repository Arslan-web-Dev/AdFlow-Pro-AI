import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import { hasPermission, UserRole } from '@/lib/auth/rbac';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';

// GET /api/users/[id] - Get user by ID (Admin only)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to view users
    if (!hasPermission(user.role as UserRole, 'canManageSystem')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const targetUser = await User.findById(params.id).select('-password');
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: targetUser });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PATCH /api/users/[id] - Update user (Admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to update users
    if (!hasPermission(user.role as UserRole, 'canManageSystem')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, role, isActive } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedUser = await User.findByIdAndUpdate(params.id, updateData, { new: true }).select('-password');
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Delete user (Admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to delete users
    if (!hasPermission(user.role as UserRole, 'canManageSystem')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const deletedUser = await User.findByIdAndDelete(params.id);
    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
