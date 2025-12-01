# Supabase Migration Guide

Replace your PHP backend + MySQL with Supabase (PostgreSQL + Auto-generated REST API)

---

## 🎯 What You're Replacing

**Before (Current):**
- PHP Backend API (`/partner-report/api`)
- MySQL Database
- Manual API endpoints
- Hostinger hosting ($2-5/month)

**After (Supabase):**
- ✅ Supabase PostgreSQL Database (FREE)
- ✅ Auto-generated REST API (FREE)
- ✅ Built-in authentication (FREE)
- ✅ Real-time subscriptions (FREE)
- ✅ File storage (FREE up to 1GB)

---

## 📝 Step 1: Create Supabase Project (5 minutes)

### 1.1 Sign Up
1. Go to https://supabase.com
2. Click **Start your project**
3. Sign in with GitHub
4. Click **New Project**

### 1.2 Create Project
- **Name:** `partner-report-db`
- **Database Password:** (Generate strong password - save it!)
- **Region:** Choose closest to your users
- **Pricing Plan:** Free tier (500MB database, 2GB bandwidth)
- Click **Create new project**

Wait 2-3 minutes for database to spin up...

### 1.3 Get Your Credentials
Once ready, go to **Project Settings** → **API**

You'll need:
- ✅ **Project URL:** `https://xxxxx.supabase.co`
- ✅ **Anon Public Key:** `eyJhbGc...` (safe for frontend)
- ✅ **Service Role Key:** `eyJhbGc...` (keep secret!)

---

## 📝 Step 2: Migrate Database Schema (15 minutes)

### 2.1 Export Your Current MySQL Schema

```bash
# From your local machine
cd /Users/michalisphytides/Desktop/partner-report

# Export schema only (structure)
mysqldump -u root -p --no-data partner_report_db > schema.sql

# Export data
mysqldump -u root -p partner_report_db > full_backup.sql
```

### 2.2 Convert MySQL to PostgreSQL

Supabase uses PostgreSQL, not MySQL. Some syntax differences:

**MySQL → PostgreSQL Conversion:**

```sql
-- MySQL: AUTO_INCREMENT
CREATE TABLE partners (
  id INT AUTO_INCREMENT PRIMARY KEY
);

-- PostgreSQL: SERIAL
CREATE TABLE partners (
  id SERIAL PRIMARY KEY
);

-- MySQL: DATETIME
created_at DATETIME DEFAULT CURRENT_TIMESTAMP

-- PostgreSQL: TIMESTAMP
created_at TIMESTAMP DEFAULT NOW()

-- MySQL: backticks
SELECT * FROM `partners`

-- PostgreSQL: double quotes (or no quotes)
SELECT * FROM partners
```

### 2.3 Create Tables in Supabase

**Option A: Use Supabase Table Editor (GUI)**
1. Go to **Table Editor** in Supabase Dashboard
2. Click **New Table**
3. Create each table manually with columns

**Option B: Use SQL Editor (Faster)**
1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Paste your converted PostgreSQL schema
4. Click **Run**

**Example Schema for Partners Table:**

```sql
-- Create partners table
CREATE TABLE partners (
  partner_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  join_date DATE,
  age INTEGER,
  tier VARCHAR(50),
  country_manager VARCHAR(255),
  country_manager_tel VARCHAR(50),
  country_rank INTEGER,
  global_rank INTEGER,
  alternate_accounts TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  current_tier VARCHAR(50),
  three_month_avg_commission DECIMAL(10,2),
  tier_reward_percentage DECIMAL(5,2),
  tier_last_calculated TIMESTAMP,
  tier_status VARCHAR(50),
  previous_tier VARCHAR(50)
);

-- Create indexes for better performance
CREATE INDEX idx_partners_tier ON partners(tier);
CREATE INDEX idx_partners_country_rank ON partners(country_rank);
CREATE INDEX idx_partners_global_rank ON partners(global_rank);

-- Enable Row Level Security (RLS)
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (adjust as needed)
CREATE POLICY "Allow public read access" ON partners
  FOR SELECT USING (true);

-- For insert/update/delete, you'll want authenticated access
CREATE POLICY "Allow authenticated insert" ON partners
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### 2.4 Import Data

**Option A: CSV Import (Easiest)**
1. Export MySQL tables to CSV
2. In Supabase Table Editor, click table → **Insert** → **Import CSV**

**Option B: SQL Insert Statements**
1. Generate INSERT statements from MySQL
2. Run in Supabase SQL Editor

---

## 📝 Step 3: Update Next.js Frontend (10 minutes)

### 3.1 Install Supabase Client

```bash
cd /Users/michalisphytides/Desktop/partner-report-nextjs
npm install @supabase/supabase-js
```

### 3.2 Create Supabase Client

Create `/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3.3 Update Environment Variables

Update `.env.local`:

```bash
# Replace old API URL
# NEXT_PUBLIC_API_URL=http://localhost:8001/api/index.php

# Add Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.4 Update API Calls

**Before (PHP API):**

```typescript
// src/lib/api.ts
export async function getPartners() {
  const response = await fetch('http://localhost:8001/api/index.php?endpoint=partners');
  return response.json();
}
```

**After (Supabase):**

```typescript
// src/lib/api.ts
import { supabase } from './supabase';

export async function getPartners() {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('global_rank', { ascending: true });
  
  if (error) throw error;
  return { success: true, data };
}

