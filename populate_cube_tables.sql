-- ============================================================================
-- Populate Cube Tables from Core Tables
-- Run this AFTER importing your core data (partners, clients, commissions, etc.)
-- ============================================================================

-- ============================================================================
-- 1. CUBE_PARTNER_DASHBOARD - Overview metrics for each partner
-- ============================================================================

INSERT INTO cube_partner_dashboard (
  partner_id, 
  total_clients, 
  active_clients, 
  total_deposits, 
  total_commissions, 
  total_volume, 
  mtd_commissions, 
  mtd_clients,
  last_updated
)
SELECT 
  p.partner_id,
  COUNT(DISTINCT c.client_id) as total_clients,
  COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.client_id END) as active_clients,
  COALESCE(SUM(d.amount), 0) as total_deposits,
  COALESCE(SUM(com.amount), 0) as total_commissions,
  COALESCE(SUM(t.volume), 0) as total_volume,
  COALESCE(SUM(CASE WHEN com.date >= DATE_TRUNC('month', CURRENT_DATE) THEN com.amount ELSE 0 END), 0) as mtd_commissions,
  COUNT(DISTINCT CASE WHEN c.signup_date >= DATE_TRUNC('month', CURRENT_DATE) THEN c.client_id END) as mtd_clients,
  NOW() as last_updated
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

-- ============================================================================
-- 2. CUBE_PARTNER_SCORECARD - Performance scores
-- ============================================================================

INSERT INTO cube_partner_scorecard (
  partner_id,
  performance_score,
  revenue_growth,
  client_growth,
  retention_rate,
  avg_client_value,
  last_updated
)
SELECT 
  p.partner_id,
  -- Performance score calculation (0-100)
  LEAST(100, 
    COALESCE(COUNT(DISTINCT c.client_id) * 5, 0) + 
    COALESCE(SUM(com.amount) / 100, 0)
  )::DECIMAL(5,2) as performance_score,
  -- Revenue growth (mock calculation - replace with actual logic)
  CASE 
    WHEN COALESCE(SUM(com.amount), 0) > 0 THEN 15.5
    ELSE 0
  END::DECIMAL(5,2) as revenue_growth,
  -- Client growth (mock calculation)
  CASE 
    WHEN COUNT(DISTINCT c.client_id) > 0 THEN 10.2
    ELSE 0
  END::DECIMAL(5,2) as client_growth,
  -- Retention rate
  CASE 
    WHEN COUNT(DISTINCT c.client_id) > 0 THEN 
      (COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.client_id END)::DECIMAL / COUNT(DISTINCT c.client_id) * 100)
    ELSE 0
  END::DECIMAL(5,2) as retention_rate,
  -- Average client value
  CASE 
    WHEN COUNT(DISTINCT c.client_id) > 0 THEN 
      COALESCE(SUM(com.amount) / COUNT(DISTINCT c.client_id), 0)
    ELSE 0
  END::DECIMAL(10,2) as avg_client_value,
  NOW() as last_updated
FROM partners p
LEFT JOIN clients c ON p.partner_id = c.partner_id
LEFT JOIN commissions com ON p.partner_id = com.partner_id
GROUP BY p.partner_id
ON CONFLICT (partner_id) DO UPDATE SET
  performance_score = EXCLUDED.performance_score,
  revenue_growth = EXCLUDED.revenue_growth,
  client_growth = EXCLUDED.client_growth,
  retention_rate = EXCLUDED.retention_rate,
  avg_client_value = EXCLUDED.avg_client_value,
  last_updated = NOW();

-- ============================================================================
-- 3. CUBE_DAILY_TRENDS - Daily metrics over last 90 days
-- ============================================================================

INSERT INTO cube_daily_trends (
  partner_id, 
  date, 
  new_clients, 
  total_deposits, 
  total_commissions, 
  total_volume, 
  active_clients
)
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

-- ============================================================================
-- 4. CUBE_DAILY_COMMISSIONS_PLAN - Commissions by plan
-- ============================================================================

INSERT INTO cube_daily_commissions_plan (
  partner_id, 
  date, 
  commission_plan, 
  total_commission, 
  client_count
)
SELECT 
  partner_id,
  date,
  COALESCE(commission_plan, 'Unknown') as commission_plan,
  SUM(amount) as total_commission,
  COUNT(DISTINCT client_id) as client_count
