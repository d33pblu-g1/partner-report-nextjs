'use client';

import { useStore } from '@/store/useStore';
import { usePartners } from '@/hooks/usePartners';
import { useMetrics } from '@/hooks/useMetrics';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function MasterPartnerPage() {
  const { selectedPartnerId } = useStore();
  const { data: partners, isLoading: partnersLoading } = usePartners();
  const { data: metrics } = useMetrics(selectedPartnerId || undefined);

  // Calculate master statistics
  const totalPartners = partners?.length || 0;
  const goldPartners = partners?.filter(p => p.tier === 'Gold').length || 0;
  const silverPartners = partners?.filter(p => p.tier === 'Silver').length || 0;
  const bronzePartners = partners?.filter(p => p.tier === 'Bronze').length || 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Master Partner Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of all partners and network performance
        </p>
      </div>

      {/* Master Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Partners</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {partnersLoading ? '...' : totalPartners}
              </p>
            </div>
            <div className="text-4xl">🤝</div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gold Partners</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                {partnersLoading ? '...' : goldPartners}
              </p>
            </div>
            <div className="text-4xl">🥇</div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Silver Partners</p>
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400 mt-1">
                {partnersLoading ? '...' : silverPartners}
              </p>
            </div>
            <div className="text-4xl">🥈</div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bronze Partners</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                {partnersLoading ? '...' : bronzePartners}
              </p>
            </div>
            <div className="text-4xl">🥉</div>
          </div>
        </Card>
      </div>

      {/* Network Performance */}
      <Card title="Network Performance" className="mb-8">
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Commissions</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(metrics.ltCommissions)}
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Clients</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                {formatNumber(metrics.ltClients)}
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Volume</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {formatNumber(metrics.ltVolume)}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Partners List */}
      <Card title="Partner Network">
        {partnersLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-20 rounded-lg" />
              </div>
            ))}
          </div>
        ) : partners && partners.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Manager
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {partners.map((partner) => (
                  <tr key={partner.partner_id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {partner.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {partner.partner_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        partner.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        partner.tier === 'Silver' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                      }`}>
                        {partner.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        #{partner.Country_Rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {partner.country_manager}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No partners found</h3>
          </div>
        )}
      </Card>
    </div>
  );
}

