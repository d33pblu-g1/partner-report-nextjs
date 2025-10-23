/**
 * Client Acquisition Funnel Chart
 * Daily signup trends with moving average
 */

'use client';

import { Card } from '@/components/ui/Card';
import { useDailySignups } from '@/hooks/useCubeData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';

interface SignupFunnelChartProps {
  partnerId?: string;
}

export function SignupFunnelChart({ partnerId }: SignupFunnelChartProps) {
  const { data, isLoading, error } = useDailySignups(partnerId);

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
          📈 Client Acquisition Trend
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No signup data available
          </p>
        </div>
      </Card>
    );
  }

  // Process data - last 60 days
  const sortedData = [...data]
    .sort((a: any, b: any) => new Date(a.date || a.signup_date).getTime() - new Date(b.date || b.signup_date).getTime())
    .slice(-60);

  // Calculate moving average (7-day)
  const chartData = sortedData.map((item: any, index: number) => {
    const signups = item.signups || item.new_clients || item.signup_count || 0;
    
    // Calculate 7-day moving average
    const startIdx = Math.max(0, index - 6);
    const window = sortedData.slice(startIdx, index + 1);
    const movingAvg = window.reduce((sum: number, d: any) => 
      sum + (d.signups || d.new_clients || d.signup_count || 0), 0) / window.length;

    return {
      date: new Date(item.date || item.signup_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      signups,
      movingAvg: Math.round(movingAvg * 10) / 10,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {payload[0].payload.date}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Signups:</strong> {payload[0].value}
          </p>
          {payload[1] && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>7-Day Avg:</strong> {payload[1].value.toFixed(1)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const totalSignups = chartData.reduce((sum, d) => sum + d.signups, 0);
  const avgDailySignups = totalSignups / chartData.length;
  const bestDay = Math.max(...chartData.map(d => d.signups));

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        📈 Client Acquisition Trend (Last 60 Days)
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D6DADB" className="dark:stroke-gray-700" opacity={0.5} />
            <XAxis
              dataKey="date"
              stroke="#6E6E6E"
              className="dark:stroke-gray-400"
              style={{ fontSize: '12px' }}
              interval={Math.floor(chartData.length / 10)}
            />
            <YAxis
              stroke="#6E6E6E"
              className="dark:stroke-gray-400"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
            
            {/* Area for signups */}
            <Area
              type="monotone"
              dataKey="signups"
              fill="#3b82f6"
              fillOpacity={0.2}
              stroke="none"
            />
            
            {/* Line for daily signups */}
            <Line
              type="monotone"
              dataKey="signups"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Daily Signups"
            />
            
            {/* Line for moving average */}
            <Line
              type="monotone"
              dataKey="movingAvg"
              stroke="#FF444F"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="7-Day Average"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Signups</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalSignups}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Daily Average</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {avgDailySignups.toFixed(1)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Best Day</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {bestDay}
          </p>
        </div>
      </div>
    </Card>
  );
}

