import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { approveAd } from '@/lib/utils/ad-workflow';
import { hasPermission } from '@/lib/auth/rbac';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user has permission to approve ads
    if (!hasPermission(payload.role as any, 'canApproveAds')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const result = await approveAd(params.id, payload.userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ad: result.ad });
  } catch (error) {
    console.error('Approve ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
