/**
 * Symbol Ranking Table
 * Sortable table showing most profitable trading symbols
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useCommissionsBySymbol } from '@/hooks/useCubeData';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface SymbolRankingTableProps {
  partnerId?: string;
}

export function SymbolRankingTable({ partnerId }: SymbolRankingTableProps) {
  const { data, isLoading, error } = useCommissionsBySymbol(partnerId);
  const [sortField, setSortField] = useState<'commission' | 'volume' | 'trades'>('commission');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          🎯 Top Trading Symbols
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No symbol data available
          </p>
        </div>
      </Card>
    );
  }

  // Process data
  const symbolData = data.map((item: any) => ({
    symbol: item.symbol || item.symbol_name || 'Unknown',
    commission: item.commission || item.total_commission || 0,
    volume: item.volume || item.total_volume || 0,
    trades: item.trade_count || item.trades || 0,
  }));

  // Sort data
  const sortedData = [...symbolData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
  });

  // Get top 20
  const topSymbols = sortedData.slice(0, 20);

  const handleSort = (field: 'commission' | 'volume' | 'trades') => {
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

  const totalCommission = topSymbols.reduce((sum, s) => sum + s.commission, 0);

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        🎯 Top Trading Symbols
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Symbol
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSort('commission')}
              >
                <div className="flex items-center justify-end gap-1">
                  Commission <SortIcon field="commission" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSort('volume')}
              >
                <div className="flex items-center justify-end gap-1">
                  Volume <SortIcon field="volume" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSort('trades')}
              >
                <div className="flex items-center justify-end gap-1">
                  Trades <SortIcon field="trades" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                % of Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {topSymbols.map((symbol, index) => {
              const percentage = totalCommission > 0 ? (symbol.commission / totalCommission) * 100 : 0;
              
              return (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      #{index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {symbol.symbol}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(symbol.commission)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatNumber(symbol.volume)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatNumber(symbol.trades)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Symbols</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {symbolData.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Showing Top</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {topSymbols.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Commission</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalCommission)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

