/**
 * Daily Trends Chart
 * Shows signups, deposits, and commissions over time
 */

'use client';

import { Card } from '@/components/ui/Card';
import { useDailyTrends } from '@/hooks/useCubeData';
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

interface DailyTrendsChartProps {
  partnerId?: string;
}

export function DailyTrendsChart({ partnerId }: DailyTrendsChartProps) {
  const { data, isLoading, error } = useDailyTrends(partnerId);

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
          📈 Daily Performance Trends
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {error ? 'Failed to load trends data' : 'No trends data available'}
          </p>
        </div>
      </Card>
    );
  }

  // Prepare chart data - limit to last 30 days
  const chartData = data.slice(-30).map((item: any) => ({
    date: new Date(item.date || item.trade_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    signups: item.new_clients || item.signups || 0,
    deposits: item.total_deposits || 0,
    commissions: item.total_commissions || item.commission || 0,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {payload[0].payload.date}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <strong>{entry.name}:</strong>{' '}
              {entry.name === 'Commissions' || entry.name === 'Deposits'
                ? formatCurrency(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        📈 Daily Performance Trends (Last 30 Days)
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D6DADB" className="dark:stroke-gray-700" opacity={0.5} />
            <XAxis
              dataKey="date"
              stroke="#6E6E6E"
              className="dark:stroke-gray-400"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#6E6E6E"
              className="dark:stroke-gray-400"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6E6E6E"
              className="dark:stroke-gray-400"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
            
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="signups"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 3 }}
              name="Signups"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="deposits"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 3 }}
              name="Deposits"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="commissions"
              stroke="#FF444F"
              strokeWidth={2}
              dot={{ fill: '#FF444F', r: 3 }}
              name="Commissions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Signups</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {chartData.reduce((sum, d) => sum + d.signups, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Deposits</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(chartData.reduce((sum, d) => sum + d.deposits, 0))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Commissions</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(chartData.reduce((sum, d) => sum + d.commissions, 0))}
          </p>
        </div>
      </div>
    </Card>
  );
}

