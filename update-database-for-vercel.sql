-- Update database schema for Vercel deployment with base64 file storage
-- This script updates the existing tables to store files as base64 data

-- Update budgets table to store file data
ALTER TABLE budgets 
ADD COLUMN IF NOT EXISTS file_data TEXT,
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS file_type VARCHAR(100);

-- Update rules_regulations table to store file data
ALTER TABLE rules_regulations 
ADD COLUMN IF NOT EXISTS file_data TEXT,
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS file_type VARCHAR(100);

-- Update downloads table to store file data
ALTER TABLE downloads 
ADD COLUMN IF NOT EXISTS file_data TEXT,
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS file_type VARCHAR(100);

-- Update latest_updates table to store file data
ALTER TABLE latest_updates 
ADD COLUMN IF NOT EXISTS file_data TEXT,
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS file_type VARCHAR(100);

-- Make file_url and file_name optional since we're using base64 storage
ALTER TABLE budgets 
ALTER COLUMN file_url DROP NOT NULL,
ALTER COLUMN file_name DROP NOT NULL;

ALTER TABLE rules_regulations 
ALTER COLUMN file_url DROP NOT NULL,
ALTER COLUMN file_name DROP NOT NULL;

ALTER TABLE downloads 
ALTER COLUMN file_url DROP NOT NULL,
ALTER COLUMN file_name DROP NOT NULL;

ALTER TABLE latest_updates 
ALTER COLUMN file_url DROP NOT NULL,
ALTER COLUMN file_name DROP NOT NULL;

-- Add comments to explain the new columns
COMMENT ON COLUMN budgets.file_data IS 'Base64 encoded file data for Vercel deployment';
COMMENT ON COLUMN budgets.file_size IS 'File size in bytes';
COMMENT ON COLUMN budgets.file_type IS 'MIME type of the file';

COMMENT ON COLUMN rules_regulations.file_data IS 'Base64 encoded file data for Vercel deployment';
COMMENT ON COLUMN rules_regulations.file_size IS 'File size in bytes';
COMMENT ON COLUMN rules_regulations.file_type IS 'MIME type of the file';

COMMENT ON COLUMN downloads.file_data IS 'Base64 encoded file data for Vercel deployment';
COMMENT ON COLUMN downloads.file_size IS 'File size in bytes';
COMMENT ON COLUMN downloads.file_type IS 'MIME type of the file';

COMMENT ON COLUMN latest_updates.file_data IS 'Base64 encoded file data for Vercel deployment';
COMMENT ON COLUMN latest_updates.file_size IS 'File size in bytes';
COMMENT ON COLUMN latest_updates.file_type IS 'MIME type of the file';

SELECT 'Database schema updated for Vercel deployment with base64 file storage' as status;
