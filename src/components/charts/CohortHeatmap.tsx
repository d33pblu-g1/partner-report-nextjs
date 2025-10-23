/**
 * Client Lifecycle Cohort Analysis
 * Retention heatmap by join month
 */

'use client';

import { Card } from '@/components/ui/Card';
import { useClients } from '@/hooks/useClients';

interface CohortHeatmapProps {
  partnerId?: string;
}

export function CohortHeatmap({ partnerId }: CohortHeatmapProps) {
  const { data: clients, isLoading, error } = useClients({ partnerId });

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (error || !clients || clients.length === 0) {
    return (
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📊 Client Retention Cohort Analysis
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Not enough client data for cohort analysis
          </p>
        </div>
      </Card>
    );
  }

  // Group clients by join month
  const cohortMap = new Map<string, any[]>();
  
  clients.forEach(client => {
    const joinDate = new Date(client.joinDate);
    const cohortKey = `${joinDate.getFullYear()}-${String(joinDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (!cohortMap.has(cohortKey)) {
      cohortMap.set(cohortKey, []);
    }
    cohortMap.get(cohortKey)!.push(client);
  });

  // Sort cohorts by date (most recent first)
  const sortedCohorts = Array.from(cohortMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 12); // Last 12 months

  // Determine activity levels (simplified - based on tier)
  const getActivityLevel = (client: any): 'active' | 'dormant' | 'churned' => {
    if (client.tier === 'active' || client.tier === 'VIP') return 'active';
    if (client.tier === 'dormant') return 'dormant';
    return 'churned';
  };

  // Calculate retention percentages for each cohort over months since join
  const cohortData = sortedCohorts.map(([cohortKey, cohortClients]) => {
    const totalClients = cohortClients.length;
    const activeClients = cohortClients.filter(c => getActivityLevel(c) === 'active').length;
    const dormantClients = cohortClients.filter(c => getActivityLevel(c) === 'dormant').length;
    
    const activeRate = (activeClients / totalClients) * 100;
    const dormantRate = (dormantClients / totalClients) * 100;
    const churnedRate = 100 - activeRate - dormantRate;

    return {
      month: cohortKey,
      displayMonth: new Date(cohortKey + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      total: totalClients,
      activeRate,
      dormantRate,
      churnedRate,
    };
  });

  const getColorForRate = (rate: number, type: 'active' | 'dormant' | 'churned') => {
    if (type === 'active') {
      if (rate >= 75) return 'bg-green-600';
      if (rate >= 50) return 'bg-green-500';
      if (rate >= 25) return 'bg-green-400';
      return 'bg-green-300';
    } else if (type === 'dormant') {
      if (rate >= 50) return 'bg-yellow-600';
      if (rate >= 25) return 'bg-yellow-500';
      return 'bg-yellow-400';
    } else {
      if (rate >= 50) return 'bg-red-600';
      if (rate >= 25) return 'bg-red-500';
      return 'bg-red-400';
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        📊 Client Retention Cohort Analysis
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Join Month
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Total Clients
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Active %
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Dormant %
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Churned %
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Retention Visual
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {cohortData.map((cohort) => (
              <tr key={cohort.month} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {cohort.displayMonth}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {cohort.total}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                    cohort.activeRate >= 50 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {cohort.activeRate.toFixed(0)}%
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    {cohort.dormantRate.toFixed(0)}%
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                    cohort.churnedRate >= 50 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {cohort.churnedRate.toFixed(0)}%
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 w-full max-w-xs">
                    {/* Active segment */}
                    {cohort.activeRate > 0 && (
                      <div
                        className={`h-8 ${getColorForRate(cohort.activeRate, 'active')} flex items-center justify-center text-xs text-white font-semibold`}
                        style={{ width: `${cohort.activeRate}%` }}
                        title={`Active: ${cohort.activeRate.toFixed(1)}%`}
                      >
                        {cohort.activeRate >= 15 && `${cohort.activeRate.toFixed(0)}%`}
                      </div>
                    )}
                    {/* Dormant segment */}
                    {cohort.dormantRate > 0 && (
                      <div
                        className={`h-8 ${getColorForRate(cohort.dormantRate, 'dormant')} flex items-center justify-center text-xs text-white font-semibold`}
                        style={{ width: `${cohort.dormantRate}%` }}
                        title={`Dormant: ${cohort.dormantRate.toFixed(1)}%`}
                      >
                        {cohort.dormantRate >= 15 && `${cohort.dormantRate.toFixed(0)}%`}
                      </div>
                    )}
                    {/* Churned segment */}
                    {cohort.churnedRate > 0 && (
                      <div
                        className={`h-8 ${getColorForRate(cohort.churnedRate, 'churned')} flex items-center justify-center text-xs text-white font-semibold`}
                        style={{ width: `${cohort.churnedRate}%` }}
                        title={`Churned: ${cohort.churnedRate.toFixed(1)}%`}
                      >
                        {cohort.churnedRate >= 15 && `${cohort.churnedRate.toFixed(0)}%`}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Dormant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Churned</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

