import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/auth/jwt';
import Log from '@/lib/models/Log';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Try MongoDB first (for local development)
    const db = await connectDB();
    let user;

    if (db) {
      // Use MongoDB
      user = await User.findOne({ email });
      if (user) {
        // Check if user is active
        if (!user.isActive) {
          return NextResponse.json(
            { error: 'Account is deactivated' },
            { status: 403 }
          );
        }

        // Verify password
        const isPasswordValid = await (user as any).comparePassword(password);
        if (!isPasswordValid) {
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }

        // Generate JWT token
        const token = generateToken({
          userId: user._id.toString(),
          email: user.email,
          role: user.role,
        });

        // Log the login (optional - don't fail if MongoDB is not available)
        try {
          await Log.create({
            level: 'info',
            action: 'login',
            userId: user._id.toString(),
            details: { email: user.email },
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
          });
        } catch (logError) {
          // Log error but don't fail the login
          console.error('Failed to create log entry:', logError);
        }

        // Return token in response body
        const response = NextResponse.json(
          {
            success: true,
            message: 'Login successful',
            token,
            user: {
              id: user._id,
              email: user.email,
              name: user.name,
              role: user.role,
              avatar: user.avatar,
            },
          },
          { status: 200 }
        );

        response.cookies.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }
    }

    // Fallback to Supabase (for production/Vercel)
    if (!user) {
      if (!supabaseAdmin) {
        return NextResponse.json(
          { error: 'Database not configured. Please contact administrator.' },
          { status: 500 }
        );
      }

      try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
          email,
          password,
        });

        if (authError || !authData.user) {
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }

        // Get user role from Supabase users table
        const { data: userData, error: userError } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (userError || !userData) {
          return NextResponse.json(
            { error: 'User profile not found' },
            { status: 401 }
          );
        }

        // Generate JWT token
        const token = generateToken({
          userId: userData.id,
          email: userData.email,
          role: userData.role,
        });

        const response = NextResponse.json(
          {
            success: true,
            message: 'Login successful',
            token,
            user: {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              avatar: userData.avatar,
            },
          },
          { status: 200 }
        );

        response.cookies.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      } catch (supabaseError) {
        console.error('Supabase login error:', supabaseError);
        return NextResponse.json(
          { error: 'Login failed. Please try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    );
  }
}
