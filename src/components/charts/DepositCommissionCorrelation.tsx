/**
 * Deposit vs Commission Correlation Chart
 * Dual-axis chart showing relationship between deposits and commissions
 */

'use client';

import { Card } from '@/components/ui/Card';
import { useMonthlyDeposits } from '@/hooks/useCubeData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface DepositCommissionCorrelationProps {
  partnerId?: string;
}

export function DepositCommissionCorrelation({ partnerId }: DepositCommissionCorrelationProps) {
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
          📊 Deposits vs Commissions
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No monthly deposit data available
          </p>
        </div>
      </Card>
    );
  }

  // Prepare chart data
  const chartData = data.map((item: any) => ({
    month: item.month_name || item.year_month_str || 'Unknown',
    deposits: item.total_deposits || 0,
    netDeposits: item.net_deposits || 0,
    withdrawals: item.total_withdrawals || 0,
    // Note: Commission data might not be in monthly_deposits cube
    // This would need to be joined with commission data in the backend
    // For now, we'll use a placeholder or estimate
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {payload[0].payload.month}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <strong>{entry.name}:</strong> {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const totalDeposits = chartData.reduce((sum, d) => sum + d.deposits, 0);
  const totalWithdrawals = chartData.reduce((sum, d) => sum + d.withdrawals, 0);
  const netDeposits = chartData.reduce((sum, d) => sum + d.netDeposits, 0);

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        📊 Deposits vs Withdrawals (Monthly)
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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
            
            <Line
              type="monotone"
              dataKey="deposits"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }}
              name="Deposits"
            />
            <Line
              type="monotone"
              dataKey="withdrawals"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', r: 5 }}
              name="Withdrawals"
            />
            <Line
              type="monotone"
              dataKey="netDeposits"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              name="Net Deposits"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Deposits</p>
          <p className="text-xl font-bold text-green-600">
            {formatCurrency(totalDeposits)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Withdrawals</p>
          <p className="text-xl font-bold text-red-600">
            {formatCurrency(totalWithdrawals)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Net Deposits</p>
          <p className={`text-xl font-bold ${netDeposits >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(netDeposits)}
          </p>
        </div>
      </div>
    </Card>
  );
}