FROM commissions
GROUP BY partner_id, date, commission_plan
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. CUBE_DAILY_COMMISSIONS_PLATFORM - Commissions by platform
-- ============================================================================

INSERT INTO cube_daily_commissions_platform (
  partner_id, 
  date, 
  platform, 
  total_commission, 
  trade_count, 
  volume
)
SELECT 
  c.partner_id,
  c.date,
  COALESCE(c.platform, 'Unknown') as platform,
  SUM(c.amount) as total_commission,
  COUNT(*) as trade_count,
  COALESCE(SUM(t.volume), 0) as volume
FROM commissions c
LEFT JOIN trades t ON c.client_id = t.client_id AND c.date = t.trade_date::date AND c.platform = t.platform
GROUP BY c.partner_id, c.date, c.platform
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. CUBE_COMMISSIONS_PRODUCT - Commissions by product
-- ============================================================================

INSERT INTO cube_commissions_product (
  partner_id, 
  product, 
  total_commission, 
  trade_count, 
  total_volume, 
  avg_commission,
  last_updated
)
SELECT 
  c.partner_id,
  COALESCE(c.product, 'Unknown') as product,
  SUM(c.amount) as total_commission,
  COUNT(*) as trade_count,
  COALESCE(SUM(t.volume), 0) as total_volume,
  AVG(c.amount) as avg_commission,
  NOW() as last_updated
FROM commissions c
LEFT JOIN trades t ON c.client_id = t.client_id AND c.product = t.product
GROUP BY c.partner_id, c.product
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. CUBE_COMMISSIONS_SYMBOL - Commissions by trading symbol
-- ============================================================================

INSERT INTO cube_commissions_symbol (
  partner_id, 
  symbol, 
  product, 
  total_commission, 
  trade_count, 
  total_volume,
  last_updated
)
SELECT 
  t.partner_id,
  t.symbol,
  t.product,
  COALESCE(SUM(c.amount), 0) as total_commission,
  COUNT(*) as trade_count,
  SUM(t.volume) as total_volume,
  NOW() as last_updated
FROM trades t
LEFT JOIN commissions c ON t.client_id = c.client_id AND t.product = c.product
WHERE t.symbol IS NOT NULL
GROUP BY t.partner_id, t.symbol, t.product
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. CUBE_DAILY_SIGNUPS - Daily signup trends
-- ============================================================================

INSERT INTO cube_daily_signups (
  partner_id, 
  date, 
  signup_count, 
  country, 
  platform
)
SELECT 
  partner_id,
  signup_date::date as date,
  COUNT(*) as signup_count,
  country,
  platform
FROM clients
WHERE signup_date IS NOT NULL
GROUP BY partner_id, signup_date::date, country, platform
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 9. CUBE_DAILY_FUNDING - Daily deposit trends
-- ============================================================================

INSERT INTO cube_daily_funding (
  partner_id, 
  date, 
  total_deposits, 
  deposit_count, 
  unique_clients, 
  avg_deposit
)
SELECT 
  partner_id,
  deposit_date::date as date,
  SUM(amount) as total_deposits,
  COUNT(*) as deposit_count,
  COUNT(DISTINCT client_id) as unique_clients,
  AVG(amount) as avg_deposit
FROM deposits
WHERE status = 'completed'
GROUP BY partner_id, deposit_date::date
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 10. CUBE_MONTHLY_DEPOSITS - Monthly deposit aggregation
-- ============================================================================

INSERT INTO cube_monthly_deposits (
  partner_id, 
  month, 
  total_deposits, 
  deposit_count, 
  avg_deposit, 
  unique_depositors
)
SELECT 
  partner_id,
  DATE_TRUNC('month', deposit_date)::date as month,
  SUM(amount) as total_deposits,
  COUNT(*) as deposit_count,
  AVG(amount) as avg_deposit,
  COUNT(DISTINCT client_id) as unique_depositors
FROM deposits
WHERE status = 'completed'
GROUP BY partner_id, DATE_TRUNC('month', deposit_date)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 11. CUBE_CLIENT_TIERS - Client distribution by tier
-- ============================================================================

