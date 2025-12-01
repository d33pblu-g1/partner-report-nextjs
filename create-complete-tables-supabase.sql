-- Complete Supabase Schema Matching MySQL
-- Run this in Supabase SQL Editor BEFORE importing CSV files

-- ============================================================================
-- Drop existing tables if you want to recreate (CAREFUL - this deletes data!)
-- ============================================================================

-- Uncomment these if you want to start fresh:
-- DROP TABLE IF EXISTS partner_badges CASCADE;
-- DROP TABLE IF EXISTS partner_tiers CASCADE;
-- DROP TABLE IF EXISTS trades CASCADE;
-- DROP TABLE IF EXISTS deposits CASCADE;
-- DROP TABLE IF EXISTS clients CASCADE;
-- DROP TABLE IF EXISTS partner_links CASCADE;
-- DROP TABLE IF EXISTS partner_monthly_commissions CASCADE;
-- DROP TABLE IF EXISTS partner_tier_config CASCADE;
-- DROP TABLE IF EXISTS badges CASCADE;
-- DROP TABLE IF EXISTS partners CASCADE;

-- ============================================================================
-- 1. Partner Tier Config (needs to be first - referenced by partners)
-- ============================================================================

CREATE TABLE IF NOT EXISTS partner_tier_config (
  id SERIAL PRIMARY KEY,
  tier_name VARCHAR(50) NOT NULL UNIQUE,
  min_commission DECIMAL(10,2) NOT NULL,
  max_commission DECIMAL(10,2),
  reward_percentage DECIMAL(5,2) NOT NULL,
  description TEXT,
  tier_color VARCHAR(20),
  tier_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 2. Partners Table (complete with all MySQL columns)
-- ============================================================================

CREATE TABLE IF NOT EXISTS partners (
  partner_id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  join_date DATE,
  age INTEGER,
  tier VARCHAR(50),
  country_manager VARCHAR(255),
  country_manager_tel VARCHAR(50),
  "Country_Rank" INTEGER,  -- Note: capital letters preserved
  global_rank INTEGER,
  "Alternate_Accounts" TEXT,  -- Note: capital letters preserved
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  current_tier VARCHAR(20) DEFAULT 'Bronze',
  three_month_avg_commission DECIMAL(10,2) DEFAULT 0.00,
  tier_reward_percentage DECIMAL(5,2) DEFAULT 0.00,
  tier_last_calculated TIMESTAMP,
  tier_status VARCHAR(20) DEFAULT 'stable',
  previous_tier VARCHAR(20)
);

-- ============================================================================
-- 3. Badges Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  category VARCHAR(100),
  badge_criteria TEXT,
  threshold_type VARCHAR(50),
  threshold_value DECIMAL(15,2),
  tier_requirement VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 4. Clients Table (complete with all MySQL columns)
-- ============================================================================

CREATE TABLE IF NOT EXISTS clients (
  binary_user_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  country VARCHAR(100),
  "joinDate" DATE,  -- Note: camelCase preserved
  "partnerId" VARCHAR(20),
  tier VARCHAR(50),
  gender VARCHAR(20),
  age INTEGER,
  account_type VARCHAR(50),
  "accountNumber" TEXT,
  sub_partner BOOLEAN DEFAULT FALSE,
  "preferredLanguage" VARCHAR(100),
  "commissionPlan" VARCHAR(100),
  "trackingLinkUsed" VARCHAR(255),
  total_trades INTEGER,
  "lifetimeDeposits" DECIMAL(15,2),
  "PNL" DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("partnerId") REFERENCES partners(partner_id)
);

-- ============================================================================
-- 5. Deposits Table (complete with all MySQL columns)
-- ============================================================================

CREATE TABLE IF NOT EXISTS deposits (
  id SERIAL PRIMARY KEY,
  binary_user_id_1 VARCHAR(50),
  transaction_id VARCHAR(50),
  payment_id VARCHAR(50),
  account_id VARCHAR(50),
  partner_id VARCHAR(50),
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  deposit_date TIMESTAMP DEFAULT NOW(),
  payment_method VARCHAR(100),
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id)
);

-- ============================================================================
-- 6. Trades Table (complete with all MySQL columns)
-- ============================================================================

CREATE TABLE IF NOT EXISTS trades (
  id SERIAL PRIMARY KEY,
  binary_user_id VARCHAR(50),
  partner_id VARCHAR(50),
  account_id VARCHAR(50),
  account_type VARCHAR(50),
  trade_date TIMESTAMP DEFAULT NOW(),
  symbol VARCHAR(50),
  product VARCHAR(100),
  platform VARCHAR(50),
  volume DECIMAL(15,2),
  profit_loss DECIMAL(10,2),
  contract_type VARCHAR(50),
  buy_price DECIMAL(15,6),
  sell_price DECIMAL(15,6),
  commission DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id)
);

-- ============================================================================
-- 7. Partner Links Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS partner_links (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(20),
  link_name VARCHAR(255) NOT NULL,
  link_url TEXT,
  campaign_source VARCHAR(100),
  campaign_medium VARCHAR(100),
  tracking_code VARCHAR(255),
  created_date TIMESTAMP DEFAULT NOW(),
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id)
);

