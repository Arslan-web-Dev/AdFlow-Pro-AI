import dotenv from 'dotenv';
import { supabaseAdmin } from '../lib/supabase/client';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function createSupabaseUsers() {
  try {
    console.log('🚀 Creating demo users in Supabase Auth...');

    const demoUsers = [
      { email: 'superadmin@adflow.com', password: 'SuperAdmin123', name: 'Super Admin', role: 'super_admin' },
      { email: 'admin@adflow.com', password: 'Admin123', name: 'Admin User', role: 'admin' },
      { email: 'moderator@adflow.com', password: 'Moderator123', name: 'Moderator User', role: 'moderator' },
      { email: 'client@adflow.com', password: 'Client123', name: 'Client User', role: 'client' },
    ];

    for (const demoUser of demoUsers) {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: demoUser.email,
        password: demoUser.password,
        email_confirm: true,
        user_metadata: {
          name: demoUser.name,
          role: demoUser.role,
        },
      });

      if (authError) {
        console.log(`  ✗ Failed to create ${demoUser.email} in Auth: ${authError.message}`);
        // Check if user already exists
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
        const userExists = existingUser.users.find(u => u.email === demoUser.email);
        
        if (userExists) {
          console.log(`  ℹ User already exists in Auth: ${demoUser.email}`);
          // Update user in users table with correct Auth user ID
          const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({
              id: userExists.id,
              name: demoUser.name,
              role: demoUser.role,
              is_active: true,
              is_verified: true,
            })
            .eq('email', demoUser.email);
          
          if (updateError) {
            console.log(`  ✗ Failed to update users table: ${updateError.message}`);
          } else {
            console.log(`  ✓ Updated users table for: ${demoUser.email}`);
          }
        }
        continue;
      }

      console.log(`  ✓ Created Auth user: ${demoUser.email}`);

      // Update user in users table (use upsert to handle existing users)
      const { error: userError } = await supabaseAdmin
        .from('users')
        .upsert({
          id: authData.user.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          is_active: true,
          is_verified: true,
        }, {
          onConflict: 'email'
        });

      if (userError) {
        console.log(`  ✗ Failed to update users table: ${userError.message}`);
      } else {
        console.log(`  ✓ Updated users table for: ${demoUser.email}`);
      }
    }

    console.log('\n✅ Supabase users created successfully!');
    console.log('\n📝 Demo Credentials:');
    console.log('   Super Admin: superadmin@adflow.com / SuperAdmin123');
    console.log('   Admin: admin@adflow.com / Admin123');
    console.log('   Moderator: moderator@adflow.com / Moderator123');
    console.log('   Client: client@adflow.com / Client123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating Supabase users:', error);
    process.exit(1);
  }
}

createSupabaseUsers();
