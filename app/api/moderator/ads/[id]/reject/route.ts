// Moderator reject route - redirects to admin functionality
// This role has been merged with admin
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: 'Moderator role merged with admin. Use /api/admin/ads/[id]/reject' },
    { status: 301 }
  );
}
