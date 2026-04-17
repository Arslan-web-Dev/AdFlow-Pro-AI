import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { fullSyncToSupabase } from '@/lib/supabase/sync';
import { hasPermission } from '@/lib/auth/rbac';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user has permission to sync database
    if (!hasPermission(payload.role as any, 'canSyncDatabase')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const result = await fullSyncToSupabase();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Full sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
