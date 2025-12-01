# 📊 Supabase Data Import Guide

## ✅ Export Complete!

I've successfully exported **7,132 rows** of data from your MySQL database:

| Table | Rows | File Size |
|-------|------|-----------|
| **partners** | 3 | 756B |
| **clients** | 428 | 103KB |
| **deposits** | 1,624 | 610KB |
| **trades** | 3,787 | 794KB |
| **partner_links** | 25 | 4.8KB |
| **badges** | 13 | 646B |
| **partner_badges** | 16 | 607B |
| **partner_tier_config** | 4 | 646B |
| **partner_tiers** | 4 | 228B |
| **partner_monthly_commissions** | 39 | 4.1KB |
| **Cube tables** | 1,189 | ~75KB |

**Total: 7,132 rows ready to import!**

---

## 🗂️ Files Location

All CSV files are in:
```
/Users/michalisphytides/Desktop/partner-report/supabase_import/
```

---

## 📋 Import Methods

### **Method 1: Supabase Dashboard (Easiest - Recommended)**

#### **Step-by-Step for Each Table:**

1. **Open Supabase Table Editor:**  
   👉 https://supabase.com/dashboard/project/brpwxtnllxoxwwsvkmpi/editor

2. **Select a table** (e.g., `partners`)

3. **Click "Insert" dropdown** → **"Import data from CSV"**

4. **Upload the CSV file:**
   - Click "Choose File"
   - Navigate to: `/Users/michalisphytides/Desktop/partner-report/supabase_import/`
   - Select `partners.csv`

5. **Map columns:**
   - Supabase will auto-detect column names
   - Verify the mapping looks correct
   - Click "Next"

6. **Import:**
   - Click "Import"
   - Wait for confirmation
   - ✅ Done!

7. **Repeat for each table**

---

### **Method 2: SQL Editor (Faster for Tech Users)**

If you're comfortable with SQL, you can use the SQL Editor:

1. **Open SQL Editor:**  
   👉 https://supabase.com/dashboard/project/brpwxtnllxoxwwsvkmpi/sql/new

2. **For each table, run:**

```sql
-- Example for partners table
-- First, delete existing test data
DELETE FROM partners WHERE partner_id = 'P-0001';

-- Then copy/paste INSERT statements
-- (See generate-sql-inserts.sh to create these)
```

---

### **Method 3: Automated Bulk Import (Advanced)**

I can create a Python script that uses Supabase's REST API to bulk import:

```bash
cd /Users/michalisphytides/Desktop/partner-report-nextjs
python3 bulk-import-supabase.py
```

---

## 🎯 Recommended Import Order

Import tables in this order to avoid foreign key conflicts:

1. ✅ **partners** (no dependencies)
2. ✅ **badges** (no dependencies)
3. ✅ **partner_tier_config** (no dependencies)
4. ✅ **clients** (depends on partners)
5. ✅ **deposits** (depends on partners/clients)
6. ✅ **trades** (depends on partners/clients)
7. ✅ **partner_links** (depends on partners)
8. ✅ **partner_badges** (depends on partners & badges)
9. ✅ **partner_tiers** (depends on partners)
10. ✅ **partner_monthly_commissions** (depends on partners)

---

## 📊 Quick Import Checklist

### **Core Tables (Essential)**
- [ ] partners (3 rows)
- [ ] clients (428 rows)
- [ ] deposits (1,624 rows)
- [ ] trades (3,787 rows)

### **Supporting Tables**
- [ ] partner_links (25 rows)
- [ ] badges (13 rows)
- [ ] partner_badges (16 rows)
- [ ] partner_tier_config (4 rows)
- [ ] partner_tiers (4 rows)
- [ ] partner_monthly_commissions (39 rows)

### **Cube Tables (Analytics - Optional)**
- [ ] cube_daily_signups (321 rows)
- [ ] cube_daily_trends (267 rows)
- [ ] cube_daily_funding (225 rows)
- [ ] cube_daily_commissions_platform (162 rows)
- [ ] cube_daily_commissions_plan (92 rows)
- [ ] cube_commissions_symbol (69 rows)
- [ ] cube_commissions_product (25 rows)
- [ ] cube_product_volume (17 rows)
- [ ] cube_monthly_deposits (4 rows)
- [ ] cube_partner_countries (7 rows)

