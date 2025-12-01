'use client';

import { useStore } from '@/store/useStore';
import { useTierConfig, useTierStatistics, useCommissionHistory } from '@/hooks/useTiers';
import { Card } from '@/components/ui/Card';
import { getTierIcon, formatCommission, type TierName } from '@/types/tiers';

export default function TiersPage() {
  const { selectedPartnerId } = useStore();
  const { data: tierConfig, isLoading: configLoading } = useTierConfig();
  const { data: tierStats, isLoading: statsLoading } = useTierStatistics(selectedPartnerId);
  const { data: commissionHistory, isLoading: historyLoading } = useCommissionHistory(selectedPartnerId, 3);

  // Get tier color classes
  const getTierColorClass = (tierName: string) => {
    const colors: Record<string, string> = {
      Bronze: 'from-orange-300 to-orange-500',
      Silver: 'from-gray-300 to-gray-400',
      Gold: 'from-yellow-300 to-yellow-500',
      Platinum: 'from-purple-300 to-purple-500',
    };
    return colors[tierName] || 'from-gray-300 to-gray-400';
  };

  const getTierTextColor = (tierName: string) => {
    const colors: Record<string, string> = {
      Bronze: 'text-orange-900',
      Silver: 'text-gray-900',
      Gold: 'text-yellow-900',
      Platinum: 'text-purple-900',
    };
    return colors[tierName] || 'text-gray-900';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Partner Tiers
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Performance-based tiering system with rewards based on your 3-month average commission
        </p>
      </div>

      {/* Tier Overview Cards */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Partner Tiering Programme
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your tier is determined by your rolling 3-month average commission. Higher tiers receive 
          percentage-based rewards on their current month's commission.
        </p>
        
        {configLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl" />
              </div>
            ))}
          </div>
        ) : tierConfig && tierConfig.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tierConfig.map((tier) => {
              const isCurrentTier = tierStats?.current_tier === tier.tier_name;
              
              return (
                <div
                  key={tier.tier_name}
                  className={`p-6 rounded-xl bg-gradient-to-br ${getTierColorClass(tier.tier_name)} border-2 ${
                    isCurrentTier 
                      ? 'border-[#FF444F] shadow-xl scale-105' 
                      : 'border-gray-200 dark:border-gray-700 shadow-lg'
                  } hover:shadow-xl transition-all relative`}
                >
                  {isCurrentTier && (
                    <div className="absolute -top-3 -right-3 bg-[#FF444F] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      YOUR TIER
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-6xl mb-3">{getTierIcon(tier.tier_name as TierName)}</div>
                    <h3 className={`text-2xl font-bold ${getTierTextColor(tier.tier_name)} mb-2`}>
                      {tier.tier_name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className={`font-semibold ${getTierTextColor(tier.tier_name)}`}>
                        {tier.max_avg_commission 
                          ? `$${tier.min_avg_commission.toLocaleString()} - $${tier.max_avg_commission.toLocaleString()}`
                          : `$${tier.min_avg_commission.toLocaleString()}+`
                        }
                      </div>
                      <div className={`text-lg font-bold ${getTierTextColor(tier.tier_name)}`}>
                        {tier.reward_percentage}% Reward
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No tier configuration available
          </div>
        )}
      </Card>

      {/* Current Tier Progress */}
      {selectedPartnerId ? (
        statsLoading ? (
          <Card className="mb-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </Card>
        ) : tierStats ? (
          <Card className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Your Current Progress
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Track your progress towards the next tier based on your 3-month average commission
                </p>
              </div>
              <div className={`px-6 py-3 rounded-xl bg-gradient-to-br ${getTierColorClass(tierStats.current_tier)} shadow-lg`}>
                <div className="text-center">
                  <div className="text-4xl mb-1">{getTierIcon(tierStats.current_tier as TierName)}</div>
                  <div className={`text-lg font-bold ${getTierTextColor(tierStats.current_tier)}`}>
                    {tierStats.current_tier}
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Month Average */}
            <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    3-Month Average Commission
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCommission(tierStats.three_month_avg_commission)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Current Reward: <span className="font-semibold text-[#FF444F]">{tierStats.tier_reward_percentage}%</span>
                  </div>
                </div>
                {tierStats.tier_status !== 'stable' && (
                  <div className={`px-4 py-2 rounded-lg ${
                    tierStats.tier_status === 'up' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      {tierStats.tier_status === 'up' ? (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 3l7 7h-4v7h-6v-7H3l7-7z"/>
                          </svg>
                          <span className="font-semibold">Upgraded</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 17l-7-7h4V3h6v7h4l-7 7z"/>
                          </svg>
                          <span className="font-semibold">Downgraded</span>
                        </>
                      )}
                    </div>
                    {tierStats.previous_tier && (
                      <div className="text-xs mt-1">
                        From {tierStats.previous_tier}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Progress to Next Tier */}
            {tierStats.next_tier && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    Progress to {tierStats.next_tier}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-[#FF444F]">
                      {formatCommission(tierStats.amount_to_next_tier)}
                    </span> more needed
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-6 rounded-full bg-gradient-to-r from-[#FF444F] to-[#FF6B6B] transition-all flex items-center justify-end pr-3"
                      style={{ width: `${Math.min(tierStats.progress_to_next_tier, 100)}%` }}
                    >
                      <span className="text-white text-xs font-bold">
                        {tierStats.progress_to_next_tier.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                    <span>{formatCommission(tierStats.min_avg_commission)}</span>
                    <span>{formatCommission(tierStats.next_tier_threshold || 0)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Commission History */}
            {commissionHistory && commissionHistory.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Last 3 Months Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {commissionHistory.map((month) => (
                    <div key={month.month_year} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {month.month_year}
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {formatCommission(month.base_commission)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Base Commission
                      </div>
                      {month.tier_reward > 0 && (
                        <div className="text-sm text-green-600 dark:text-green-400 mt-2">
                          +{formatCommission(month.tier_reward)} ({month.tier_reward_percentage}% reward)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ) : (
          <Card className="mb-8">
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No tier statistics available for this partner
            </div>
          </Card>
        )
      ) : (
        <Card className="mb-8">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No partner selected</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select a partner from the dropdown to view their tier progress
            </p>
          </div>
        </Card>
      )}

      {/* How It Works */}
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How the Tiering System Works
        </h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-[#FF444F] rounded-lg flex items-center justify-center text-white font-bold text-xl">
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Rolling 3-Month Average
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your tier is calculated based on the average of your last 3 full months of commission earnings. 
                This includes both your base commission and any master partner commissions you earn.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-[#FF444F] rounded-lg flex items-center justify-center text-white font-bold text-xl">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Monthly Tier Updates
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                At the end of each month, your tier is automatically recalculated. You can move up or down 
                by more than one tier level based on your performance. No application is required.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-[#FF444F] rounded-lg flex items-center justify-center text-white font-bold text-xl">
              3
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Tier Rewards
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Silver, Gold, and Platinum partners receive a percentage-based reward on their current month's 
                commission. The reward is calculated on your base commission for that month and paid out the 
                following month.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-[#FF444F] rounded-lg flex items-center justify-center text-white font-bold text-xl">
              4
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                New Partner Calculation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                For new partners, your tier during your first three months is recalculated at the end of each month. 
                Month 1 uses only that month's commission, Month 2 averages Months 1-2, and Month 3 averages all three months.
              </p>
            </div>
          </div>

          <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Example Calculation
            </h4>
            <p className="text-blue-800 dark:text-blue-200">
              If you earn $700 in September, $1,200 in October, and $1,700 in November, your 3-month average 
              at the end of November is <span className="font-bold">$1,200</span> (($700 + $1,200 + $1,700) ÷ 3). 
              This places you in the <span className="font-bold">Gold tier</span> ($1,000-$4,999.99), earning you a 
              <span className="font-bold">6% reward</span> on your November commission of $1,700, which is 
              <span className="font-bold">$102</span> additional earnings.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

