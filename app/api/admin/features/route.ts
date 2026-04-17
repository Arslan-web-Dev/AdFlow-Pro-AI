import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { getFeatureToggles, updateFeatureToggle } from '@/lib/utils/feature-toggles';
import { hasPermission } from '@/lib/auth/rbac';

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

    // Check if user has permission to manage features
    if (!hasPermission(payload.role as any, 'canManageFeatures')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const toggles = await getFeatureToggles();

    return NextResponse.json({ toggles });
  } catch (error) {
    console.error('Get feature toggles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user has permission to manage features
    if (!hasPermission(payload.role as any, 'canManageFeatures')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { toggleId, enabled } = body;

    if (!toggleId || typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const result = await updateFeatureToggle(toggleId, enabled);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const toggles = await getFeatureToggles();

    return NextResponse.json({ toggles });
  } catch (error) {
    console.error('Update feature toggle error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
