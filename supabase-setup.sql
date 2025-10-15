-- Create tables for Finance Admin Panel

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  financial_year VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  file_url TEXT,
  file_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rules and Regulations table
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

-- Downloads table
CREATE TABLE IF NOT EXISTS downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  description TEXT NOT NULL,
  file_url TEXT,
  file_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Latest Updates table
CREATE TABLE IF NOT EXISTS latest_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  file_url TEXT,
  file_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules_regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE latest_updates ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users only
CREATE POLICY "Only authenticated users can view budgets" ON budgets
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can insert budgets" ON budgets
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update budgets" ON budgets
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete budgets" ON budgets
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can view rules_regulations" ON rules_regulations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can insert rules_regulations" ON rules_regulations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update rules_regulations" ON rules_regulations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete rules_regulations" ON rules_regulations
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can view downloads" ON downloads
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can insert downloads" ON downloads
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update downloads" ON downloads
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete downloads" ON downloads
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can view latest_updates" ON latest_updates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can insert latest_updates" ON latest_updates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update latest_updates" ON latest_updates
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete latest_updates" ON latest_updates
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('budget-files', 'budget-files', false),
  ('rules-files', 'rules-files', false),
  ('download-files', 'download-files', false),
  ('update-files', 'update-files', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Only authenticated users can upload budget files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'budget-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can view budget files" ON storage.objects
  FOR SELECT USING (bucket_id = 'budget-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update budget files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'budget-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete budget files" ON storage.objects
  FOR DELETE USING (bucket_id = 'budget-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can upload rules files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'rules-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can view rules files" ON storage.objects
  FOR SELECT USING (bucket_id = 'rules-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update rules files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'rules-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete rules files" ON storage.objects
  FOR DELETE USING (bucket_id = 'rules-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can upload download files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'download-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can view download files" ON storage.objects
  FOR SELECT USING (bucket_id = 'download-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update download files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'download-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete download files" ON storage.objects
  FOR DELETE USING (bucket_id = 'download-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can upload update files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'update-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can view update files" ON storage.objects
  FOR SELECT USING (bucket_id = 'update-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update update files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'update-files' AND auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete update files" ON storage.objects
  FOR DELETE USING (bucket_id = 'update-files' AND auth.role() = 'authenticated');
