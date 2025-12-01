# Supabase Migration Checklist

Quick reference guide for ensuring all tables and cubes are on Supabase.

---

## ✅ Pre-Migration Checklist

- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Project credentials saved (URL + Anon Key)
- [ ] `.env.local` file updated with Supabase credentials
- [ ] Backup of existing MySQL data (if applicable)

---

## 📊 Database Setup Checklist

### Core Tables (17 tables)

- [ ] `partners` - Partner accounts
- [ ] `clients` - Client accounts  
- [ ] `commissions` - Commission records
- [ ] `deposits` - Deposit transactions
- [ ] `trades` - Trade history
- [ ] `partner_links` - Tracking links
- [ ] `badges` - Badge definitions
- [ ] `partner_badges` - Earned badges
- [ ] `partner_tiers` - Tier history
- [ ] `partner_tier_config` - Tier definitions (5 tiers pre-populated)
- [ ] `partner_insights` - AI insights
- [ ] `partner_recommendations` - Recommendations
- [ ] `affiliate_tips` - Forex affiliate tips
- [ ] `client_metrics` - Aggregated client metrics
- [ ] `country_stats` - Country-level stats
- [ ] `monthly_commissions` - Monthly commission totals
- [ ] `partner_monthly_commissions` - Detailed monthly commissions

### Cube Tables (15 tables)

- [ ] `cube_partner_dashboard` - Partner overview metrics
- [ ] `cube_partner_scorecard` - Performance scores
- [ ] `cube_daily_trends` - Daily time-series data
- [ ] `cube_daily_commissions_plan` - Commissions by plan
- [ ] `cube_daily_commissions_platform` - Commissions by platform
- [ ] `cube_commissions_product` - Product breakdown
- [ ] `cube_commissions_symbol` - Symbol rankings
- [ ] `cube_daily_signups` - Signup trends
- [ ] `cube_daily_funding` - Funding trends
- [ ] `cube_monthly_deposits` - Monthly deposit aggregation
- [ ] `cube_client_tiers` - Client tier distribution
- [ ] `cube_client_demographics` - Geographic demographics
- [ ] `cube_country_performance` - Country performance metrics
- [ ] `cube_product_volume` - Trading volume by product
- [ ] `cube_badge_progress` - Badge achievement tracking

---

## 🔧 Configuration Checklist

### Database Objects

- [ ] All indexes created (15+ indexes for performance)
- [ ] RLS enabled on all tables
- [ ] RLS policies created for public read access
- [ ] PostgreSQL functions created:
  - [ ] `get_partner_scorecard()`
  - [ ] `get_commission_trends()`
  - [ ] `get_random_tip()`
  - [ ] `update_updated_at_column()`
- [ ] Triggers created (partners table auto-update)
- [ ] Views created (`partner_badges_view`)

### Sample Data

- [ ] Tier configuration data inserted (Bronze, Silver, Gold, Platinum, Diamond)
- [ ] Affiliate tips populated (optional)
- [ ] Test partners created (optional)

---

## 📥 Data Migration Checklist

- [ ] Partners data imported
- [ ] Clients data imported
- [ ] Commissions data imported
- [ ] Deposits data imported
- [ ] Trades data imported
- [ ] Partner links imported
- [ ] Badges data imported
- [ ] Partner badges imported
- [ ] Insights imported (optional)
- [ ] Recommendations imported (optional)

---

## 🔷 Cube Population Checklist

Run `populate_cube_tables.sql` after importing core data:

- [ ] `cube_partner_dashboard` populated
- [ ] `cube_partner_scorecard` populated
- [ ] `cube_daily_trends` populated (last 90 days)
- [ ] `cube_daily_commissions_plan` populated
- [ ] `cube_daily_commissions_platform` populated
- [ ] `cube_commissions_product` populated
- [ ] `cube_commissions_symbol` populated
- [ ] `cube_daily_signups` populated
- [ ] `cube_daily_funding` populated
- [ ] `cube_monthly_deposits` populated
- [ ] `cube_client_tiers` populated
- [ ] `cube_client_demographics` populated
- [ ] `cube_country_performance` populated
- [ ] `cube_product_volume` populated
- [ ] `cube_badge_progress` populated

---

## 🔍 Verification Checklist

