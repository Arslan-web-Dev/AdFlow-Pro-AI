import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import { logActivity } from '@/lib/models/ActivityLog';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Only moderators and admins can reject
    if (payload.role !== 'moderator' && payload.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { reason } = await request.json();

    const ad = await Ad.findById(id);
    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Update ad status
    ad.status = 'rejected';
    ad.moderatedBy = payload.userId;
    ad.moderatedAt = new Date();
    ad.rejectionReason = reason || 'Content does not meet our guidelines';
    await ad.save();

    // Log the activity
    await logActivity({
      type: 'ad_rejected',
      description: `Ad "${ad.title}" rejected by moderator`,
      userId: ad.userId,
      adId: ad._id.toString(),
      performedBy: payload.userId,
      metadata: { title: ad.title, reason: ad.rejectionReason },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Ad rejected',
      ad: {
        _id: ad._id,
        title: ad.title,
        status: ad.status,
        rejectionReason: ad.rejectionReason,
      }
    });
  } catch (error) {
    console.error('Reject ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
