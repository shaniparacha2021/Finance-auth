-- Reset password for admin user
-- Run this in your Supabase SQL Editor

-- Method 1: Update the existing user's password
UPDATE auth.users 
SET encrypted_password = crypt('admin123', gen_salt('bf'))
WHERE email = 'admin@finance.com';

-- Method 2: If the above doesn't work, delete and recreate the user
-- Uncomment the lines below if Method 1 fails

-- DELETE FROM auth.users WHERE email = 'admin@finance.com';

-- INSERT INTO auth.users (
--   instance_id,
--   id,
--   aud,
--   role,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   created_at,
--   updated_at
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   gen_random_uuid(),
--   'authenticated',
--   'authenticated',
--   'admin@finance.com',
--   crypt('admin123', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   NOW()
-- );

-- Verify the user exists and is confirmed
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'admin@finance.com';
