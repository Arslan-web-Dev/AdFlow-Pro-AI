-- Create missing auth users for existing users
-- NOTE: You need to provide actual passwords for these users
-- Replace 'TEMP_PASSWORD' with actual passwords

-- For muhammadarslan.cs.web@gmail.com
-- Run this in Supabase SQL Editor with service role:
-- SELECT * FROM auth.users WHERE email = 'muhammadarslan.cs.web@gmail.com';

-- Manual approach: Use the Supabase Dashboard to create these users
-- Go to Authentication > Users > Add user
-- Or use the Admin API

-- Alternative: Create a script to insert directly into auth.users
-- WARNING: This requires service role and proper password hashing
-- Better to use Supabase Dashboard or API

-- Check the existing users table for more details
SELECT id, email, name, role, is_active, is_verified 
FROM users 
WHERE email IN ('muhammadarslan.cs.web@gmail.com', 'arslan.webdeveloper01@gmail.com');
