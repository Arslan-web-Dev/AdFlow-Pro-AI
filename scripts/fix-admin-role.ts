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

async function fixAdminRole() {
  // Update admin account role
  const { error } = await supabase
    .from('profiles')
    .update({ 
      role: 'admin',
      full_name: 'Test Admin'
    })
    .eq('email', 'admin@adflow.com');

  if (error) {
    console.error('❌ Failed to update admin role:', error.message);
    process.exit(1);
  }

  console.log('✅ Admin role updated successfully');

  // Verify the update
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'admin@adflow.com')
    .single();

  console.log('Admin profile:', adminProfile);
}

fixAdminRole()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
