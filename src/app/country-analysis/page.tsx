'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useClients } from '@/hooks/useClients';
import { Card } from '@/components/ui/Card';
import { WorldMap } from '@/components/charts/WorldMap';
import { CountryPerformanceTable } from '@/components/charts/CountryPerformanceTable';
import { formatNumber } from '@/lib/utils';

interface CountryMetrics {
  country: string;
  clientCount: number;
  percentage: number;
}

export default function CountryAnalysisPage() {
  const { selectedPartnerId } = useStore();
  const { data: clients, isLoading, error } = useClients({
    partnerId: selectedPartnerId || undefined,
  });

  // Calculate country metrics
  const countryMetrics: CountryMetrics[] = [];
  if (clients) {
    const countryMap = new Map<string, number>();
    
    clients.forEach(client => {
      if (client.country) {
        countryMap.set(client.country, (countryMap.get(client.country) || 0) + 1);
      }
    });

    const totalClients = clients.length;
    
    countryMap.forEach((count, country) => {
      countryMetrics.push({
        country,
        clientCount: count,
        percentage: totalClients > 0 ? (count / totalClients) * 100 : 0,
      });
    });

    // Sort by client count descending
    countryMetrics.sort((a, b) => b.clientCount - a.clientCount);
  }

  // Get top 3 countries
  const topCountries = countryMetrics.slice(0, 3);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Country Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze client distribution by country
        </p>
      </div>

      {/* World Map Visualization */}
      <Card className="mb-8">
        <WorldMap
          countryData={countryMetrics.map(c => ({
            country: c.country,
            count: c.clientCount,
            percentage: c.percentage
          }))}
          isLoading={isLoading}
        />
      </Card>

      {/* Top Countries Summary */}
      {!isLoading && topCountries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {topCountries.map((country, index) => (
            <Card key={country.country}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      #{index + 1} Country
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {country.country}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formatNumber(country.clientCount)} clients ({country.percentage.toFixed(1)}%)
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Enhanced Country Performance Table */}
      <div className="mb-8">
        <CountryPerformanceTable partnerId={selectedPartnerId || undefined} />
      </div>

      {/* All Countries Table */}
      {isLoading ? (
        <Card>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-16 rounded-lg" />
              </div>
            ))}
          </div>
        </Card>
      ) : error ? (
        <Card>
          <div className="text-red-600 dark:text-red-400 text-center py-8">
            ❌ Failed to load country data: {error.message}
          </div>
        </Card>
      ) : countryMetrics.length > 0 ? (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Clients
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Distribution
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {countryMetrics.map((country, index) => (
                  <tr key={country.country} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        #{index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {country.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatNumber(country.clientCount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {country.percentage.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-xs">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${country.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth={2} />
              <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" strokeWidth={2} />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No country data found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No clients available for analysis
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

