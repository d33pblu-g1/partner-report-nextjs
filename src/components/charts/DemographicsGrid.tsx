/**
 * Demographics Dashboard
 * Grid of cards showing age/gender/language breakdown
 */

'use client';

import { Card } from '@/components/ui/Card';
import { useClientDemographics } from '@/hooks/useCubeData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DemographicsGridProps {
  partnerId?: string;
}

export function DemographicsGrid({ partnerId }: DemographicsGridProps) {
  const { data, isLoading, error } = useClientDemographics(partnerId);

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          👥 Client Demographics
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No demographic data available
          </p>
        </div>
      </Card>
    );
  }

  // Process demographic data
  const ageGroups: Record<string, number> = {};
  const genders: Record<string, number> = {};
  const languages: Record<string, number> = {};

  data.forEach((item: any) => {
    // Age groups
    if (item.age_group || item.age_range) {
      const age = item.age_group || item.age_range;
      ageGroups[age] = (ageGroups[age] || 0) + (item.count || item.client_count || 1);
    }
    
    // Genders
    if (item.gender) {
      genders[item.gender] = (genders[item.gender] || 0) + (item.count || item.client_count || 1);
    }
    
    // Languages
    if (item.language || item.preferred_language) {
      const lang = item.language || item.preferred_language;
      languages[lang] = (languages[lang] || 0) + (item.count || item.client_count || 1);
    }
  });

  const ageData = Object.entries(ageGroups).map(([name, value]) => ({ name, value }));
  const genderData = Object.entries(genders).map(([name, value]) => ({ 
    name: name.charAt(0).toUpperCase() + name.slice(1), 
    value 
  }));
  const languageData = Object.entries(languages)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 languages

  const COLORS = ['#FF444F', '#377CFC', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
  const GENDER_COLORS: Record<string, string> = {
    'Male': '#3b82f6',
    'Female': '#ec4899',
    'Other': '#6b7280',
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {data.value} clients
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        👥 Client Demographics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Age Groups */}
        {ageData.length > 0 && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              Age Distribution
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {ageData.map((age, index) => (
                <div key={age.name} className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">{age.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {age.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gender Distribution */}
        {genderData.length > 0 && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              Gender Distribution
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[entry.name] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {genderData.map((gender) => (
                <div key={gender.name} className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: GENDER_COLORS[gender.name] || '#6b7280' }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">{gender.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {gender.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Languages */}
        {languageData.length > 0 && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              Top Languages
            </h4>
            <div className="space-y-3">
              {languageData.map((lang, index) => {
                const total = languageData.reduce((sum, l) => sum + l.value, 0);
                const percentage = (lang.value / total) * 100;
                
                return (
                  <div key={lang.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {lang.name}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {lang.value} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

