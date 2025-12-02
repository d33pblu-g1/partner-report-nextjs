-- Quick Fix for cube_commissions_by_plan table
-- Run this in Supabase SQL Editor

-- Drop and recreate with correct columns
DROP TABLE IF EXISTS cube_commissions_by_plan CASCADE;

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

-- Create indexes
CREATE INDEX idx_cube_commissions_by_plan_partner ON cube_commissions_by_plan(partner_id);
CREATE INDEX idx_cube_commissions_by_plan_plan ON cube_commissions_by_plan(commission_plan);
CREATE INDEX idx_cube_commissions_by_plan_date ON cube_commissions_by_plan(date);
CREATE INDEX idx_cube_commissions_by_plan_trade_date ON cube_commissions_by_plan(trade_date);

-- Enable RLS
ALTER TABLE cube_commissions_by_plan ENABLE ROW LEVEL SECURITY;

-- Create policy
DROP POLICY IF EXISTS "Allow public read cube_commissions_by_plan" ON cube_commissions_by_plan;
CREATE POLICY "Allow public read cube_commissions_by_plan" ON cube_commissions_by_plan FOR SELECT USING (true);

-- Done!
DO $$
BEGIN
  RAISE NOTICE '✅ cube_commissions_by_plan table fixed!';
  RAISE NOTICE 'Added columns: trade_date, total_commissions, last_updated';
END $$;