Run `verify_supabase_setup.sql` to check:

- [ ] All 32 tables exist (17 core + 15 cubes)
- [ ] RLS is enabled on key tables
- [ ] All required PostgreSQL functions exist
- [ ] Core tables have data
- [ ] Cube tables have data
- [ ] Tier configuration is complete
- [ ] Indexes are created
- [ ] Database size is reasonable

---

## 🌐 Next.js Application Checklist

### Environment Variables

- [ ] `NEXT_PUBLIC_SUPABASE_URL` set in `.env.local`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in `.env.local`
- [ ] Dev server restarted after env changes

### API Integration

- [ ] Supabase client created (`src/lib/supabase.ts`)
- [ ] API functions updated to use Supabase (`src/lib/api.ts`)
- [ ] Cube data fetching implemented
- [ ] Connection test passes (check browser console)

### Testing

- [ ] Home page loads
- [ ] Database page shows all tables
- [ ] Clients page displays data
- [ ] Commissions page shows charts
- [ ] Partner links page works
- [ ] No console errors

---

## 🚀 Deployment Checklist

### Vercel Environment Variables

- [ ] `NEXT_PUBLIC_SUPABASE_URL` added to Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` added to Vercel

### Deployment

- [ ] Code pushed to Git repository
- [ ] Vercel deployment triggered
- [ ] Production build successful
- [ ] Production site accessible
- [ ] Production data loading correctly

---

## 🔐 Security Checklist

- [ ] Row Level Security enabled on all tables
- [ ] Public read policies reviewed and appropriate
- [ ] Anon key used in frontend (not service role key)
- [ ] Sensitive data not exposed in public tables
- [ ] Production environment variables secure

---

## 📈 Performance Checklist

- [ ] All recommended indexes created
- [ ] Cube tables populated (pre-aggregated data)
- [ ] Queries under 200ms for common operations
- [ ] Database size under free tier limits (< 500MB)
- [ ] Bandwidth usage monitored

---

## 🎯 Quick Command Reference

### Run Schema Migration
```bash
# In Supabase SQL Editor:
# Copy/paste: supabase_complete_schema.sql
```

### Populate Cubes
```bash
# In Supabase SQL Editor:
# Copy/paste: populate_cube_tables.sql
```

### Verify Setup
```bash
# In Supabase SQL Editor:
# Copy/paste: verify_supabase_setup.sql
```

### Restart Next.js
```bash
# Stop server (Ctrl+C), then:
npm run dev
```

### Deploy to Vercel
```bash
vercel --prod
```

---

## 📁 Files Reference

| File | Purpose |
|------|---------|
| `supabase_complete_schema.sql` | Complete database schema with all tables |
| `populate_cube_tables.sql` | Populate cube tables from core data |
| `verify_supabase_setup.sql` | Verification script for setup |
| `SUPABASE_SETUP_COMPLETE.md` | Detailed setup guide |
| `SUPABASE_CHECKLIST.md` | This checklist |
| `src/lib/supabase.ts` | Supabase client configuration |
| `src/lib/api.ts` | API functions using Supabase |
| `.env.local` | Environment variables |

---

## ⚠️ Common Issues & Solutions

### Issue: Tables not found
**Solution:** Run `supabase_complete_schema.sql` in Supabase SQL Editor

### Issue: Empty cube tables
**Solution:** Run `populate_cube_tables.sql` after importing core data

### Issue: Connection error
**Solution:** Check environment variables in `.env.local` and restart dev server

### Issue: RLS policy violation
**Solution:** Verify RLS policies exist or temporarily disable for testing

### Issue: Slow queries
**Solution:** Ensure indexes are created and cube tables are populated

---

## 🎉 Success Criteria

Your migration is complete when:

✅ All 32 tables exist in Supabase  
✅ Core tables have your data  
✅ All 15 cube tables are populated  
✅ Next.js app loads without errors  
✅ All pages display data correctly  
✅ Production deployment successful  
✅ No console errors in browser  
✅ Database queries are fast (< 200ms)  

---

## 📞 Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Check `SUPABASE_SETUP_COMPLETE.md` for detailed instructions
- Review browser console for error messages
- Check Supabase Dashboard → Database → Logs for query errors

---

**Last Updated:** December 2025  
**Version:** 1.0

