-- ============================================================================
-- Supabase Setup Verification Script
-- Run this to verify all tables, cubes, and configurations are set up correctly
-- ============================================================================

-- ============================================================================
-- 1. Check All Core Tables Exist
-- ============================================================================

SELECT 
  'Core Tables Check' as check_type,
  COUNT(*) as tables_found,
  CASE 
    WHEN COUNT(*) = 17 THEN '✅ All core tables exist'
    ELSE '❌ Missing ' || (17 - COUNT(*))::text || ' core tables'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN (
    'partners',
    'clients',
    'commissions',
    'deposits',
    'trades',
    'partner_links',
    'badges',
    'partner_badges',
    'partner_tiers',
    'partner_tier_config',
    'partner_insights',
    'partner_recommendations',
    'affiliate_tips',
    'client_metrics',
    'country_stats',
    'monthly_commissions',
    'partner_monthly_commissions'
  );

-- ============================================================================
-- 2. Check All Cube Tables Exist
-- ============================================================================

SELECT 
  'Cube Tables Check' as check_type,
  COUNT(*) as cubes_found,
  CASE 
    WHEN COUNT(*) = 15 THEN '✅ All cube tables exist'
    ELSE '❌ Missing ' || (15 - COUNT(*))::text || ' cube tables'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN (
    'cube_partner_dashboard',
    'cube_partner_scorecard',
    'cube_monthly_deposits',
    'cube_daily_commissions_plan',
    'cube_daily_commissions_platform',
    'cube_commissions_product',
    'cube_commissions_symbol',
    'cube_daily_signups',
    'cube_daily_funding',
    'cube_client_tiers',
    'cube_client_demographics',
    'cube_country_performance',
    'cube_product_volume',
    'cube_daily_trends',
    'cube_badge_progress'
  );

-- ============================================================================
-- 3. List All Tables with Row Counts
-- ============================================================================

SELECT 
  'Table Inventory' as report_type,
  table_name,
  CASE 
    WHEN table_name LIKE 'cube_%' THEN 'Cube'
    ELSE 'Core'
  END as table_type,
  pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name NOT LIKE 'pg_%'
ORDER BY 
  CASE WHEN table_name LIKE 'cube_%' THEN 2 ELSE 1 END,
  table_name;

-- ============================================================================
-- 4. Check Row Level Security Status
-- ============================================================================

SELECT 
  'RLS Status Check' as check_type,
  tablename as table_name,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'partners', 'clients', 'commissions', 'deposits', 'trades',
    'partner_links', 'partner_insights', 'partner_recommendations',
    'affiliate_tips', 'cube_partner_dashboard', 'cube_daily_trends'
  )
ORDER BY tablename;

-- ============================================================================
-- 5. Check Required Indexes Exist
-- ============================================================================

SELECT 
  'Index Check' as check_type,
  COUNT(DISTINCT indexname) as indexes_found,
  CASE 
    WHEN COUNT(DISTINCT indexname) >= 15 THEN '✅ Key indexes exist'
    ELSE '⚠️  Some indexes may be missing'
  END as status
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%';

-- ============================================================================
-- 6. Check PostgreSQL Functions Exist
-- ============================================================================

SELECT 
  'Functions Check' as check_type,
  proname as function_name,
  '✅ Exists' as status
FROM pg_proc
WHERE proname IN (
  'get_partner_scorecard',
  'get_commission_trends',
  'get_random_tip',
  'update_updated_at_column'
)
ORDER BY proname;

-- ============================================================================
-- 7. Check Data in Core Tables
-- ============================================================================

SELECT 'partners' as table_name, COUNT(*) as row_count FROM partners
UNION ALL
SELECT 'clients', COUNT(*) FROM clients
UNION ALL
SELECT 'commissions', COUNT(*) FROM commissions
UNION ALL
SELECT 'deposits', COUNT(*) FROM deposits
UNION ALL
SELECT 'trades', COUNT(*) FROM trades
UNION ALL
SELECT 'partner_links', COUNT(*) FROM partner_links
UNION ALL
SELECT 'badges', COUNT(*) FROM badges
UNION ALL
SELECT 'partner_badges', COUNT(*) FROM partner_badges
UNION ALL
SELECT 'partner_tier_config', COUNT(*) FROM partner_tier_config
UNION ALL
SELECT 'affiliate_tips', COUNT(*) FROM affiliate_tips
ORDER BY table_name;

-- ============================================================================
-- 8. Check Data in Cube Tables
-- ============================================================================

SELECT 'cube_partner_dashboard' as cube_name, COUNT(*) as row_count FROM cube_partner_dashboard
UNION ALL
SELECT 'cube_partner_scorecard', COUNT(*) FROM cube_partner_scorecard
UNION ALL
SELECT 'cube_daily_trends', COUNT(*) FROM cube_daily_trends
UNION ALL
SELECT 'cube_daily_commissions_plan', COUNT(*) FROM cube_daily_commissions_plan
UNION ALL
SELECT 'cube_daily_commissions_platform', COUNT(*) FROM cube_daily_commissions_platform
UNION ALL
SELECT 'cube_commissions_product', COUNT(*) FROM cube_commissions_product
UNION ALL
SELECT 'cube_commissions_symbol', COUNT(*) FROM cube_commissions_symbol
UNION ALL
SELECT 'cube_daily_signups', COUNT(*) FROM cube_daily_signups
UNION ALL
SELECT 'cube_daily_funding', COUNT(*) FROM cube_daily_funding
UNION ALL
SELECT 'cube_monthly_deposits', COUNT(*) FROM cube_monthly_deposits
UNION ALL
SELECT 'cube_client_tiers', COUNT(*) FROM cube_client_tiers
UNION ALL
SELECT 'cube_client_demographics', COUNT(*) FROM cube_client_demographics
UNION ALL
SELECT 'cube_country_performance', COUNT(*) FROM cube_country_performance
UNION ALL
SELECT 'cube_product_volume', COUNT(*) FROM cube_product_volume
UNION ALL
SELECT 'cube_badge_progress', COUNT(*) FROM cube_badge_progress
ORDER BY cube_name;

