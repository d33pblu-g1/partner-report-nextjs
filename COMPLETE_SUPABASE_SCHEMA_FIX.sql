-- ============================================================================
-- COMPLETE SUPABASE SCHEMA - Matching Actual MySQL Database
-- Run this ONCE in Supabase SQL Editor to fix all table structures
-- ============================================================================
-- This replaces all incorrectly structured tables with the actual MySQL structure
-- ============================================================================

-- ============================================================================
-- PART 1: CORE TABLES (Already Correct)
-- ============================================================================
-- partners, clients, partner_tier_config are already correct from the first schema
-- We only need to fix the tables that have mismatched columns
-- ============================================================================

-- ============================================================================
-- 1. FIX TRADES TABLE (Analytics Cube)
-- ============================================================================

DROP TABLE IF EXISTS trades CASCADE;

CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  date DATE,
  binary_user_id VARCHAR(50),
  loginid VARCHAR(50),
  platform VARCHAR(100),
  app_name VARCHAR(100),
  account_type VARCHAR(50),
  contract_type VARCHAR(100),
  asset_type VARCHAR(100),
  asset VARCHAR(255),
  number_of_trades INTEGER,
  closed_pnl_usd DECIMAL(15,2),
  closed_pnl_usd_abook DECIMAL(15,2),
  closed_pnl_usd_bbook DECIMAL(15,2),
  floating_pnl_usd DECIMAL(15,2),
  floating_pnl DECIMAL(15,2),
  expected_revenue_usd DECIMAL(15,2),
  closed_pnl DECIMAL(15,2),
  swaps_usd DECIMAL(15,2),
  volume_usd DECIMAL(15,2),
  is_synthetic BOOLEAN,
  is_financial BOOLEAN,
  app_markup_usd DECIMAL(15,2),
  affiliated_partner_id VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_trades_date ON trades(date);
CREATE INDEX idx_trades_user ON trades(binary_user_id);
CREATE INDEX idx_trades_platform ON trades(platform);
CREATE INDEX idx_trades_contract ON trades(contract_type);
CREATE INDEX idx_trades_partner ON trades(affiliated_partner_id);

ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read trades" ON trades;
CREATE POLICY "Allow public read trades" ON trades FOR SELECT USING (true);

-- ============================================================================
-- 2. FIX DEPOSITS TABLE (Transaction Data)
-- ============================================================================

DROP TABLE IF EXISTS deposits CASCADE;