---

## 🔧 Troubleshooting

### **Error: "Column X doesn't exist"**
**Solution:** The table schema needs to be created first.
- Check: https://supabase.com/dashboard/project/brpwxtnllxoxwwsvkmpi/editor
- Ensure all columns from CSV exist in the table
- Or run the schema creation script first

### **Error: "Duplicate key value"**
**Solution:** Clear existing data first.
```sql
-- In Supabase SQL Editor
TRUNCATE TABLE partners CASCADE;
-- Then try import again
```

### **Error: "Foreign key constraint"**
**Solution:** Import tables in the correct order (see above)

### **CSV Import Not Working?**
**Solution:** Check CSV format:
- Ensure UTF-8 encoding
- Check for special characters
- Verify column headers match table columns

---

## 🚀 After Import

### **Verify Data:**

1. **Check row counts:**
   ```sql
   SELECT 'partners' as table_name, COUNT(*) as rows FROM partners
   UNION ALL
   SELECT 'clients', COUNT(*) FROM clients
   UNION ALL
   SELECT 'deposits', COUNT(*) FROM deposits
   UNION ALL
   SELECT 'trades', COUNT(*) FROM trades;
   ```

2. **Test your app:**
   - Visit: https://partner-reports-85o4h6y0k-derivgp.vercel.app (after fixing 404)
   - Or local: http://localhost:3001
   - Select a partner
   - Check if data loads

### **Update Your App:**

Once data is imported, redeploy your app:

```bash
cd /Users/michalisphytides/Desktop/partner-report-nextjs
git add .
git commit -m "Data: Imported production data to Supabase"
git push  # Auto-deploys to Vercel
```

---

## 💡 Pro Tips

### **Tip 1: Batch Import**
If you have many files, open multiple browser tabs and import simultaneously.

### **Tip 2: Verify Before Import**
Check a few rows in each CSV file first:
```bash
head -5 /Users/michalisphytides/Desktop/partner-report/supabase_import/partners.csv
```

### **Tip 3: Backup First**
Supabase has automatic backups, but you can also:
```bash
# Keep your MySQL export as backup
cp -r /Users/michalisphytides/Desktop/partner-report/supabase_import ~/Desktop/mysql_backup_$(date +%Y%m%d)
```

### **Tip 4: Automate Future Updates**
After initial import, use the Supabase API for ongoing data sync.

---

## 📈 Expected Results

After importing all data, your dashboard should show:

- ✅ **3 partners** in dropdown
- ✅ **428 clients** in clients page
- ✅ **1,624 deposits** in analytics
- ✅ **3,787 trades** for volume calculations
- ✅ **Charts populated** with real data
- ✅ **Analytics working** with cube data

---

## 🆘 Need Help?

### **Option 1: Use Supabase Support**
- Dashboard: https://supabase.com/dashboard/support
- Discord: https://discord.supabase.com

### **Option 2: Automated Import Script**
I can create a Python script to automate the entire import process.

Would you like me to create the automated import script?

---

## 📋 Quick Reference

**Supabase Project:**
- URL: https://brpwxtnllxoxwwsvkmpi.supabase.co
- Dashboard: https://supabase.com/dashboard/project/brpwxtnllxoxwwsvkmpi
- Table Editor: https://supabase.com/dashboard/project/brpwxtnllxoxwwsvkmpi/editor
- SQL Editor: https://supabase.com/dashboard/project/brpwxtnllxoxwwsvkmpi/sql

**Data Location:**
- Export folder: `/Users/michalisphytides/Desktop/partner-report/supabase_import/`

**Scripts:**
- Export: `./export-mysql-to-supabase.sh`
- Import: `./import-to-supabase.sh`

---

**Ready to import?** Start with Method 1 (Dashboard import) for the easiest experience!

