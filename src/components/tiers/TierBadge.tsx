/**
 * TierBadge Component
 * Displays a color-coded badge for partner tiers
 */

import { cn } from '@/lib/utils';

interface TierBadgeProps {
  tier: string;
  className?: string;
}

/**
 * Get tier-specific styling
 */
function getTierStyles(tier: string): string {
  const normalizedTier = tier.toLowerCase();

  switch (normalizedTier) {
    case 'bronze':
      return 'bg-amber-700 dark:bg-amber-800 text-amber-100 border-amber-600 dark:border-amber-700';
    case 'silver':
      return 'bg-gray-400 dark:bg-gray-500 text-gray-900 dark:text-white border-gray-500 dark:border-gray-600';
    case 'gold':
      return 'bg-yellow-500 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 border-yellow-600 dark:border-yellow-700';
    case 'platinum':
      return 'bg-purple-600 dark:bg-purple-700 text-purple-100 border-purple-700 dark:border-purple-800';
    default:
      // Default styling for unknown tiers
      return 'bg-gray-500 dark:bg-gray-600 text-white border-gray-600 dark:border-gray-700';
  }
}

/**
 * Get tier icon/emoji
 */
function getTierIcon(tier: string): string {
  const normalizedTier = tier.toLowerCase();

  switch (normalizedTier) {
    case 'bronze':
      return '🥉';
    case 'silver':
      return '🥈';
    case 'gold':
      return '🥇';
    case 'platinum':
      return '💎';
    default:
      return '⭐';
  }
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  if (!tier) return null;

  const tierStyles = getTierStyles(tier);
  const tierIcon = getTierIcon(tier);
  const displayTier = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm border-2 shadow-md',
        tierStyles,
        className
      )}
    >
      <span className="text-lg">{tierIcon}</span>
      <span>{displayTier}</span>
    </span>
  );
}
