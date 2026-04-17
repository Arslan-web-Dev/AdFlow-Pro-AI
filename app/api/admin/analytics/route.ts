import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { hasPermission } from '@/lib/auth/rbac';
import { getAnalyticsSummary } from '@/lib/utils/analytics';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check permission
    if (!hasPermission(payload.role as any, 'canViewAnalytics')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const analytics = await getAnalyticsSummary();

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
