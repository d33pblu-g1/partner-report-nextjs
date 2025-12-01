-- ============================================================================
-- Supabase Schema for Partner Report Dashboard
-- PostgreSQL-compatible schema converted from MySQL
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Core Tables
-- ============================================================================

-- Partners table
CREATE TABLE IF NOT EXISTS partners (
  partner_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  join_date DATE,
  age INTEGER,
  tier VARCHAR(50),
  country_manager VARCHAR(255),
  country_manager_tel VARCHAR(50),
  country_rank INTEGER,
  global_rank INTEGER,
  alternate_accounts TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  current_tier VARCHAR(50),
  three_month_avg_commission DECIMAL(10,2),
  tier_reward_percentage DECIMAL(5,2),
  tier_last_calculated TIMESTAMP,
  tier_status VARCHAR(50),
  previous_tier VARCHAR(50)
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  client_id VARCHAR(50) PRIMARY KEY,
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  signup_date TIMESTAMP DEFAULT NOW(),
  country VARCHAR(100),
  platform VARCHAR(50),
  status VARCHAR(50),
  first_deposit_date TIMESTAMP,
  total_deposits DECIMAL(10,2) DEFAULT 0,
  total_volume DECIMAL(15,2) DEFAULT 0,
  last_trade_date TIMESTAMP,
  tier VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Commissions table
CREATE TABLE IF NOT EXISTS commissions (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  client_id VARCHAR(50),
  date DATE NOT NULL,
  amount DECIMAL(10,2) DEFAULT 0,
  product VARCHAR(100),
  platform VARCHAR(50),
  commission_plan VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Deposits table
CREATE TABLE IF NOT EXISTS deposits (
  id SERIAL PRIMARY KEY,
  client_id VARCHAR(50),
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  deposit_date TIMESTAMP DEFAULT NOW(),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  payment_method VARCHAR(100),
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trades table
CREATE TABLE IF NOT EXISTS trades (
  id SERIAL PRIMARY KEY,
  client_id VARCHAR(50),
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  trade_date TIMESTAMP DEFAULT NOW(),
  symbol VARCHAR(50),
  product VARCHAR(100),
  platform VARCHAR(50),
  volume DECIMAL(15,2),
  profit_loss DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Partner Links table
CREATE TABLE IF NOT EXISTS partner_links (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  link_name VARCHAR(255) NOT NULL,
  link_url TEXT,
  campaign_source VARCHAR(100),
  campaign_medium VARCHAR(100),
  created_date TIMESTAMP DEFAULT NOW(),
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================================
-- Tier System Tables
-- ============================================================================

-- Partner Tier Config
CREATE TABLE IF NOT EXISTS partner_tier_config (
  id SERIAL PRIMARY KEY,
  tier_name VARCHAR(50) NOT NULL UNIQUE,
  min_commission DECIMAL(10,2) NOT NULL,
  max_commission DECIMAL(10,2),
  reward_percentage DECIMAL(5,2) NOT NULL,
  tier_color VARCHAR(20),
  tier_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Partner Tiers (History)
CREATE TABLE IF NOT EXISTS partner_tiers (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  tier VARCHAR(50) NOT NULL,
  effective_date DATE NOT NULL,
  avg_commission DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- Badges System
-- ============================================================================

-- Badges definition
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  category VARCHAR(100),
  threshold_type VARCHAR(50),
  threshold_value DECIMAL(15,2),
  tier_requirement VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Partner Badges (earned badges)
CREATE TABLE IF NOT EXISTS partner_badges (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  badge_id INTEGER REFERENCES badges(id),
  earned_date TIMESTAMP DEFAULT NOW(),
  progress DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(partner_id, badge_id)
);

-- ============================================================================
-- Analytics & Metrics Tables
-- ============================================================================

-- Client Metrics (aggregated data)
CREATE TABLE IF NOT EXISTS client_metrics (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  metric_date DATE NOT NULL,
  total_clients INTEGER DEFAULT 0,
  active_clients INTEGER DEFAULT 0,
  new_clients INTEGER DEFAULT 0,
  churned_clients INTEGER DEFAULT 0,
  avg_deposit DECIMAL(10,2) DEFAULT 0,
  avg_volume DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(partner_id, metric_date)
);

-- Country Stats
CREATE TABLE IF NOT EXISTS country_stats (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  country VARCHAR(100) NOT NULL,
  total_clients INTEGER DEFAULT 0,
  total_deposits DECIMAL(15,2) DEFAULT 0,
  total_volume DECIMAL(15,2) DEFAULT 0,
  total_commission DECIMAL(10,2) DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(partner_id, country)
);

-- Monthly Commissions
CREATE TABLE IF NOT EXISTS monthly_commissions (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  month DATE NOT NULL,
  total_commission DECIMAL(10,2) DEFAULT 0,
  client_count INTEGER DEFAULT 0,
  avg_commission_per_client DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(partner_id, month)
);

-- Partner Monthly Commissions (detailed)
CREATE TABLE IF NOT EXISTS partner_monthly_commissions (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  month DATE NOT NULL,
  commission_plan VARCHAR(100),
  platform VARCHAR(50),
  product VARCHAR(100),
  total_commission DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- Insights & Recommendations
-- ============================================================================

-- Partner Insights
CREATE TABLE IF NOT EXISTS partner_insights (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  insight_text TEXT NOT NULL,
  category VARCHAR(50),
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Partner Recommendations
CREATE TABLE IF NOT EXISTS partner_recommendations (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(50) REFERENCES partners(partner_id),
  recommendation_text TEXT NOT NULL,
  category VARCHAR(50),
  priority INTEGER DEFAULT 1,
  action_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Partners indexes
CREATE INDEX idx_partners_tier ON partners(tier);
CREATE INDEX idx_partners_country_rank ON partners(country_rank);
CREATE INDEX idx_partners_global_rank ON partners(global_rank);

-- Clients indexes
CREATE INDEX idx_clients_partner ON clients(partner_id);
CREATE INDEX idx_clients_country ON clients(country);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_signup_date ON clients(signup_date);

-- Commissions indexes
CREATE INDEX idx_commissions_partner ON commissions(partner_id);
CREATE INDEX idx_commissions_date ON commissions(date);
CREATE INDEX idx_commissions_product ON commissions(product);

-- Deposits indexes
CREATE INDEX idx_deposits_partner ON deposits(partner_id);
CREATE INDEX idx_deposits_date ON deposits(deposit_date);

-- Trades indexes
CREATE INDEX idx_trades_partner ON trades(partner_id);
CREATE INDEX idx_trades_date ON trades(trade_date);
CREATE INDEX idx_trades_symbol ON trades(symbol);

-- Partner Links indexes
CREATE INDEX idx_partner_links_partner ON partner_links(partner_id);
CREATE INDEX idx_partner_links_active ON partner_links(is_active);

-- Insights indexes
CREATE INDEX idx_insights_partner ON partner_insights(partner_id);
CREATE INDEX idx_insights_active ON partner_insights(is_active);
CREATE INDEX idx_insights_priority ON partner_insights(priority);

-- Recommendations indexes
CREATE INDEX idx_recommendations_partner ON partner_recommendations(partner_id);
CREATE INDEX idx_recommendations_active ON partner_recommendations(is_active);
CREATE INDEX idx_recommendations_priority ON partner_recommendations(priority);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_recommendations ENABLE ROW LEVEL SECURITY;

-- Public read access policies (adjust based on your security needs)
CREATE POLICY "Allow public read access to partners" ON partners
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to clients" ON clients
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to commissions" ON commissions
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to deposits" ON deposits
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to partner_links" ON partner_links
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to insights" ON partner_insights
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to recommendations" ON partner_recommendations
  FOR SELECT USING (true);

-- ============================================================================
-- Database Functions for Complex Queries
-- ============================================================================

-- Function to get partner scorecard
CREATE OR REPLACE FUNCTION get_partner_scorecard(p_partner_id VARCHAR)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'partner_id', p.partner_id,
    'name', p.name,
    'tier', p.tier,
    'global_rank', p.global_rank,
    'total_commissions', COALESCE(SUM(c.amount), 0),
    'total_clients', (SELECT COUNT(*) FROM clients WHERE partner_id = p_partner_id),
    'total_deposits', (SELECT COALESCE(SUM(amount), 0) FROM deposits WHERE partner_id = p_partner_id),
    'avg_commission', COALESCE(AVG(c.amount), 0),
    'mtd_commission', COALESCE(
      (SELECT SUM(amount) FROM commissions 
       WHERE partner_id = p_partner_id 
       AND date >= DATE_TRUNC('month', CURRENT_DATE)), 
      0
    )
  ) INTO result
  FROM partners p
  LEFT JOIN commissions c ON p.partner_id = c.partner_id
  WHERE p.partner_id = p_partner_id
  GROUP BY p.partner_id, p.name, p.tier, p.global_rank;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get commission trends (last 6 months)
CREATE OR REPLACE FUNCTION get_commission_trends(p_partner_id VARCHAR)
RETURNS TABLE(month DATE, total_commission DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE_TRUNC('month', c.date)::DATE as month,
    COALESCE(SUM(c.amount), 0)::DECIMAL as total_commission
  FROM commissions c
  WHERE c.partner_id = p_partner_id
    AND c.date >= CURRENT_DATE - INTERVAL '6 months'
  GROUP BY DATE_TRUNC('month', c.date)
  ORDER BY month DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Sample Data (Insert Tier Configuration)
-- ============================================================================

INSERT INTO partner_tier_config (tier_name, min_commission, max_commission, reward_percentage, tier_color, tier_order) VALUES
  ('Bronze', 0, 999.99, 3.00, '#CD7F32', 1),
  ('Silver', 1000, 2999.99, 4.50, '#C0C0C0', 2),
  ('Gold', 3000, 4999.99, 6.00, '#FFD700', 3),
  ('Platinum', 5000, 9999.99, 7.50, '#E5E4E2', 4),
  ('Diamond', 10000, NULL, 10.00, '#B9F2FF', 5)
ON CONFLICT (tier_name) DO NOTHING;

-- ============================================================================
-- Views for Common Queries
-- ============================================================================

-- Partner Badges View
CREATE OR REPLACE VIEW partner_badges_view AS
SELECT 
  pb.partner_id,
  b.name as badge_name,
  b.description,
  b.icon,
  b.category,
  pb.earned_date,
  pb.progress,
  pb.is_active
FROM partner_badges pb
JOIN badges b ON pb.badge_id = b.id
WHERE pb.is_active = true;

-- ============================================================================
-- Triggers for Auto-updating timestamps
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to partners table
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- End of Schema
-- ============================================================================

-- Grant permissions (adjust based on your needs)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

