<!-- cspell:disable -->
# Vercel Deployment Guide - Fixing Ads Not Showing

## Problem Summary
- ✅ Ads show locally with MongoDB
- ❌ Ads don't show on Vercel 
- **Root Cause**: Missing or misconfigured Supabase environment variables on Vercel

## Required Environment Variables for Vercel

Add these to your Vercel project settings at: `https://vercel.com/projects/[YOUR_PROJECT]/settings/environment-variables`

### 1. **Supabase Configuration (Required for Production)**
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key-here
```

### 2. **JWT Authentication**
```
JWT_SECRET = your-secret-key-here-change-this-in-production
```

### 3. **App Configuration**
```
NEXT_PUBLIC_APP_URL = https://your-vercel-domain.vercel.app
NODE_ENV = production
```

### 4. **Optional - OpenAI Integration**
```
OPENAI_API_KEY = your-openai-api-key
```

## How to Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Secret** → `SUPABASE_SERVICE_ROLE_KEY`

## How to Add Environment Variables to Vercel

1. Open your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter each variable from above:
   - Name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Value (e.g., your actual Supabase URL)
   - Select environments: **Production**, **Preview**, **Development**
5. Click **Save**
6. **Important**: Redeploy after adding variables (`npm run build && npm run start`)

## Verify Supabase Tables Exist

Your Supabase database needs these tables:

1. **ads** table with columns:
   - `id` (uuid, primary key)
   - `user_id` (uuid, foreign key to users)
   - `title` (text, required)
   - `description` (text, required)
   - `category` (text)
   - `city` (text)
   - `price` (numeric)
   - `currency` (varchar)
   - `status` (varchar: draft, pending, approved, rejected, published, expired)
   - `priority` (varchar: basic, standard, premium)
   - `tags` (jsonb, array)
   - `media` (jsonb, array of {url, type, order})
   - `views` (numeric)
   - `clicks` (numeric)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

2. **users** table with columns:
   - `id` (uuid, primary key)
   - `email` (text, unique)
   - `name` (text)
   - `role` (varchar: client, moderator, admin)
   - `created_at` (timestamp)

## Troubleshooting Steps

### Step 1: Check Logs on Vercel
1. Go to your Vercel project → **Deployments**
2. Click on the latest deployment
3. Go to **Logs** and search for "Supabase"
4. Look for errors like:
   - "NEXT_PUBLIC_SUPABASE_URL: MISSING"
   - "SUPABASE_SERVICE_ROLE_KEY: MISSING"

### Step 2: Testing Locally with Supabase
Create a `.env.local` file with Supabase variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Then test:
```bash
npm run dev
# Try accessing /api/public/ads in browser or Postman
```

### Step 3: Verify Database Connection
Add this temporary debugging endpoint to check connectivity:

```typescript
// app/api/debug/supabase.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET() {
  return NextResponse.json({
    supabaseAdminExists: !!supabaseAdmin,
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    nodeEnv: process.env.NODE_ENV,
  });
}
```

Visit: `https://your-app.vercel.app/api/debug/supabase` to verify configuration.

### Step 4: Check Supabase Table Permissions
1. Go to Supabase Dashboard → **SQL Editor**
2. Run:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```
3. Verify `ads` table exists
4. Check row-level security (RLS) policies - should allow service role to access data

### Step 5: Rebuild and Redeploy
```bash
# In your project
git add .
git commit -m "Fix environment variables for Vercel"
git push
# Wait for Vercel to auto-deploy or manually redeploy
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Supabase not configured" error | Add all 3 Supabase env vars to Vercel |
| Ads return empty array | Check if ads table has `status='published'` records |
| "Table 'ads' doesn't exist" error | Create tables in Supabase (see SQL scripts in repo) |
| CORS errors on frontend | Already handled in vercel.json headers |
| Ads work locally but not on Vercel | Missing environment variables on Vercel (most common) |

## Database Schema Setup (if needed)

Run these SQL queries in Supabase SQL Editor to create tables:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role VARCHAR(20) DEFAULT 'client',
  avatar TEXT,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ads table
CREATE TABLE ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  city TEXT,
  price NUMERIC,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'draft',
  priority VARCHAR(20) DEFAULT 'basic',
  tags JSONB DEFAULT '[]'::jsonb,
  media JSONB DEFAULT '[]'::jsonb,
  views NUMERIC DEFAULT 0,
  clicks NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_ads_status ON ads(status);
CREATE INDEX idx_ads_category ON ads(category);
CREATE INDEX idx_ads_city ON ads(city);
CREATE INDEX idx_ads_user_id ON ads(user_id);
```

## After Deployment

1. ✅ Ads should now appear on marketplace/homepage
2. ✅ Check Vercel logs for "Supabase result - ads found: X"
3. ✅ Test creating a new ad and verify it shows on published list
4. ✅ Monitor Vercel analytics for any errors

---

**Need help?** Check the Vercel logs and share the error messages from `/api/public/ads` endpoint.
