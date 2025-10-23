'use client';

import { Card } from '@/components/ui/Card';

interface RankCardProps {
  type: 'country' | 'global';
  rank?: number;
  totalPartners?: number;
  isLoading?: boolean;
}

export function RankCard({ type, rank, totalPartners, isLoading }: RankCardProps) {
  const isCountry = type === 'country';
  const icon = isCountry ? '🏴' : '🌍';
  const title = isCountry ? 'Country Rank' : 'Global Rank';
  
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl">{icon}</div>
            <div className="bg-gray-200 dark:bg-gray-700 h-6 w-32 rounded"></div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 h-12 w-24 rounded mb-2"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-4 w-40 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!rank) {
    return (
      <Card>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Rank not available
          </p>
        </div>
      </Card>
    );
  }

  // Determine rank color based on position
  const getRankColor = (rankValue: number) => {
    if (rankValue <= 50) return 'text-green-600 dark:text-green-400';
    if (rankValue <= 100) return 'text-blue-600 dark:text-blue-400';
    if (rankValue <= 150) return 'text-amber-600 dark:text-amber-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getRankBadge = (rankValue: number) => {
    if (rankValue <= 10) return '⭐';
    if (rankValue <= 50) return '🏆';
    if (rankValue <= 100) return '🥈';
    return '';
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className={`text-5xl font-bold ${getRankColor(rank)}`}>
          #{rank}
        </span>
        {getRankBadge(rank) && (
          <span className="text-2xl">{getRankBadge(rank)}</span>
        )}
      </div>
      
      {totalPartners && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          out of {totalPartners} partners
        </p>
      )}
      
      {/* Performance indicator */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {rank <= 50 ? (
            <span className="text-green-600 dark:text-green-400">🎯 Top performer</span>
          ) : rank <= 100 ? (
            <span className="text-blue-600 dark:text-blue-400">📈 Strong performance</span>
          ) : rank <= 150 ? (
            <span className="text-amber-600 dark:text-amber-400">💪 Good standing</span>
          ) : (
            <span className="text-gray-600 dark:text-gray-400">📊 Room for growth</span>
          )}
        </p>
      </div>
    </Card>
  );
}

