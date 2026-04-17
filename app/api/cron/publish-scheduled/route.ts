import { NextRequest, NextResponse } from 'next/server';
import { publishScheduledAds } from '@/lib/utils/scheduled-jobs';

export async function POST(request: NextRequest) {
  try {
    const result = await publishScheduledAds();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Publish scheduled ads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
