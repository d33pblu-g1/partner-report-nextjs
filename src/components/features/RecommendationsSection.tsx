'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { PartnerRecommendation } from '@/types';

interface RecommendationsSectionProps {
  recommendations?: PartnerRecommendation[];
  isLoading?: boolean;
  error?: Error | null;
}

const getCategoryIcon = (category?: string) => {
  switch (category) {
    case 'strategy':
      return '🎯';
    case 'content':
      return '📝';
    case 'engagement':
      return '💬';
    case 'onboarding':
      return '🚀';
    case 'conversion':
      return '📈';
    case 'marketing':
      return '📢';
    case 'optimization':
      return '⚡';
    case 'retention':
      return '🔄';
    case 'platform':
      return '💻';
    case 'timing':
      return '⏰';
    default:
      return '💡';
  }
};

const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'strategy':
      return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
    case 'content':
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    case 'engagement':
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    case 'onboarding':
      return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    case 'conversion':
      return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
    case 'marketing':
      return 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800';
    case 'retention':
      return 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800';
    default:
      return 'bg-gray-50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700';
  }
};

export function RecommendationsSection({ recommendations, isLoading, error }: RecommendationsSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Top 3 Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-20 rounded-lg"></div>
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
      // Show demo recommendations instead of an error
      const demoRecommendations = [
        {
          id: 1,
          partner_id: 'demo',
          recommendation_text: 'You have a healthy acquisition channel; you should concentrate more on activation and reactivation campaigns',
          category: 'strategy',
          priority: 1,
          action_url: '/clients',
          created_at: new Date().toISOString(),
          is_active: true
        },
        {
          id: 2,
          partner_id: 'demo',
          recommendation_text: 'Most of your customers are stuck on KYC verification. Consider creating a step-by-step guide',
          category: 'onboarding',
          priority: 2,
          action_url: null,
          created_at: new Date().toISOString(),
          is_active: true
        },
        {
          id: 3,
          partner_id: 'demo',
          recommendation_text: 'You have 45 dormant clients. Launch a reactivation email campaign',
          category: 'retention',
          priority: 3,
          action_url: '/clients',
          created_at: new Date().toISOString(),
          is_active: true
        }
      ];
      
      return (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Top 3 Recommendations
              </h2>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Demo • Backend setup required
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoRecommendations.map((recommendation, index) => (
              <div
                key={recommendation.id}
                className={`p-4 rounded-lg border ${getCategoryColor(recommendation.category)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <span className="text-2xl">
                      {getCategoryIcon(recommendation.category)}
                    </span>
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                      {index + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white mb-2">
                      {recommendation.recommendation_text}
                    </p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      {recommendation.category && (
                        <span className="text-xs px-2 py-1 rounded-full bg-white/50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300">
                          {recommendation.category.replace(/_/g, ' ')}
                        </span>
                      )}
                      
                      {recommendation.action_url && (
                        <a href={recommendation.action_url}>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="text-xs"
                          >
                            Take Action →
                          </Button>
                        </a>
                      )}
                    </div>
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
          Top 3 Recommendations
        </h2>
        <div className="text-center py-6">
          <p className="text-red-600 dark:text-red-400 text-sm">
            Failed to load recommendations: {error.message}
          </p>
        </div>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Top 3 Recommendations
        </h2>
        <div className="text-center py-8">
          <span className="text-4xl mb-2 block">🎯</span>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No recommendations at this time. You're doing great!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎯</span>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Top 3 Recommendations
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.slice(0, 3).map((recommendation, index) => (
          <div
            key={recommendation.id}
            className={`p-4 rounded-lg border ${getCategoryColor(recommendation.category)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 flex flex-col items-center gap-1">
                <span className="text-2xl">
                  {getCategoryIcon(recommendation.category)}
                </span>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  {index + 1}
                </span>
              </div>
              
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white mb-2">
                  {recommendation.recommendation_text}
                </p>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {recommendation.category && (
                    <span className="text-xs px-2 py-1 rounded-full bg-white/50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300">
                      {recommendation.category.replace(/_/g, ' ')}
                    </span>
                  )}
                  
                  {recommendation.action_url && (
                    <a href={recommendation.action_url}>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="text-xs"
                      >
                        Take Action →
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

