-- Create custom admin user
-- Replace the email and password with your preferred credentials

-- Step 1: Replace these values with your preferred credentials
-- Email: your_email@example.com
-- Password: your_secure_password

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
  'your_email@example.com',  -- Replace with your email
  crypt('your_secure_password', gen_salt('bf')),  -- Replace with your password
  NOW(),
  NOW(),
  NOW()
);

-- Step 2: Verify the user was created
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'your_email@example.com';  -- Replace with your email