-- ============================================================================
-- 9. Check Tier Configuration
-- ============================================================================

SELECT 
  'Tier Config' as check_type,
  tier_name,
  min_commission,
  max_commission,
  reward_percentage,
  tier_color,
  '✅ Configured' as status
FROM partner_tier_config
ORDER BY tier_order;

-- ============================================================================
-- 10. Check RLS Policies
-- ============================================================================

SELECT 
  'RLS Policies' as check_type,
  schemaname,
  tablename,
  policyname,
  '✅ Active' as status
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname
LIMIT 20;

-- ============================================================================
-- 11. Database Size Summary
-- ============================================================================

SELECT 
  'Database Size' as metric,
  pg_size_pretty(pg_database_size(current_database())) as size,
  '📊' as icon;

-- ============================================================================
-- 12. Sample Data Check - Partners
-- ============================================================================

SELECT 
  'Sample Partners' as check_type,
  partner_id,
  name,
  tier,
  global_rank,
  '✅ Data exists' as status
FROM partners
LIMIT 5;

-- ============================================================================
-- 13. Sample Data Check - Cube Dashboard
-- ============================================================================

SELECT 
  'Sample Dashboard Cube' as check_type,
  partner_id,
  total_clients,
  total_commissions,
  mtd_commissions,
  '✅ Data aggregated' as status
FROM cube_partner_dashboard
LIMIT 5;

-- ============================================================================
-- 14. Missing Tables Report
-- ============================================================================

WITH expected_tables AS (
  SELECT unnest(ARRAY[
    'partners', 'clients', 'commissions', 'deposits', 'trades',
    'partner_links', 'badges', 'partner_badges', 'partner_tiers',
    'partner_tier_config', 'partner_insights', 'partner_recommendations',
    'affiliate_tips', 'client_metrics', 'country_stats',
    'monthly_commissions', 'partner_monthly_commissions',
    'cube_partner_dashboard', 'cube_partner_scorecard', 'cube_monthly_deposits',
    'cube_daily_commissions_plan', 'cube_daily_commissions_platform',
    'cube_commissions_product', 'cube_commissions_symbol', 'cube_daily_signups',
    'cube_daily_funding', 'cube_client_tiers', 'cube_client_demographics',
    'cube_country_performance', 'cube_product_volume', 'cube_daily_trends',
    'cube_badge_progress'
  ]) AS table_name
),
existing_tables AS (
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
)
SELECT 
  'Missing Tables' as report_type,
  e.table_name,
  '❌ NOT FOUND' as status
FROM expected_tables e
LEFT JOIN existing_tables ex ON e.table_name = ex.table_name
WHERE ex.table_name IS NULL
ORDER BY e.table_name;

-- ============================================================================
-- 15. Overall Health Check Summary
-- ============================================================================

WITH health_metrics AS (
  SELECT 
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name NOT LIKE 'cube_%') as core_tables,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name LIKE 'cube_%') as cube_tables,
    (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true) as rls_enabled_count,
    (SELECT COUNT(*) FROM pg_proc WHERE proname IN ('get_partner_scorecard', 'get_commission_trends', 'get_random_tip')) as functions_count,
    (SELECT COUNT(*) FROM partners) as partners_count,
    (SELECT COUNT(*) FROM clients) as clients_count,
    (SELECT COUNT(*) FROM commissions) as commissions_count
)
SELECT 
  '🎯 Overall Health Check' as summary,
  CASE 
    WHEN core_tables >= 15 AND cube_tables >= 15 THEN '✅ HEALTHY'
    WHEN core_tables >= 10 AND cube_tables >= 10 THEN '⚠️  PARTIAL'
    ELSE '❌ INCOMPLETE'
  END as status,
  json_build_object(
    'core_tables', core_tables,
    'cube_tables', cube_tables,
    'rls_enabled', rls_enabled_count,
    'functions', functions_count,
    'partners', partners_count,
    'clients', clients_count,
    'commissions', commissions_count
  ) as metrics
FROM health_metrics;

-- ============================================================================
-- END OF VERIFICATION
-- ============================================================================

-- Print completion message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Verification Complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Review the results above to ensure:';
  RAISE NOTICE '1. All 32 tables exist (17 core + 15 cubes)';
  RAISE NOTICE '2. RLS is enabled on key tables';
  RAISE NOTICE '3. Required functions are created';
  RAISE NOTICE '4. Data exists in core tables';
  RAISE NOTICE '5. Cube tables are populated';
  RAISE NOTICE '========================================';
END $$;

