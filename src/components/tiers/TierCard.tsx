/**
 * TierCard Component
 * Summary card showing tier information
 */

'use client';

import { Card } from '@/components/ui/Card';
import { TierBadge } from './TierBadge';
import type { TierName, TierStatus } from '@/types/tiers';
import { formatCommission } from '@/types/tiers';

interface TierCardProps {
  tier: TierName;
  avgCommission: number;
  rewardPercentage: number;
  status: TierStatus;
  className?: string;
}

export function TierCard({
  tier,
  avgCommission,
  rewardPercentage,
  status,
  className = '',
}: TierCardProps) {
  // Status indicators
  const statusIcons: Record<TierStatus, string> = {
    up: '↑',
    down: '↓',
    stable: '→',
    new: '✨',
  };
  
  const statusColors: Record<TierStatus, string> = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    stable: 'text-gray-600 dark:text-gray-400',
    new: 'text-blue-600 dark:text-blue-400',
  };
  
  const statusLabels: Record<TierStatus, string> = {
    up: 'Tier Up',
    down: 'Tier Down',
    stable: 'Stable',
    new: 'New Partner',
  };
  
  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Current Tier
          </p>
          <TierBadge tier={tier} />
        </div>
        
        {/* Status Indicator */}
        <div className={`flex items-center gap-1 text-sm font-semibold ${statusColors[status]}`}>
          <span className="text-xl">{statusIcons[status]}</span>
          <span>{statusLabels[status]}</span>
        </div>
      </div>
      
      {/* Metrics */}
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            3-Month Average Commission
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCommission(avgCommission)}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Tier Reward
            </p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {rewardPercentage.toFixed(1)}%
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              On Monthly Commission
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Applied automatically
            </p>
          </div>
        </div>
      </div>
      
      {/* Example Calculation */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          Example: On $1,000 monthly commission
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300">
            Base: $1,000.00
          </span>
          <span className="text-green-600 dark:text-green-400 font-semibold">
            + ${(1000 * (rewardPercentage / 100)).toFixed(2)} tier reward
          </span>
        </div>
        <div className="mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm font-bold">
            <span className="text-gray-700 dark:text-gray-300">Total:</span>
            <span className="text-gray-900 dark:text-white">
              ${(1000 + (1000 * (rewardPercentage / 100))).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

