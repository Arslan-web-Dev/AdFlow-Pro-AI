// Moderator pending ads route - redirects to admin functionality
// This role has been merged with admin
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Moderator role merged with admin. Use /api/admin/pending-ads' },
    { status: 301 }
  );
}
