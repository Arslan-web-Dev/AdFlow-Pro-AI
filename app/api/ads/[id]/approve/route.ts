import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import { moveToPaymentPending } from '@/lib/utils/ad-workflow';
import { hasPermission, UserRole } from '@/lib/auth/rbac';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user has permission to approve ads
    if (!hasPermission(payload.role as UserRole, 'canApproveAds')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;
    const result = await moveToPaymentPending(id, payload.userId, payload.role);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ad: result.ad });
  } catch (error) {
    console.error('Approve ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
