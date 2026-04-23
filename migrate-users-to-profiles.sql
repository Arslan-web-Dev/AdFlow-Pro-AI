-- Migration script to move existing users to profiles table
-- Run this after updating the database schema

-- First, check which users have corresponding auth users
SELECT
  u.id,
  u.email,
  u.name,
  u.role,
  au.id as auth_user_id,
  au.email as auth_email
FROM users u
LEFT JOIN auth.users au ON u.email = au.email
LIMIT 10;

-- Insert profiles for users that have matching auth users
INSERT INTO profiles (id, email, full_name, role, avatar, is_active, is_verified, created_at, updated_at)
SELECT
  au.id,
  u.email,
  u.name,
  u.avatar,
  u.role,
  u.is_active,
  u.is_verified,
  u.created_at,
  u.updated_at
FROM users u
INNER JOIN auth.users au ON u.email = au.email
ON CONFLICT (id) DO NOTHING;

-- Check how many profiles were created
SELECT COUNT(*) as profiles_created FROM profiles;

-- Check which users don't have auth users (these need manual creation)
SELECT
  u.id,
  u.email,
  u.name
FROM users u
LEFT JOIN auth.users au ON u.email = au.email
WHERE au.id IS NULL;