'use client';

import { Card } from '@/components/ui/Card';
import type { PartnerInsight } from '@/types';

interface InsightsSectionProps {
  insights?: PartnerInsight[];
  isLoading?: boolean;
  error?: Error | null;
}

const getCategoryIcon = (category?: string) => {
  switch (category) {
    case 'trading_behavior':
      return '📊';
    case 'platform_usage':
      return '💻';
    case 'device_usage':
      return '📱';
    case 'link_performance':
      return '🔗';
    case 'demographics':
      return '👥';
    case 'behavior':
      return '🎯';
    case 'timing':
      return '⏰';
    default:
      return '💡';
  }
};

const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'trading_behavior':
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    case 'platform_usage':
      return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
    case 'device_usage':
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    case 'link_performance':
      return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    case 'demographics':
      return 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800';
    default:
      return 'bg-gray-50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700';
  }
};

export function InsightsSection({ insights, isLoading, error }: InsightsSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Top 3 Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-16 rounded-lg"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    // Check if it's the "Endpoint not found" error (backend not implemented yet)
    const isEndpointMissing = error.message.includes('Endpoint not found');
    
    if (isEndpointMissing) {
      // Show demo insights instead of an error
      const demoInsights = [
        {
          id: 1,
          partner_id: 'demo',
          insight_text: 'Your client trading trends have been shifting from synthetics to crypto over the past 3 months',
          category: 'trading_behavior',
          priority: 1,
          created_at: new Date().toISOString(),
          is_active: true
        },
        {
          id: 2,
          partner_id: 'demo',
          insight_text: 'Most of your clients this month have traded on their mobile phone',
          category: 'device_usage',
          priority: 2,
          created_at: new Date().toISOString(),
          is_active: true
        },
        {
          id: 3,
          partner_id: 'demo',
          insight_text: 'Your most profitable link was the Instagram campaign',
          category: 'link_performance',
          priority: 3,
          created_at: new Date().toISOString(),
          is_active: true
        }
      ];
      
      return (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Top 3 Insights
              </h2>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Demo • Backend setup required
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoInsights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border ${getCategoryColor(insight.category)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">
                    {getCategoryIcon(insight.category)}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">
                      {insight.insight_text}
                    </p>
                    {insight.category && (
                      <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-white/50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300">
                        {insight.category.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      );
    }
    
    // Show error for other types of errors
    return (
      <Card>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Top 3 Insights
        </h2>
        <div className="text-center py-6">
          <p className="text-red-600 dark:text-red-400 text-sm">
            Failed to load insights: {error.message}
          </p>
        </div>
      </Card>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <Card>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Top 3 Insights
        </h2>
        <div className="text-center py-8">
          <span className="text-4xl mb-2 block">💡</span>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No insights available yet. Keep building your performance!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">✨</span>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Top 3 Insights
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.slice(0, 3).map((insight, index) => (
          <div
            key={insight.id}
            className={`p-4 rounded-lg border ${getCategoryColor(insight.category)}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">
                {getCategoryIcon(insight.category)}
              </span>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white">
                  {insight.insight_text}
                </p>
                {insight.category && (
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-white/50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300">
                    {insight.category.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

