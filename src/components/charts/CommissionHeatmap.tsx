/**
 * Commission Heatmap Calendar
 * Calendar view showing daily commission earnings
 */

'use client';

import { Card } from '@/components/ui/Card';
import { useCommissionsByPlan } from '@/hooks/useCubeData';
import { formatCurrency } from '@/lib/utils';

interface CommissionHeatmapProps {
  partnerId?: string;
}

export function CommissionHeatmap({ partnerId }: CommissionHeatmapProps) {
  const { data, isLoading, error } = useCommissionsByPlan(partnerId);

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
          🗓️ Commission Calendar Heatmap
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No daily commission data available
          </p>
        </div>
      </Card>
    );
  }

  // Group by date and sum commissions
  const dateMap = new Map<string, number>();
  data.forEach((item: any) => {
    const date = item.date || item.trade_date || item.commission_date;
    if (date) {
      const dateStr = new Date(date).toISOString().split('T')[0];
      const commission = item.commission || item.total_commission || 0;
      dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + commission);
    }
  });

  // Get last 90 days
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 89);

  const dailyData: Array<{ date: string; commission: number }> = [];
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dailyData.push({
      date: dateStr,
      commission: dateMap.get(dateStr) || 0,
    });
  }

  // Find min and max for color scaling
  const commissions = dailyData.map(d => d.commission).filter(c => c > 0);
  const maxCommission = Math.max(...commissions, 1);

  // Get color intensity based on commission
  const getColor = (commission: number) => {
    if (commission === 0) return 'bg-gray-100 dark:bg-gray-800';
    const intensity = Math.min((commission / maxCommission) * 100, 100);
    if (intensity > 75) return 'bg-green-600';
    if (intensity > 50) return 'bg-green-500';
    if (intensity > 25) return 'bg-green-400';
    return 'bg-green-300';
  };

  // Group by week
  const weeks: Array<Array<{ date: string; commission: number }>> = [];
  let currentWeek: Array<{ date: string; commission: number }> = [];
  
  dailyData.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === dailyData.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const totalCommission = dailyData.reduce((sum, d) => sum + d.commission, 0);
  const avgDailyCommission = totalCommission / dailyData.length;

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        🗓️ Commission Calendar Heatmap (Last 90 Days)
      </h3>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Day labels */}
          <div className="flex gap-1 mb-2 ml-12">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="w-12 text-xs text-center text-gray-600 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1 items-center">
                <div className="w-10 text-xs text-gray-600 dark:text-gray-400">
                  W{weekIndex + 1}
                </div>
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-12 h-12 rounded ${getColor(day.commission)} cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all`}
                    title={`${day.date}: ${formatCurrency(day.commission)}`}
                  >
                    <div className="flex items-center justify-center h-full">
                      <span className="text-xs font-semibold text-white">
                        {day.commission > 0 ? `$${(day.commission / 1000).toFixed(0)}k` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Less</span>
            <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800"></div>
            <div className="w-4 h-4 rounded bg-green-300"></div>
            <div className="w-4 h-4 rounded bg-green-400"></div>
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <div className="w-4 h-4 rounded bg-green-600"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">More</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total (90 days)</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalCommission)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Daily Average</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(avgDailyCommission)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Best Day</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(maxCommission)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

