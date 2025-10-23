/**
 * Product Volume Distribution Treemap
 * Hierarchical visualization of trading volume by product
 */

'use client';

import { Card } from '@/components/ui/Card';
import { useProductVolume } from '@/hooks/useCubeData';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { formatNumber, formatCurrency } from '@/lib/utils';

interface ProductTreemapProps {
  partnerId?: string;
}

const COLORS = ['#FF444F', '#377CFC', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

export function ProductTreemap({ partnerId }: ProductTreemapProps) {
  const { data, isLoading, error } = useProductVolume(partnerId);

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

  if (error || !data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📦 Product Volume Distribution
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No product volume data available
          </p>
        </div>
      </Card>
    );
  }

  // Process data for treemap
  const chartData = data.map((item: any, index: number) => ({
    name: item.product || item.product_type || item.product_name || 'Unknown',
    size: item.volume || item.total_volume || 0,
    value: item.volume || item.total_volume || 0,
    trades: item.trades || item.trade_count || 0,
    fill: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {data.name}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Volume:</strong> {formatNumber(data.value)}
          </p>
          {data.trades > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Trades:</strong> {formatNumber(data.trades)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomContent = (props: any) => {
    const { x, y, width, height, name, value, fill } = props;
    
    // Don't render if too small
    if (width < 40 || height < 40) return null;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill,
            stroke: '#fff',
            strokeWidth: 2,
            strokeOpacity: 1,
          }}
        />
        <text
          x={x + width / 2}
          y={y + height / 2 - 10}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
          fontWeight="bold"
        >
          {name}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
        >
          {formatNumber(value)}
        </text>
      </g>
    );
  };

  const totalVolume = chartData.reduce((sum, item) => sum + item.value, 0);
  const totalTrades = chartData.reduce((sum, item) => sum + item.trades, 0);

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        📦 Product Volume Distribution
      </h3>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={chartData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
            content={<CustomContent />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>

      {/* Product List */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {chartData.map((product, index) => {
            const percentage = totalVolume > 0 ? (product.value / totalVolume) * 100 : 0;
            
            return (
              <div key={product.name} className="flex items-start gap-2">
                <div
                  className="w-4 h-4 rounded flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: product.fill }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {percentage.toFixed(1)}% • {formatNumber(product.value)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {chartData.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(totalVolume)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Trades</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(totalTrades)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

