import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug logging for server-side
if (typeof window === 'undefined') {
  console.log('Supabase Env Check:');
  console.log('  URL exists:', !!supabaseUrl);
  console.log('  Anon Key exists:', !!supabaseAnonKey);
  console.log('  Service Key exists:', !!supabaseServiceKey);
}

// Client for browser/client-side use
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin client with service role key for server-side operations
// Throws if env vars are missing to ensure type safety
if (!supabaseUrl || !supabaseServiceKey) {
  if (typeof window === 'undefined') {
    console.error('Missing Supabase environment variables');
  }
}

export const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export default supabase;
