-- Fix Deposits Table - Replace with Actual MySQL Structure
-- Run this in Supabase SQL Editor

-- 1. Drop the incorrect deposits table
DROP TABLE IF EXISTS deposits CASCADE;

-- 2. Create the CORRECT deposits table
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

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits(binary_user_id_1);
CREATE INDEX IF NOT EXISTS idx_deposits_time ON deposits(transaction_time);
CREATE INDEX IF NOT EXISTS idx_deposits_category ON deposits(category);
CREATE INDEX IF NOT EXISTS idx_deposits_affiliate ON deposits(affiliate_id);

-- 4. Enable RLS
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;

-- 5. Drop old policy if exists
DROP POLICY IF EXISTS "Allow public read deposits" ON deposits;

-- 6. Create new policy
CREATE POLICY "Allow public read deposits" ON deposits FOR SELECT USING (true);

-- Done!
DO $$
BEGIN
  RAISE NOTICE '✅ Deposits table fixed! You can now import the CSV.';
END $$;

