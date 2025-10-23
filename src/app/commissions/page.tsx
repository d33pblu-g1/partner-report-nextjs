'use client';

import { useStore } from '@/store/useStore';
import { useCommissions } from '@/hooks/useCommissions';
import { Card } from '@/components/ui/Card';
import { CommissionByPlanChart } from '@/components/charts/CommissionByPlanChart';
import { PlatformPieChart } from '@/components/charts/PlatformPieChart';
import { ProductBarChart } from '@/components/charts/ProductBarChart';
import { SymbolRankingTable } from '@/components/charts/SymbolRankingTable';
import { CommissionHeatmap } from '@/components/charts/CommissionHeatmap';
import { DepositCommissionCorrelation } from '@/components/charts/DepositCommissionCorrelation';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function CommissionsPage() {
  const { selectedPartnerId } = useStore();
  const { data: commissions, isLoading, error } = useCommissions(selectedPartnerId || undefined);

  // Calculate totals
  const totalCommissions = commissions?.reduce((sum, c) => sum + (c.commission || 0), 0) || 0;
  const averageCommission = commissions?.length ? totalCommissions / commissions.length : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Commissions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View commission history and analytics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Commissions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {isLoading ? '...' : formatCurrency(totalCommissions)}
              </p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Commission</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {isLoading ? '...' : formatCurrency(averageCommission)}
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Months</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {isLoading ? '...' : formatNumber(commissions?.length || 0)}
              </p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </Card>
      </div>

      {/* Commission Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CommissionByPlanChart partnerId={selectedPartnerId || undefined} />
        <PlatformPieChart partnerId={selectedPartnerId || undefined} />
      </div>

      <div className="mb-8">
        <ProductBarChart partnerId={selectedPartnerId || undefined} />
      </div>

      <div className="mb-8">
        <SymbolRankingTable partnerId={selectedPartnerId || undefined} />
      </div>

      <div className="mb-8">
        <CommissionHeatmap partnerId={selectedPartnerId || undefined} />
      </div>

      <div className="mb-8">
        <DepositCommissionCorrelation partnerId={selectedPartnerId || undefined} />
      </div>

      {/* Commission List */}
      {isLoading ? (
        <Card>
          <div className="space-y-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-16 rounded-lg" />
              </div>
            ))}
          </div>
        </Card>
      ) : error ? (
        <Card>
          <div className="text-red-600 dark:text-red-400 text-center py-8">
            ❌ Failed to load commissions: {error.message}
          </div>
        </Card>
      ) : commissions && commissions.length > 0 ? (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {commissions.map((commission, index) => {
                  const percentage = totalCommissions > 0 ? (commission.commission / totalCommissions) * 100 : 0;
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {commission.month}
                        </div>
                        {commission.date && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {commission.date}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(commission.commission)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      Total
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(totalCommissions)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      100%
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No commissions found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No commission data available for this selection
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

