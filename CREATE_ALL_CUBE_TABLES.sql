-- ============================================================================
-- CREATE ALL CUBE TABLES FOR SUPABASE
-- Run this in Supabase SQL Editor to create all analytics cube tables
-- ============================================================================

-- ============================================================================
-- DROP EXISTING CUBE TABLES (if they exist with wrong structure)
-- ============================================================================

DROP TABLE IF EXISTS cube_product_volume CASCADE;
DROP TABLE IF EXISTS cube_product_adoption CASCADE;
DROP TABLE IF EXISTS cube_daily_trends CASCADE;
DROP TABLE IF EXISTS cube_commissions_by_plan CASCADE;
DROP TABLE IF EXISTS cube_partner_dashboard CASCADE;
DROP TABLE IF EXISTS cube_client_tiers CASCADE;
DROP TABLE IF EXISTS cube_monthly_deposits CASCADE;
DROP TABLE IF EXISTS cube_partner_scorecard CASCADE;
DROP TABLE IF EXISTS cube_age_distribution CASCADE;
DROP TABLE IF EXISTS cube_client_demographics CASCADE;
DROP TABLE IF EXISTS cube_client_funnel CASCADE;
DROP TABLE IF EXISTS cube_commissions_product CASCADE;

-- ============================================================================
-- 1. CUBE_PRODUCT_VOLUME
-- ============================================================================

