-- Migration script to move existing users to profiles table
-- Run this after updating the database schema

-- Insert existing users into profiles (if they don't exist)
INSERT INTO profiles (id, email, full_name, role, is_active, is_verified, created_at, updated_at)
SELECT
  CASE
    WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN id::uuid
    ELSE gen_random_uuid()
  END as id,
  email,
  COALESCE(name, 'User') as full_name,
  COALESCE(role, 'client') as role,
  COALESCE(is_active, true) as is_active,
  COALESCE(is_verified, false) as is_verified,
  COALESCE(created_at, NOW()) as created_at,
  COALESCE(updated_at, NOW()) as updated_at
FROM users
WHERE email NOT IN (SELECT email FROM profiles)
ON CONFLICT (email) DO NOTHING;

-- Optional: Drop old users table after migration
-- DROP TABLE users;