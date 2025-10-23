'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '@/components/ui/Card';
import type { Client } from '@/types';

interface ClientTierChartProps {
  clients: Client[];
  isLoading?: boolean;
}

interface TierData {
  name: string;
  value: number;
  percentage: number;
  [key: string]: string | number;
}

// Color mapping for tiers - Deriv colors
const TIER_COLORS: Record<string, string> = {
  'new': '#4BB4B3', // Success Green
  'active': '#377CFC', // Deriv Blue
  'dormant': '#FF6444', // Warning Orange
  'VIP': '#FF444F', // Deriv Red (premium tier)
};

export function ClientTierChart({ clients, isLoading }: ClientTierChartProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg" />
        </div>
      </Card>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No client data</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Client tier distribution will appear here once available
          </p>
        </div>
      </Card>
    );
  }

  // Calculate tier distribution
  const tierCounts: Record<string, number> = {};
  clients.forEach(client => {
    const tier = client.tier || 'unknown';
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
  });

  // Convert to chart data format
  const chartData: TierData[] = Object.entries(tierCounts)
    .map(([tier, count]) => ({
      name: tier.charAt(0).toUpperCase() + tier.slice(1),
      value: count,
      percentage: (count / clients.length) * 100,
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-[#151717] border border-[#D6DADB] dark:border-[#323738] rounded-lg px-3 py-2 shadow-lg">
          <p className="text-[#333333] dark:text-white font-semibold">{data.name}</p>
          <p className="text-[#6E6E6E] dark:text-[#C2C2C2] text-sm">
            {data.value} clients ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#333333] dark:text-white">
          Client Tier Distribution
        </h3>
        <p className="text-sm text-[#6E6E6E] dark:text-[#C2C2C2] mt-1">
          Breakdown of clients by tier status
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => {
              const data = chartData.find(d => d.name === props.name);
              return data ? `${data.name} (${data.percentage.toFixed(0)}%)` : '';
            }}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => {
              const color = TIER_COLORS[entry.name.toLowerCase()] || '#6b7280';
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{
              paddingTop: '20px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#D6DADB] dark:border-[#323738]">
        {chartData.map((tier) => (
          <div key={tier.name} className="text-center">
            <div 
              className="w-3 h-3 rounded-full mx-auto mb-1" 
              style={{ backgroundColor: TIER_COLORS[tier.name.toLowerCase()] || '#6E6E6E' }}
            />
            <p className="text-xs text-[#6E6E6E] dark:text-[#C2C2C2] mb-1">{tier.name}</p>
            <p className="text-lg font-bold text-[#333333] dark:text-white">
              {tier.value}
            </p>
            <p className="text-xs text-[#6E6E6E] dark:text-[#999999]">
              {tier.percentage.toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

