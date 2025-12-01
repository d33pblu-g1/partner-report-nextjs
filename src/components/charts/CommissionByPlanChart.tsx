/**
 * Commission by Plan Breakdown
 * Stacked bar chart showing commission breakdown by plan type
 */

'use client';

import { Card } from '@/components/ui/Card';
import { useCommissionsByPlan } from '@/hooks/useCubeData';
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

interface CommissionByPlanChartProps {
  partnerId?: string;
}

export function CommissionByPlanChart({ partnerId }: CommissionByPlanChartProps) {
  const { data, isLoading, error } = useCommissionsByPlan(partnerId);

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
          📊 Commission by Plan
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {error ? `Error: ${error.message}` : 'No commission plan data available'}
          </p>
        </div>
      </Card>
    );
  }

  // Debug: Log first item to see actual field names
  if (data.length > 0) {
    console.log('📊 Commission by Plan - Sample data:', data[0]);
    console.log('📊 Commission by Plan - Available fields:', Object.keys(data[0]));
  }

  // Group by plan and aggregate
  const planMap = new Map<string, number>();
  data.forEach((item: any) => {
    // Try multiple possible field name variations for plan
    const plan = item.commission_plan || 
                 item.plan_name || 
                 item.commissionplan || 
                 item.plan || 
                 item.type ||
                 item.plan_type ||
                 'Unknown';
    
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
    
    planMap.set(plan, (planMap.get(plan) || 0) + commission);
  });

  const chartData = Array.from(planMap.entries())
    .map(([plan, commission]) => ({
      plan: plan.length > 20 ? plan.substring(0, 20) + '...' : plan,
      fullPlan: plan,
      commission,
    }))
    .filter(item => item.commission > 0) // Filter out zero values
    .sort((a, b) => b.commission - a.commission);

  // If all plans are "Unknown" or no valid data, show helpful message
  const allUnknown = chartData.every(item => item.fullPlan === 'Unknown');
  const totalCommission = chartData.reduce((sum, item) => sum + item.commission, 0);

  if (chartData.length === 0 || totalCommission === 0) {
    console.warn('📊 Commission by Plan - No valid commission data found in response');
    return (
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📊 Commission by Plan
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No commission data with valid amounts found.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Check browser console for data structure details.
          </p>
        </div>
      </Card>
    );
  }

  if (allUnknown) {
    console.warn('📊 Commission by Plan - All plans are "Unknown". Check field names.');
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {payload[0].payload.fullPlan}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Commission:</strong> {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        📊 Commission by Plan
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D6DADB" className="dark:stroke-gray-700" opacity={0.5} />
            <XAxis
              dataKey="plan"
              stroke="#6E6E6E"
              className="dark:stroke-gray-400"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis
              stroke="#6E6E6E"
              className="dark:stroke-gray-400"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
            <Bar dataKey="commission" fill="#377CFC" name="Commission" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Plans</p>
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

