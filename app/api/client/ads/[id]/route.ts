import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import { hasPermission, UserRole } from '@/lib/auth/rbac';
import { submitAdForReview } from '@/lib/utils/ad-workflow';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...updateData } = body;

    const { id } = await params;
    const ad = await Ad.findById(id);
    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Check ownership
    if (ad.userId.toString() !== payload.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Can only edit draft ads
    if (ad.status !== 'draft' && !hasPermission(payload.role as UserRole, 'canEditOwnAds')) {
      return NextResponse.json({ error: 'Cannot edit published ads' }, { status: 400 });
    }

    // Update ad
    Object.assign(ad, updateData);
    await ad.save();

    // If action is submit, submit for review
    if (action === 'submit') {
      await submitAdForReview(id, payload.userId, payload.role);
    }

    return NextResponse.json({ success: true, ad });
  } catch (error) {
    console.error('Update ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    const ad = await Ad.findById(id);
    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Check ownership or admin permission
    if (ad.userId.toString() !== payload.userId && !hasPermission(payload.role as UserRole, 'canDeleteOwnAds')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await Ad.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
