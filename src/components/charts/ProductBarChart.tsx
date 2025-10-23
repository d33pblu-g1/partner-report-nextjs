/**
 * Product Commission Distribution
 * Bar chart for forex/crypto/synthetics commission breakdown
 */

'use client';

import { Card } from '@/components/ui/Card';
import { useCommissionsByProduct } from '@/hooks/useCubeData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ProductBarChartProps {
  partnerId?: string;
}

const PRODUCT_COLORS: Record<string, string> = {
  'Forex': '#3b82f6',
  'Crypto': '#f59e0b',
  'Synthetics': '#8b5cf6',
  'Commodities': '#10b981',
  'Indices': '#ef4444',
  'Stocks': '#06b6d4',
};

export function ProductBarChart({ partnerId }: ProductBarChartProps) {
  const { data, isLoading, error } = useCommissionsByProduct(partnerId);

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
          📦 Product Commission Distribution
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No product data available
          </p>
        </div>
      </Card>
    );
  }

  // Group by product
  const productMap = new Map<string, number>();
  data.forEach((item: any) => {
    const product = item.product || item.product_type || item.product_name || 'Other';
    const commission = item.commission || item.total_commission || 0;
    productMap.set(product, (productMap.get(product) || 0) + commission);
  });

  const chartData = Array.from(productMap.entries())
    .map(([product, commission]) => ({
      product,
      commission,
      fill: PRODUCT_COLORS[product] || '#6b7280',
    }))
    .sort((a, b) => b.commission - a.commission);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = chartData.reduce((sum, item) => sum + item.commission, 0);
      const percentage = total > 0 ? (data.commission / total) * 100 : 0;

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {data.product}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Commission:</strong> {formatCurrency(data.commission)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {percentage.toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const totalCommission = chartData.reduce((sum, item) => sum + item.commission, 0);

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        📦 Product Commission Distribution
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#D6DADB" className="dark:stroke-gray-700" opacity={0.5} />
            <XAxis
              type="category"
              dataKey="product"
              stroke="#6E6E6E"
              className="dark:stroke-gray-400"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              type="number"
              stroke="#6E6E6E"
              className="dark:stroke-gray-400"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
            <Bar dataKey="commission" name="Commission" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {chartData.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Commission</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalCommission)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

