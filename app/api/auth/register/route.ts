import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/auth/jwt';
import { logActivity } from '@/lib/models/ActivityLog';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    // Validation
    if (!normalizedEmail || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate role (default to client if not specified or invalid)
    const validRoles = ['client', 'moderator', 'admin'];
    const userRole = validRoles.includes(role) ? role : 'client';

    // Try MongoDB first (for local development)
    const db = await connectDB();

    if (db) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      // Create new user
      const user = await User.create({
        email: normalizedEmail,
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
      await logActivity({
        type: 'user_registered',
        description: `New user registered: ${email}`,
        userId: user._id.toString(),
        performedBy: user._id.toString(),
        metadata: { email, role: user.role },
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
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Check if user already exists in Supabase Auth (this is the real check)
    let userExists = false;
    if (typeof supabaseAdmin.auth.admin.getUserByEmail === 'function') {
      const { data: existingAuthUser, error: existingAuthUserError } = await supabaseAdmin.auth.admin.getUserByEmail(normalizedEmail);
      if (existingAuthUserError) {
        console.warn('Supabase auth getUserByEmail error:', existingAuthUserError);
      }
      userExists = !!existingAuthUser?.user;
    } else {
      const { data: existingAuthUsers, error: existingAuthUsersError } = await supabaseAdmin.auth.admin.listUsers();
      if (existingAuthUsersError) {
        console.warn('Supabase auth listUsers error:', existingAuthUsersError);
      }
      userExists = !!existingAuthUsers?.users?.find(
        u => typeof u.email === 'string' && u.email.toLowerCase() === normalizedEmail
      );
    }

    if (userExists) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Also ensure the email is not already present in the Supabase users table
    const { data: existingUserRows, error: existingUserRowsError } = await supabaseAdmin
      .from('users')
      .select('id')
      .ilike('email', normalizedEmail)
      .limit(1);

    if (existingUserRowsError) {
      console.warn('Supabase users table lookup error:', existingUserRowsError);
    }

    if (Array.isArray(existingUserRows) && existingUserRows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
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

    if (!authData?.user?.id) {
      console.error('Supabase Auth returned invalid user id:', authData);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    const userPayload = {
      id: authData.user.id,
      email: normalizedEmail,
      name,
      role: userRole,
      is_active: true,
      is_verified: true,
    };

    const { data: insertedUser, error: userError } = await supabaseAdmin
      .from('users')
      .upsert(userPayload, { onConflict: 'email' })
      .select()
      .maybeSingle();

    if (userError) {
      console.error('Supabase users table error:', userError);
      if (userError.message?.toLowerCase().includes('duplicate') || userError.code === '23505') {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    if (!insertedUser) {
      console.error('Supabase users table returned no profile row after upsert for:', normalizedEmail);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: authData.user.id,
      email: authData.user.email || normalizedEmail,
      role: userRole,
    });

    return NextResponse.json(
      {
        message: 'User registered successfully',
        token,
        user: {
          id: authData.user.id,
          email: authData.user.email || normalizedEmail,
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
