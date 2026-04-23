-- Drop all existing policies first
DROP POLICY IF EXISTS "Allow admins to manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow service role full access" ON profiles;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Allow select own profile" ON profiles;
DROP POLICY IF EXISTS "Allow update own profile" ON profiles;

-- Create service role policy (bypasses RLS for admin operations)
CREATE POLICY "Allow service role full access" ON profiles
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Create basic policies for user operations
CREATE POLICY "Allow insert for authenticated users" ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow select own profile" ON profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Allow update own profile" ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE tablename = 'profiles';
