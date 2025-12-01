# 🚀 Supabase Setup - Quick Start

Your Partner Report Dashboard is ready for Supabase! Everything has been prepared for you.

---

## ✅ What's Ready

- ✅ **Complete database schema** with 32 tables (17 core + 15 cubes)
- ✅ **Cube population scripts** for analytics
- ✅ **Verification scripts** to check setup
- ✅ **Updated API** to query Supabase
- ✅ **Complete documentation** and guides

---

## 🎯 Three Simple Steps

### 1️⃣ Create Supabase Project (5 min)

```bash
# Go to https://supabase.com
# Click "New Project"
# Name: partner-report-db
# Save your password!
```

Get your credentials from **Project Settings → API**:
- Project URL: `https://xxxxx.supabase.co`
- Anon Key: `eyJhbGc...`

---

### 2️⃣ Run Database Setup (10 min)

**In Supabase SQL Editor:**

1. Copy entire `supabase_complete_schema.sql`
2. Paste into SQL Editor
3. Click **Run**
4. Wait for "Success" message

This creates all 32 tables automatically!

---

### 3️⃣ Update Environment & Test (5 min)

**Update `.env.local`:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Test locally:**
```bash
npm run dev
```

Visit http://localhost:3000 and check:
- ✅ No console errors
- ✅ Database page shows 32 tables
- ✅ Supabase connection successful

**Deploy:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel --prod
```

---

## 📁 Key Files

| File | What It Does |
|------|--------------|
| `supabase_complete_schema.sql` | 📄 **Run this first** - Creates all 32 tables |
| `populate_cube_tables.sql` | 📊 **Run after importing data** - Populates analytics |
| `verify_supabase_setup.sql` | ✅ **Run to verify** - Checks everything is set up |
| `SUPABASE_SETUP_COMPLETE.md` | 📖 **Read for details** - Full step-by-step guide |
| `SUPABASE_CHECKLIST.md` | ☑️  **Use as reference** - Quick checklist |
| `SUPABASE_MIGRATION_SUMMARY.md` | 📝 **Overview** - What was built |

---

## 🗂️ Database Tables

### Core Tables (17)
```
✅ partners                    ✅ partner_insights
✅ clients                     ✅ partner_recommendations
✅ commissions                 ✅ affiliate_tips
✅ deposits                    ✅ client_metrics
✅ trades                      ✅ country_stats
✅ partner_links               ✅ monthly_commissions
✅ badges                      ✅ partner_monthly_commissions
✅ partner_badges
✅ partner_tiers
✅ partner_tier_config
```

### Cube Tables (15)
```
📊 cube_partner_dashboard      📊 cube_client_tiers
📊 cube_partner_scorecard      📊 cube_client_demographics
📊 cube_daily_trends           📊 cube_country_performance
📊 cube_daily_commissions_plan 📊 cube_product_volume
📊 cube_daily_commissions_platform
📊 cube_commissions_product
📊 cube_commissions_symbol
📊 cube_daily_signups
📊 cube_daily_funding
📊 cube_monthly_deposits
📊 cube_badge_progress
```

---

## 🔄 If You Have Existing Data

### Step 1: Create Schema
Run `supabase_complete_schema.sql` first (creates empty tables)

### Step 2: Import Your Data
**Option A - CSV Import (Easiest):**
1. Export each table to CSV from MySQL
2. In Supabase Table Editor → Insert → Import CSV
3. Upload each CSV file

**Option B - SQL Import:**
1. Export: `mysqldump -u root -p partner_report_db > data.sql`
2. Convert MySQL syntax to PostgreSQL
3. Run in Supabase SQL Editor

### Step 3: Populate Cubes
Run `populate_cube_tables.sql` in Supabase SQL Editor

### Step 4: Verify
Run `verify_supabase_setup.sql` to check everything

---

## 🎯 Success Checklist

- [ ] Supabase project created
- [ ] `supabase_complete_schema.sql` executed
- [ ] All 32 tables exist (check in Table Editor)
- [ ] `.env.local` updated with Supabase credentials
- [ ] Dev server restarted
- [ ] Local test successful (no console errors)
- [ ] Database page shows all tables
- [ ] Environment variables added to Vercel
- [ ] Production deployed and working

---

## 💡 Quick Tips

### Check Connection
Open browser console, look for:
```
✅ Supabase connected successfully!
```

### View All Tables
Go to **Database** page: http://localhost:3000/database

Should show:
- 17 Core Tables
- 15 Data Cubes
- Total: 32 tables

### Verify Data
```sql
-- In Supabase SQL Editor
SELECT COUNT(*) FROM partners;
SELECT COUNT(*) FROM clients;
SELECT COUNT(*) FROM commissions;
```

---

## 🐛 Troubleshooting

### "Connection error"
- Check `.env.local` has correct credentials
- Restart dev server: `npm run dev`
- Verify Supabase project is active

### "Table does not exist"
- Run `supabase_complete_schema.sql` again
- Check Supabase Table Editor to see created tables

### "No data in cubes"
- Cubes are empty until populated
- Import core data first
- Then run `populate_cube_tables.sql`

### "RLS policy violation"
- RLS policies should allow public read
- Run verification script to check policies
- Or temporarily disable: `ALTER TABLE partners DISABLE ROW LEVEL SECURITY;`

---

## 📞 Need More Help?

📖 **Detailed Guide:** See `SUPABASE_SETUP_COMPLETE.md`  
☑️  **Step-by-Step:** See `SUPABASE_CHECKLIST.md`  
📝 **What Was Built:** See `SUPABASE_MIGRATION_SUMMARY.md`  
🌐 **Supabase Docs:** https://supabase.com/docs  
💬 **Discord:** https://discord.supabase.com  

---

## 🎉 That's It!

Your database is ready. Just:
1. Create Supabase project
2. Run the schema
3. Update environment variables
4. Test and deploy

**Total time: ~20 minutes**

---

**Questions?** Check the detailed guides in this folder!

