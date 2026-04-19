<!-- cspell:disable -->
# Quick Checklist: Fix Ads Not Showing on Vercel

## Step 1: Test Current Configuration ✓
Visit this URL on your Vercel deployment to check if everything is properly configured:
```
https://your-app.vercel.app/api/debug/connection
```

This will show: ✓ SET or ✗ MISSING for each environment variable

## Step 2: Add Supabase Environment Variables to Vercel

Go to: `https://vercel.com/your-team/adflow-pro-ai/settings/environment-variables`

Add these 3 variables (get values from https://app.supabase.com → Your Project → Settings → API):

| Variable Name | Value Source | Environments |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Public Key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Secret | Production, Preview, Development |

## Step 3: Add Other Required Variables (Optional but Recommended)

| Variable Name | Value |
|---|---|
| `JWT_SECRET` | Generate random value: `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | https://your-vercel-domain.vercel.app |

## Step 4: Redeploy Your Application

After adding env variables to Vercel:

**Option A: Automatic (recommended)**
```bash
git add .
git commit -m "Fix Vercel env vars for Supabase"
git push
# Wait for Vercel to auto-deploy
```

**Option B: Manual Redeploy**
1. Go to Vercel project → Deployments
2. Click menu ⋮ on the latest deployment
3. Select "Redeploy"

## Step 5: Verify Supabase Tables Exist

1. Open https://app.supabase.com → Your Project → SQL Editor
2. Run this query to verify tables:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('ads', 'users');
```

Expected result: Should show `ads` and `users` tables

### If tables don't exist, create them:
```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role VARCHAR(20) DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Create indexes for performance
CREATE INDEX idx_ads_status ON ads(status);
CREATE INDEX idx_ads_category ON ads(category);
CREATE INDEX idx_ads_city ON ads(city);
CREATE INDEX idx_ads_user_id ON ads(user_id);
```

## Step 6: Test Live APIs

After redeployment, test these URLs:

1. **Check Configuration**
   ```
   https://your-app.vercel.app/api/debug/connection
   ```
   Should show: ✓ CONNECTED for Supabase

2. **Fetch Published Ads**
   ```
   https://your-app.vercel.app/api/public/ads?status=published&limit=10
   ```
   Should return ads array (even if empty is OK, but you need data!)

3. **Visit Marketplace**
   ```
   https://your-app.vercel.app/marketplace
   ```
   Should show ads or "No ads found" message (but NOT error)

## Step 7: Seed Sample Data (Optional)

If Supabase tables are empty, add test ads:

1. Connect from your local machine to Supabase:
```bash
npm run seed  # This will insert test ads into MongoDB
```

2. Or manually insert via Supabase SQL Editor:
```sql
INSERT INTO ads (user_id, title, description, slug, category, city, price, status)
VALUES (
  (SELECT id FROM users LIMIT 1),
  'Test Ad',
  'This is a test ad',
  'test-ad-' || NOW()::text,
  'Electronics',
  'New York',
  99.99,
  'published'
);
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Still no ads after redeploy | Check `/api/debug/connection` - all should show ✓ |
| "Database not available" error | Missing environment variables on Vercel |
| "Failed to fetch ads from Supabase" | Check Supabase credentials are correct |
| Ads work locally but not on Vercel | Environment variables not set on Vercel |
| Error accessing /api/debug/connection | File may not be created yet - run `npm run build` locally first |

## For Production (Next.js 16+)

The app uses Next.js 16.2.4 which has some breaking changes:
- Read more: Check `AGENTS.md` for Next.js specific guidance
- Run locally: `npm run dev`  
- Test marketplace: `http://localhost:3000/marketplace`

---

**Still having issues?** 
Check Vercel deployment logs:
1. Go to your Vercel project
2. Click the failing deployment
3. Go to "Logs" tab
4. Search for "Supabase" or "error" to see what went wrong
