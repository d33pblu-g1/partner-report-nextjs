'use client';

import { useStore } from '@/store/useStore';
import { ProductTreemap } from '@/components/charts/ProductTreemap';
import { PlatformPieChart } from '@/components/charts/PlatformPieChart';
import { SymbolRankingTable } from '@/components/charts/SymbolRankingTable';
import { ProductBarChart } from '@/components/charts/ProductBarChart';

export default function TradingAnalyticsPage() {
  const { selectedPartnerId } = useStore();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Trading Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive analysis of trading patterns, products, and platforms
        </p>
      </div>

      {/* Product Volume Distribution */}
      <div className="mb-8">
        <ProductTreemap partnerId={selectedPartnerId || undefined} />
      </div>

      {/* Platform Performance & Product Commission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PlatformPieChart partnerId={selectedPartnerId || undefined} />
        <ProductBarChart partnerId={selectedPartnerId || undefined} />
      </div>

      {/* Symbol Performance Matrix */}
      <div className="mb-8">
        <SymbolRankingTable partnerId={selectedPartnerId || undefined} />
      </div>
    </div>
  );
}

