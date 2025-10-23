/**
 * Country Performance Table
 * Enhanced table with revenue, clients, and conversion metrics
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useCountryPerformance } from '@/hooks/useCubeData';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface CountryPerformanceTableProps {
  partnerId?: string;
}

export function CountryPerformanceTable({ partnerId }: CountryPerformanceTableProps) {
  const { data, isLoading, error } = useCountryPerformance(partnerId);
  const [sortField, setSortField] = useState<'revenue' | 'clients' | 'conversion'>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error || !data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🌍 Country Performance Metrics
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No country performance data available
          </p>
        </div>
      </Card>
    );
  }

  // Process data
  const countryData = data.map((item: any) => ({
    country: item.country || item.country_name || 'Unknown',
    revenue: item.revenue || item.total_revenue || 0,
    clients: item.clients || item.client_count || 0,
    trades: item.trades || item.trade_count || 0,
    deposits: item.deposits || item.total_deposits || 0,
    conversion: item.conversion_rate || (item.clients > 0 ? (item.active_clients || item.clients * 0.7) / item.clients * 100 : 0),
  }));

  // Sort data
  const sortedData = [...countryData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
  });

  const handleSort = (field: 'revenue' | 'clients' | 'conversion') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <span className="text-gray-400">↕</span>;
    return sortDirection === 'desc' ? <span>↓</span> : <span>↑</span>;
  };

  const totalRevenue = sortedData.reduce((sum, c) => sum + c.revenue, 0);
  const totalClients = sortedData.reduce((sum, c) => sum + c.clients, 0);

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        🌍 Country Performance Metrics
      </h3>

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
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSort('revenue')}
              >
                <div className="flex items-center justify-end gap-1">
                  Revenue <SortIcon field="revenue" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSort('clients')}
              >
                <div className="flex items-center justify-end gap-1">
                  Clients <SortIcon field="clients" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Avg Rev/Client
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSort('conversion')}
              >
                <div className="flex items-center justify-end gap-1">
                  Conversion <SortIcon field="conversion" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                % of Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((country, index) => {
              const revenuePercentage = totalRevenue > 0 ? (country.revenue / totalRevenue) * 100 : 0;
              const avgRevPerClient = country.clients > 0 ? country.revenue / country.clients : 0;
              
              return (
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
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(country.revenue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatNumber(country.clients)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(avgRevPerClient)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                      country.conversion >= 70 ? 'bg-green-100 text-green-800' :
                      country.conversion >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {country.conversion.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${revenuePercentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {revenuePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <td colSpan={2} className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  Total ({sortedData.length} countries)
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalRevenue)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatNumber(totalClients)}
                </div>
              </td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}

