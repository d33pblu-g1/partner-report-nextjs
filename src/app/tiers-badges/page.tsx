'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useAllBadges, usePartnerBadges, useBadgeProgress } from '@/hooks/useBadges';
import { Card } from '@/components/ui/Card';

export default function TiersBadgesPage() {
  const { selectedPartnerId } = useStore();
  const [activeTab, setActiveTab] = useState<'tiers' | 'all' | 'earned' | 'progress'>('tiers');
  
  const { data: allBadges, isLoading: allLoading } = useAllBadges();
  const { data: partnerBadges, isLoading: partnerLoading } = usePartnerBadges(selectedPartnerId || undefined);
  const { data: badgeProgress, isLoading: progressLoading } = useBadgeProgress(selectedPartnerId || undefined);

  const getBadgeIcon = (icon: string | undefined, criteria: string, trigger: string) => {
    // If icon is provided, use it
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
    
    // Auto-assign based on criteria and value
    const criteriaLower = criteria?.toLowerCase() || '';
    if (criteriaLower.includes('commission')) {
      return '💰';
    } else if (criteriaLower.includes('deposit')) {
      return '💵';
    } else if (criteriaLower.includes('client')) {
      return '👥';
    } else if (criteriaLower.includes('trade')) {
      return '📈';
    } else if (criteriaLower.includes('volume')) {
      return '📊';
    }
    return '🏆';
  };

  const getBadgeColorClass = (color: string | undefined, criteria: string, trigger: string) => {
    // If color is provided, use it
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
      return colorMap[color.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
    
    // Auto-assign based on value
    const value = parseInt(trigger?.replace(/[^0-9]/g, '') || '0');
    if (value >= 100000) {
      return 'bg-gradient-to-br from-yellow-200 to-yellow-400 text-yellow-900 border-yellow-500'; // Gold
    } else if (value >= 10000) {
      return 'bg-gradient-to-br from-purple-200 to-purple-400 text-purple-900 border-purple-500'; // Purple
    } else if (value >= 1000) {
      return 'bg-gradient-to-br from-blue-200 to-blue-400 text-blue-900 border-blue-500'; // Blue
    } else if (value >= 100) {
      return 'bg-gradient-to-br from-green-200 to-green-400 text-green-900 border-green-500'; // Green
    } else {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'; // Silver
    }
  };

  // Deriv Partner Tiers Information
  const derivTiers = [
    {
      name: 'Bronze',
      icon: '🥉',
      color: 'from-orange-200 to-orange-400',
      textColor: 'text-orange-900',
      requirements: [
        'Entry level tier for new partners',
        'Access to basic marketing materials',
        'Standard commission rates',
        'Email support',
      ],
      benefits: [
        'Partner dashboard access',
        'Basic reporting tools',
        'Marketing materials library',
        'Email support within 48 hours',
      ],
    },
    {
      name: 'Silver',
      icon: '🥈',
      color: 'from-gray-300 to-gray-400',
      textColor: 'text-gray-900',
      requirements: [
        'Minimum 50 active clients',
        'Monthly trading volume of $500K+',
        '$5,000+ in monthly commissions',
        '3+ months as active partner',
      ],
      benefits: [
        'Enhanced commission rates (+10%)',
        'Priority email support (24h response)',
        'Access to exclusive webinars',
        'Custom landing pages',
        'Dedicated account manager',
      ],
    },
    {
      name: 'Gold',
      icon: '🥇',
      color: 'from-yellow-300 to-yellow-500',
      textColor: 'text-yellow-900',
      requirements: [
        'Minimum 150 active clients',
        'Monthly trading volume of $2M+',
        '$15,000+ in monthly commissions',
        '6+ months as active partner',
      ],
      benefits: [
        'Premium commission rates (+20%)',
        '24/7 priority support',
        'Co-branded marketing materials',
        'API access for integration',
        'Quarterly business reviews',
        'Conference attendance sponsorship',
      ],
    },
    {
      name: 'Diamond',
      icon: '💎',
      color: 'from-blue-300 to-purple-400',
      textColor: 'text-purple-900',
      requirements: [
        'Minimum 300 active clients',
        'Monthly trading volume of $5M+',
        '$50,000+ in monthly commissions',
        '12+ months as active partner',
        'Top 10% performer in region',
      ],
      benefits: [
        'Maximum commission rates (+30%)',
        'Dedicated success team',
        'White-label solutions available',
        'Custom technology integrations',
        'Revenue share opportunities',
        'Speaking opportunities at events',
        'Partnership development fund',
      ],
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Tiers & Badges
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Partner tiering programme, achievements, and progress tracking
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'tiers'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Partner Tiers
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            All Badges
          </button>
          {selectedPartnerId && (
            <>
              <button
                onClick={() => setActiveTab('earned')}
                className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'earned'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Earned ({partnerBadges?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'progress'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Progress
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Partner Tiers Tab */}
      {activeTab === 'tiers' && (
        <div className="space-y-8">
          {/* Tiers Overview */}
          <Card>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Partner Tiering Programme
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our partner tiering programme rewards high-performing partners with enhanced benefits, 
              higher commission rates, and exclusive perks. Progress through the tiers by growing your 
              client base, increasing trading volume, and maintaining consistent performance.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {derivTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`p-6 rounded-xl bg-gradient-to-br ${tier.color} border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow`}
                >
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-2">{tier.icon}</div>
                    <h4 className={`text-2xl font-bold ${tier.textColor}`}>
                      {tier.name}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Detailed Tier Information */}
          {derivTiers.map((tier, index) => (
            <Card key={tier.name}>
              <div className="flex items-start gap-6">
                <div className={`p-6 rounded-xl bg-gradient-to-br ${tier.color} flex-shrink-0`}>
                  <div className="text-6xl">{tier.icon}</div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {tier.name} Tier
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Requirements */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <span>📋</span> Requirements
                      </h4>
                      <ul className="space-y-2">
                        {tier.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Benefits */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <span>🎁</span> Benefits
                      </h4>
                      <ul className="space-y-2">
                        {tier.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                            <span className="text-blue-500 mt-1">★</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* How to Qualify */}
          <Card title="How to Qualify">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Track Your Performance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Monitor your client count, trading volume, and commissions in your partner dashboard
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Meet the Criteria</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Achieve all requirements for your target tier consistently over the qualification period
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Automatic Upgrade</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tiers are reviewed monthly - you'll be automatically upgraded when you meet the requirements
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Support Available</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contact your account manager for guidance on reaching the next tier
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* No Partner Selected Message */}
      {!selectedPartnerId && activeTab !== 'all' && activeTab !== 'tiers' && (
        <Card>
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No partner selected</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select a partner from the dropdown to view their badges
            </p>
          </div>
        </Card>
      )}

      {/* All Badges Tab */}
      {activeTab === 'all' && (
        <>
          {allLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg" />
                </div>
              ))}
            </div>
          ) : allBadges && allBadges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBadges.map((badge) => (
                <Card key={badge.badge_id} className={`border-2 ${getBadgeColorClass((badge as any).badge_color, badge.badge_criteria, badge.badge_trigger)}`}>
                  <div className="text-center">
                    <div className="text-6xl mb-4">{getBadgeIcon((badge as any).badge_icon, badge.badge_criteria, badge.badge_trigger)}</div>
                    <h3 className="text-xl font-bold mb-2">{badge.badge_name}</h3>
                    <p className="text-sm mb-2">{badge.badge_criteria}</p>
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-800">
                      {badge.badge_trigger}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No badges found</h3>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Earned Badges Tab */}
      {activeTab === 'earned' && selectedPartnerId && (
        <>
          {partnerLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg" />
                </div>
              ))}
            </div>
          ) : partnerBadges && partnerBadges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnerBadges.map((badge) => (
                <Card key={badge.badge_id} className={`border-2 ${getBadgeColorClass((badge as any).badge_color, badge.badge_criteria, '')} relative overflow-hidden`}>
                  {/* Earned ribbon */}
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-bold transform rotate-45 translate-x-8 translate-y-4">
                    EARNED
                  </div>
                  <div className="text-center">
                    <div className="text-6xl mb-4">{getBadgeIcon((badge as any).badge_icon, badge.badge_criteria, '')}</div>
                    <h3 className="text-xl font-bold mb-2">{badge.badge_name}</h3>
                    <p className="text-sm mb-2">{badge.badge_criteria}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Earned: {new Date(badge.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No badges earned yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Keep working to earn your first badge!
                </p>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && selectedPartnerId && (
        <>
          {progressLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />
                </div>
              ))}
            </div>
          ) : badgeProgress && badgeProgress.length > 0 ? (
            <div className="space-y-4">
              {badgeProgress.map((badge) => (
                <Card key={badge.badge_id} className={`${badge.earned ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl flex-shrink-0">
                      {getBadgeIcon((badge as any).badge_icon, badge.badge_criteria, badge.badge_trigger)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {badge.badge_name}
                        </h3>
                        {badge.earned && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-semibold">
                            ✓ Earned
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
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {badge.progress_percentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              badge.earned
                                ? 'bg-green-600'
                                : badge.progress_percentage >= 75
                                ? 'bg-blue-600'
                                : badge.progress_percentage >= 50
                                ? 'bg-yellow-600'
                                : 'bg-gray-400'
                            }`}
                            style={{ width: `${Math.min(badge.progress_percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      {badge.earned && badge.earned_at && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Earned on {new Date(badge.earned_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No progress data</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Progress tracking is not available for this partner
                </p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

