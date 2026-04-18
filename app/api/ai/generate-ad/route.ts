import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title, description, category } = await request.json();

    // This is a mock AI generation - in production, you'd call OpenAI or similar
    const input = title || description || '';
    
    // Generate mock AI response
    const aiResponse = {
      title: title || `Premium ${category || 'Quality'} Item - Like New`,
      description: description || `Discover this amazing ${category || 'item'} that combines quality and value. Perfect for those who demand the best. Contact us today!`,
      tags: [
        category || 'general',
        'quality',
        'value',
        'premium',
        Math.random() > 0.5 ? 'new' : 'used',
      ],
      suggestedPrice: Math.floor(Math.random() * 900) + 100,
    };

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate ad content' },
      { status: 500 }
    );
  }
}
