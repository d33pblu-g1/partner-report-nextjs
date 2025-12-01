'use client';

import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useAllBadges, usePartnerBadges, useBadgeProgress } from '@/hooks/useBadges';
import { Card } from '@/components/ui/Card';

export default function BadgesPage() {
  const { selectedPartnerId } = useStore();
  const { data: allBadges, isLoading: allLoading } = useAllBadges();
  const { data: partnerBadges, isLoading: partnerLoading } = usePartnerBadges(selectedPartnerId || undefined);
  const { data: badgeProgress, isLoading: progressLoading } = useBadgeProgress(selectedPartnerId || undefined);

  // Create a set of earned badge IDs for quick lookup
  const earnedBadgeIds = useMemo(() => {
    if (!partnerBadges || !Array.isArray(partnerBadges)) return new Set();
    return new Set(partnerBadges.map(b => b.badge_id));
  }, [partnerBadges]);

  // Sort progress by percentage (closest to earning first)
  const sortedProgress = useMemo(() => {
    if (!badgeProgress || !Array.isArray(badgeProgress)) return [];
    return [...badgeProgress].sort((a, b) => {
      // Earned badges go to the end
      if (a.earned && !b.earned) return 1;
      if (!a.earned && b.earned) return -1;
      // Sort by progress percentage (descending)
      return b.progress_percentage - a.progress_percentage;
    });
  }, [badgeProgress]);

  const getBadgeIcon = (icon: string | undefined, criteria: string) => {
    if (icon) {
      const iconMap: Record<string, string> = {
        'trophy': '🏆',
        'star': '⭐',
        'medal': '🏅',
        'crown': '👑',
        'fire': '🔥',
        'diamond': '💎',
        'rocket': '🚀',
        'target': '🎯',
        'money': '💰',
        'chart': '📈',
        'users': '👥',
        'shield': '🛡️',
        'bolt': '⚡',
        'gem': '💠',
        'award': '🎖️',
      };
      return iconMap[icon.toLowerCase()] || '🏆';
    }
    
    const criteriaLower = criteria?.toLowerCase() || '';
    if (criteriaLower.includes('commission')) return '💰';
    if (criteriaLower.includes('deposit')) return '💵';
    if (criteriaLower.includes('client')) return '👥';
    if (criteriaLower.includes('trade')) return '📈';
    if (criteriaLower.includes('volume')) return '📊';
    return '🏆';
  };

  const getBadgeColorClass = (color: string | undefined, trigger: string, isEarned: boolean) => {
    const baseOpacity = isEarned ? '' : 'opacity-50 grayscale';
    
    if (color) {
      const colorMap: Record<string, string> = {
        'gold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
        'silver': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
        'bronze': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-700',
        'blue': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700',
        'green': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300 dark:border-green-700',
        'purple': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-700',
        'red': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300 dark:border-red-700',
      };
      return `${colorMap[color.toLowerCase()] || 'bg-gray-100 text-gray-800'} ${baseOpacity}`;
    }
    
    const value = parseInt(trigger?.replace(/[^0-9]/g, '') || '0');
    if (value >= 100000) {
      return `bg-gradient-to-br from-yellow-200 to-yellow-400 text-yellow-900 border-yellow-500 ${baseOpacity}`;
    } else if (value >= 10000) {
      return `bg-gradient-to-br from-purple-200 to-purple-400 text-purple-900 border-purple-500 ${baseOpacity}`;
    } else if (value >= 1000) {
      return `bg-gradient-to-br from-blue-200 to-blue-400 text-blue-900 border-blue-500 ${baseOpacity}`;
    } else if (value >= 100) {
      return `bg-gradient-to-br from-green-200 to-green-400 text-green-900 border-green-500 ${baseOpacity}`;
    } else {
      return `bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 ${baseOpacity}`;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Badges
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your achievements and progress towards earning new badges
        </p>
      </div>

      {!selectedPartnerId ? (
        <Card>
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No partner selected</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select a partner from the dropdown to view their badges and progress
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Badge Cabinet Section */}
          <Card className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Badge Cabinet
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {Array.isArray(partnerBadges) ? partnerBadges.length : 0} of {Array.isArray(allBadges) ? allBadges.length : 0} badges earned
                </p>
              </div>
              {Array.isArray(partnerBadges) && Array.isArray(allBadges) && allBadges.length > 0 && (
                <div className="text-right">
                  <div className="text-4xl font-bold text-[#FF444F]">
                    {Math.round((partnerBadges.length / allBadges.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Completion
                  </div>
                </div>
              )}
            </div>

            {allLoading || partnerLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : allBadges && allBadges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allBadges.map((badge) => {
                  const isEarned = earnedBadgeIds.has(badge.badge_id);
                  const earnedBadge = Array.isArray(partnerBadges) ? partnerBadges.find(b => b.badge_id === badge.badge_id) : undefined;
                  
                  return (
                    <div
                      key={badge.badge_id}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        isEarned 
                          ? 'shadow-lg hover:shadow-xl' 
                          : 'shadow-sm hover:shadow-md'
                      } ${getBadgeColorClass((badge as any).badge_color, badge.badge_trigger, isEarned)}`}
                    >
                      {isEarned && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg">
                          ✓ EARNED
                        </div>
                      )}
                      <div className="text-center">
                        <div className={`text-6xl mb-4 ${isEarned ? '' : 'opacity-40'}`}>
                          {getBadgeIcon((badge as any).badge_icon, badge.badge_criteria)}
                        </div>
                        <h3 className="text-lg font-bold mb-2">{badge.badge_name}</h3>
                        <p className="text-sm mb-2 opacity-90">{badge.badge_criteria}</p>
                        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/50 dark:bg-gray-800/50">
                          {badge.badge_trigger}
                        </div>
                        {isEarned && earnedBadge && (
                          <p className="text-xs mt-3 opacity-75">
                            Earned: {new Date(earnedBadge.earned_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No badges found</h3>
              </div>
            )}
          </Card>

          {/* Progress Tracking Section */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Badge Progress
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Track your progress towards earning badges. Closest to completion shown first.
            </p>

            {progressLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : sortedProgress && sortedProgress.length > 0 ? (
              <div className="space-y-4">
                {sortedProgress.map((badge) => (
                  <div
                    key={badge.badge_id}
                    className={`p-6 bg-gray-50 dark:bg-gray-800 rounded-lg ${
                      badge.earned ? 'border-2 border-green-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-5xl flex-shrink-0 ${badge.earned ? '' : 'opacity-60'}`}>
                        {getBadgeIcon((badge as any).badge_icon, badge.badge_criteria)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {badge.badge_name}
                          </h3>
                          {badge.earned ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-semibold flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Earned
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-semibold">
                              {badge.progress_percentage.toFixed(0)}% Complete
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {badge.badge_criteria}: {badge.badge_trigger}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              {badge.current_value.toLocaleString()} / {badge.target_value.toLocaleString()}
                            </span>
                            {!badge.earned && (
                              <span className="font-semibold text-[#FF444F]">
                                {(badge.target_value - badge.current_value).toLocaleString()} remaining
                              </span>
                            )}
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-3 rounded-full transition-all ${
                                badge.earned
                                  ? 'bg-green-600'
                                  : badge.progress_percentage >= 75
                                  ? 'bg-gradient-to-r from-[#FF444F] to-[#FF6B6B]'
                                  : badge.progress_percentage >= 50
                                  ? 'bg-yellow-500'
                                  : 'bg-gray-400'
                              }`}
                              style={{ width: `${Math.min(badge.progress_percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                        {badge.earned && badge.earned_at && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-semibold">
                            Earned on {new Date(badge.earned_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No progress data</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Progress tracking is not available for this partner
                </p>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

