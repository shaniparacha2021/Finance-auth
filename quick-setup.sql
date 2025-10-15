-- Quick Database Setup for Finance Admin Panel
-- Run this in your Supabase SQL Editor

-- 1. Create the main tables
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  financial_year VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  file_url TEXT,
  file_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rules_regulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('Rules', 'Regulations')),
  description TEXT NOT NULL,
  file_url TEXT,
  file_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  description TEXT NOT NULL,
  file_url TEXT,
  file_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS latest_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  file_url TEXT,
  file_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules_regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE latest_updates ENABLE ROW LEVEL SECURITY;

-- 3. Create basic policies (allow all for authenticated users)
CREATE POLICY "Allow all for authenticated users" ON budgets
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON rules_regulations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON downloads
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON latest_updates
  FOR ALL USING (auth.role() = 'authenticated');

-- 4. Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('budget-files', 'budget-files', false),
  ('rules-files', 'rules-files', false),
  ('download-files', 'download-files', false),
  ('update-files', 'update-files', false)
ON CONFLICT (id) DO NOTHING;

-- 5. Create storage policies
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to view files" ON storage.objects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update files" ON storage.objects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete files" ON storage.objects
  FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Create admin user
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

-- 7. Verify setup
SELECT 'Tables created successfully' as status;
SELECT 'Admin user created' as status;
