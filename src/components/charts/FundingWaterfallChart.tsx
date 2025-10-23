/**
 * Funding Waterfall Chart
 * Shows net deposit flow analysis
 */

'use client';

import { Card } from '@/components/ui/Card';
import { useMonthlyDeposits } from '@/hooks/useCubeData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface FundingWaterfallChartProps {
  partnerId?: string;
}

export function FundingWaterfallChart({ partnerId }: FundingWaterfallChartProps) {
  const { data, isLoading, error } = useMonthlyDeposits(partnerId);

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (error || !data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          💧 Net Deposit Waterfall
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No monthly deposit data available
          </p>
        </div>
      </Card>
    );
  }

  // Prepare waterfall data
  const chartData = data.map((item: any) => {
    const deposits = item.total_deposits || 0;
    const withdrawals = item.total_withdrawals || 0;
    const netDeposits = item.net_deposits || (deposits - withdrawals);

    return {
      month: item.month_name || item.year_month_str || 'Unknown',
      deposits,
      withdrawals: -withdrawals, // Negative for visualization
      netDeposits,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {data.month}
          </p>
          <p className="text-sm text-green-600">
            <strong>Deposits:</strong> {formatCurrency(data.deposits)}
          </p>
          <p className="text-sm text-red-600">
            <strong>Withdrawals:</strong> {formatCurrency(-data.withdrawals)}
          </p>
          <p className={`text-sm font-semibold ${data.netDeposits >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            <strong>Net:</strong> {formatCurrency(data.netDeposits)}
          </p>
        </div>
      );
    }
    return null;
  };

  const totalDeposits = chartData.reduce((sum, d) => sum + d.deposits, 0);
  const totalWithdrawals = chartData.reduce((sum, d) => sum + Math.abs(d.withdrawals), 0);
  const totalNet = totalDeposits - totalWithdrawals;

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        💧 Net Deposit Waterfall Analysis
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D6DADB" className="dark:stroke-gray-700" opacity={0.5} />
            <XAxis
              dataKey="month"
              stroke="#6E6E6E"
              className="dark:stroke-gray-400"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6E6E6E"
              className="dark:stroke-gray-400"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
            <ReferenceLine y={0} stroke="#6b7280" />
            
            <Bar dataKey="deposits" fill="#10b981" name="Deposits" />
            <Bar dataKey="withdrawals" fill="#ef4444" name="Withdrawals" />
            <Bar dataKey="netDeposits" fill="#3b82f6" name="Net Deposits">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.netDeposits >= 0 ? '#3b82f6' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Deposits</p>
          <p className="text-2xl font-bold text-green-600">
            +{formatCurrency(totalDeposits)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Withdrawals</p>
          <p className="text-2xl font-bold text-red-600">
            -{formatCurrency(totalWithdrawals)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Net Flow</p>
          <p className={`text-2xl font-bold ${totalNet >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {totalNet >= 0 ? '+' : ''}{formatCurrency(totalNet)}
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>💡 Insight:</strong>{' '}
          {totalNet >= 0
            ? `Healthy net deposit flow with ${((totalDeposits / (totalDeposits + totalWithdrawals)) * 100).toFixed(0)}% retention rate.`
            : `Net negative flow detected. Focus on retention strategies to reduce withdrawals.`}
        </p>
      </div>
    </Card>
  );
}

