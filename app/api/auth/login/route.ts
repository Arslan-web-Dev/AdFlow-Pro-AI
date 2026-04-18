import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/auth/jwt';
import Log from '@/lib/models/Log';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    console.log('[LOGIN] Starting login process...');
    
    const body = await request.json();
    const { email, password } = body;
    console.log('[LOGIN] Received request for email:', email);

    // Validation
    if (!email || !password) {
      console.log('[LOGIN] Validation failed - missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Try MongoDB first (for local development)
    console.log('[LOGIN] Connecting to database...');
    let db;
    try {
      db = await connectDB();
      console.log('[LOGIN] Database connection result:', db ? 'connected' : 'null (using Supabase)');
    } catch (dbError) {
      console.error('[LOGIN] Database connection error:', dbError);
      db = null;
    }
    
    let user;

    if (db) {
      console.log('[LOGIN] Using MongoDB for authentication');
      // Use MongoDB
      try {
        user = await User.findOne({ email });
        console.log('[LOGIN] MongoDB user lookup result:', user ? 'user found' : 'user not found');
      } catch (userLookupError) {
        console.error('[LOGIN] Error looking up user in MongoDB:', userLookupError);
        user = null;
      }
      
      if (user) {
        console.log('[LOGIN] User found in MongoDB, checking if active...');
        // Check if user is active
        if (!user.isActive) {
          console.log('[LOGIN] User account is deactivated');
          return NextResponse.json(
            { error: 'Account is deactivated' },
            { status: 403 }
          );
        }

        console.log('[LOGIN] Verifying password...');
        // Verify password
        let isPasswordValid;
        try {
          isPasswordValid = await (user as any).comparePassword(password);
          console.log('[LOGIN] Password verification result:', isPasswordValid);
        } catch (pwError) {
          console.error('[LOGIN] Password verification error:', pwError);
          return NextResponse.json(
            { error: 'Error verifying password' },
            { status: 500 }
          );
        }
        
        if (!isPasswordValid) {
          console.log('[LOGIN] Invalid password');
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }

        console.log('[LOGIN] Generating JWT token...');
        // Generate JWT token
        let token;
        try {
          token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
          });
          console.log('[LOGIN] Token generated successfully');
        } catch (tokenError) {
          console.error('[LOGIN] Token generation error:', tokenError);
          return NextResponse.json(
            { error: 'Error generating token' },
            { status: 500 }
          );
        }

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
          console.error('[LOGIN] Failed to create log entry:', logError);
        }

        console.log('[LOGIN] Login successful via MongoDB');
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
    console.log('[LOGIN] User not found in MongoDB, trying Supabase...');
    if (!user) {
      if (!supabaseAdmin) {
        console.log('[LOGIN] Supabase admin client is null - database not configured');
        return NextResponse.json(
          { error: 'Database not configured. Please contact administrator.' },
          { status: 500 }
        );
      }

      console.log('[LOGIN] Attempting Supabase authentication...');
      try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          console.log('[LOGIN] Supabase auth error:', authError.message);
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }

        if (!authData.user) {
          console.log('[LOGIN] No user returned from Supabase auth');
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }

        console.log('[LOGIN] Supabase auth successful, fetching user profile...');
        // Get user role from Supabase users table
        const { data: userData, error: userError } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (userError) {
          console.log('[LOGIN] Supabase user lookup error:', userError.message);
          return NextResponse.json(
            { error: 'User profile not found' },
            { status: 401 }
          );
        }

        if (!userData) {
          console.log('[LOGIN] No user data found in Supabase users table');
          return NextResponse.json(
            { error: 'User profile not found' },
            { status: 401 }
          );
        }

        console.log('[LOGIN] Generating token from Supabase user data...');
        // Generate JWT token
        let token;
        try {
          token = generateToken({
            userId: userData.id,
            email: userData.email,
            role: userData.role,
          });
        } catch (tokenError) {
          console.error('[LOGIN] Token generation error:', tokenError);
          return NextResponse.json(
            { error: 'Error generating authentication token' },
            { status: 500 }
          );
        }

        console.log('[LOGIN] Login successful via Supabase');
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
      } catch (supabaseError: any) {
        console.error('[LOGIN] Supabase login error:', supabaseError);
        console.error('[LOGIN] Supabase error details:', supabaseError?.message || supabaseError);
        return NextResponse.json(
          { error: 'Login failed. Please try again.', details: supabaseError?.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('[LOGIN] CRITICAL ERROR in login route:', error);
    console.error('[LOGIN] Error message:', error?.message);
    console.error('[LOGIN] Error stack:', error?.stack);
    console.error('[LOGIN] Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error?.message || String(error),
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined 
      },
      { status: 500 }
    );
  }
}
