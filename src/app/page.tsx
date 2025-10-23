'use client';

import { useStore } from '@/store/useStore';
import { usePartners } from '@/hooks/usePartners';
import { useMetrics } from '@/hooks/useMetrics';
import { useInsights } from '@/hooks/useInsights';
import { useRecommendations } from '@/hooks/useRecommendations';
import { usePartner } from '@/hooks/usePartners';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { CommissionTrendsChart } from '@/components/charts/CommissionTrendsChart';
import { DailyTrendsChart } from '@/components/charts/DailyTrendsChart';
import { PerformanceGauge } from '@/components/charts/PerformanceGauge';
import { BadgeProgressCards } from '@/components/charts/BadgeProgressCards';
import { TierBadge } from '@/components/tiers/TierBadge';
import { RankCard } from '@/components/features/RankCard';
import { InsightsSection } from '@/components/features/InsightsSection';
import { RecommendationsSection } from '@/components/features/RecommendationsSection';
import { TopTipSection } from '@/components/features/TopTipSection';

export default function Home() {
  const { selectedPartnerId, setSelectedPartnerId } = useStore();
  const { data: partners, isLoading: partnersLoading, error: partnersError } = usePartners();
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useMetrics(selectedPartnerId || undefined);
  const { data: partner, isLoading: partnerLoading } = usePartner(selectedPartnerId || '');
  const { data: insights, isLoading: insightsLoading, error: insightsError } = useInsights(selectedPartnerId || undefined);
  const { data: recommendations, isLoading: recommendationsLoading, error: recommendationsError } = useRecommendations(selectedPartnerId || undefined);

  // Check if a specific partner is selected (not "All partners")
  const isSpecificPartner = selectedPartnerId && metrics?.partnerName && metrics.partnerName !== 'All partners';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Partner Dashboard
          </h1>
          {/* Tier Badge - Only show when a specific partner is selected */}
          {!metricsLoading && metrics && metrics.partnerName && metrics.partnerName !== 'All partners' && metrics.partnerTier && (
            <TierBadge tier={metrics.partnerTier} />
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive partner analytics and reporting
        </p>
      </div>

      {/* Top Tip Section - Always visible */}
      <div className="mb-8">
        <TopTipSection />
      </div>

      {/* Rankings Section - Only show for specific partners */}
      {isSpecificPartner && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RankCard
              type="country"
              rank={partner?.Country_Rank}
              isLoading={partnerLoading}
            />
            <RankCard
              type="global"
              rank={partner?.global_rank}
              isLoading={partnerLoading}
            />
          </div>
        </div>
      )}

      {/* Insights Section - Only show for specific partners */}
      {isSpecificPartner && (
        <div className="mb-8">
          <InsightsSection
            insights={insights}
            isLoading={insightsLoading}
            error={insightsError}
          />
        </div>
      )}

      {/* Recommendations Section - Only show for specific partners */}
      {isSpecificPartner && (
        <div className="mb-8">
          <RecommendationsSection
            recommendations={recommendations}
            isLoading={recommendationsLoading}
            error={recommendationsError}
          />
        </div>
      )}

      {/* Metrics Section */}
      {metricsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : metricsError ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">
              ❌ Failed to load metrics: {metricsError.message}
            </p>
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              Make sure the PHP API server is running on http://localhost:8001
            </p>
          </div>
        ) : metrics ? (
          <>
            {/* Lifetime Metrics */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Lifetime Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Commissions"
                  value={formatCurrency(metrics.ltCommissions)}
                  icon="💰"
                />
                <MetricCard
                  title="Volume Traded"
                  value={formatNumber(metrics.ltVolume)}
                  icon="📈"
                />
                <MetricCard
                  title="Deposits"
                  value={formatCurrency(metrics.ltDeposits)}
                  icon="💵"
                />
                <MetricCard
                  title="Clients"
                  value={formatNumber(metrics.ltClients)}
                  icon="👥"
                />
              </div>
            </div>

            {/* Month-to-Date Metrics */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                This Month
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Commissions"
                  value={formatCurrency(metrics.mtdComm)}
                  icon="💰"
                  badge="MTD"
                />
                <MetricCard
                  title="Volume Traded"
                  value={formatNumber(metrics.mtdVolume)}
                  icon="📈"
                  badge="MTD"
                />
                <MetricCard
                  title="Deposits"
                  value={formatCurrency(metrics.mtdDeposits)}
                  icon="💵"
                  badge="MTD"
                />
                <MetricCard
                  title="Clients"
                  value={formatNumber(metrics.mtdClients)}
                  icon="👥"
                  badge="MTD"
                />
              </div>
            </div>

            {/* Partner Info */}
            {metrics.partnerName && metrics.partnerName !== 'All partners' && (
              <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  📊 Viewing: {metrics.partnerName}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Tier: {metrics.partnerTier}
                </p>
                {metrics._cached && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    ⚡ Loaded from cache ({metrics._cache_time})
                  </p>
                )}
              </div>
            )}

            {/* Performance & Achievement Section */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceGauge partnerId={selectedPartnerId || undefined} />
              <DailyTrendsChart partnerId={selectedPartnerId || undefined} />
            </div>

            {/* Badge Progress */}
            {isSpecificPartner && (
              <div className="mt-8">
                <BadgeProgressCards partnerId={selectedPartnerId || undefined} />
              </div>
            )}

            {/* Commission Chart */}
            <div className="mt-8">
              {/* Commission Trends with Forecast */}
              <CommissionTrendsChart partnerId={selectedPartnerId} />
            </div>
          </>
        ) : null}

      {/* System Info */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <strong>React Query:</strong> ✅ Active
          </div>
          <div>
            <strong>Zustand Store:</strong> ✅ Active
          </div>
          <div>
            <strong>API:</strong> {metricsError ? '❌ Offline' : '✅ Connected'}
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  badge?: string;
}

function MetricCard({ title, value, icon, badge }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {badge && (
          <span className="text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
            {badge}
          </span>
        )}
      </div>
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h4>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
