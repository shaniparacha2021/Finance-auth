# Finance Admin Panel

A secure, responsive, and professional Finance Admin Panel built with Next.js, TypeScript, Tailwind CSS, and Supabase. This application provides a complete file management system with GitHub repository storage.

## 🚀 Features

- **Secure Authentication** - Supabase Auth with email/password login
- **File Management** - Upload, download, and manage files directly in GitHub repository
- **CRUD Operations** - Full Create, Read, Update, Delete functionality
- **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- **Modern UI** - Clean design with shadcn/ui components
- **File Storage** - Files stored in GitHub repository (not cloud storage)
- **Database Integration** - Supabase for data management
- **Type Safety** - Full TypeScript support

## 📁 Project Structure

```
finance-admin-panel/
├── app/                          # Next.js App Router
│   ├── api/upload/              # File upload API
│   ├── dashboard/               # Admin dashboard pages
│   └── login/                   # Authentication pages
├── components/                  # Reusable UI components
│   ├── auth/                   # Authentication components
│   ├── budget/                 # Budget management
│   ├── downloads/              # Downloads management
│   ├── latest-updates/         # Updates management
│   ├── rules-regulations/      # Rules management
│   └── ui/                     # shadcn/ui components
├── lib/                        # Utility functions
│   ├── supabase/              # Supabase configuration
│   └── file-upload.ts         # File upload utilities
├── public/uploads/            # File storage directories
│   ├── budget-files/          # Budget documents
│   ├── rules-files/           # Rules & regulations
│   ├── download-files/        # General downloads
│   └── update-files/          # Latest updates
└── *.sql                      # Database setup scripts
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth, Database)
- **File Storage**: GitHub Repository (public/uploads/)
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- GitHub account

### 1. Clone the Repository

```bash
git clone https://github.com/shaniparacha2021/Finance-auth.git
cd Finance-auth
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

Run the SQL scripts in your Supabase SQL Editor:

1. **Create Tables**: `setup-database-only.sql`
2. **Update Schema**: `update-database-schema.sql` (for latest updates)

### 5. Create Admin User

Run in Supabase SQL Editor:

```sql
-- Create admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@finance.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
```

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and login with your admin credentials.

## 📋 Admin Features

### Budget Management
- Create, edit, delete budget entries
- Upload PDF/Word documents
- Organize by financial year
- Files stored in `public/uploads/budget-files/`

### Rules & Regulations
- Manage rules and regulations
- Categorize by type (Rules/Regulations)
- Upload supporting documents
- Files stored in `public/uploads/rules-files/`

### Downloads
- Manage downloadable files
- Organize by year
- Support any file format
- Files stored in `public/uploads/download-files/`

### Latest Updates
- Create updates with heading and description
- Optional file attachments
- Files stored in `public/uploads/update-files/`

## 🔧 File Storage System

Files are stored directly in your GitHub repository:

- **Location**: `public/uploads/[type]/`
- **Access**: Direct URLs like `/uploads/budget-files/filename.pdf`
- **Version Control**: Files tracked in Git
- **Backup**: Automatic with repository
- **Collaboration**: Team can manage files

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**:
   - Push to GitHub
   - Connect repository to Vercel
   - Deploy automatically

2. **Environment Variables**:
   - Add all `.env.local` variables to Vercel
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel domain

3. **Database Configuration**:
   - Update Supabase URL configuration
   - Add Vercel domain to allowed URLs

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 🔐 Security Features

- **Authentication Required** - All routes protected
- **Session Management** - Secure session handling
- **Input Validation** - Form validation and sanitization
- **File Security** - Secure file upload and storage
- **SQL Injection Protection** - Supabase RLS policies
- **XSS Protection** - React built-in protection

## 📱 Responsive Design

- Mobile-first approach
- Responsive sidebar navigation
- Touch-friendly interface
- Optimized for all screen sizes

## 🧪 Testing

Test pages available during development:

- `/test-all-local-storage` - Test all file upload functionality
- `/test-login-credentials` - Test authentication
- `/env-test` - Check environment variables
- `/diagnose` - System diagnostics

## 📝 Database Schema

### Tables

- **budgets** - Financial year budgets
- **rules_regulations** - Rules and regulations
- **downloads** - Downloadable files
- **latest_updates** - Latest updates with heading/description

### File Storage

- Files stored in `public/uploads/` directory
- Database stores only file names and URLs
- No binary data in database
- Fast queries and small database size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 📞 Support

For support, contact: shaniparacha2021@gmail.com

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**