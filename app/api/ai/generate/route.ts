import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { createAIGeneratedAd, getAdSuggestions } from '@/lib/ai/ad-generator';

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

    const body = await request.json();
    const { topic, category, action } = body;

    if (action === 'suggestions') {
      const result = await getAdSuggestions(category || topic);
      return NextResponse.json(result);
    }

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const result = await createAIGeneratedAd(payload.userId, topic);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI generation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
