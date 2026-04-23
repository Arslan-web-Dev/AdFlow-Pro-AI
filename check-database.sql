-- Check if profiles table exists and has correct structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check RLS status on profiles table
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Check existing RLS policies on profiles table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Check if users table exists and has data
SELECT COUNT(*) as user_count FROM users;

-- Check if profiles table has data
SELECT COUNT(*) as profile_count FROM profiles;