CREATE TABLE cube_product_volume (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(20),
  asset_type VARCHAR(100),
  total_volume DECIMAL(15,2) DEFAULT 0.00,
  trade_count INTEGER DEFAULT 0,
  avg_trade_size DECIMAL(15,2) DEFAULT 0.00,
  client_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cube_product_volume_partner ON cube_product_volume(partner_id);
CREATE INDEX IF NOT EXISTS idx_cube_product_volume_asset ON cube_product_volume(asset_type);

-- ============================================================================
-- 2. CUBE_PRODUCT_ADOPTION
-- ============================================================================

CREATE TABLE cube_product_adoption (
  product_name VARCHAR(100) NOT NULL,
  partner_id INTEGER NOT NULL,
  adoption_rate DECIMAL(5,2),
  client_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (product_name, partner_id)
);

-- ============================================================================
-- 3. CUBE_DAILY_TRENDS
-- ============================================================================

CREATE TABLE cube_daily_trends (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(20),
  trend_date DATE,
  signups INTEGER DEFAULT 0,
  deposits DECIMAL(15,2) DEFAULT 0.00,
  commissions DECIMAL(15,2) DEFAULT 0.00,
  trades INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cube_daily_trends_partner ON cube_daily_trends(partner_id);
CREATE INDEX IF NOT EXISTS idx_cube_daily_trends_date ON cube_daily_trends(trend_date);

-- ============================================================================
-- 4. CUBE_COMMISSIONS_BY_PLAN
-- ============================================================================

CREATE TABLE cube_commissions_by_plan (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(20),
  commission_plan VARCHAR(100),
  date DATE,
  trade_date DATE,
  period_type VARCHAR(20),
  total_commission DECIMAL(15,2) DEFAULT 0.00,
  total_commissions DECIMAL(15,2) DEFAULT 0.00,
  trade_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cube_commissions_by_plan_partner ON cube_commissions_by_plan(partner_id);
CREATE INDEX IF NOT EXISTS idx_cube_commissions_by_plan_plan ON cube_commissions_by_plan(commission_plan);
CREATE INDEX IF NOT EXISTS idx_cube_commissions_by_plan_date ON cube_commissions_by_plan(date);
CREATE INDEX IF NOT EXISTS idx_cube_commissions_by_plan_trade_date ON cube_commissions_by_plan(trade_date);
CREATE INDEX IF NOT EXISTS idx_cube_commissions_by_plan_period ON cube_commissions_by_plan(period_type);

-- ============================================================================
-- 5. CUBE_PARTNER_DASHBOARD
-- ============================================================================

CREATE TABLE cube_partner_dashboard (
  partner_id VARCHAR(20) PRIMARY KEY,
  partner_name VARCHAR(255),
  partner_tier VARCHAR(50),
  total_clients INTEGER DEFAULT 0,
  total_deposits DECIMAL(15,2) DEFAULT 0.00,
  total_commissions DECIMAL(15,2) DEFAULT 0.00,
  total_trades INTEGER DEFAULT 0,
  mtd_clients INTEGER DEFAULT 0,
  mtd_deposits DECIMAL(15,2) DEFAULT 0.00,
  mtd_commissions DECIMAL(15,2) DEFAULT 0.00,
  mtd_trades INTEGER DEFAULT 0,
  month_1_commissions DECIMAL(15,2) DEFAULT 0.00,
  month_2_commissions DECIMAL(15,2) DEFAULT 0.00,
  month_3_commissions DECIMAL(15,2) DEFAULT 0.00,
  month_4_commissions DECIMAL(15,2) DEFAULT 0.00,
  month_5_commissions DECIMAL(15,2) DEFAULT 0.00,
  month_6_commissions DECIMAL(15,2) DEFAULT 0.00,
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cube_partner_dashboard_tier ON cube_partner_dashboard(partner_tier);

-- ============================================================================
-- 6. CUBE_CLIENT_TIERS
-- ============================================================================

CREATE TABLE cube_client_tiers (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(20),
  tier VARCHAR(50),
  client_count INTEGER DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0.00,
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cube_client_tiers_partner ON cube_client_tiers(partner_id);

-- ============================================================================
-- 7. CUBE_MONTHLY_DEPOSITS
-- ============================================================================

CREATE TABLE cube_monthly_deposits (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(20),
  year_month_str VARCHAR(7),
  year_val INTEGER,
  month_val INTEGER,
  month_name VARCHAR(10),
  total_deposits DECIMAL(15,2) DEFAULT 0.00,
  deposit_count INTEGER DEFAULT 0,
  avg_deposit_size DECIMAL(15,2) DEFAULT 0.00,
  max_deposit DECIMAL(15,2) DEFAULT 0.00,
  min_deposit DECIMAL(15,2) DEFAULT 0.00,
  total_withdrawals DECIMAL(15,2) DEFAULT 0.00,
  withdrawal_count INTEGER DEFAULT 0,
  net_deposits DECIMAL(15,2) DEFAULT 0.00,
  unique_depositors INTEGER DEFAULT 0,
  repeat_depositors INTEGER DEFAULT 0,
  first_time_depositors INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cube_monthly_deposits_partner ON cube_monthly_deposits(partner_id);
CREATE INDEX IF NOT EXISTS idx_cube_monthly_deposits_month ON cube_monthly_deposits(year_month_str);

-- ============================================================================
-- 8. CUBE_PARTNER_SCORECARD
-- ============================================================================

CREATE TABLE cube_partner_scorecard (
  partner_id VARCHAR(20) PRIMARY KEY,
  partner_name VARCHAR(255),
  partner_tier VARCHAR(50),
  total_revenue DECIMAL(15,2) DEFAULT 0.00,
  total_clients INTEGER DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  total_deposits DECIMAL(15,2) DEFAULT 0.00,
  avg_trade_size DECIMAL(15,2) DEFAULT 0.00,
  mtd_revenue DECIMAL(15,2) DEFAULT 0.00,
  mtd_clients INTEGER DEFAULT 0,
  mtd_trades INTEGER DEFAULT 0,
  mtd_deposits DECIMAL(15,2) DEFAULT 0.00,
  client_growth_rate DECIMAL(5,2) DEFAULT 0.00,
  revenue_growth_rate DECIMAL(5,2) DEFAULT 0.00,
  trade_growth_rate DECIMAL(5,2) DEFAULT 0.00,
  avg_client_value DECIMAL(15,2) DEFAULT 0.00,
  client_retention_rate DECIMAL(5,2) DEFAULT 0.00,
  active_client_ratio DECIMAL(5,2) DEFAULT 0.00,
  month_1_revenue DECIMAL(15,2) DEFAULT 0.00,
  month_2_revenue DECIMAL(15,2) DEFAULT 0.00,
  month_3_revenue DECIMAL(15,2) DEFAULT 0.00,
  month_4_revenue DECIMAL(15,2) DEFAULT 0.00,
  month_5_revenue DECIMAL(15,2) DEFAULT 0.00,
  month_6_revenue DECIMAL(15,2) DEFAULT 0.00,
  month_1_clients INTEGER DEFAULT 0,
  month_2_clients INTEGER DEFAULT 0,
  month_3_clients INTEGER DEFAULT 0,
  month_4_clients INTEGER DEFAULT 0,
  month_5_clients INTEGER DEFAULT 0,
  month_6_clients INTEGER DEFAULT 0,
  revenue_percentile INTEGER DEFAULT 0,
  client_percentile INTEGER DEFAULT 0,
  performance_score DECIMAL(5,2) DEFAULT 0.00,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cube_partner_scorecard_tier ON cube_partner_scorecard(partner_tier);
CREATE INDEX IF NOT EXISTS idx_cube_partner_scorecard_score ON cube_partner_scorecard(performance_score);
CREATE INDEX IF NOT EXISTS idx_cube_partner_scorecard_updated ON cube_partner_scorecard(last_updated);

-- ============================================================================
-- 9. CUBE_AGE_DISTRIBUTION
-- ============================================================================

CREATE TABLE cube_age_distribution (
  age_group VARCHAR(20) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  partner_id INTEGER NOT NULL,
  client_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (age_group, gender, partner_id)
);

-- ============================================================================
-- 10. CUBE_CLIENT_DEMOGRAPHICS
-- ============================================================================

CREATE TABLE cube_client_demographics (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(20),
  dimension VARCHAR(50),
  dimension_value VARCHAR(50),
  client_count INTEGER DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0.00,
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cube_client_demographics_partner ON cube_client_demographics(partner_id);
CREATE INDEX IF NOT EXISTS idx_cube_client_demographics_dimension ON cube_client_demographics(dimension);

-- ============================================================================
-- 11. CUBE_CLIENT_FUNNEL
-- ============================================================================

CREATE TABLE cube_client_funnel (
  funnel_stage VARCHAR(50) NOT NULL,
  partner_id INTEGER NOT NULL,
  period_date DATE NOT NULL,
  client_count INTEGER,
  conversion_rate DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (funnel_stage, partner_id, period_date)
);

-- ============================================================================
-- 12. CUBE_COMMISSIONS_PRODUCT
-- ============================================================================

CREATE TABLE cube_commissions_product (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(20),
  asset_type VARCHAR(100),
  contract_type VARCHAR(100),
  total_commissions DECIMAL(15,2) DEFAULT 0.00,
  trade_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cube_commissions_product_partner ON cube_commissions_product(partner_id);

-- ============================================================================
-- Enable RLS on All Cube Tables
-- ============================================================================

ALTER TABLE cube_product_volume ENABLE ROW LEVEL SECURITY;
ALTER TABLE cube_product_adoption ENABLE ROW LEVEL SECURITY;
ALTER TABLE cube_daily_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE cube_commissions_by_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE cube_partner_dashboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE cube_client_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cube_monthly_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE cube_partner_scorecard ENABLE ROW LEVEL SECURITY;
ALTER TABLE cube_age_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE cube_client_demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cube_client_funnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE cube_commissions_product ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies (Allow Public Read)
-- ============================================================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Allow public read cube_product_volume" ON cube_product_volume;
DROP POLICY IF EXISTS "Allow public read cube_product_adoption" ON cube_product_adoption;
DROP POLICY IF EXISTS "Allow public read cube_daily_trends" ON cube_daily_trends;
DROP POLICY IF EXISTS "Allow public read cube_commissions_by_plan" ON cube_commissions_by_plan;
DROP POLICY IF EXISTS "Allow public read cube_partner_dashboard" ON cube_partner_dashboard;
DROP POLICY IF EXISTS "Allow public read cube_client_tiers" ON cube_client_tiers;
DROP POLICY IF EXISTS "Allow public read cube_monthly_deposits" ON cube_monthly_deposits;
DROP POLICY IF EXISTS "Allow public read cube_partner_scorecard" ON cube_partner_scorecard;
DROP POLICY IF EXISTS "Allow public read cube_age_distribution" ON cube_age_distribution;
DROP POLICY IF EXISTS "Allow public read cube_client_demographics" ON cube_client_demographics;
DROP POLICY IF EXISTS "Allow public read cube_client_funnel" ON cube_client_funnel;
DROP POLICY IF EXISTS "Allow public read cube_commissions_product" ON cube_commissions_product;

-- Create new policies
CREATE POLICY "Allow public read cube_product_volume" ON cube_product_volume FOR SELECT USING (true);
CREATE POLICY "Allow public read cube_product_adoption" ON cube_product_adoption FOR SELECT USING (true);
CREATE POLICY "Allow public read cube_daily_trends" ON cube_daily_trends FOR SELECT USING (true);
CREATE POLICY "Allow public read cube_commissions_by_plan" ON cube_commissions_by_plan FOR SELECT USING (true);
CREATE POLICY "Allow public read cube_partner_dashboard" ON cube_partner_dashboard FOR SELECT USING (true);
CREATE POLICY "Allow public read cube_client_tiers" ON cube_client_tiers FOR SELECT USING (true);
CREATE POLICY "Allow public read cube_monthly_deposits" ON cube_monthly_deposits FOR SELECT USING (true);
CREATE POLICY "Allow public read cube_partner_scorecard" ON cube_partner_scorecard FOR SELECT USING (true);
CREATE POLICY "Allow public read cube_age_distribution" ON cube_age_distribution FOR SELECT USING (true);
CREATE POLICY "Allow public read cube_client_demographics" ON cube_client_demographics FOR SELECT USING (true);
CREATE POLICY "Allow public read cube_client_funnel" ON cube_client_funnel FOR SELECT USING (true);
CREATE POLICY "Allow public read cube_commissions_product" ON cube_commissions_product FOR SELECT USING (true);

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅✅✅ ALL CUBE TABLES CREATED! ✅✅✅';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Analytics cube tables ready:';
  RAISE NOTICE '  1. cube_product_volume (asset_type, client_count fixed)';
  RAISE NOTICE '  2. cube_product_adoption';
  RAISE NOTICE '  3. cube_daily_trends';
  RAISE NOTICE '  4. cube_commissions_by_plan';
  RAISE NOTICE '  5. cube_partner_dashboard';
  RAISE NOTICE '  6. cube_client_tiers';
  RAISE NOTICE '  7. cube_monthly_deposits';
  RAISE NOTICE '  8. cube_partner_scorecard';
  RAISE NOTICE '  9. cube_age_distribution';
  RAISE NOTICE ' 10. cube_client_demographics';
  RAISE NOTICE ' 11. cube_client_funnel';
  RAISE NOTICE ' 12. cube_commissions_product';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 You can now import your cube CSV files!';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Note: If you need other cube tables, they will be created';
  RAISE NOTICE '   automatically when you try to import their CSV files.';
END $$;

