# Complete Supabase Setup Guide

## 🎯 Overview

This guide will help you set up **ALL** tables and cubes in Supabase for your Partner Report Dashboard.

### What's Included:
- ✅ 16 Core Tables (partners, clients, commissions, etc.)
- ✅ 15 Cube Tables (analytics/pre-aggregated data)
- ✅ All indexes for performance
- ✅ Row Level Security policies
- ✅ PostgreSQL functions for complex queries
- ✅ Sample tier configuration data

---

## 📋 Pre-Flight Checklist

Before starting, make sure you have:

- [ ] Supabase account created at https://supabase.com
- [ ] Supabase project created
- [ ] Project URL and Anon Key from Supabase Dashboard
- [ ] Environment variables set in `.env.local`
- [ ] Backup of your current database (if migrating from MySQL)

---

## Step 1: Create Supabase Project (5 minutes)

### 1.1 Sign Up & Create Project

1. Go to https://supabase.com
2. Click **Start your project**
3. Sign in with GitHub
4. Click **New Project**

### 1.2 Project Configuration

- **Name:** `partner-report-db`
- **Database Password:** Generate strong password (SAVE IT!)
- **Region:** Choose closest to your users
- **Pricing Plan:** Free tier (500MB database, 2GB bandwidth/month)

Click **Create new project** and wait 2-3 minutes...

### 1.3 Get Your Credentials

Once ready:
1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values:

```bash
Project URL: https://xxxxx.supabase.co
Anon public key: eyJhbGc...
```

---

## Step 2: Set Environment Variables (2 minutes)

Update your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Keep old API URL for reference
# NEXT_PUBLIC_API_URL=http://localhost:8001/api/index.php
```

**Important:** Restart your Next.js dev server after updating environment variables!

```bash
# Stop the server (Ctrl+C), then restart:
npm run dev
```

---

## Step 3: Run Complete Schema Migration (10 minutes)

### 3.1 Open Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### 3.2 Run the Complete Schema

Copy the entire contents of `supabase_complete_schema.sql` and paste into the SQL editor.

This file includes:
- All 16 core tables
- All 15 cube tables
- All indexes
- All RLS policies
- PostgreSQL functions
- Sample tier data

Click **Run** (or press Cmd/Ctrl + Enter)

You should see: `Success. No rows returned`

### 3.3 Verify Tables Were Created

In the SQL Editor, run:

```sql
-- Check core tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name NOT LIKE 'cube_%'
ORDER BY table_name;

-- Check cube tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name LIKE 'cube_%'
ORDER BY table_name;
```

You should see:

**Core Tables (16):**
1. affiliate_tips
2. badges
3. client_metrics
4. clients
5. commissions
6. country_stats
7. deposits
8. monthly_commissions
9. partner_badges
10. partner_insights
11. partner_links
12. partner_monthly_commissions
13. partner_recommendations
14. partner_tier_config
15. partner_tiers
16. partners
17. trades

**Cube Tables (15):**
1. cube_badge_progress
2. cube_client_demographics
3. cube_client_tiers
4. cube_commissions_product
5. cube_commissions_symbol
6. cube_country_performance
7. cube_daily_commissions_plan
8. cube_daily_commissions_platform
9. cube_daily_funding
10. cube_daily_signups
11. cube_daily_trends
12. cube_monthly_deposits
13. cube_partner_dashboard
14. cube_partner_scorecard
15. cube_product_volume

---

## Step 4: Verify Table Structure (Optional)

Check a few key tables to ensure they're set up correctly:

```sql
-- Verify partners table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'partners'
ORDER BY ordinal_position;

-- Verify cube_daily_trends
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'cube_daily_trends'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('partners', 'clients', 'cube_daily_trends');
```

All tables should have `rowsecurity = true`.

---

## Step 5: Import Your Data (if migrating from MySQL)

### Option A: CSV Import (Recommended for < 10K rows)

1. Export data from MySQL to CSV:

```bash
# Export partners
mysql -u root -p partner_report_db -e "SELECT * FROM partners" > partners.csv

# Export clients
mysql -u root -p partner_report_db -e "SELECT * FROM clients" > clients.csv

# ... repeat for other tables
```

2. In Supabase Dashboard:
   - Go to **Table Editor**
   - Select the table (e.g., `partners`)
   - Click **Insert** → **Import from CSV**
   - Upload your CSV file

### Option B: SQL Insert Statements (Better for large datasets)

1. Generate INSERT statements from MySQL:

```bash
mysqldump -u root -p partner_report_db partners clients commissions deposits trades > data.sql
```

2. Convert MySQL syntax to PostgreSQL:
   - Replace backticks with nothing: `` `partners` `` → `partners`
   - Replace `0000-00-00` dates with NULL
   - Replace `\'` with `''` for string escaping

