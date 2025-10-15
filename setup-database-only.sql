-- Database Setup Only (Skip User Creation)
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
DROP POLICY IF EXISTS "Allow all for authenticated users" ON budgets;
CREATE POLICY "Allow all for authenticated users" ON budgets
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all for authenticated users" ON rules_regulations;
CREATE POLICY "Allow all for authenticated users" ON rules_regulations
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all for authenticated users" ON downloads;
CREATE POLICY "Allow all for authenticated users" ON downloads
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all for authenticated users" ON latest_updates;
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
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to view files" ON storage.objects;
CREATE POLICY "Allow authenticated users to view files" ON storage.objects
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to update files" ON storage.objects;
CREATE POLICY "Allow authenticated users to update files" ON storage.objects
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to delete files" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete files" ON storage.objects
  FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Verify setup
SELECT 'Database setup completed successfully' as status;
SELECT 'Admin user already exists - use admin@finance.com / admin123' as login_info;