-- ============================================================================
-- 8. Partner Badges Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS partner_badges (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(20),
  badge_id INTEGER,
  badge_name VARCHAR(255),
  earned_date TIMESTAMP DEFAULT NOW(),
  progress DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(partner_id, badge_id),
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id),
  FOREIGN KEY (badge_id) REFERENCES badges(id)
);

-- ============================================================================
-- 9. Partner Tiers Table (History)
-- ============================================================================

CREATE TABLE IF NOT EXISTS partner_tiers (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(20),
  tier VARCHAR(50) NOT NULL,
  effective_date DATE NOT NULL,
  range_description TEXT,
  avg_commission DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id)
);

-- ============================================================================
-- 10. Partner Monthly Commissions Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS partner_monthly_commissions (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(20),
  month DATE NOT NULL,
  commission_plan VARCHAR(100),
  platform VARCHAR(50),
  product VARCHAR(100),
  base_commission DECIMAL(10,2) DEFAULT 0,
  bonus_commission DECIMAL(10,2) DEFAULT 0,
  total_commission DECIMAL(10,2) DEFAULT 0,
  client_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id)
);

-- ============================================================================
-- Create Indexes for Performance
-- ============================================================================

-- Partners indexes
CREATE INDEX IF NOT EXISTS idx_partners_tier ON partners(tier);
CREATE INDEX IF NOT EXISTS idx_partners_country_rank ON partners("Country_Rank");
CREATE INDEX IF NOT EXISTS idx_partners_global_rank ON partners(global_rank);

-- Clients indexes
CREATE INDEX IF NOT EXISTS idx_clients_partner ON clients("partnerId");
CREATE INDEX IF NOT EXISTS idx_clients_country ON clients(country);
CREATE INDEX IF NOT EXISTS idx_clients_tier ON clients(tier);
CREATE INDEX IF NOT EXISTS idx_clients_join_date ON clients("joinDate");

-- Deposits indexes
CREATE INDEX IF NOT EXISTS idx_deposits_partner ON deposits(partner_id);
CREATE INDEX IF NOT EXISTS idx_deposits_date ON deposits(deposit_date);
CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits(binary_user_id_1);

-- Trades indexes
CREATE INDEX IF NOT EXISTS idx_trades_partner ON trades(partner_id);
CREATE INDEX IF NOT EXISTS idx_trades_date ON trades(trade_date);
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON trades(symbol);
CREATE INDEX IF NOT EXISTS idx_trades_user ON trades(binary_user_id);

-- Partner Links indexes
CREATE INDEX IF NOT EXISTS idx_partner_links_partner ON partner_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_links_active ON partner_links(is_active);

-- ============================================================================
-- Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_tier_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_monthly_commissions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies (Allow public read for now)
-- ============================================================================

-- Drop existing policies first (if any)
DROP POLICY IF EXISTS "Allow public read partners" ON partners;
DROP POLICY IF EXISTS "Allow public read clients" ON clients;
DROP POLICY IF EXISTS "Allow public read deposits" ON deposits;
DROP POLICY IF EXISTS "Allow public read trades" ON trades;
DROP POLICY IF EXISTS "Allow public read partner_links" ON partner_links;
DROP POLICY IF EXISTS "Allow public read badges" ON badges;
DROP POLICY IF EXISTS "Allow public read partner_badges" ON partner_badges;
DROP POLICY IF EXISTS "Allow public read partner_tier_config" ON partner_tier_config;
DROP POLICY IF EXISTS "Allow public read partner_tiers" ON partner_tiers;
DROP POLICY IF EXISTS "Allow public read partner_monthly_commissions" ON partner_monthly_commissions;

-- Create new policies
CREATE POLICY "Allow public read partners" ON partners FOR SELECT USING (true);
CREATE POLICY "Allow public read clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow public read deposits" ON deposits FOR SELECT USING (true);
CREATE POLICY "Allow public read trades" ON trades FOR SELECT USING (true);
CREATE POLICY "Allow public read partner_links" ON partner_links FOR SELECT USING (true);
CREATE POLICY "Allow public read badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Allow public read partner_badges" ON partner_badges FOR SELECT USING (true);
CREATE POLICY "Allow public read partner_tier_config" ON partner_tier_config FOR SELECT USING (true);
CREATE POLICY "Allow public read partner_tiers" ON partner_tiers FOR SELECT USING (true);
CREATE POLICY "Allow public read partner_monthly_commissions" ON partner_monthly_commissions FOR SELECT USING (true);

-- ============================================================================
-- Insert Default Tier Configuration
-- ============================================================================

INSERT INTO partner_tier_config (tier_name, min_commission, max_commission, reward_percentage, tier_color, tier_order, description)
VALUES
  ('Bronze', 0, 999.99, 3.00, '#CD7F32', 1, 'Entry level tier'),
  ('Silver', 1000, 2999.99, 4.50, '#C0C0C0', 2, 'Intermediate tier'),
  ('Gold', 3000, 4999.99, 6.00, '#FFD700', 3, 'Advanced tier'),
  ('Platinum', 5000, 9999.99, 7.50, '#E5E4E2', 4, 'Premium tier'),
  ('Diamond', 10000, NULL, 10.00, '#B9F2FF', 5, 'Elite tier')
ON CONFLICT (tier_name) DO NOTHING;

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Schema created successfully!';
  RAISE NOTICE 'You can now import your CSV files.';
END $$;

