'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui/Card';

interface CommissionData {
  month: string;
  commission: number;
  date?: string;
}

interface CommissionChartProps {
  data: CommissionData[];
  isLoading?: boolean;
}

export function CommissionChart({ data, isLoading }: CommissionChartProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg" />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No commission data</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Commission data will appear here once available
          </p>
        </div>
      </Card>
    );
  }

  // Get last 6 months of data
  const last6Months = data.slice(-6);

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#333333] dark:text-white">
          Commission Trend (Last 6 Months)
        </h3>
        <p className="text-sm text-[#6E6E6E] dark:text-[#C2C2C2] mt-1">
          Monthly commission performance
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={last6Months} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#D6DADB" className="dark:stroke-[#323738]" opacity={0.5} />
          <XAxis 
            dataKey="month" 
            stroke="#6E6E6E"
            tick={{ fill: '#6E6E6E' }}
            className="dark:stroke-[#C2C2C2]"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6E6E6E"
            tick={{ fill: '#6E6E6E' }}
            className="dark:stroke-[#C2C2C2]"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D6DADB',
              borderRadius: '8px',
              color: '#333333',
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Commission']}
            labelStyle={{ color: '#6E6E6E' }}
          />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              color: '#6E6E6E'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="commission" 
            stroke="#FF444F" 
            strokeWidth={3}
            dot={{ fill: '#FF444F', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Commission"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-[#D6DADB] dark:border-[#323738]">
        <div className="text-center">
          <p className="text-xs text-[#6E6E6E] dark:text-[#C2C2C2] mb-1">Total</p>
          <p className="text-lg font-bold text-[#333333] dark:text-white">
            ${last6Months.reduce((sum, item) => sum + item.commission, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#6E6E6E] dark:text-[#C2C2C2] mb-1">Average</p>
          <p className="text-lg font-bold text-[#333333] dark:text-white">
            ${Math.round(last6Months.reduce((sum, item) => sum + item.commission, 0) / last6Months.length).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#6E6E6E] dark:text-[#C2C2C2] mb-1">Trend</p>
          <p className="text-lg font-bold text-[#333333] dark:text-white">
            {last6Months.length >= 2 && last6Months[last6Months.length - 1].commission > last6Months[last6Months.length - 2].commission ? (
              <span className="text-[#4BB4B3]">📈 Up</span>
            ) : last6Months.length >= 2 && last6Months[last6Months.length - 1].commission < last6Months[last6Months.length - 2].commission ? (
              <span className="text-[#EC3F3F]">📉 Down</span>
            ) : (
              <span className="text-[#6E6E6E] dark:text-[#C2C2C2]">→ Flat</span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}

