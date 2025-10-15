# 🚀 GitHub File Storage Setup Instructions

## Overview
This guide will help you set up GitHub file storage for your Finance Admin Panel, allowing files to be saved directly to your GitHub repository instead of just the database.

## ✅ What's Already Implemented

1. **GitHub API Integration** (`/api/github-upload/route.ts`)
   - Uploads files directly to your GitHub repository
   - Stores files in `public/uploads/[bucket]/[filename]` structure
   - Returns GitHub URLs for file access

2. **Updated File Upload System** (`lib/file-upload.ts`)
   - Tries GitHub upload first, falls back to local storage
   - Handles both upload and delete operations

3. **Database Schema Updates** (`update-database-for-github.sql`)
   - Added GitHub file tracking columns
   - Stores file path, SHA, and GitHub URL

4. **Updated Components** (`budget-management-local.tsx`)
   - Now stores GitHub file information in database
   - Enhanced error handling and logging

## 🔧 Setup Steps

### Step 1: Create GitHub Personal Access Token

1. Go to [GitHub.com](https://github.com) → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Finance Admin Panel"
4. Select these scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `public_repo` (Access public repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Update Environment Variables

Add this line to your `.env.local` file:
```bash
GITHUB_TOKEN=your_github_personal_access_token_here
```

### Step 3: Update Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
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
```

### Step 4: Test the System

1. Restart your development server: `npm run dev`
2. Go to: `http://localhost:3000/dashboard/budget`
3. Try uploading a file
4. Check your GitHub repository at: `https://github.com/shaniparacha2021/Finance-auth`

## 📁 Where Files Are Saved

Files will be saved in your GitHub repository at:
```
https://github.com/shaniparacha2021/Finance-auth/tree/main/public/uploads/
├── budget-files/
├── rules-files/
├── download-files/
└── update-files/
```

## 🔗 File Access URLs

Files will be accessible via:
```
https://raw.githubusercontent.com/shaniparacha2021/Finance-auth/main/public/uploads/[bucket]/[filename]
```

## 🚨 Important Notes

1. **GitHub Token Security**: Never commit your GitHub token to the repository
2. **File Size Limits**: GitHub has a 100MB file size limit per file
3. **Repository Access**: Make sure your repository is public or the token has proper access
4. **Fallback System**: If GitHub upload fails, it falls back to the previous base64 storage method

## 🧪 Testing Steps

1. **Add GitHub Token** to `.env.local`
2. **Run Database Update** SQL script
3. **Restart Server**: `npm run dev`
4. **Test Upload**: Try uploading a small file (under 1MB)
5. **Check GitHub**: Verify the file appears in your repository
6. **Check Database**: Verify the GitHub information is stored

## 📋 What Happens When You Upload

1. **File Upload**: File is sent to `/api/github-upload`
2. **GitHub API**: File is uploaded to your GitHub repository
3. **Database Storage**: File metadata is saved in Supabase
4. **File Access**: File is accessible via GitHub raw URL

## 🔧 Troubleshooting

### Common Issues:

1. **"GitHub token not configured"**
   - Make sure `GITHUB_TOKEN` is added to `.env.local`
   - Restart the development server

2. **"Failed to upload to GitHub"**
   - Check if the GitHub token has the correct permissions
   - Verify the repository exists and is accessible
   - Check file size (must be under 100MB)

3. **"Database error"**
   - Run the database schema update SQL script
   - Check if all required columns exist

4. **Files not appearing in GitHub**
   - Check the browser console for error messages
   - Verify the GitHub token is valid
   - Check if the repository is public or token has access

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure the database schema is updated
4. Test with a small file first (under 1MB)

## 🎯 Next Steps After Setup

1. Test file upload functionality
2. Verify files appear in GitHub repository
3. Test file download/access
4. Deploy to Vercel with the same environment variables
5. Test on production environment

---

**Created**: $(date)
**Last Updated**: $(date)
**Status**: Ready for implementation