CREATE TABLE deposits (
  id SERIAL PRIMARY KEY,
  binary_user_id_1 VARCHAR(50),
  transaction_id VARCHAR(50),
  payment_id VARCHAR(50),
  currency_code VARCHAR(10),
  transaction_time TIMESTAMP,
  amount DECIMAL(15,2),
  payment_gateway_code VARCHAR(100),
  payment_type_code VARCHAR(100),
  account_id VARCHAR(50),
  client_loginid VARCHAR(50),
  remark TEXT,
  transfer_fees DECIMAL(15,2),
  is_pa VARCHAR(10),
  amount_usd DECIMAL(15,2),
  transfer_type VARCHAR(100),
  category VARCHAR(100),
  payment_processor VARCHAR(100),
  payment_method VARCHAR(100),
  affiliate_id VARCHAR(50),
  target_loginid VARCHAR(50),
  target_is_pa VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deposits_user ON deposits(binary_user_id_1);
CREATE INDEX idx_deposits_time ON deposits(transaction_time);
CREATE INDEX idx_deposits_category ON deposits(category);
CREATE INDEX idx_deposits_affiliate ON deposits(affiliate_id);

ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read deposits" ON deposits;
CREATE POLICY "Allow public read deposits" ON deposits FOR SELECT USING (true);

-- ============================================================================
-- 3. FIX PARTNER_TIERS TABLE (Tier Definitions, NOT History)
-- ============================================================================

DROP TABLE IF EXISTS partner_tiers CASCADE;

CREATE TABLE partner_tiers (
  id SERIAL PRIMARY KEY,
  tier VARCHAR(50) NOT NULL,
  range_description VARCHAR(255),
  reward VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE partner_tiers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read partner_tiers" ON partner_tiers;
CREATE POLICY "Allow public read partner_tiers" ON partner_tiers FOR SELECT USING (true);

-- ============================================================================
-- 4. FIX PARTNER_MONTHLY_COMMISSIONS TABLE
-- ============================================================================

DROP TABLE IF EXISTS partner_monthly_commissions CASCADE;

CREATE TABLE partner_monthly_commissions (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(20) NOT NULL,
  month_year VARCHAR(7) NOT NULL,
  year_val INTEGER NOT NULL,
  month_val INTEGER NOT NULL,
  base_commission DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  tier_reward DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  total_commission DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  tier_at_month_end VARCHAR(20),
  three_month_average DECIMAL(15,2),
  tier_reward_percentage DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_partner_monthly_commissions_partner ON partner_monthly_commissions(partner_id);
CREATE INDEX idx_partner_monthly_commissions_month ON partner_monthly_commissions(month_year);
CREATE INDEX idx_partner_monthly_commissions_tier ON partner_monthly_commissions(tier_at_month_end);

ALTER TABLE partner_monthly_commissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read partner_monthly_commissions" ON partner_monthly_commissions;
CREATE POLICY "Allow public read partner_monthly_commissions" ON partner_monthly_commissions FOR SELECT USING (true);

-- ============================================================================
-- 5. FIX PARTNER_BADGES TABLE (Simplified)
-- ============================================================================

DROP TABLE IF EXISTS partner_badges CASCADE;

CREATE TABLE partner_badges (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(20) NOT NULL,
  badge_name VARCHAR(50) NOT NULL,
  earned_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_partner_badges_partner ON partner_badges(partner_id);
CREATE INDEX idx_partner_badges_name ON partner_badges(badge_name);

ALTER TABLE partner_badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read partner_badges" ON partner_badges;
CREATE POLICY "Allow public read partner_badges" ON partner_badges FOR SELECT USING (true);

-- ============================================================================
-- 6. FIX PARTNER_LINKS TABLE (Commission Links Structure)
-- ============================================================================

DROP TABLE IF EXISTS partner_links CASCADE;

CREATE TABLE partner_links (
  commission_id SERIAL PRIMARY KEY,
  partner_id VARCHAR(20) NOT NULL,
  commission_plan VARCHAR(100),
  type VARCHAR(50) NOT NULL,
  target VARCHAR(100),
  language VARCHAR(10) DEFAULT 'en',
  url VARCHAR(2048) NOT NULL,
  landing_page VARCHAR(2048),
  description TEXT,
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_partner_links_partner ON partner_links(partner_id);
CREATE INDEX idx_partner_links_plan ON partner_links(commission_plan);
CREATE INDEX idx_partner_links_type ON partner_links(type);
CREATE INDEX idx_partner_links_status ON partner_links(status);

ALTER TABLE partner_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read partner_links" ON partner_links;
CREATE POLICY "Allow public read partner_links" ON partner_links FOR SELECT USING (true);

-- ============================================================================
-- 7. FIX BADGES TABLE (Simplified Badge Definitions)
-- ============================================================================

DROP TABLE IF EXISTS badges CASCADE;

CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  badge_name VARCHAR(50) NOT NULL UNIQUE,
  badge_criteria VARCHAR(50) NOT NULL,
  badge_trigger VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_badges_criteria ON badges(badge_criteria);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read badges" ON badges;
CREATE POLICY "Allow public read badges" ON badges FOR SELECT USING (true);

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅✅✅ ALL TABLES FIXED! ✅✅✅';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Tables corrected to match MySQL database:';
  RAISE NOTICE '  1. trades (analytics cube structure)';
  RAISE NOTICE '  2. deposits (transaction structure)';
  RAISE NOTICE '  3. partner_tiers (tier definitions)';
  RAISE NOTICE '  4. partner_monthly_commissions (monthly data)';
  RAISE NOTICE '  5. partner_badges (simplified)';
  RAISE NOTICE '  6. partner_links (commission links)';
  RAISE NOTICE '  7. badges (badge definitions)';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 You can now import ALL your CSV files!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Tables that are already correct (no changes needed):';
  RAISE NOTICE '  - partners';
  RAISE NOTICE '  - clients';
  RAISE NOTICE '  - partner_tier_config';
END $$;

