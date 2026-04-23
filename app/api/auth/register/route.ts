import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name required' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Check if user exists
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .ilike('email', normalizedEmail)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error('Auth user creation failed:', authError);
      return NextResponse.json({ 
        error: 'Failed to create user',
        details: authError?.message || 'Unknown error'
      }, { status: 500 });
    }

    // Create profile with default role 'user'
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: normalizedEmail,
        full_name: name,
        role: 'user',
        is_active: true,
      })
      .select()
      .single();

    if (profileError || !profile) {
      console.error('Profile creation failed:', profileError);
      return NextResponse.json({ 
        error: 'Failed to create profile',
        details: profileError?.message || 'Unknown error'
      }, { status: 500 });
    }

    const token = generateToken({
      userId: authData.user.id,
      email: normalizedEmail,
      role: 'user',
    });

    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: {
        id: authData.user.id,
        email: normalizedEmail,
        name,
        role: 'user',
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}