export async function getPartner(partnerId: string) {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('partner_id', partnerId)
    .single();
  
  if (error) throw error;
  return { success: true, data };
}

export async function getMetrics(partnerId: string) {
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .eq('partner_id', partnerId);
  
  if (error) throw error;
  return { success: true, data };
}

export async function getCommissions(partnerId: string) {
  const { data, error } = await supabase
    .from('commissions')
    .select('*')
    .eq('partner_id', partnerId)
    .order('date', { ascending: false });
  
  if (error) throw error;
  return { success: true, data };
}
```

---

## 📝 Step 4: Advanced Features (Optional)

### 4.1 Real-time Updates

Subscribe to database changes:

```typescript
// Real-time partner updates
const channel = supabase
  .channel('partner_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'partners'
    },
    (payload) => {
      console.log('Partner updated:', payload);
      // Refresh your UI
    }
  )
  .subscribe();
```

### 4.2 Database Functions (Replace Complex PHP Endpoints)

For complex queries, create PostgreSQL functions:

```sql
-- Create a function to get partner scorecard
CREATE OR REPLACE FUNCTION get_partner_scorecard(p_partner_id VARCHAR)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'partner_id', p.partner_id,
    'total_commissions', COALESCE(SUM(c.amount), 0),
    'total_clients', COUNT(DISTINCT cl.client_id),
    'avg_commission', COALESCE(AVG(c.amount), 0)
  ) INTO result
  FROM partners p
  LEFT JOIN commissions c ON p.partner_id = c.partner_id
  LEFT JOIN clients cl ON p.partner_id = cl.partner_id
  WHERE p.partner_id = p_partner_id
  GROUP BY p.partner_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

Call from Next.js:

```typescript
const { data, error } = await supabase
  .rpc('get_partner_scorecard', { p_partner_id: partnerId });
```

### 4.3 Edge Functions (Replace Complex PHP Logic)

For very complex business logic, use Supabase Edge Functions (TypeScript/Deno):

```bash
# Install Supabase CLI
npm install -g supabase

# Create edge function
supabase functions new calculate-partner-rank

# Deploy
supabase functions deploy calculate-partner-rank
```

---

## 📝 Step 5: Deploy to Vercel (2 minutes)

### 5.1 Add Environment Variables to Vercel

```bash
cd /Users/michalisphytides/Desktop/partner-report-nextjs

# Add Supabase credentials
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Enter: https://xxxxx.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Enter: eyJhbGc...
```

### 5.2 Deploy

```bash
vercel --prod
```

Done! 🎉

---

## 🔒 Security Best Practices

### Enable Row Level Security (RLS)

Supabase uses PostgreSQL's Row Level Security:

```sql
-- Enable RLS on all tables
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read" ON partners
  FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Allow authenticated write" ON partners
  FOR ALL USING (auth.role() = 'authenticated');

-- Partner-specific access (each partner can only see their own data)
CREATE POLICY "Partners can view own data" ON commissions
  FOR SELECT USING (auth.uid()::text = partner_id);
```

---

## 💰 Cost Comparison

| Usage Level | Supabase Free | Supabase Pro | Hostinger |
|-------------|---------------|--------------|-----------|
| Database | 500MB | 8GB | 1GB |
| Bandwidth | 2GB | 50GB | 100GB |
| API Requests | Unlimited | Unlimited | Unlimited |
| **Monthly Cost** | **$0** | **$25** | **$3-5** |

**Recommendation:** Start with Free tier, upgrade to Pro if needed.

---

## 🎯 Migration Checklist

- [ ] Create Supabase project
- [ ] Get API credentials (URL + Anon Key)
- [ ] Export MySQL schema and data
- [ ] Convert MySQL syntax to PostgreSQL
- [ ] Create tables in Supabase
- [ ] Import data to Supabase
- [ ] Install `@supabase/supabase-js` in Next.js
- [ ] Create Supabase client (`src/lib/supabase.ts`)
- [ ] Update environment variables (`.env.local`)
- [ ] Rewrite API calls to use Supabase
- [ ] Test locally
- [ ] Add Supabase env vars to Vercel
- [ ] Deploy to Vercel
- [ ] Enable RLS policies
- [ ] Test production

---

## 🆘 Troubleshooting

### Error: "relation 'partners' does not exist"
- Table name is case-sensitive in PostgreSQL
- Check table exists in Supabase Table Editor
- Run `SELECT * FROM partners` in SQL Editor to verify

### Error: "Row Level Security policy violation"
- You need to create RLS policies
- Or temporarily disable RLS: `ALTER TABLE partners DISABLE ROW LEVEL SECURITY;`

### Error: "Invalid API key"
- Check you're using the Anon key, not Service Role key in frontend
- Verify environment variables are set correctly

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [PostgreSQL to MySQL Conversion](https://wiki.postgresql.org/wiki/Things_to_find_out_about_when_moving_from_MySQL_to_PostgreSQL)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎉 Benefits of Migration

✅ **No PHP hosting needed** - Save $2-5/month  
✅ **Auto-generated API** - No manual endpoint coding  
✅ **Real-time updates** - Built-in websocket support  
✅ **Better developer experience** - TypeScript SDK  
✅ **Scalability** - Auto-scaling infrastructure  
✅ **Built-in auth** - No need to implement authentication  
✅ **PostgreSQL** - More powerful than MySQL  
✅ **Free tier** - Great for development and small projects  

---

**Ready to migrate? Let me know if you need help with any step!**

