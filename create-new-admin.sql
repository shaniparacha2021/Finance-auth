-- Create a new admin user with different email
-- Run this in your Supabase SQL Editor

-- Delete any existing admin user first
DELETE FROM auth.users WHERE email = 'admin@finance.com';

-- Create new admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@finance.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- Verify the new user
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'admin@finance.com';
