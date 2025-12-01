-- ============================================================================
-- Supabase Quick Start Schema - Partner Report Dashboard
-- Copy and paste this into Supabase SQL Editor
-- ============================================================================

-- 1. Partners Table (Core)
CREATE TABLE partners (
  partner_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  join_date DATE,
  tier VARCHAR(50),
  country_manager VARCHAR(255),
  country_manager_tel VARCHAR(50),
  country_rank INTEGER,
  global_rank INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  current_tier VARCHAR(50),
  three_month_avg_commission DECIMAL(10,2),
  tier_reward_percentage DECIMAL(5,2)
);

-- 2. Clients Table
CREATE TABLE clients (
  client_id VARCHAR(50) PRIMARY KEY,
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  signup_date TIMESTAMP DEFAULT NOW(),
  country VARCHAR(100),
  platform VARCHAR(50),
  status VARCHAR(50),
  first_deposit_date TIMESTAMP,
  total_deposits DECIMAL(10,2) DEFAULT 0,
  total_volume DECIMAL(15,2) DEFAULT 0
);

-- 3. Commissions Table
CREATE TABLE commissions (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  client_id VARCHAR(50),
  date DATE NOT NULL,
  amount DECIMAL(10,2) DEFAULT 0,
  product VARCHAR(100),
  platform VARCHAR(50),
  commission_plan VARCHAR(100)
);

-- 4. Enable RLS (Row Level Security)
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

-- 5. Allow public read access (adjust later for security)
CREATE POLICY "Allow public read" ON partners FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON commissions FOR SELECT USING (true);

-- 6. Create indexes for performance
CREATE INDEX idx_partners_tier ON partners(tier);
CREATE INDEX idx_clients_partner ON clients(partner_id);
CREATE INDEX idx_commissions_partner ON commissions(partner_id);
CREATE INDEX idx_commissions_date ON commissions(date);

-- 7. Insert sample partner (for testing)
INSERT INTO partners (partner_id, name, tier, country_manager, global_rank, three_month_avg_commission)
VALUES ('P-0001', 'Test Partner', 'Gold', 'Manager Name', 100, 2500.00);

-- Done! Click "Run" to execute this schema.