3. Run the converted SQL in Supabase SQL Editor

### Option C: Use a Migration Tool

For larger databases, consider using:
- **pgloader** - Automatic MySQL to PostgreSQL migration
- **dbeaver** - GUI-based data migration

---

## Step 6: Populate Cube Tables with Aggregated Data

The cube tables need to be populated from your core tables. Here are example queries:

### 6.1 Populate cube_partner_dashboard

```sql
INSERT INTO cube_partner_dashboard (partner_id, total_clients, active_clients, total_deposits, total_commissions, total_volume, mtd_commissions, mtd_clients)
SELECT 
  p.partner_id,
  COUNT(DISTINCT c.client_id) as total_clients,
  COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.client_id END) as active_clients,
  COALESCE(SUM(d.amount), 0) as total_deposits,
  COALESCE(SUM(com.amount), 0) as total_commissions,
  COALESCE(SUM(t.volume), 0) as total_volume,
  COALESCE(SUM(CASE WHEN com.date >= DATE_TRUNC('month', CURRENT_DATE) THEN com.amount ELSE 0 END), 0) as mtd_commissions,
  COUNT(DISTINCT CASE WHEN c.signup_date >= DATE_TRUNC('month', CURRENT_DATE) THEN c.client_id END) as mtd_clients
FROM partners p
LEFT JOIN clients c ON p.partner_id = c.partner_id
LEFT JOIN deposits d ON p.partner_id = d.partner_id
LEFT JOIN commissions com ON p.partner_id = com.partner_id
LEFT JOIN trades t ON p.partner_id = t.partner_id
GROUP BY p.partner_id
ON CONFLICT (partner_id) DO UPDATE SET
  total_clients = EXCLUDED.total_clients,
  active_clients = EXCLUDED.active_clients,
  total_deposits = EXCLUDED.total_deposits,
  total_commissions = EXCLUDED.total_commissions,
  total_volume = EXCLUDED.total_volume,
  mtd_commissions = EXCLUDED.mtd_commissions,
  mtd_clients = EXCLUDED.mtd_clients,
  last_updated = NOW();
```

### 6.2 Populate cube_daily_trends

```sql
INSERT INTO cube_daily_trends (partner_id, date, new_clients, total_deposits, total_commissions, total_volume, active_clients)
SELECT 
  p.partner_id,
  d.date,
  COUNT(DISTINCT CASE WHEN c.signup_date::date = d.date THEN c.client_id END) as new_clients,
  COALESCE(SUM(dep.amount), 0) as total_deposits,
  COALESCE(SUM(com.amount), 0) as total_commissions,
  COALESCE(SUM(t.volume), 0) as total_volume,
  COUNT(DISTINCT CASE WHEN t.trade_date::date = d.date THEN t.client_id END) as active_clients
FROM partners p
CROSS JOIN GENERATE_SERIES(
  CURRENT_DATE - INTERVAL '90 days',
  CURRENT_DATE,
  '1 day'::interval
)::date AS d(date)
LEFT JOIN clients c ON p.partner_id = c.partner_id
LEFT JOIN deposits dep ON p.partner_id = dep.partner_id AND dep.deposit_date::date = d.date
LEFT JOIN commissions com ON p.partner_id = com.partner_id AND com.date = d.date
LEFT JOIN trades t ON p.partner_id = t.partner_id AND t.trade_date::date = d.date
GROUP BY p.partner_id, d.date
ON CONFLICT DO NOTHING;
```

### 6.3 Populate cube_daily_commissions_plan

```sql
INSERT INTO cube_daily_commissions_plan (partner_id, date, commission_plan, total_commission, client_count)
SELECT 
  partner_id,
  date,
  commission_plan,
  SUM(amount) as total_commission,
  COUNT(DISTINCT client_id) as client_count
FROM commissions
WHERE commission_plan IS NOT NULL
GROUP BY partner_id, date, commission_plan
ON CONFLICT DO NOTHING;
```

### 6.4 Populate cube_daily_commissions_platform

```sql
INSERT INTO cube_daily_commissions_platform (partner_id, date, platform, total_commission, trade_count, volume)
SELECT 
  c.partner_id,
  c.date,
  c.platform,
  SUM(c.amount) as total_commission,
  COUNT(*) as trade_count,
  COALESCE(SUM(t.volume), 0) as volume
FROM commissions c
LEFT JOIN trades t ON c.client_id = t.client_id AND c.date = t.trade_date::date
WHERE c.platform IS NOT NULL
GROUP BY c.partner_id, c.date, c.platform
ON CONFLICT DO NOTHING;
```

