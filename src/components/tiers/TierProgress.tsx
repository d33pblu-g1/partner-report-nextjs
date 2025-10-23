/**
 * TierProgress Component
 * Shows progress towards next tier
 */

'use client';

import type { TierName } from '@/types/tiers';
import { formatCommission, getNextTier, getTierColor } from '@/types/tiers';

interface TierProgressProps {
  currentTier: TierName;
  currentAverage: number;
  nextTierThreshold: number | null;
  className?: string;
}

export function TierProgress({
  currentTier,
  currentAverage,
  nextTierThreshold,
  className = '',
}: TierProgressProps) {
  const nextTier = getNextTier(currentTier);
  const tierColor = getTierColor(currentTier);
  
  // If already at Platinum, show completion
  if (!nextTier || !nextTierThreshold) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tier Progress
          </span>
          <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
            💎 Maximum Tier Achieved!
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
            style={{ width: '100%' }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
          You've reached Platinum tier - the highest level!
        </div>
      </div>
    );
  }
  
  // Calculate progress
  const amountNeeded = nextTierThreshold - currentAverage;
  const progress = Math.min((currentAverage / nextTierThreshold) * 100, 100);
  
  // Get current tier's minimum for base calculation
  const tierThresholds: Record<TierName, number> = {
    Bronze: 0,
    Silver: 500,
    Gold: 1000,
    Platinum: 5000,
  };
  
  const currentTierMin = tierThresholds[currentTier];
  const range = nextTierThreshold - currentTierMin;
  const relativeProgress = range > 0 
    ? Math.min(((currentAverage - currentTierMin) / range) * 100, 100) 
    : 0;
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Progress to {nextTier}
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {relativeProgress.toFixed(0)}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${relativeProgress}%`,
            background: `linear-gradient(90deg, ${tierColor} 0%, ${getTierColor(nextTier)} 100%)`,
          }}
        />
      </div>
      
      {/* Details */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Current Avg:
          </span>{' '}
          {formatCommission(currentAverage)}
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Need:
          </span>{' '}
          <span className={amountNeeded > 0 ? 'text-orange-600 dark:text-orange-400 font-semibold' : 'text-green-600 dark:text-green-400'}>
            {amountNeeded > 0 ? formatCommission(amountNeeded) : '✓ Reached!'}
          </span>
        </div>
      </div>
      
      {/* Threshold indicator */}
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-500 text-right">
        {nextTier} threshold: {formatCommission(nextTierThreshold)}
      </div>
    </div>
  );
}

