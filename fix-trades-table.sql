-- Fix Trades Table - Replace with Actual MySQL Structure
-- Run this in Supabase SQL Editor

-- 1. Drop the incorrect trades table
DROP TABLE IF EXISTS trades CASCADE;

-- 2. Create the CORRECT trades table (analytics/cube data)
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

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trades_date ON trades(date);
CREATE INDEX IF NOT EXISTS idx_trades_user ON trades(binary_user_id);
CREATE INDEX IF NOT EXISTS idx_trades_platform ON trades(platform);
CREATE INDEX IF NOT EXISTS idx_trades_contract ON trades(contract_type);
CREATE INDEX IF NOT EXISTS idx_trades_partner ON trades(affiliated_partner_id);

-- 4. Enable RLS
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- 5. Drop old policy if exists
DROP POLICY IF EXISTS "Allow public read trades" ON trades;

-- 6. Create new policy
CREATE POLICY "Allow public read trades" ON trades FOR SELECT USING (true);

-- Done!
DO $$
BEGIN
  RAISE NOTICE '✅ Trades table fixed! You can now import the CSV.';
END $$;

