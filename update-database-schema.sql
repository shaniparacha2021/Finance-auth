-- Update database schema for simplified latest updates
-- Run this in your Supabase SQL Editor

-- Update the latest_updates table to have heading instead of just description
ALTER TABLE latest_updates 
ADD COLUMN IF NOT EXISTS heading VARCHAR(255);

-- Update existing records to use description as heading if heading is null
UPDATE latest_updates 
SET heading = description 
WHERE heading IS NULL;

-- Make heading NOT NULL after updating existing records
ALTER TABLE latest_updates 
ALTER COLUMN heading SET NOT NULL;

-- Add a comment to clarify the structure
COMMENT ON TABLE latest_updates IS 'Latest updates with heading, description, and optional file';
COMMENT ON COLUMN latest_updates.heading IS 'Main heading/title of the update';
COMMENT ON COLUMN latest_updates.description IS 'Detailed description of the update';
COMMENT ON COLUMN latest_updates.file_name IS 'Name of the attached file (optional)';
COMMENT ON COLUMN latest_updates.file_url IS 'URL path to the attached file (optional)';

-- Verify the updated structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'latest_updates' 
ORDER BY ordinal_position;
