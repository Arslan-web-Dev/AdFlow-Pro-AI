import { NextRequest, NextResponse } from 'next/server';
import { autoExpireAds } from '@/lib/utils/ad-workflow';

export async function POST(request: NextRequest) {
  try {
    const result = await autoExpireAds();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Expire ads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