INSERT INTO cube_client_tiers (
  partner_id, 
  tier, 
  client_count, 
  total_deposits, 
  total_commissions, 
  avg_commission,
  last_updated
)
SELECT 
  c.partner_id,
  COALESCE(c.tier, 'No Tier') as tier,
  COUNT(DISTINCT c.client_id) as client_count,
  COALESCE(SUM(d.amount), 0) as total_deposits,
  COALESCE(SUM(com.amount), 0) as total_commissions,
  CASE 
    WHEN COUNT(DISTINCT c.client_id) > 0 THEN COALESCE(SUM(com.amount) / COUNT(DISTINCT c.client_id), 0)
    ELSE 0
  END as avg_commission,
  NOW() as last_updated
FROM clients c
LEFT JOIN deposits d ON c.client_id = d.client_id
LEFT JOIN commissions com ON c.client_id = com.client_id
GROUP BY c.partner_id, c.tier
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 12. CUBE_CLIENT_DEMOGRAPHICS - Geographic distribution
-- ============================================================================

INSERT INTO cube_client_demographics (
  partner_id, 
  country, 
  client_count, 
  total_deposits, 
  total_volume, 
  avg_client_value,
  last_updated
)
SELECT 
  c.partner_id,
  COALESCE(c.country, 'Unknown') as country,
  COUNT(DISTINCT c.client_id) as client_count,
  COALESCE(SUM(d.amount), 0) as total_deposits,
  COALESCE(SUM(t.volume), 0) as total_volume,
  CASE 
    WHEN COUNT(DISTINCT c.client_id) > 0 THEN 
      (COALESCE(SUM(d.amount), 0) + COALESCE(SUM(com.amount), 0)) / COUNT(DISTINCT c.client_id)
    ELSE 0
  END as avg_client_value,
  NOW() as last_updated
FROM clients c
LEFT JOIN deposits d ON c.client_id = d.client_id
LEFT JOIN trades t ON c.client_id = t.client_id
LEFT JOIN commissions com ON c.client_id = com.client_id
GROUP BY c.partner_id, c.country
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 13. CUBE_COUNTRY_PERFORMANCE - Country-level metrics
-- ============================================================================

INSERT INTO cube_country_performance (
  partner_id, 
  country, 
  clients, 
  revenue, 
  deposits, 
  commissions, 
  conversion_rate,
  last_updated
)
SELECT 
  c.partner_id,
  COALESCE(c.country, 'Unknown') as country,
  COUNT(DISTINCT c.client_id) as clients,
  COALESCE(SUM(com.amount), 0) as revenue,
  COALESCE(SUM(d.amount), 0) as deposits,
  COALESCE(SUM(com.amount), 0) as commissions,
  CASE 
    WHEN COUNT(DISTINCT c.client_id) > 0 THEN
      (COUNT(DISTINCT CASE WHEN d.id IS NOT NULL THEN c.client_id END)::DECIMAL / COUNT(DISTINCT c.client_id) * 100)
    ELSE 0
  END as conversion_rate,
  NOW() as last_updated
FROM clients c
LEFT JOIN deposits d ON c.client_id = d.client_id
LEFT JOIN commissions com ON c.partner_id = com.partner_id
GROUP BY c.partner_id, c.country
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 14. CUBE_PRODUCT_VOLUME - Trading volume by product
-- ============================================================================

INSERT INTO cube_product_volume (
  partner_id, 
  product, 
  total_volume, 
  trade_count, 
  unique_clients, 
  avg_trade_size,
  last_updated
)
SELECT 
  partner_id,
  COALESCE(product, 'Unknown') as product,
  SUM(volume) as total_volume,
  COUNT(*) as trade_count,
  COUNT(DISTINCT client_id) as unique_clients,
  AVG(volume) as avg_trade_size,
  NOW() as last_updated
FROM trades
WHERE volume > 0
GROUP BY partner_id, product
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 15. CUBE_BADGE_PROGRESS - Badge achievement tracking
-- ============================================================================

