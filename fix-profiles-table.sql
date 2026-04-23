-- Create profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  avatar TEXT,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts (run individually to avoid errors)
DROP POLICY IF EXISTS "Allow service role full access" ON profiles;
DROP POLICY IF EXISTS "Allow admins to manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Allow select own profile" ON profiles;
DROP POLICY IF EXISTS "Allow update own profile" ON profiles;

-- Create RLS Policies for profiles table
CREATE POLICY "Allow insert for authenticated users" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow select own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Allow service role to bypass RLS for admin operations
CREATE POLICY "Allow service role full access" ON profiles
FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- For admin operations (optional, if you have admin roles)
CREATE POLICY "Allow admins to manage all profiles" ON profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);
