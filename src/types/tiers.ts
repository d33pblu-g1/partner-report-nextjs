/**
 * TypeScript types for Partner Tier System
 * Based on Deriv's Official Partner Tiering Programme
 */

export type TierName = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export type TierStatus = 'up' | 'down' | 'stable' | 'new';

export interface TierConfig {
  tier_name: TierName;
  min_avg_commission: number;
  max_avg_commission: number | null;
  reward_percentage: number;
  tier_order: number;
  tier_color: string;
  description: string;
}

export interface PartnerTierInfo {
  partner_id: string;
  name: string;
  current_tier: TierName;
  three_month_avg_commission: number;
  tier_reward_percentage: number;
  tier_status: TierStatus;
  previous_tier: TierName | null;
  tier_last_calculated: string;
}

export interface MonthlyCommission {
  month_year: string;
  year_val: number;
  month_val: number;
  base_commission: number;
  tier_reward: number;
  total_commission: number;
  tier_at_month_end: TierName;
  three_month_average: number;
  tier_reward_percentage: number;
  tier_color?: string;
  tier_order?: number;
  created_at: string;
}

export interface TierDistribution {
  current_tier: TierName;
  partner_count: number;
  avg_commission: number;
  min_commission: number;
  max_commission: number;
}

export interface TierStatistics {
  partner_id: string;
  name: string;
  current_tier: TierName;
  three_month_avg_commission: number;
  tier_reward_percentage: number;
  tier_status: TierStatus;
  previous_tier: TierName | null;
  tier_last_calculated: string;
  tier_color: string;
  tier_order: number;
  min_avg_commission: number;
  max_avg_commission: number | null;
  next_tier: TierName | null;
  next_tier_threshold: number | null;
  amount_to_next_tier: number;
  progress_to_next_tier: number;
  recent_months: Array<{
    month_year: string;
    base_commission: number;
    tier_reward: number;
    total_commission: number;
  }>;
}

export interface TierMovement {
  tier_status: TierStatus;
  count: number;
}

// Helper function to get tier color
export function getTierColor(tier: TierName): string {
  const colors: Record<TierName, string> = {
    Bronze: '#CD7F32',
    Silver: '#C0C0C0',
    Gold: '#FFD700',
    Platinum: '#E5E4E2',
  };
  return colors[tier];
}

// Helper function to get tier gradient for backgrounds
export function getTierGradient(tier: TierName): string {
  const gradients: Record<TierName, string> = {
    Bronze: 'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)',
    Silver: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
    Gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    Platinum: 'linear-gradient(135deg, #E5E4E2 0%, #B4B4B4 100%)',
  };
  return gradients[tier];
}

// Helper function to format tier reward
export function formatTierReward(baseCommission: number, rewardPercentage: number): string {
  const reward = baseCommission * (rewardPercentage / 100);
  return reward.toFixed(2);
}

// Helper function to get tier icon/emoji
export function getTierIcon(tier: TierName): string {
  const icons: Record<TierName, string> = {
    Bronze: '🥉',
    Silver: '🥈',
    Gold: '🥇',
    Platinum: '💎',
  };
  return icons[tier];
}

// Helper function to check if partner can move up
export function canMoveUp(currentTier: TierName): boolean {
  return currentTier !== 'Platinum';
}

// Helper function to get next tier
export function getNextTier(currentTier: TierName): TierName | null {
  const tierOrder: Record<TierName, TierName | null> = {
    Bronze: 'Silver',
    Silver: 'Gold',
    Gold: 'Platinum',
    Platinum: null,
  };
  return tierOrder[currentTier];
}

// Helper function to format commission with currency
export function formatCommission(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