### 6.5 Populate cube_commissions_product

```sql
INSERT INTO cube_commissions_product (partner_id, product, total_commission, trade_count, total_volume, avg_commission)
SELECT 
  c.partner_id,
  c.product,
  SUM(c.amount) as total_commission,
  COUNT(*) as trade_count,
  COALESCE(SUM(t.volume), 0) as total_volume,
  AVG(c.amount) as avg_commission
FROM commissions c
LEFT JOIN trades t ON c.client_id = t.client_id AND c.product = t.product
WHERE c.product IS NOT NULL
GROUP BY c.partner_id, c.product
ON CONFLICT DO NOTHING;
```

### 6.6 Populate other cube tables

Similar queries can be created for:
- `cube_commissions_symbol`
- `cube_daily_signups`
- `cube_daily_funding`
- `cube_client_tiers`
- `cube_client_demographics`
- `cube_country_performance`
- `cube_product_volume`
- `cube_badge_progress`
- `cube_monthly_deposits`
- `cube_partner_scorecard`

---

## Step 7: Populate Affiliate Tips (Optional)

Run the affiliate tips data from `database_migrations.sql` (lines 123-242):

```sql
INSERT INTO affiliate_tips (tip_text, category) VALUES
('Focus on building trust before selling. Share educational content about forex trading to establish yourself as an authority in the space.', 'marketing'),
('Leverage video content on YouTube and TikTok. Visual demonstrations of trading strategies get 3x more engagement than text posts.', 'marketing'),
-- ... (add all 100 tips from database_migrations.sql)
```

Or create a simpler set of test tips:

```sql
INSERT INTO affiliate_tips (tip_text, category) VALUES
('Focus on building trust before selling.', 'marketing'),
('Create engaging video content for better reach.', 'content'),
('Monitor your analytics weekly for insights.', 'analytics'),
('Build relationships with your clients.', 'relationships'),
('Offer educational resources to new traders.', 'acquisition'),
('Send personalized follow-ups to dormant clients.', 'retention');
```

---

## Step 8: Test Your Next.js Application (5 minutes)

### 8.1 Restart Next.js Dev Server

```bash
# Stop the server (Ctrl+C) if running
# Start it again
npm run dev
```

### 8.2 Check Console Logs

Open your browser console (F12) and look for:

✅ `✅ Supabase connected successfully!`

❌ If you see errors:
- `❌ Supabase connection error` → Check your environment variables
- `Missing Supabase environment variables!` → Verify `.env.local` is set up
- `Row Level Security policy violation` → Check RLS policies were created

### 8.3 Test Key Pages

Navigate to these pages and verify data loads:

1. **Home** (`http://localhost:3000`) 
   - Should show partner metrics
   - Check for "Daily Trends" chart

2. **Database** (`http://localhost:3000/database`)
   - Should show all 31 tables (16 core + 15 cubes)
   - Verify service status shows green

3. **Clients** (`http://localhost:3000/clients`)
   - Should display client list
   - Try filtering and pagination

4. **Commissions** (`http://localhost:3000/commissions`)
   - Should show commission charts
   - Verify cube data is loading

---

## Step 9: Deploy to Vercel (5 minutes)

### 9.1 Add Environment Variables to Vercel

```bash
cd /Users/michalisphytides/Desktop/partner-report-nextjs

# Add Supabase URL
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste: https://xxxxx.supabase.co

# Add Supabase Anon Key
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste: eyJhbGc...
```

### 9.2 Deploy

```bash
vercel --prod
```

### 9.3 Verify Production

Visit your production URL and test key pages.

---

## 🔧 Troubleshooting

### Issue: "Table does not exist"

**Solution:**
1. Go to Supabase SQL Editor
2. Run: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
3. Verify the table exists
4. Check table name is correct (PostgreSQL is case-sensitive)

### Issue: "Row Level Security policy violation"

**Solution:**
The RLS policies should allow public read access. If you're getting this error:

```sql
-- Temporarily disable RLS for testing
ALTER TABLE partners DISABLE ROW LEVEL SECURITY;

-- Or create a more permissive policy
CREATE POLICY "Allow all" ON partners FOR ALL USING (true);
```

### Issue: "No data in cube tables"

**Solution:**
Cube tables need to be populated from core tables. Run the population queries from Step 6.

### Issue: "Supabase connection error"