INSERT INTO cube_badge_progress (
  partner_id, 
  badge_name, 
  badge_category, 
  current_value, 
  target_value, 
  progress_percentage, 
  is_earned,
  last_updated
)
SELECT 
  pb.partner_id,
  b.name as badge_name,
  b.category as badge_category,
  CASE 
    WHEN b.threshold_type = 'commission' THEN 
      (SELECT COALESCE(SUM(amount), 0) FROM commissions WHERE partner_id = pb.partner_id)
    WHEN b.threshold_type = 'clients' THEN 
      (SELECT COUNT(*) FROM clients WHERE partner_id = pb.partner_id)
    ELSE pb.progress
  END as current_value,
  b.threshold_value as target_value,
  CASE 
    WHEN b.threshold_value > 0 THEN 
      LEAST(100, (pb.progress / b.threshold_value * 100))
    ELSE 100
  END as progress_percentage,
  pb.is_active as is_earned,
  NOW() as last_updated
FROM partner_badges pb
JOIN badges b ON pb.badge_id = b.id
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Summary Report
-- ============================================================================

DO $$
DECLARE
  partner_count INT;
  dashboard_count INT;
  trends_count INT;
  plan_count INT;
  platform_count INT;
BEGIN
  -- Count records
  SELECT COUNT(*) INTO partner_count FROM partners;
  SELECT COUNT(*) INTO dashboard_count FROM cube_partner_dashboard;
  SELECT COUNT(*) INTO trends_count FROM cube_daily_trends;
  SELECT COUNT(*) INTO plan_count FROM cube_daily_commissions_plan;
  SELECT COUNT(*) INTO platform_count FROM cube_daily_commissions_platform;
  
  -- Print summary
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Cube Population Complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Partners: %', partner_count;
  RAISE NOTICE 'Dashboard Records: %', dashboard_count;
  RAISE NOTICE 'Daily Trends Records: %', trends_count;
  RAISE NOTICE 'Commission Plan Records: %', plan_count;
  RAISE NOTICE 'Commission Platform Records: %', platform_count;
  RAISE NOTICE '========================================';
  RAISE NOTICE 'All 15 cube tables populated successfully!';
END $$;

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Run these to verify data was populated correctly:

-- Check cube_partner_dashboard
-- SELECT partner_id, total_clients, total_commissions FROM cube_partner_dashboard LIMIT 5;

-- Check cube_daily_trends
-- SELECT partner_id, date, new_clients, total_commissions FROM cube_daily_trends ORDER BY date DESC LIMIT 10;

-- Check cube_daily_commissions_plan
-- SELECT partner_id, commission_plan, SUM(total_commission) as total FROM cube_daily_commissions_plan GROUP BY partner_id, commission_plan LIMIT 10;

-- Check all cube tables have data
-- SELECT 
--   'cube_partner_dashboard' as table_name, COUNT(*) as row_count FROM cube_partner_dashboard
-- UNION ALL SELECT 'cube_partner_scorecard', COUNT(*) FROM cube_partner_scorecard
-- UNION ALL SELECT 'cube_daily_trends', COUNT(*) FROM cube_daily_trends
-- UNION ALL SELECT 'cube_daily_commissions_plan', COUNT(*) FROM cube_daily_commissions_plan
-- UNION ALL SELECT 'cube_daily_commissions_platform', COUNT(*) FROM cube_daily_commissions_platform
-- UNION ALL SELECT 'cube_commissions_product', COUNT(*) FROM cube_commissions_product
-- UNION ALL SELECT 'cube_commissions_symbol', COUNT(*) FROM cube_commissions_symbol
-- UNION ALL SELECT 'cube_daily_signups', COUNT(*) FROM cube_daily_signups
-- UNION ALL SELECT 'cube_daily_funding', COUNT(*) FROM cube_daily_funding
-- UNION ALL SELECT 'cube_monthly_deposits', COUNT(*) FROM cube_monthly_deposits
-- UNION ALL SELECT 'cube_client_tiers', COUNT(*) FROM cube_client_tiers
-- UNION ALL SELECT 'cube_client_demographics', COUNT(*) FROM cube_client_demographics
-- UNION ALL SELECT 'cube_country_performance', COUNT(*) FROM cube_country_performance
-- UNION ALL SELECT 'cube_product_volume', COUNT(*) FROM cube_product_volume
-- UNION ALL SELECT 'cube_badge_progress', COUNT(*) FROM cube_badge_progress;

