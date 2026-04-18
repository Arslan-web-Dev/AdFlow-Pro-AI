import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import bcrypt from 'bcryptjs';

// Demo users to create
const demoUsers = [
  {
    email: 'superadmin@adflow.com',
    password: 'SuperAdmin123!',
    name: 'Super Admin',
    role: 'super_admin',
  },
  {
    email: 'admin@adflow.com',
    password: 'Admin123!',
    name: 'Admin User',
    role: 'admin',
  },
  {
    email: 'moderator@adflow.com',
    password: 'Moderator123!',
    name: 'Moderator User',
    role: 'moderator',
  },
  {
    email: 'client@adflow.com',
    password: 'Client123!',
    name: 'Client User',
    role: 'client',
  },
];

export async function POST(request: NextRequest) {
  try {
    // Check for setup key (simple security)
    const { setupKey } = await request.json();
    if (setupKey !== 'adflow-setup-2024') {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const results = {
      created: [] as string[],
      existing: [] as string[],
      errors: [] as string[],
    };

    for (const userData of demoUsers) {
      try {
        // Check if user exists
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('email')
          .eq('email', userData.email)
          .single();

        if (existingUser) {
          results.existing.push(userData.email);
          continue;
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
        });

        if (authError) {
          results.errors.push(`${userData.email}: ${authError.message}`);
          continue;
        }

        // Insert user into users table
        const { error: dbError } = await supabaseAdmin.from('users').insert({
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          is_active: true,
          is_verified: true,
        });

        if (dbError) {
          results.errors.push(`${userData.email}: ${dbError.message}`);
          continue;
        }

        results.created.push(userData.email);
      } catch (error: any) {
        results.errors.push(`${userData.email}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Setup completed',
      results,
      demoAccounts: demoUsers.map(u => ({ email: u.email, password: u.password, role: u.role })),
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Setup failed', details: error.message },
      { status: 500 }
    );
  }
}
