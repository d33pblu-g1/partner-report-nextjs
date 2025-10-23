/**
 * Badge Progress Cards
 * Achievement tracking with progress bars
 */

'use client';

import { Card } from '@/components/ui/Card';
import { useBadgeProgress } from '@/hooks/useCubeData';

interface BadgeProgressCardsProps {
  partnerId?: string;
}

export function BadgeProgressCards({ partnerId }: BadgeProgressCardsProps) {
  const { data, isLoading, error } = useBadgeProgress(partnerId);

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error || !data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🏆 Achievement Progress
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {error ? 'Failed to load badge data' : 'No badges available'}
          </p>
        </div>
      </Card>
    );
  }

  // Badge emoji mapping
  const badgeEmojis: Record<string, string> = {
    'First Client': '🎯',
    'Top Performer': '🏆',
    '100 Clients': '👥',
    '$10K Revenue': '💰',
    'Growth Master': '📈',
    'Client Champion': '⭐',
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        🏆 Achievement Progress
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((badge: any, index: number) => {
          const progress = Math.min((badge.current_value / badge.target_value) * 100, 100);
          const isComplete = progress >= 100;

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                isComplete
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Badge Icon and Name */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">
                  {badgeEmojis[badge.badge_name] || '🎖️'}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {badge.badge_name}
                  </h4>
                  {isComplete && (
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      ✓ Completed
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>{badge.current_value.toLocaleString()}</span>
                  <span>{badge.target_value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isComplete
                        ? 'bg-green-500'
                        : 'bg-blue-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Progress Percentage */}
              <p className="text-sm text-center font-semibold text-gray-700 dark:text-gray-300">
                {progress.toFixed(0)}% Complete
              </p>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Badges Earned:
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {data.filter((b: any) => (b.current_value / b.target_value) * 100 >= 100).length} / {data.length}
          </span>
        </div>
      </div>
    </Card>
  );
}

