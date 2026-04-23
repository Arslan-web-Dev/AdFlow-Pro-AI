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

async function checkUserProfile() {
  const email = 'user@adflow.com';

  console.log(`Checking profile for: ${email}`);

  // Get auth user
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError.message);
    process.exit(1);
  }

  const authUser = users.find(u => u.email === email);
  if (!authUser) {
    console.error('Auth user not found');
    process.exit(1);
  }

  console.log(`Auth user found: ${authUser.id}`);

  // Check profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (profileError) {
    console.error('Profile error:', profileError.message);
    console.log('Creating profile...');

    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.id,
        email: email,
        full_name: 'Test User',
        role: 'user',
        is_active: true,
        is_verified: true,
      });

    if (insertError) {
      console.error('Profile creation failed:', insertError.message);
    } else {
      console.log('Profile created successfully');
    }
  } else {
    console.log('Profile found:', profile);
  }
}

checkUserProfile()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
