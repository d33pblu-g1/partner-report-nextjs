-- ============================================================================
-- FIX ALL MAIN TABLES - Match Actual MySQL Database Structure
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. FIX PARTNER_TIERS TABLE (tier definitions, not history)
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
-- 2. FIX PARTNER_MONTHLY_COMMISSIONS TABLE
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
-- 3. FIX PARTNER_BADGES TABLE (simplified structure)
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
-- 4. FIX PARTNER_LINKS TABLE (commission links, not tracking links)
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
-- 5. FIX BADGES TABLE (simplified badge definitions)
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
  RAISE NOTICE '✅ All main tables fixed!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Tables updated:';
  RAISE NOTICE '  - partner_tiers (tier definitions)';
  RAISE NOTICE '  - partner_monthly_commissions (with month_year, tier_reward, etc.)';
  RAISE NOTICE '  - partner_badges (simplified: partner_id, badge_name, earned_date)';
  RAISE NOTICE '  - partner_links (commission links structure)';
  RAISE NOTICE '  - badges (simplified: badge_name, badge_criteria, badge_trigger)';
  RAISE NOTICE '';
  RAISE NOTICE 'You can now import your CSV files!';
END $$;

