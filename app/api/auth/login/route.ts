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
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    console.log('[LOGIN] Received request for email:', normalizedEmail);

    // Validation
    if (!normalizedEmail || !password) {
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
        user = await User.findOne({ email: normalizedEmail });
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
          email: normalizedEmail,
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

        const authUser = authData.user;
        const authEmail = authUser.email ? authUser.email.toString().trim().toLowerCase() : normalizedEmail;
        const metadata = authUser.user_metadata || {};

        const { data: existingByEmail, error: emailLookupError } = await supabaseAdmin
          .from('users')
          .select('*')
          .ilike('email', authEmail)
          .limit(1);

        if (emailLookupError) {
          console.warn('[LOGIN] Supabase users table lookup by email error:', emailLookupError);
        }

        let userData = Array.isArray(existingByEmail) && existingByEmail.length > 0 ? existingByEmail[0] : null;

        if (!userData) {
          const { data: existingById, error: idLookupError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .limit(1);

          if (idLookupError) {
            console.warn('[LOGIN] Supabase users table lookup by id error:', idLookupError);
          }

          if (Array.isArray(existingById) && existingById.length > 0) {
            userData = existingById[0];
          }
        }

        if (userData) {
          console.log('[LOGIN] Existing Supabase user profile found, syncing profile fields');
          const updatePayload = {
            email: authEmail,
            name: metadata.name || userData.name || authEmail.split('@')[0] || 'User',
            role: metadata.role || userData.role || 'client',
            is_active: true,
            is_verified: true,
          };

          const { data: updatedUser, error: updateError } = await supabaseAdmin
            .from('users')
            .update(updatePayload)
            .eq('id', userData.id)
            .select()
            .maybeSingle();

          if (updateError) {
            console.warn('[LOGIN] Failed to update existing user profile:', updateError);
          } else if (updatedUser) {
            userData = updatedUser;
          }

          console.log('[LOGIN] User profile synced successfully');
        } else {
          console.log('[LOGIN] No existing Supabase profile found, upserting row');
          const userPayload = {
            id: authUser.id,
            email: authEmail,
            name: metadata.name || authEmail.split('@')[0] || 'User',
            role: metadata.role || 'client',
            is_active: true,
            is_verified: true,
          };

          const { data: newUser, error: upsertError } = await supabaseAdmin
            .from('users')
            .upsert(userPayload, { onConflict: 'email' })
            .select()
            .maybeSingle();

          if (upsertError) {
            console.error('[LOGIN] Failed to upsert user profile:', upsertError);

            const { data: recoveryByEmail, error: recoveryEmailError } = await supabaseAdmin
              .from('users')
              .select('*')
              .ilike('email', authEmail)
              .limit(1);

            if (recoveryEmailError) {
              console.warn('[LOGIN] Failed to recover profile by email:', recoveryEmailError);
            }

            if (Array.isArray(recoveryByEmail) && recoveryByEmail.length > 0) {
              userData = recoveryByEmail[0];
            } else {
              const { data: recoveryById, error: recoveryIdError } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .limit(1);

              if (recoveryIdError) {
                console.warn('[LOGIN] Failed to recover profile by id:', recoveryIdError);
              }

              if (Array.isArray(recoveryById) && recoveryById.length > 0) {
                userData = recoveryById[0];
              }
            }

            if (!userData) {
              console.error('[LOGIN] Failed to recover existing user profile after upsert error');
              return NextResponse.json(
                { error: 'Failed to create user profile' },
                { status: 500 }
              );
            }
          } else if (newUser) {
            userData = newUser;
          } else {
            // If newUser is null but no error, try to find existing profile
            console.warn('[LOGIN] Upsert returned null user, attempting recovery lookup');
            const { data: recoveryByEmail, error: recoveryEmailError } = await supabaseAdmin
              .from('users')
              .select('*')
              .ilike('email', authEmail)
              .limit(1);

            if (!recoveryEmailError && Array.isArray(recoveryByEmail) && recoveryByEmail.length > 0) {
              userData = recoveryByEmail[0];
            }

            if (!userData) {
              console.error('[LOGIN] Failed to recover user profile after null return');
              return NextResponse.json(
                { error: 'Failed to create user profile' },
                { status: 500 }
              );
            }
          }

          console.log('[LOGIN] New user profile upserted successfully');
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
