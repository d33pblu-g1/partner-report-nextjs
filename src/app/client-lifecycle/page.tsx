'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useClients } from '@/hooks/useClients';
import { Card } from '@/components/ui/Card';

export default function ClientLifecyclePage() {
  const { selectedPartnerId } = useStore();
  const { data: clients, isLoading } = useClients({
    partnerId: selectedPartnerId || undefined,
  });

  // Calculate lifecycle stages
  const lifecycleStages = {
    new: clients?.filter(c => c.tier === 'new').length || 0,
    active: clients?.filter(c => c.tier === 'active').length || 0,
    dormant: clients?.filter(c => c.tier === 'dormant').length || 0,
    vip: clients?.filter(c => c.tier === 'VIP').length || 0,
  };

  const totalClients = clients?.length || 0;
  const getPercentage = (count: number) => totalClients > 0 ? (count / totalClients) * 100 : 0;

  const stages = [
    {
      name: 'New Clients',
      count: lifecycleStages.new,
      percentage: getPercentage(lifecycleStages.new),
      color: 'bg-blue-500',
      icon: '🆕',
      description: 'Recently registered clients',
    },
    {
      name: 'Active Clients',
      count: lifecycleStages.active,
      percentage: getPercentage(lifecycleStages.active),
      color: 'bg-green-500',
      icon: '✅',
      description: 'Actively trading clients',
    },
    {
      name: 'Dormant Clients',
      count: lifecycleStages.dormant,
      percentage: getPercentage(lifecycleStages.dormant),
      color: 'bg-yellow-500',
      icon: '😴',
      description: 'Inactive clients',
    },
    {
      name: 'VIP Clients',
      count: lifecycleStages.vip,
      percentage: getPercentage(lifecycleStages.vip),
      color: 'bg-purple-500',
      icon: '👑',
      description: 'High-value clients',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Client Lifecycle
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track client journey through different lifecycle stages
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stages.map((stage) => (
          <Card key={stage.name}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{stage.icon}</span>
              <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${stage.color}`}>
                {stage.percentage.toFixed(1)}%
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {stage.name}
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isLoading ? '...' : stage.count.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stage.description}
            </p>
          </Card>
        ))}
      </div>

      {/* Lifecycle Flow Visualization */}
      <Card title="Client Lifecycle Flow">
        <div className="space-y-6">
          {/* Flow diagram */}
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4">
            {stages.map((stage, index) => (
              <div key={stage.name} className="flex items-center flex-shrink-0">
                <div className="text-center">
                  <div className={`w-24 h-24 rounded-full ${stage.color} flex items-center justify-center text-white text-4xl mb-2`}>
                    {stage.icon}
                  </div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                    {stage.name}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stage.count}
                  </div>
                </div>
                {index < stages.length - 1 && (
                  <div className="mx-4 flex-shrink-0">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Progress bars */}
          <div className="space-y-4 mt-8">
            {stages.map((stage) => (
              <div key={stage.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stage.name}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {stage.count} ({stage.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 ${stage.color} transition-all`}
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card title="Lifecycle Insights">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Conversion Rate</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {totalClients > 0 ? ((lifecycleStages.active / totalClients) * 100).toFixed(1) : 0}% of clients are active
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">At Risk</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {lifecycleStages.dormant} dormant clients need re-engagement
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">VIP Retention</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {lifecycleStages.vip} VIP clients generating premium revenue
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Recommended Actions">
          <div className="space-y-4">
            {lifecycleStages.new > 0 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  🎯 Welcome New Clients
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {lifecycleStages.new} new clients - Send onboarding materials and first trade incentives
                </p>
              </div>
            )}
            {lifecycleStages.dormant > 10 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  ⚡ Re-engage Dormant
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {lifecycleStages.dormant} dormant clients - Launch win-back campaign with special offers
                </p>
              </div>
            )}
            {lifecycleStages.vip > 0 && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  👑 VIP Recognition
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  {lifecycleStages.vip} VIP clients - Provide exclusive perks and dedicated support
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

