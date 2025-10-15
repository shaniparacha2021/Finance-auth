-- Update database schema for GitHub file storage
-- This script adds columns to store GitHub file information

-- Update budgets table to store GitHub file info
ALTER TABLE budgets 
ADD COLUMN IF NOT EXISTS github_file_path TEXT,
ADD COLUMN IF NOT EXISTS github_sha VARCHAR(255),
ADD COLUMN IF NOT EXISTS github_url TEXT;

-- Update rules_regulations table to store GitHub file info
ALTER TABLE rules_regulations 
ADD COLUMN IF NOT EXISTS github_file_path TEXT,
ADD COLUMN IF NOT EXISTS github_sha VARCHAR(255),
ADD COLUMN IF NOT EXISTS github_url TEXT;

-- Update downloads table to store GitHub file info
ALTER TABLE downloads 
ADD COLUMN IF NOT EXISTS github_file_path TEXT,
ADD COLUMN IF NOT EXISTS github_sha VARCHAR(255),
ADD COLUMN IF NOT EXISTS github_url TEXT;

-- Update latest_updates table to store GitHub file info
ALTER TABLE latest_updates 
ADD COLUMN IF NOT EXISTS github_file_path TEXT,
ADD COLUMN IF NOT EXISTS github_sha VARCHAR(255),
ADD COLUMN IF NOT EXISTS github_url TEXT;

-- Add comments to explain the new columns
COMMENT ON COLUMN budgets.github_file_path IS 'Path to file in GitHub repository';
COMMENT ON COLUMN budgets.github_sha IS 'GitHub SHA hash for file operations';
COMMENT ON COLUMN budgets.github_url IS 'GitHub URL to view/edit the file';

COMMENT ON COLUMN rules_regulations.github_file_path IS 'Path to file in GitHub repository';
COMMENT ON COLUMN rules_regulations.github_sha IS 'GitHub SHA hash for file operations';
COMMENT ON COLUMN rules_regulations.github_url IS 'GitHub URL to view/edit the file';

COMMENT ON COLUMN downloads.github_file_path IS 'Path to file in GitHub repository';
COMMENT ON COLUMN downloads.github_sha IS 'GitHub SHA hash for file operations';
COMMENT ON COLUMN downloads.github_url IS 'GitHub URL to view/edit the file';

COMMENT ON COLUMN latest_updates.github_file_path IS 'Path to file in GitHub repository';
COMMENT ON COLUMN latest_updates.github_sha IS 'GitHub SHA hash for file operations';
COMMENT ON COLUMN latest_updates.github_url IS 'GitHub URL to view/edit the file';

SELECT 'Database schema updated for GitHub file storage' as status;
