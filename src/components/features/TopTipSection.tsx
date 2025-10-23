'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRandomTip } from '@/hooks/useTips';

const getCategoryIcon = (category?: string) => {
  switch (category) {
    case 'marketing':
      return '📢';
    case 'acquisition':
      return '🎯';
    case 'retention':
      return '🔄';
    case 'platforms':
      return '💻';
    case 'social_media':
      return '📱';
    case 'content':
      return '✍️';
    case 'conversion':
      return '💰';
    case 'compliance':
      return '⚖️';
    case 'analytics':
      return '📊';
    case 'relationships':
      return '🤝';
    default:
      return '💡';
  }
};

const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'marketing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'acquisition':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'retention':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'platforms':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
    case 'social_media':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
    case 'content':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    case 'conversion':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    case 'compliance':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'analytics':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300';
    case 'relationships':
      return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getCategoryLabel = (category?: string) => {
  if (!category) return 'General';
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function TopTipSection() {
  const { data: tip, isLoading, error, refetch } = useRandomTip();

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Top Tip
            </h2>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg mb-4"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-10 w-32 rounded-lg"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    // Check if it's the "Endpoint not found" error (backend not implemented yet)
    const isEndpointMissing = error.message.includes('Endpoint not found');
    
    if (isEndpointMissing) {
      // Show a friendly placeholder instead of an error
      return (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Top Tip
              </h2>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl flex-shrink-0">💡</span>
              <div className="flex-1">
                <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
                  Focus on building trust before selling. Share educational content about forex trading to establish yourself as an authority in the space.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              Marketing
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Demo Tip • Backend setup required
            </span>
          </div>
        </Card>
      );
    }
    
    // Show error for other types of errors
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Top Tip
            </h2>
          </div>
        </div>
        <div className="text-center py-6">
          <p className="text-red-600 dark:text-red-400 text-sm mb-4">
            Failed to load tip: {error.message}
          </p>
          <Button onClick={() => refetch()} size="sm">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!tip) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Top Tip
            </h2>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            No tips available yet.
          </p>
          <Button onClick={() => refetch()} size="sm">
            Load Tip
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💡</span>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Top Tip
          </h2>
        </div>
        <Button 
          onClick={() => refetch()} 
          size="sm" 
          variant="secondary"
          className="flex items-center gap-2"
        >
          <span>🔄</span>
          Get New Tip
        </Button>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-4 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-start gap-4">
          <span className="text-4xl flex-shrink-0">
            {getCategoryIcon(tip.category)}
          </span>
          <div className="flex-1">
            <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
              {tip.tip_text}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(tip.category)}`}>
          {getCategoryLabel(tip.category)}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Tip #{tip.id}
        </span>
      </div>
    </Card>
  );
}

