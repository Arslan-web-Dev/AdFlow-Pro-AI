import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import { canEditAd, canDeleteAd, hasPermission } from '@/lib/auth/rbac';
import Log from '@/lib/models/Log';
import { syncAdToSupabase } from '@/lib/supabase/sync';
import { transitionAdStatus } from '@/lib/utils/ad-workflow';

// GET single ad by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const ad = await Ad.findById(params.id)
      .populate('userId', 'name email avatar')
      .populate('moderatorId', 'name email');

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Check permission - clients can only view their own ads
    if (payload.role === 'client' && ad.userId.toString() !== payload.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ ad });
  } catch (error) {
    console.error('Get ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update ad
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const ad = await Ad.findById(params.id);
    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Check edit permission
    if (!canEditAd(payload.role as any, ad.userId.toString(), payload.userId)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Can only edit draft or rejected ads
    if (ad.status !== 'draft' && ad.status !== 'rejected') {
      return NextResponse.json(
        { error: 'Can only edit draft or rejected ads' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, imagePrompt, category, tags, budget, startDate, endDate } = body;

    // Update ad
    if (title) ad.title = title;
    if (description) ad.description = description;
    if (imagePrompt) ad.imagePrompt = imagePrompt;
    if (category) ad.category = category;
    if (tags) ad.tags = tags;
    if (budget !== undefined) ad.budget = budget;
    if (startDate) ad.startDate = startDate;
    if (endDate) ad.endDate = endDate;

    await ad.save();

    // Log the update
    await Log.create({
      level: 'info',
      action: 'ad_updated',
      userId: payload.userId,
      adId: ad._id.toString(),
      details: { title: ad.title },
    });

    // Sync to Supabase
    await syncAdToSupabase(ad._id.toString());

    return NextResponse.json({ ad });
  } catch (error) {
    console.error('Update ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE ad
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const ad = await Ad.findById(params.id);
    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Check delete permission
    if (!canDeleteAd(payload.role as any, ad.userId.toString(), payload.userId)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Can only delete draft or rejected ads
    if (ad.status !== 'draft' && ad.status !== 'rejected') {
      return NextResponse.json(
        { error: 'Can only delete draft or rejected ads' },
        { status: 400 }
      );
    }

    await Ad.findByIdAndDelete(params.id);

    // Log the deletion
    await Log.create({
      level: 'info',
      action: 'ad_deleted',
      userId: payload.userId,
      adId: params.id,
      details: { title: ad.title },
    });

    return NextResponse.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error('Delete ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
