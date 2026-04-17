import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import Log from '@/lib/models/Log';
import connectDB from '@/lib/db/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    
    if (token) {
      const payload = verifyToken(token);
      
      if (payload) {
        // Log the logout
        await Log.create({
          level: 'info',
          action: 'logout',
          userId: payload.userId,
          details: { email: payload.email },
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        });
      }
    }

    // Clear token cookie
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    response.cookies.delete('token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
