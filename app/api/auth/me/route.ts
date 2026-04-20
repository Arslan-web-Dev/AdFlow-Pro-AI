import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies (not Authorization header)
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Try MongoDB first
    const db = await connectDB();
    if (db) {
      const user = await User.findById(payload.userId).select('-password');
      if (user) {
        return NextResponse.json(
          {
            user: {
              id: user._id,
              email: user.email,
              name: user.name,
              role: user.role,
              avatar: user.avatar,
              isActive: user.isActive,
              isVerified: user.isVerified,
              createdAt: user.createdAt,
            },
          },
          { status: 200 }
        );
      }
    }

    // Fallback to Supabase
    if (supabaseAdmin) {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', payload.userId)
        .maybeSingle();

      if (profileError) {
        console.error('Supabase profile error:', profileError);
      }

      if (profile) {
        return NextResponse.json(
          {
            user: {
              id: profile.id,
              email: profile.email,
              name: profile.full_name,
              role: profile.role,
              avatar: profile.avatar_url,
              isActive: profile.is_active,
              isVerified: profile.is_verified,
              createdAt: profile.created_at,
            },
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
