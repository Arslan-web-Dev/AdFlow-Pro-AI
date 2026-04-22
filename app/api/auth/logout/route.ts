import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (token && supabaseAdmin) {
      const payload = verifyToken(token);
      
      if (payload) {
        // Log the logout
        await supabaseAdmin.from('logs').insert({
          level: 'info',
          action: 'logout',
          user_id: payload.userId,
          details: { email: payload.email },
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown',
        });
      }
    }

    // Clear token cookie
    const response = NextResponse.json({ message: 'Logout successful' });
    response.cookies.delete('token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
