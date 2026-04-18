import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/auth/jwt';
import Log from '@/lib/models/Log';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    // Check if required environment variables are set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: JWT_SECRET not set' },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase environment variables are not set');
      return NextResponse.json(
        { error: 'Server configuration error: Supabase credentials not set' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, password, name, role } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate role (default to client if not specified or invalid)
    const validRoles = ['client', 'moderator', 'admin', 'super_admin'];
    const userRole = validRoles.includes(role) ? role : 'client';

    // Try MongoDB first (for local development)
    const db = await connectDB();

    if (db) {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      // Create new user
      const user = await User.create({
        email,
        password,
        name,
        role: userRole,
      });

      // Generate JWT token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      // Log the registration
      await Log.create({
        level: 'info',
        action: 'user_created',
        userId: user._id.toString(),
        details: { email: user.email, role: user.role },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });

      return NextResponse.json(
        {
          message: 'User registered successfully',
          token,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
        { status: 201 }
      );
    }

    // Fallback to Supabase (for production/Vercel)
    // Check if user already exists in Supabase
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: userRole,
      },
    });

    if (authError) {
      console.error('Supabase Auth error:', authError);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create user in users table
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role: userRole,
        is_active: true,
        is_verified: true,
      });

    if (userError) {
      console.error('Supabase users table error:', userError);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: authData.user.id,
      email: authData.user.email || email,
      role: userRole,
    });

    return NextResponse.json(
      {
        message: 'User registered successfully',
        token,
        user: {
          id: authData.user.id,
          email: authData.user.email || email,
          name,
          role: userRole,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
