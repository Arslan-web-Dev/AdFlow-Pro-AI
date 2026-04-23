import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createTestAccounts() {
  const testAccounts = [
    {
      email: 'user@adflow.com',
      password: 'User123',
      name: 'Test User',
      role: 'user',
    },
    {
      email: 'admin@adflow.com',
      password: 'Admin123',
      name: 'Test Admin',
      role: 'admin',
    },
  ];

  for (const account of testAccounts) {
    try {
      console.log(`Creating account: ${account.email}`);

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          full_name: account.name,
        },
      });

      if (authError) {
        console.error(`  Auth error for ${account.email}:`, authError.message);
        continue;
      }

      if (!authData.user) {
        console.error(`  No user created for ${account.email}`);
        continue;
      }

      console.log(`  Auth user created: ${authData.user.id}`);

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: account.email,
          full_name: account.name,
          role: account.role,
          is_active: true,
          is_verified: true,
        });

      if (profileError) {
        console.error(`  Profile error for ${account.email}:`, profileError.message);
      } else {
        console.log(`  Profile created successfully`);
      }
    } catch (error: any) {
      console.error(`  Error creating ${account.email}:`, error.message);
    }
  }

  console.log('\nTest accounts creation completed');
}

createTestAccounts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
