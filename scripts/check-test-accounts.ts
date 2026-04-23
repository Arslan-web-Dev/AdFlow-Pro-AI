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

async function checkTestAccounts() {
  const testEmails = ['user@adflow.com', 'admin@adflow.com'];

  for (const email of testEmails) {
    console.log(`\nChecking: ${email}`);

    // Check auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('  Auth error:', authError.message);
      continue;
    }

    const user = authUser.users.find(u => u.email === email);
    if (!user) {
      console.log('  ❌ Auth user not found');
      continue;
    }

    console.log(`  ✅ Auth user found: ${user.id}`);

    // Check profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.log('  ❌ Profile not found, creating...');
      
      const role = email === 'admin@adflow.com' ? 'admin' : 'user';
      const name = email === 'admin@adflow.com' ? 'Test Admin' : 'Test User';

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: email,
          full_name: name,
          role: role,
          is_active: true,
          is_verified: true,
        });

      if (insertError) {
        console.error('  ❌ Profile creation failed:', insertError.message);
      } else {
        console.log('  ✅ Profile created successfully');
      }
    } else {
      console.log(`  ✅ Profile found: ${profile.full_name}, role: ${profile.role}`);
    }
  }

  console.log('\n✅ Test accounts check completed');
}

checkTestAccounts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
