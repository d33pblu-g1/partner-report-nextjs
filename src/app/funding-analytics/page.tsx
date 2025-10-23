'use client';

import { useStore } from '@/store/useStore';
import { useMonthlyDeposits } from '@/hooks/useCubeData';
import { Card } from '@/components/ui/Card';
import { DepositCommissionCorrelation } from '@/components/charts/DepositCommissionCorrelation';
import { FundingWaterfallChart } from '@/components/charts/FundingWaterfallChart';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function FundingAnalyticsPage() {
  const { selectedPartnerId } = useStore();
  const { data: deposits, isLoading, error } = useMonthlyDeposits(selectedPartnerId || undefined);

  // Calculate funding velocity metrics
  const calculateMetrics = () => {
    if (!deposits || !Array.isArray(deposits) || deposits.length === 0) {
      return {
        totalDeposits: 0,
        totalWithdrawals: 0,
        netDeposits: 0,
        avgDepositSize: 0,
        uniqueDepositors: 0,
        repeatDepositors: 0,
        depositGrowth: 0,
      };
    }

    const totalDeposits = deposits.reduce((sum: number, d: any) => sum + (d.total_deposits || 0), 0);
    const totalWithdrawals = deposits.reduce((sum: number, d: any) => sum + (d.total_withdrawals || 0), 0);
    const netDeposits = deposits.reduce((sum: number, d: any) => sum + (d.net_deposits || 0), 0);
    const uniqueDepositors = deposits.reduce((sum: number, d: any) => sum + (d.unique_depositors || 0), 0);
    const repeatDepositors = deposits.reduce((sum: number, d: any) => sum + (d.repeat_depositors || 0), 0);
    const depositCount = deposits.reduce((sum: number, d: any) => sum + (d.deposit_count || 0), 0);
    const avgDepositSize = depositCount > 0 ? totalDeposits / depositCount : 0;

    // Calculate growth (last month vs first month)
    const sortedDeposits = [...deposits].sort((a: any, b: any) => 
      (a.year_val * 100 + a.month_val) - (b.year_val * 100 + b.month_val)
    );
    const firstMonth = sortedDeposits[0]?.total_deposits || 0;
    const lastMonth = sortedDeposits[sortedDeposits.length - 1]?.total_deposits || 0;
    const depositGrowth = firstMonth > 0 ? ((lastMonth - firstMonth) / firstMonth) * 100 : 0;

    return {
      totalDeposits,
      totalWithdrawals,
      netDeposits,
      avgDepositSize,
      uniqueDepositors,
      repeatDepositors,
      depositGrowth,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Funding Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze deposit and withdrawal patterns, funding velocity, and client behavior
        </p>
      </div>

      {/* Funding Velocity KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Deposits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {isLoading ? '...' : formatCurrency(metrics.totalDeposits)}
              </p>
              <p className={`text-sm mt-1 ${metrics.depositGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.depositGrowth >= 0 ? '↑' : '↓'} {Math.abs(metrics.depositGrowth).toFixed(1)}% growth
              </p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Net Deposits</p>
              <p className={`text-2xl font-bold mt-1 ${metrics.netDeposits >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {isLoading ? '...' : formatCurrency(metrics.netDeposits)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                After withdrawals
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Deposit Size</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {isLoading ? '...' : formatCurrency(metrics.avgDepositSize)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Per transaction
              </p>
            </div>
            <div className="text-3xl">💵</div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Repeat Depositors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {isLoading ? '...' : formatNumber(metrics.repeatDepositors)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {metrics.uniqueDepositors > 0 
                  ? `${((metrics.repeatDepositors / metrics.uniqueDepositors) * 100).toFixed(0)}% of total`
                  : 'No data'}
              </p>
            </div>
            <div className="text-3xl">🔄</div>
          </div>
        </Card>
      </div>

      {/* Deposit vs Withdrawal Trends */}
      <div className="mb-8">
        <DepositCommissionCorrelation partnerId={selectedPartnerId || undefined} />
      </div>

      {/* Net Deposit Waterfall */}
      <div className="mb-8">
        <FundingWaterfallChart partnerId={selectedPartnerId || undefined} />
      </div>

      {/* Funding Insights */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          💡 Funding Insights & Recommendations
        </h3>
        <div className="space-y-4">
          {metrics.netDeposits >= 0 ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                ✅ Positive Net Flow
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                Your clients are depositing more than they're withdrawing, which indicates healthy account growth and client satisfaction.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                ⚠️ Negative Net Flow
              </h4>
              <p className="text-sm text-red-800 dark:text-red-200">
                Withdrawals exceed deposits. Consider implementing retention strategies and investigating client satisfaction.
              </p>
            </div>
          )}

          {metrics.repeatDepositors > 0 && metrics.uniqueDepositors > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🔄 Repeat Depositor Rate: {((metrics.repeatDepositors / metrics.uniqueDepositors) * 100).toFixed(0)}%
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {((metrics.repeatDepositors / metrics.uniqueDepositors) * 100) >= 50
                  ? 'Excellent! More than half of your clients are making repeat deposits, showing strong engagement.'
                  : 'Focus on encouraging initial depositors to add more funds through bonuses and engagement campaigns.'}
              </p>
            </div>
          )}

          {metrics.depositGrowth !== 0 && (
            <div className={`p-4 ${metrics.depositGrowth >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} rounded-lg`}>
              <h4 className={`font-semibold mb-2 ${metrics.depositGrowth >= 0 ? 'text-green-900 dark:text-green-100' : 'text-yellow-900 dark:text-yellow-100'}`}>
                📈 Deposit Growth Trend: {metrics.depositGrowth >= 0 ? '+' : ''}{metrics.depositGrowth.toFixed(1)}%
              </h4>
              <p className={`text-sm ${metrics.depositGrowth >= 0 ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'}`}>
                {metrics.depositGrowth >= 0
                  ? 'Your deposit volume is growing month-over-month. Keep up the momentum!'
                  : 'Deposits are declining. Review your acquisition and activation strategies.'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