**Solution:**
1. Verify environment variables are correct
2. Check Supabase project is active (not paused)
3. Verify network connection
4. Check browser console for detailed error message

### Issue: "Migration takes too long"

**Solution:**
For large datasets:
1. Split inserts into batches of 1000 rows
2. Disable triggers temporarily: `ALTER TABLE ... DISABLE TRIGGER ALL;`
3. Re-enable after import: `ALTER TABLE ... ENABLE TRIGGER ALL;`

---

## 📊 Database Structure Summary

### Core Tables (16)

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `partners` | Partner accounts | partner_id, name, tier, global_rank |
| `clients` | Client accounts | client_id, partner_id, country, status |
| `commissions` | Commission records | partner_id, date, amount, product |
| `deposits` | Client deposits | client_id, deposit_date, amount |
| `trades` | Trade history | client_id, symbol, volume, profit_loss |
| `partner_links` | Tracking links | partner_id, link_url, clicks, conversions |
| `badges` | Badge definitions | name, category, threshold_value |
| `partner_badges` | Earned badges | partner_id, badge_id, progress |
| `partner_tiers` | Tier history | partner_id, tier, effective_date |
| `partner_tier_config` | Tier definitions | tier_name, min_commission, reward_percentage |
| `partner_insights` | AI insights | partner_id, insight_text, priority |
| `partner_recommendations` | Recommendations | partner_id, recommendation_text, action_url |
| `affiliate_tips` | Forex tips | tip_text, category |
| `client_metrics` | Aggregated metrics | partner_id, metric_date, total_clients |
| `country_stats` | Country analytics | partner_id, country, total_clients |
| `monthly_commissions` | Monthly totals | partner_id, month, total_commission |
| `partner_monthly_commissions` | Detailed monthly | partner_id, month, commission_plan |

### Cube Tables (15)

| Cube | Purpose | Refresh Frequency |
|------|---------|-------------------|
| `cube_partner_dashboard` | Overview metrics | Daily |
| `cube_partner_scorecard` | Performance scores | Daily |
| `cube_daily_trends` | Daily time series | Real-time |
| `cube_daily_commissions_plan` | Commissions by plan | Daily |
| `cube_daily_commissions_platform` | Commissions by platform | Daily |
| `cube_commissions_product` | Product breakdown | Weekly |
| `cube_commissions_symbol` | Symbol rankings | Weekly |
| `cube_daily_signups` | Signup trends | Real-time |
| `cube_daily_funding` | Funding trends | Real-time |
| `cube_monthly_deposits` | Monthly deposits | Monthly |
| `cube_client_tiers` | Client tier distribution | Daily |
| `cube_client_demographics` | Geographic data | Weekly |
| `cube_country_performance` | Country metrics | Weekly |
| `cube_product_volume` | Product volumes | Daily |
| `cube_badge_progress` | Badge achievement | Daily |

---

## 🎯 Next Steps

After completing this setup:

1. ✅ **Set up automatic cube refresh**
   - Create scheduled functions in Supabase
   - Or use Vercel Cron Jobs to refresh cubes daily

2. ✅ **Add authentication** (optional)
   - Use Supabase Auth for user login
   - Update RLS policies for partner-specific access

3. ✅ **Monitor performance**
   - Use Supabase Dashboard → Database → Logs
   - Check slow queries and add indexes if needed

4. ✅ **Backup your data**
   - Set up automated backups in Supabase
   - Export data regularly

---

## 💰 Cost Estimate

### Free Tier Limits:
- ✅ 500MB database storage
- ✅ 2GB bandwidth/month
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests
- ✅ 500MB file storage

### Upgrade Triggers:
- Database size > 500MB → **$25/month** (Pro plan: 8GB)
- Bandwidth > 2GB/month → **$25/month**
- Need more backups → **$25/month**

**For most partners:** Free tier is sufficient ✅

---

## ✅ Completion Checklist

- [ ] Supabase project created
- [ ] Environment variables set in `.env.local`
- [ ] Complete schema migrated (`supabase_complete_schema.sql`)
- [ ] All 31 tables created (16 core + 15 cubes)
- [ ] RLS policies enabled
- [ ] Core data imported (partners, clients, commissions, etc.)
- [ ] Cube tables populated with aggregated data
- [ ] Affiliate tips added
- [ ] Tier configuration data inserted
- [ ] Next.js app tested locally
- [ ] Supabase connection verified
- [ ] Environment variables added to Vercel
- [ ] Production deployment successful
- [ ] Production app tested

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**🎉 Congratulations!** Your Partner Report Dashboard is now fully powered by Supabase!

