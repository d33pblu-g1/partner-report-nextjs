/**
 * Platform Performance Pie Chart
 * Shows commission distribution across MT4/MT5/cTrader platforms
 */

'use client';

import { Card } from '@/components/ui/Card';
import { useCommissionsByPlatform } from '@/hooks/useCubeData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface PlatformPieChartProps {
  partnerId?: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  'MT4': '#FF444F',
  'MT5': '#377CFC',
  'cTrader': '#10b981',
  'DTrader': '#8b5cf6',
  'Other': '#6b7280',
};

export function PlatformPieChart({ partnerId }: PlatformPieChartProps) {
  const { data, isLoading, error } = useCommissionsByPlatform(partnerId);

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
          💻 Platform Performance
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {error ? `Error: ${error.message}` : 'No platform data available'}
          </p>
        </div>
      </Card>
    );
  }

  // Debug: Log first item to see actual field names
  if (data.length > 0) {
    console.log('💻 Platform Performance - Sample data:', data[0]);
    console.log('💻 Platform Performance - Available fields:', Object.keys(data[0]));
  }

  // Group by platform
  const platformMap = new Map<string, number>();
  data.forEach((item: any) => {
    // Try multiple possible field name variations for platform
    const platform = item.platform || 
                     item.platform_name || 
                     item.platformname ||
                     item.trading_platform ||
                     item.platform_type ||
                     item.type ||
                     'Other';
    
    // Try multiple possible field name variations for commission amount
    const commission = parseFloat(
      item.commission || 
      item.total_commission || 
      item.total_commissions ||
      item.amount || 
      item.commission_amount ||
      item.revenue ||
      item.expected_revenue_usd ||
      0
    );
    
    platformMap.set(platform, (platformMap.get(platform) || 0) + commission);
  });

  const chartData = Array.from(platformMap.entries())
    .map(([platform, commission]) => ({
      name: platform,
      value: commission,
      percentage: 0, // Will calculate after
    }))
    .filter(item => item.value > 0) // Filter out zero values
    .sort((a, b) => b.value - a.value);

  // Calculate percentages
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  chartData.forEach(item => {
    item.percentage = total > 0 ? (item.value / total) * 100 : 0;
  });

  // Validation and warnings
  const allOther = chartData.every(item => item.name === 'Other');
  
  if (chartData.length === 0 || total === 0) {
    console.warn('💻 Platform Performance - No valid commission data found in response');
    return (
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          💻 Platform Performance
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No platform data with valid amounts found.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Check browser console for data structure details.
          </p>
        </div>
      </Card>
    );
  }

  if (allOther) {
    console.warn('💻 Platform Performance - All platforms are "Other". Check field names.');
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {data.name}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Commission:</strong> {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.percentage.toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        💻 Platform Performance
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
             label={({ name, percentage }: any) => `${name} (${percentage.toFixed(0)}%)`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PLATFORM_COLORS[entry.name] || PLATFORM_COLORS['Other']}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Platform Details */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {chartData.map((platform) => (
            <div key={platform.name} className="text-center">
              <div
                className="w-4 h-4 rounded-full mx-auto mb-2"
                style={{ backgroundColor: PLATFORM_COLORS[platform.name] || PLATFORM_COLORS['Other'] }}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {platform.name}
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(platform.value)}
              </p>
              <p className="text-xs text-gray-500">
                {platform.percentage.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

