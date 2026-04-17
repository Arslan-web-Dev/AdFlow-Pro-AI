import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import LearningQuestion from '@/lib/models/LearningQuestion';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    const difficulty = searchParams.get('difficulty');

    const query: any = { isActive: true };
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;

    const count = await LearningQuestion.countDocuments(query);
    const random = Math.floor(Math.random() * count);

    const question = await LearningQuestion.findOne(query).skip(random);

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Get random question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
