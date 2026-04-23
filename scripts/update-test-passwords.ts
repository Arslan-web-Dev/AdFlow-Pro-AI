import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

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

async function updatePasswords() {
  const accounts = [
    { email: 'user@adflow.com', newPassword: 'User123@' },
    { email: 'admin@adflow.com', newPassword: 'Admin123@' },
  ];

  for (const account of accounts) {
    try {
      console.log(`Updating password for: ${account.email}`);

      // Get user by email
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error(`  Error listing users:`, listError.message);
        continue;
      }

      const user = users.find(u => u.email === account.email);
      if (!user) {
        console.error(`  User not found`);
        continue;
      }

      console.log(`  User found: ${user.id}`);

      // Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        password: account.newPassword,
      });

      if (updateError) {
        console.error(`  ❌ Password update failed:`, updateError.message);
      } else {
        console.log(`  ✅ Password updated successfully`);
      }
    } catch (error: any) {
      console.error(`  Error:`, error.message);
    }
  }

  console.log('\n✅ Password update completed');
}

updatePasswords()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
