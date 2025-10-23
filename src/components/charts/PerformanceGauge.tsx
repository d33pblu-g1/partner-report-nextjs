/**
 * Performance Gauge
 * Visual indicator of overall performance score
 */

'use client';

import { Card } from '@/components/ui/Card';
import { usePartnerScorecard } from '@/hooks/useMetrics';
import { safeToFixed } from '@/lib/utils';

interface PerformanceGaugeProps {
  partnerId?: string;
}

export function PerformanceGauge({ partnerId }: PerformanceGaugeProps) {
  const { data, isLoading, error } = usePartnerScorecard(partnerId);

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🎯 Performance Score
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {error ? 'Failed to load performance data' : 'No performance data available'}
          </p>
        </div>
      </Card>
    );
  }

  // Extract scorecard data
  const scorecard = Array.isArray(data) ? data[0] : data;
  const score = Number(scorecard?.overall_performance_score) || 0;
  const revenueGrowth = Number(scorecard?.revenue_growth_rate) || 0;
  const clientGrowth = Number(scorecard?.client_growth_rate) || 0;

  // Determine color based on score
  const getColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#3b82f6'; // blue
    if (score >= 40) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const getLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const color = getColor(score);
  const label = getLabel(score);
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        🎯 Performance Score
      </h3>

      <div className="flex flex-col items-center">
        {/* Circular Gauge */}
        <div className="relative w-56 h-56">
          <svg className="transform -rotate-90 w-56 h-56">
            {/* Background circle */}
            <circle
              cx="112"
              cy="112"
              r="90"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
              className="dark:stroke-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="112"
              cy="112"
              r="90"
              stroke={color}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-gray-900 dark:text-white">
              {Math.round(score)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              out of 100
            </span>
            <span
              className="text-sm font-semibold mt-2 px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${color}20`,
                color: color,
              }}
            >
              {label}
            </span>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="mt-8 w-full grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Revenue Growth
            </p>
            <p className={`text-2xl font-bold ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {revenueGrowth > 0 ? '+' : ''}{safeToFixed(revenueGrowth, 1)}%
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Client Growth
            </p>
            <p className={`text-2xl font-bold ${clientGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {clientGrowth > 0 ? '+' : ''}{safeToFixed(clientGrowth, 1)}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

