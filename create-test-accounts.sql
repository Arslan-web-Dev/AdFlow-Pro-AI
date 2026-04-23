-- Create test accounts for login/register page testing
-- These accounts are shown on the login/register pages

-- Create test user account
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES 
  (
    gen_random_uuid(),
    'user@adflow.com',
    crypt('User123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test User"}',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'admin@adflow.com',
    crypt('Admin123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test Admin"}',
    NOW(),
    NOW()
  )
ON CONFLICT (email) DO NOTHING;

-- Create corresponding profiles
INSERT INTO profiles (id, email, full_name, role, is_active, is_verified, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 'User'),
  CASE 
    WHEN au.email = 'admin@adflow.com' THEN 'admin'
    ELSE 'user'
  END,
  true,
  true,
  au.created_at,
  au.updated_at
FROM auth.users au
WHERE au.email IN ('user@adflow.com', 'admin@adflow.com')
ON CONFLICT (id) DO NOTHING;

-- Verify the accounts were created
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  p.full_name,
  p.role,
  p.is_active
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email IN ('user@adflow.com', 'admin@adflow.com');
