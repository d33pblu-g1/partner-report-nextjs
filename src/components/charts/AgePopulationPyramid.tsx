'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '@/components/ui/Card';
import type { Client } from '@/types';

interface AgeGroup {
  ageRange: string;
  male: number;
  female: number;
}

interface AgePopulationPyramidProps {
  clients: Client[];
  isLoading?: boolean;
}

export function AgePopulationPyramid({ clients, isLoading }: AgePopulationPyramidProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg" />
        </div>
      </Card>
    );
  }

  // Transform client data into age groups
  const processAgeData = (): AgeGroup[] => {
    const ageGroups = {
      '18-25': { male: 0, female: 0 },
      '25-35': { male: 0, female: 0 },
      '35-45': { male: 0, female: 0 },
      '45-55': { male: 0, female: 0 },
      '55-65': { male: 0, female: 0 },
      '65+': { male: 0, female: 0 },
    };

    clients.forEach(client => {
      if (!client.age || !client.gender) return;

      let group: keyof typeof ageGroups;
      if (client.age >= 18 && client.age < 25) group = '18-25';
      else if (client.age >= 25 && client.age < 35) group = '25-35';
      else if (client.age >= 35 && client.age < 45) group = '35-45';
      else if (client.age >= 45 && client.age < 55) group = '45-55';
      else if (client.age >= 55 && client.age < 65) group = '55-65';
      else if (client.age >= 65) group = '65+';
      else return;

      if (client.gender === 'male') {
        ageGroups[group].male += 1;
      } else if (client.gender === 'female') {
        ageGroups[group].female += 1;
      }
    });

    // Convert to array format for Recharts, with males as negative values
    return Object.entries(ageGroups).map(([ageRange, counts]) => ({
      ageRange,
      male: -counts.male, // Negative for left side
      female: counts.female,
    }));
  };

  const data = processAgeData();
  const hasData = data.some(d => d.male !== 0 || d.female !== 0);

  if (!hasData) {
    return (
      <Card>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No demographic data</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Age and gender data will appear here once available
          </p>
        </div>
      </Card>
    );
  }

  // Calculate max value for symmetric axis
  const maxValue = Math.max(
    ...data.map(d => Math.max(Math.abs(d.male), d.female))
  );
  const axisMax = Math.ceil(maxValue / 10) * 10; // Round up to nearest 10

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const ageRange = payload[0].payload.ageRange;
      const maleCount = Math.abs(payload[0].payload.male);
      const femaleCount = payload[0].payload.female;
      const total = maleCount + femaleCount;

      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-2">{ageRange} years</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-300">Male: {maleCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <span className="text-gray-300">Female: {femaleCount}</span>
            </div>
            <div className="border-t border-gray-700 pt-1 mt-1">
              <span className="text-gray-400">Total: {total}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Age Population Pyramid
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Customer distribution by age and gender
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
          barGap={0}
          barCategoryGap="0%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          
          <XAxis
            type="number"
            domain={[-axisMax, axisMax]}
            tickFormatter={(value) => Math.abs(value).toString()}
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
            style={{ fontSize: '12px' }}
          />
          
          <YAxis
            type="category"
            dataKey="ageRange"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
            style={{ fontSize: '12px' }}
            width={80}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
          
          {/* Male bars (left side) */}
          <Bar
            dataKey="male"
            fill="#3b82f6"
            name="Male"
            radius={[4, 0, 0, 4]}
          />
          
          {/* Female bars (right side) */}
          <Bar
            dataKey="female"
            fill="#ec4899"
            name="Female"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-6 flex justify-center items-center gap-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Male</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-pink-500"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Female</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Male</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {data.reduce((sum, item) => sum + Math.abs(item.male), 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Female</p>
          <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
            {data.reduce((sum, item) => sum + item.female, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Customers</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {data.reduce((sum, item) => sum + Math.abs(item.male) + item.female, 0)}
          </p>
        </div>
      </div>
    </Card>
  );
}

