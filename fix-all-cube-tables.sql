-- ============================================================================
-- Fix ALL Analytics/Cube Tables - Run this in Supabase SQL Editor
-- This replaces the incorrect table structures with the actual MySQL structures
-- ============================================================================

-- ============================================================================
-- 1. FIX TRADES TABLE
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
-- 2. FIX DEPOSITS TABLE
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
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Trades and Deposits tables fixed!';
  RAISE NOTICE 'You can now import your CSV files.';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Tables updated:';
  RAISE NOTICE '  - trades (analytics/cube structure)';
  RAISE NOTICE '  - deposits (transaction structure)';
END $$;

