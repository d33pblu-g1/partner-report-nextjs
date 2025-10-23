/**
 * TypeScript Type Definitions for Partner Report
 * Generated from existing PHP API structure
 */

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

// ============================================================================
// Partner Types
// ============================================================================

export interface Partner {
  partner_id: string;
  name: string;
  tier?: string;
  country_manager?: string;
  Country_Rank?: number;
  global_rank?: number;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  created_at?: string;
}

// ============================================================================
// Client Types
// ============================================================================

export interface Client {
  binary_user_id: string;
  customerId?: string;
  name: string;
  partnerId: string;
  country: string;
  tier?: 'new' | 'active' | 'dormant' | 'VIP';
  joinDate: string;
  accountType?: string;
  lifetimeDeposits?: number;
  commissionPlan?: string;
  trackingLinkUsed?: string;
  subPartner?: string;
  email?: string;
  preferredLanguage?: string;
  accountNumber?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
}

// ============================================================================
// Metrics Types
// ============================================================================

export interface PartnerMetrics {
  partnerName: string;
  partnerTier: string;
  ltClients: number;
  ltDeposits: number;
  ltCommissions: number;
  ltVolume: number;
  mtdClients: number;
  mtdDeposits: number;
  mtdComm: number;
  mtdVolume: number;
  last6Months?: number[];
  _cached?: boolean;
  _cache_time?: string;
}

// ============================================================================
// Chart Data Types
// ============================================================================

export interface CommissionData {
  month: string;
  commission: number;
  date?: string;
}

export interface TierDistribution {
  tier: string;
  count: number;
  percentage?: number;
}

export interface CountryData {
  country: string;
  clients: number;
  revenue?: number;
  percentage?: number;
}

// ============================================================================
// Cube Data Types
// ============================================================================

export interface MonthlyDepositsCube {
  id: number;
  partner_id: string;
  year_month_str: string;
  year_val: number;
  month_val: number;
  month_name: string;
  total_deposits: number;
  deposit_count: number;
  avg_deposit_size: number;
  max_deposit: number;
  min_deposit: number;
  total_withdrawals: number;
  withdrawal_count: number;
  net_deposits: number;
  unique_depositors: number;
  repeat_depositors: number;
  first_time_depositors: number;
  last_updated: string;
}

export interface PartnerScorecardCube {
  id: number;
  partner_id: string;
  partner_name: string;
  partner_tier: string;
  total_revenue: number;
  total_clients: number;
  total_trades: number;
  mtd_revenue: number;
  mtd_clients: number;
  mtd_trades: number;
  revenue_growth_rate: number;
  client_growth_rate: number;
  overall_performance_score: number;
  last_updated: string;
}

// ============================================================================
// Partner Links Types
// ============================================================================

export interface PartnerLink {
  id: number;
  partner_id: string;
  link_type: 'youtube' | 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'website' | 'blog' | 'other';
  url: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Deposit Types
// ============================================================================

export interface Deposit {
  id: number;
  binary_user_id_1: string;
  affiliate_id?: string;
  transaction_time: string;
  amount_usd: number;
  category: 'deposit' | 'withdrawal';
}

// ============================================================================
// Trade Types
// ============================================================================

export interface Trade {
  id: number;
  trade_id: string;
  binary_user_id: string;
  partner_id?: string;
  date: string;
  trade_time?: string;
  symbol?: string;
  volume?: number;
  expected_revenue_usd: number;
}

// ============================================================================
// Badge Types
// ============================================================================

export interface Badge {
  id: number;
  partner_id: string;
  badge_name: string;
  badge_icon?: string;
  earned_date: string;
  description?: string;
}

// ============================================================================
// Partner Insights & Recommendations Types
// ============================================================================

export interface PartnerInsight {
  id: number;
  partner_id: string;
  insight_text: string;
  category?: string;
  priority: number;
  created_at: string;
  is_active?: boolean;
}

export interface PartnerRecommendation {
  id: number;
  partner_id: string;
  recommendation_text: string;
  category?: string;
  priority: number;
  action_url?: string;
  created_at: string;
  is_active?: boolean;
}

// ============================================================================
// Affiliate Tips Types
// ============================================================================

export interface AffiliateTip {
  id: number;
  tip_text: string;
  category?: string;
  created_at: string;
  is_active?: boolean;
}

// ============================================================================
// Recommendation Types (Legacy)
// ============================================================================

export interface Recommendation {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  title: string;
  description: string;
  action?: string;
  icon?: string;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface FilterOptions {
  partnerId?: string;
  country?: string;
  tier?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// ============================================================================
// Database Control Types
// ============================================================================

export interface DatabaseStatus {
  mysql: 'running' | 'stopped' | 'pending' | 'unknown';
  php_server: 'running' | 'stopped' | 'pending' | 'unknown';
  python_server: 'running' | 'stopped' | 'pending' | 'unknown';
}

export interface DatabaseControlAction {
  action: 'start' | 'stop' | 'restart' | 'status';
  service?: 'mysql' | 'php' | 'python' | 'all';
}

// ============================================================================
// Chart Configuration Types
// ============================================================================

export interface ChartConfig {
  title?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  colors?: string[];
  animate?: boolean;
}

// ============================================================================
// Theme Types
// ============================================================================

export type Theme = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

